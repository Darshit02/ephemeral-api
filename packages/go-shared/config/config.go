package config

import (
	"os"
)

type Config struct {
	DatabaseURL         string
	RedisURL            string
	JWTSecret           string
	Port                string
	ServiceName         string
	StripeSecretKey     string
	StripeWebhookSecret string
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func Load(defaultServiceName, defaultPort string) *Config {
	return &Config{
		DatabaseURL:         getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ephemeral?sslmode=disable"),
		RedisURL:            getEnv("REDIS_URL", "redis://localhost:6379/0"),
		JWTSecret:           getEnv("JWT_SECRET", "ephemeral-super-secret-jwt-key-minimum-32-chars-long!"),
		Port:                getEnv("PORT", defaultPort),
		ServiceName:         getEnv("SERVICE_NAME", defaultServiceName),
		StripeSecretKey:     getEnv("STRIPE_SECRET_KEY", "sk_test_mock_ephemeral_stripe_key"),
		StripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET", "whsec_mock_ephemeral_stripe_secret"),
	}
}
