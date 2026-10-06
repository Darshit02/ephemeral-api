package router

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"ephemeral/apps/admin-api/internal/handler"
	"ephemeral/apps/admin-api/internal/repository"
	"ephemeral/apps/admin-api/internal/service"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/models"
	"ephemeral/packages/go-shared/response"
)

type AdminRouterDeps struct {
	ServiceName string
	JWTSecret   string
	DB          *pgxpool.Pool
	Redis       *redis.Client
	Logger      *slog.Logger
}

func New(deps AdminRouterDeps) *chi.Mux {
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

	if deps.DB != nil {
		analyticsRepo := repository.NewAnalyticsRepository(deps.DB)
		analyticsSvc := service.NewAnalyticsService(analyticsRepo)
		analyticsHandler := handler.NewAnalyticsHandler(analyticsSvc)

		r.Route("/admin", func(r chi.Router) {
			r.Use(middleware.Auth(deps.JWTSecret, nil))

			// Time-series usage metrics
			r.Get("/apis/{id}/usage", analyticsHandler.GetAPIUsage)

			// Consumer listing
			r.Get("/apis/{id}/consumers", analyticsHandler.GetAPIConsumers)

			// Revenue summary (provider or admin only)
			r.With(middleware.RequireRole(models.RoleProvider, models.RoleAdmin)).Get("/revenue", analyticsHandler.GetRevenueSummary)
		})
	}

	return r
}
