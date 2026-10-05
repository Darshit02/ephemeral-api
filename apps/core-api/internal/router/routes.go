package router

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"ephemeral/apps/core-api/internal/handler"
	"ephemeral/apps/core-api/internal/repository"
	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/models"
	"ephemeral/packages/go-shared/response"
)

type RouterDeps struct {
	ServiceName         string
	JWTSecret           string
	DB                  *pgxpool.Pool
	Redis               *redis.Client
	Logger              *slog.Logger
	StripeSecretKey     string
	StripeWebhookSecret string
}

func New(deps RouterDeps) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger(deps.Logger))
	r.Use(middleware.Recoverer(deps.Logger))
	r.Use(middleware.CORS())

	// Health check endpoints
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

	// Business endpoints (available when database is configured)
	if deps.DB != nil {
		userRepo := repository.NewUserRepository(deps.DB)
		authService := service.NewAuthService(userRepo, deps.JWTSecret)
		authHandler := handler.NewAuthHandler(authService)

		apiRepo := repository.NewAPIRepository(deps.DB)
		apiService := service.NewAPIService(apiRepo)
		apiHandler := handler.NewAPIHandler(apiService)

		planRepo := repository.NewPlanRepository(deps.DB)
		planService := service.NewPlanService(planRepo, apiRepo)
		planHandler := handler.NewPlanHandler(planService)

		stripeSvc := service.NewStripeService(deps.StripeSecretKey, deps.StripeWebhookSecret, deps.Logger)
		subRepo := repository.NewSubscriptionRepository(deps.DB)
		subService := service.NewSubscriptionService(subRepo, planRepo, apiRepo, userRepo, stripeSvc, deps.Logger)
		subHandler := handler.NewSubscriptionHandler(subService)
		webhookHandler := handler.NewWebhookHandler(subService)

		// Stripe Webhooks (verified via Stripe signature)
		r.Post("/webhooks/stripe", webhookHandler.HandleStripe)

		// Auth endpoints
		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", authHandler.Register)
			r.Post("/login", authHandler.Login)

			r.Group(func(r chi.Router) {
				r.Use(middleware.Auth(deps.JWTSecret, authService.GetUserByID))
				r.Get("/me", authHandler.Me)
				r.Post("/logout", authHandler.Logout)
			})
		})

		// Public API catalog & plans
		r.Get("/apis", apiHandler.ListPublic)
		r.Get("/apis/{slug}", apiHandler.GetPublic)
		r.Get("/apis/{slug}/plans", planHandler.ListPublic)

		// Subscriptions
		r.Route("/subscriptions", func(r chi.Router) {
			r.Use(middleware.Auth(deps.JWTSecret, authService.GetUserByID))

			r.Post("/", subHandler.Subscribe)
			r.Get("/", subHandler.ListMy)
			r.Get("/{id}", subHandler.GetOne)
			r.Delete("/{id}", subHandler.Cancel)
			r.Post("/{id}/rotate-key", subHandler.RotateKey)
		})

		// Provider administration
		r.Route("/admin", func(r chi.Router) {
			r.Use(middleware.Auth(deps.JWTSecret, authService.GetUserByID))
			r.Use(middleware.RequireRole(models.RoleProvider, models.RoleAdmin))

			// APIs
			r.Route("/apis", func(r chi.Router) {
				r.Post("/", apiHandler.Create)
				r.Get("/", apiHandler.ListOwn)
				r.Get("/{id}", apiHandler.GetOwn)
				r.Put("/{id}", apiHandler.Update)
				r.Delete("/{id}", apiHandler.Delete)

				// Plans under API
				r.Post("/{id}/plans", planHandler.Create)
				r.Get("/{id}/plans", planHandler.ListByAPI)
			})

			// Plans
			r.Route("/plans/{planID}", func(r chi.Router) {
				r.Put("/", planHandler.Update)
				r.Delete("/", planHandler.Delete)
			})
		})
	}

	return r
}
