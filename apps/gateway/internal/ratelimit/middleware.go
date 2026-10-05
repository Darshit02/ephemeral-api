package ratelimit

import (
	"log/slog"
	"net/http"
	"strconv"

	"ephemeral/apps/gateway/internal/auth"
	"ephemeral/packages/go-shared/response"
)

func Middleware(limiter Limiter, logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sub := auth.GetSubscription(r.Context())
			api := auth.GetAPI(r.Context())

			// If no subscription or API in context, pass through
			if sub == nil || api == nil || limiter == nil {
				next.ServeHTTP(w, r)
				return
			}

			if sub.RateLimitPerHour > 0 {
				res, err := limiter.Allow(r.Context(), sub.ID, api.ID, sub.RateLimitPerHour)
				if err != nil {
					if logger != nil {
						logger.Error("rate limit error", slog.Any("error", err))
					}
					response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to check rate limit")
					return
				}

				// Rate limit response headers (always present)
				w.Header().Set("X-RateLimit-Limit", strconv.Itoa(res.Limit))
				w.Header().Set("X-RateLimit-Remaining", strconv.Itoa(res.Remaining))
				w.Header().Set("X-RateLimit-Reset", strconv.FormatInt(res.ResetUnix, 10))

				if !res.Allowed {
					w.Header().Set("Retry-After", strconv.Itoa(res.RetryAfter))
					response.Error(w, http.StatusTooManyRequests, "RATE_LIMIT_EXCEEDED", "Hourly limit reached")
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
