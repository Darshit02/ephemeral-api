package usage

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	chiMiddleware "github.com/go-chi/chi/v5/middleware"

	"ephemeral/apps/gateway/internal/auth"
	"ephemeral/apps/gateway/internal/repository"
)

func Middleware(repo repository.Repository, logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			startTime := time.Now()
			ww := chiMiddleware.NewWrapResponseWriter(w, r.ProtoMajor)

			next.ServeHTTP(ww, r)

			durationMs := int(time.Since(startTime).Milliseconds())
			sub := auth.GetSubscription(r.Context())
			api := auth.GetAPI(r.Context())

			if sub != nil && api != nil && repo != nil {
				endpoint := r.URL.Path
				method := r.Method
				subID := sub.ID
				apiID := api.ID
				status := ww.Status()

				go func() {
					ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
					defer cancel()
					if err := repo.RecordUsage(ctx, subID, apiID, endpoint, method, status, durationMs); err != nil {
						if logger != nil {
							logger.Error("failed to record usage event", slog.Any("error", err))
						}
					}
				}()
			}
		})
	}
}
