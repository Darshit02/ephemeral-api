package proxy

import (
	"context"
	"crypto/subtle"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"ephemeral/apps/gateway/internal/repository"
	"ephemeral/packages/go-shared/auth"
	"ephemeral/packages/go-shared/models"
	"ephemeral/packages/go-shared/response"
)

type Repository interface {
	FindSubscriptionsByPrefix(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error)
	FindAPIBySlug(ctx context.Context, slug string) (*models.API, error)
	RecordUsage(ctx context.Context, subID, apiID, endpoint, method string, status, latencyMs int) error
}

type ProxyHandler struct {
	repo       Repository
	logger     *slog.Logger
	httpClient *http.Client
}

func NewProxyHandler(repo Repository, logger *slog.Logger) *ProxyHandler {
	if logger == nil {
		logger = slog.Default()
	}
	return &ProxyHandler{
		repo:   repo,
		logger: logger,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
			CheckRedirect: func(req *http.Request, via []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
	}
}

func (h *ProxyHandler) SetHTTPClient(client *http.Client) {
	h.httpClient = client
}

func (h *ProxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	// 1. Extract X-API-Key header
	apiKey := strings.TrimSpace(r.Header.Get("X-API-Key"))
	if apiKey == "" {
		response.Error(w, http.StatusUnauthorized, "MISSING_API_KEY", "Missing X-API-Key header")
		return
	}

	if len(apiKey) < 12 {
		response.Error(w, http.StatusUnauthorized, "INVALID_API_KEY", "Invalid API key")
		return
	}

	// 2. Look up subscription by api_key_prefix (indexed)
	prefix := apiKey[:12]
	hash := auth.HashAPIKey(apiKey)

	subs, err := h.repo.FindSubscriptionsByPrefix(r.Context(), prefix)
	if err != nil || len(subs) == 0 {
		response.Error(w, http.StatusUnauthorized, "INVALID_API_KEY", "Invalid API key")
		return
	}

	// 3. Constant-time compare SHA-256 hash
	var matchedSub *repository.SubscriptionAuthInfo
	for _, s := range subs {
		if subtle.ConstantTimeCompare([]byte(s.APIKeyHash), []byte(hash)) == 1 {
			matchedSub = &s
			break
		}
	}

	if matchedSub == nil {
		response.Error(w, http.StatusUnauthorized, "INVALID_API_KEY", "Invalid API key")
		return
	}

	// 4. Check subscription status = active
	if matchedSub.Status != models.SubscriptionStatusActive {
		response.Error(w, http.StatusForbidden, "SUBSCRIPTION_INACTIVE", "Subscription is not active")
		return
	}

	// 5. Check current_period_end > now
	if matchedSub.CurrentPeriodEnd.Before(time.Now()) {
		response.Error(w, http.StatusForbidden, "SUBSCRIPTION_INACTIVE", "Subscription period has expired")
		return
	}

	// 6. Look up API by slug, verify status = live
	slug := chi.URLParam(r, "slug")
	api, err := h.repo.FindAPIBySlug(r.Context(), slug)
	if err != nil {
		if errors.Is(err, repository.ErrAPINotFound) {
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API not found")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to lookup API")
		return
	}

	// Verify subscription belongs to this API
	if matchedSub.APIID != api.ID {
		response.Error(w, http.StatusForbidden, "FORBIDDEN", "API key does not have access to this API")
		return
	}

	if api.Status != models.APIStatusLive {
		response.Error(w, http.StatusForbidden, "API_NOT_LIVE", "API is not currently live")
		return
	}

	// 7. Proxy request to API.base_url + remaining path
	targetURL := strings.TrimRight(api.BaseURL, "/")
	remainder := chi.URLParam(r, "*")
	if remainder != "" {
		if !strings.HasPrefix(remainder, "/") {
			remainder = "/" + remainder
		}
		targetURL += remainder
	} else if strings.HasSuffix(r.URL.Path, "/") && !strings.HasSuffix(targetURL, "/") {
		targetURL += "/"
	}

	if r.URL.RawQuery != "" {
		targetURL += "?" + r.URL.RawQuery
	}

	outReq, err := http.NewRequestWithContext(r.Context(), r.Method, targetURL, r.Body)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to create upstream request")
		return
	}

	// Copy headers
	for k, vv := range r.Header {
		if isHopByHopHeader(k) || strings.EqualFold(k, "X-API-Key") {
			continue
		}
		for _, v := range vv {
			outReq.Header.Add(k, v)
		}
	}

	// Set X-Forwarded-For
	clientIP := r.RemoteAddr
	if idx := strings.LastIndex(clientIP, ":"); idx != -1 {
		clientIP = clientIP[:idx]
	}
	if prior := r.Header.Get("X-Forwarded-For"); prior != "" {
		clientIP = prior + ", " + clientIP
	}
	outReq.Header.Set("X-Forwarded-For", clientIP)

	resp, err := h.httpClient.Do(outReq)
	if err != nil {
		h.logger.Error("upstream error", slog.String("url", targetURL), slog.Any("error", err))
		response.Error(w, http.StatusBadGateway, "UPSTREAM_ERROR", "Failed to connect to upstream service")
		return
	}
	defer resp.Body.Close()

	// Copy upstream response headers
	for k, vv := range resp.Header {
		if isHopByHopHeader(k) {
			continue
		}
		for _, v := range vv {
			w.Header().Add(k, v)
		}
	}

	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)

	// 8. Record usage event asynchronously
	durationMs := int(time.Since(startTime).Milliseconds())
	endpoint := r.URL.Path
	method := r.Method
	subID := matchedSub.ID
	apiID := api.ID
	respStatus := resp.StatusCode

	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := h.repo.RecordUsage(ctx, subID, apiID, endpoint, method, respStatus, durationMs); err != nil {
			h.logger.Error("failed to record usage event", slog.Any("error", err))
		}
	}()
}

var hopByHopHeaders = map[string]bool{
	"connection":          true,
	"keep-alive":          true,
	"proxy-authenticate":  true,
	"proxy-authorization": true,
	"te":                  true,
	"trailer":             true,
	"transfer-encoding":   true,
	"upgrade":             true,
}

func isHopByHopHeader(h string) bool {
	return hopByHopHeaders[strings.ToLower(h)]
}
