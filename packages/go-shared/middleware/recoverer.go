package middleware

import (
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"

	"ephemeral/packages/go-shared/response"
)

func Recoverer(logger *slog.Logger) func(http.Handler) http.Handler {
	if logger == nil {
		logger = slog.Default()
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rvr := recover(); rvr != nil {
					reqID := GetRequestID(r.Context())
					stack := string(debug.Stack())
					logger.Error("panic recovered",
						slog.String("request_id", reqID),
						slog.Any("error", rvr),
						slog.String("stack", stack),
					)
					response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", fmt.Sprintf("Internal server error: %v", rvr))
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}
