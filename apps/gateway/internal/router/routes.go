package router

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"ephemeral/apps/gateway/internal/auth"
	"ephemeral/apps/gateway/internal/proxy"
	"ephemeral/apps/gateway/internal/ratelimit"
	"ephemeral/apps/gateway/internal/repository"
	"ephemeral/apps/gateway/internal/usage"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/response"
)

type GatewayRouterDeps struct {
	ServiceName string
	DB          *pgxpool.Pool
	Redis       *redis.Client
	Logger      *slog.Logger
}

func New(deps GatewayRouterDeps) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger(deps.Logger))
	r.Use(middleware.Recoverer(deps.Logger))
	r.Use(middleware.CORS())

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{
			"status":  "ok",
			"service": deps.ServiceName,
		})
	})

	r.Get("/health/redis", func(w http.ResponseWriter, r *http.Request) {
		if deps.Redis == nil {
			response.Error(w, http.StatusServiceUnavailable, "SERVICE_UNAVAILABLE", "Redis client is not initialized")
			return
		}

		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		if err := deps.Redis.Ping(ctx).Err(); err != nil {
			response.Error(w, http.StatusServiceUnavailable, "SERVICE_UNAVAILABLE", "Redis connection unhealthy: "+err.Error())
			return
		}

		response.JSON(w, http.StatusOK, map[string]string{
			"status":  "ok",
			"service": "redis",
		})
	})

	if deps.DB != nil {
		repo := repository.NewGatewayRepository(deps.DB)

		var limiter ratelimit.Limiter
		if deps.Redis != nil {
			limiter = ratelimit.NewRedisLimiter(deps.Redis)
		}

		proxyHandler := proxy.NewProxyHandler(repo, deps.Logger)

		r.Route("/v1/{slug}", func(apiR chi.Router) {
			apiR.Use(auth.Middleware(repo, deps.Logger))
			apiR.Use(usage.Middleware(repo, deps.Logger))
			if limiter != nil {
				apiR.Use(ratelimit.Middleware(limiter, deps.Logger))
			}

			apiR.HandleFunc("/", proxyHandler.ServeHTTP)
			apiR.HandleFunc("/*", proxyHandler.ServeHTTP)
		})
	}

	return r
}
