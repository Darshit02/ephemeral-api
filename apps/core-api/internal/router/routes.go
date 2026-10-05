package router

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/response"
)

type RouterDeps struct {
	ServiceName string
	DB          *pgxpool.Pool
	Redis       *redis.Client
	Logger      *slog.Logger
}

func New(deps RouterDeps) *chi.Mux {
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

	r.Get("/health/db", func(w http.ResponseWriter, r *http.Request) {
		if deps.DB == nil {
			response.Error(w, http.StatusServiceUnavailable, "SERVICE_UNAVAILABLE", "Postgres pool is not initialized")
			return
		}

		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		if err := deps.DB.Ping(ctx); err != nil {
			response.Error(w, http.StatusServiceUnavailable, "SERVICE_UNAVAILABLE", "Postgres connection unhealthy: "+err.Error())
			return
		}

		response.JSON(w, http.StatusOK, map[string]string{
			"status":  "ok",
			"service": "postgres",
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

	return r
}
