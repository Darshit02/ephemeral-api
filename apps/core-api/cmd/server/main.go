package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"ephemeral/apps/core-api/internal/router"
	"ephemeral/apps/core-api/migrations"
	"ephemeral/packages/go-shared/config"
	"ephemeral/packages/go-shared/db"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	cfg := config.Load("core-api", "8081")

	logger.Info("starting service",
		slog.String("service", cfg.ServiceName),
		slog.String("port", cfg.Port),
	)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var pgPool *pgxpool.Pool
	pool, err := db.NewPostgresPool(ctx, cfg.DatabaseURL)
	if err != nil {
		logger.Error("failed to connect to postgres", slog.Any("error", err))
	} else {
		pgPool = pool
		logger.Info("connected to postgres")
		defer pgPool.Close()

		if err := db.RunMigrations(cfg.DatabaseURL, migrations.FS, ".", logger); err != nil {
			logger.Error("failed to run database migrations", slog.Any("error", err))
		}
	}

	var redisClient *redis.Client
	rdb, err := db.NewRedisClient(ctx, cfg.RedisURL)
	if err != nil {
		logger.Error("failed to connect to redis", slog.Any("error", err))
	} else {
		redisClient = rdb
		logger.Info("connected to redis")
		defer redisClient.Close()
	}

	r := router.New(router.RouterDeps{
		ServiceName:         cfg.ServiceName,
		JWTSecret:           cfg.JWTSecret,
		DB:                  pgPool,
		Redis:               redisClient,
		Logger:              logger,
		StripeSecretKey:     cfg.StripeSecretKey,
		StripeWebhookSecret: cfg.StripeWebhookSecret,
	})

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		logger.Info("server listening", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("server error", slog.Any("error", err))
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	logger.Info("shutting down server", slog.String("signal", sig.String()))

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Error("server forced to shutdown", slog.Any("error", err))
	}

	fmt.Println("Server exiting")
}
