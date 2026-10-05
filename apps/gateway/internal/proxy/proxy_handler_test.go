package proxy_test

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"

	"ephemeral/apps/gateway/internal/proxy"
	"ephemeral/apps/gateway/internal/repository"
	"ephemeral/packages/go-shared/auth"
	"ephemeral/packages/go-shared/models"
)

type roundTripFunc func(req *http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

type mockRepo struct {
	subsFunc    func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error)
	apiFunc     func(ctx context.Context, slug string) (*models.API, error)
	usageCalled bool
}

func (m *mockRepo) FindSubscriptionsByPrefix(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
	if m.subsFunc != nil {
		return m.subsFunc(ctx, prefix)
	}
	return nil, nil
}

func (m *mockRepo) FindAPIBySlug(ctx context.Context, slug string) (*models.API, error) {
	if m.apiFunc != nil {
		return m.apiFunc(ctx, slug)
	}
	return nil, nil
}

func (m *mockRepo) RecordUsage(ctx context.Context, subID, apiID, endpoint, method string, status, latencyMs int) error {
	m.usageCalled = true
	return nil
}

func setupTestRouter(handler *proxy.ProxyHandler) *chi.Mux {
	r := chi.NewRouter()
	r.Handle("/v1/{slug}", handler)
	r.Handle("/v1/{slug}/*", handler)
	return r
}

func TestProxyHandler(t *testing.T) {
	validKey := "ephemeral_live_abc123xyz456"
	validHash := auth.HashAPIKey(validKey)
	apiID := "api-123"
	subID := "sub-456"

	t.Run("missing API key returns 401", func(t *testing.T) {
		h := proxy.NewProxyHandler(&mockRepo{}, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "MISSING_API_KEY") {
			t.Fatalf("expected MISSING_API_KEY, got %s", rr.Body.String())
		}
	})

	t.Run("short API key returns 401", func(t *testing.T) {
		h := proxy.NewProxyHandler(&mockRepo{}, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		req.Header.Set("X-API-Key", "short")
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "INVALID_API_KEY") {
			t.Fatalf("expected INVALID_API_KEY, got %s", rr.Body.String())
		}
	})

	t.Run("unknown API key returns 401", func(t *testing.T) {
		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return nil, nil
			},
		}
		h := proxy.NewProxyHandler(repo, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("inactive subscription returns 403", func(t *testing.T) {
		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return []repository.SubscriptionAuthInfo{
					{
						ID:               subID,
						APIID:            apiID,
						APIKeyHash:       validHash,
						Status:           models.SubscriptionStatusCanceled,
						CurrentPeriodEnd: time.Now().Add(24 * time.Hour),
					},
				}, nil
			},
		}
		h := proxy.NewProxyHandler(repo, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusForbidden {
			t.Fatalf("expected 403, got %d", rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "SUBSCRIPTION_INACTIVE") {
			t.Fatalf("expected SUBSCRIPTION_INACTIVE, got %s", rr.Body.String())
		}
	})

	t.Run("expired subscription returns 403", func(t *testing.T) {
		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return []repository.SubscriptionAuthInfo{
					{
						ID:               subID,
						APIID:            apiID,
						APIKeyHash:       validHash,
						Status:           models.SubscriptionStatusActive,
						CurrentPeriodEnd: time.Now().Add(-1 * time.Hour),
					},
				}, nil
			},
		}
		h := proxy.NewProxyHandler(repo, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusForbidden {
			t.Fatalf("expected 403, got %d", rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "SUBSCRIPTION_INACTIVE") {
			t.Fatalf("expected SUBSCRIPTION_INACTIVE, got %s", rr.Body.String())
		}
	})

	t.Run("API not found returns 404", func(t *testing.T) {
		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return []repository.SubscriptionAuthInfo{
					{
						ID:               subID,
						APIID:            apiID,
						APIKeyHash:       validHash,
						Status:           models.SubscriptionStatusActive,
						CurrentPeriodEnd: time.Now().Add(24 * time.Hour),
					},
				}, nil
			},
			apiFunc: func(ctx context.Context, slug string) (*models.API, error) {
				return nil, repository.ErrAPINotFound
			},
		}
		h := proxy.NewProxyHandler(repo, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusNotFound {
			t.Fatalf("expected 404, got %d", rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "API_NOT_FOUND") {
			t.Fatalf("expected API_NOT_FOUND, got %s", rr.Body.String())
		}
	})

	t.Run("API key for different API returns 403", func(t *testing.T) {
		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return []repository.SubscriptionAuthInfo{
					{
						ID:               subID,
						APIID:            "other-api-id",
						APIKeyHash:       validHash,
						Status:           models.SubscriptionStatusActive,
						CurrentPeriodEnd: time.Now().Add(24 * time.Hour),
					},
				}, nil
			},
			apiFunc: func(ctx context.Context, slug string) (*models.API, error) {
				return &models.API{
					ID:      apiID,
					Slug:    slug,
					Status:  models.APIStatusLive,
					BaseURL: "http://upstream.local",
				}, nil
			},
		}
		h := proxy.NewProxyHandler(repo, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusForbidden {
			t.Fatalf("expected 403, got %d", rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "FORBIDDEN") {
			t.Fatalf("expected FORBIDDEN, got %s", rr.Body.String())
		}
	})

	t.Run("API not live returns 403", func(t *testing.T) {
		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return []repository.SubscriptionAuthInfo{
					{
						ID:               subID,
						APIID:            apiID,
						APIKeyHash:       validHash,
						Status:           models.SubscriptionStatusActive,
						CurrentPeriodEnd: time.Now().Add(24 * time.Hour),
					},
				}, nil
			},
			apiFunc: func(ctx context.Context, slug string) (*models.API, error) {
				return &models.API{
					ID:      apiID,
					Slug:    slug,
					Status:  models.APIStatusDraft,
					BaseURL: "http://upstream.local",
				}, nil
			},
		}
		h := proxy.NewProxyHandler(repo, nil)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusForbidden {
			t.Fatalf("expected 403, got %d", rr.Code)
		}
		if !strings.Contains(rr.Body.String(), "API_NOT_LIVE") {
			t.Fatalf("expected API_NOT_LIVE, got %s", rr.Body.String())
		}
	})

	t.Run("successful proxy forward and response", func(t *testing.T) {
		var receivedPath string
		var receivedForwardedFor string
		var receivedAuthHeader string

		mockClient := &http.Client{
			Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
				receivedPath = req.URL.Path
				receivedForwardedFor = req.Header.Get("X-Forwarded-For")
				receivedAuthHeader = req.Header.Get("X-API-Key")

				resp := &http.Response{
					StatusCode: http.StatusOK,
					Header:     make(http.Header),
					Body:       io.NopCloser(strings.NewReader(`{"temperature": 72}`)),
				}
				resp.Header.Set("Content-Type", "application/json")
				resp.Header.Set("X-Custom-Upstream", "hello")
				return resp, nil
			}),
		}

		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return []repository.SubscriptionAuthInfo{
					{
						ID:               subID,
						APIID:            apiID,
						APIKeyHash:       validHash,
						Status:           models.SubscriptionStatusActive,
						CurrentPeriodEnd: time.Now().Add(24 * time.Hour),
					},
				}, nil
			},
			apiFunc: func(ctx context.Context, slug string) (*models.API, error) {
				return &models.API{
					ID:      apiID,
					Slug:    slug,
					Status:  models.APIStatusLive,
					BaseURL: "http://upstream.local",
				}, nil
			},
		}

		h := proxy.NewProxyHandler(repo, nil)
		h.SetHTTPClient(mockClient)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api/forecast/daily?days=5", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Fatalf("expected 200, got %d: %s", rr.Code, rr.Body.String())
		}
		if receivedPath != "/forecast/daily" {
			t.Fatalf("expected upstream path /forecast/daily, got %s", receivedPath)
		}
		if receivedForwardedFor == "" {
			t.Fatal("expected X-Forwarded-For header to be forwarded")
		}
		if receivedAuthHeader != "" {
			t.Fatalf("expected X-API-Key to be stripped from upstream, got %s", receivedAuthHeader)
		}
		if rr.Header().Get("X-Custom-Upstream") != "hello" {
			t.Fatalf("expected response header X-Custom-Upstream, got %s", rr.Header().Get("X-Custom-Upstream"))
		}
		if !strings.Contains(rr.Body.String(), `"temperature": 72`) {
			t.Fatalf("unexpected body: %s", rr.Body.String())
		}
	})

	t.Run("upstream connection failure returns 502", func(t *testing.T) {
		repo := &mockRepo{
			subsFunc: func(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
				return []repository.SubscriptionAuthInfo{
					{
						ID:               subID,
						APIID:            apiID,
						APIKeyHash:       validHash,
						Status:           models.SubscriptionStatusActive,
						CurrentPeriodEnd: time.Now().Add(24 * time.Hour),
					},
				}, nil
			},
			apiFunc: func(ctx context.Context, slug string) (*models.API, error) {
				return &models.API{
					ID:      apiID,
					Slug:    slug,
					Status:  models.APIStatusLive,
					BaseURL: "http://upstream.local",
				}, nil
			},
		}

		mockClient := &http.Client{
			Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
				return nil, errors.New("dial error")
			}),
		}

		h := proxy.NewProxyHandler(repo, nil)
		h.SetHTTPClient(mockClient)
		r := setupTestRouter(h)

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api/test", nil)
		req.Header.Set("X-API-Key", validKey)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusBadGateway {
			t.Fatalf("expected 502, got %d: %s", rr.Code, rr.Body.String())
		}
		if !strings.Contains(rr.Body.String(), "UPSTREAM_ERROR") {
			t.Fatalf("expected UPSTREAM_ERROR, got %s", rr.Body.String())
		}
	})
}
