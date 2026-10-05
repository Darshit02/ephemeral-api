package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
	Port        string
	ServiceName string
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func Load(defaultServiceName, defaultPort string) *Config {
	return &Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ephemeral?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379/0"),
		JWTSecret:   getEnv("JWT_SECRET", "ephemeral-super-secret-jwt-key-minimum-32-chars-long!"),
		Port:        getEnv("PORT", defaultPort),
		ServiceName: getEnv("SERVICE_NAME", defaultServiceName),
	}
}
