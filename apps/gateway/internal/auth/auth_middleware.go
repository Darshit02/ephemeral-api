package auth

import (
	"crypto/subtle"
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"ephemeral/apps/gateway/internal/repository"
	sharedAuth "ephemeral/packages/go-shared/auth"
	"ephemeral/packages/go-shared/models"
	"ephemeral/packages/go-shared/response"
)

func Middleware(repo repository.Repository, logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			apiKey := strings.TrimSpace(r.Header.Get("X-API-Key"))
			if apiKey == "" {
				response.Error(w, http.StatusUnauthorized, "MISSING_API_KEY", "Missing X-API-Key header")
				return
			}

			if len(apiKey) < 12 {
				response.Error(w, http.StatusUnauthorized, "INVALID_API_KEY", "Invalid API key")
				return
			}

			prefix := apiKey[:12]
			hash := sharedAuth.HashAPIKey(apiKey)

			subs, err := repo.FindSubscriptionsByPrefix(r.Context(), prefix)
			if err != nil || len(subs) == 0 {
				response.Error(w, http.StatusUnauthorized, "INVALID_API_KEY", "Invalid API key")
				return
			}

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

			if matchedSub.Status != models.SubscriptionStatusActive {
				response.Error(w, http.StatusForbidden, "SUBSCRIPTION_INACTIVE", "Subscription is not active")
				return
			}

			if matchedSub.CurrentPeriodEnd.Before(time.Now()) {
				response.Error(w, http.StatusForbidden, "SUBSCRIPTION_INACTIVE", "Subscription period has expired")
				return
			}

			slug := chi.URLParam(r, "slug")
			api, err := repo.FindAPIBySlug(r.Context(), slug)
			if err != nil {
				if errors.Is(err, repository.ErrAPINotFound) {
					response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API not found")
					return
				}
				if logger != nil {
					logger.Error("failed to lookup API", slog.Any("error", err))
				}
				response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to lookup API")
				return
			}

			if matchedSub.APIID != api.ID {
				response.Error(w, http.StatusForbidden, "FORBIDDEN", "API key does not have access to this API")
				return
			}

			if api.Status != models.APIStatusLive {
				response.Error(w, http.StatusForbidden, "API_NOT_LIVE", "API is not currently live")
				return
			}

			ctx := WithSubscription(r.Context(), matchedSub)
			ctx = WithAPI(ctx, api)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
