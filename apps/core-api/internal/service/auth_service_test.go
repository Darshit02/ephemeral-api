package service_test

import (
	"context"
	"testing"

	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/models"
)

func TestAuthServiceValidation(t *testing.T) {
	svc := service.NewAuthService(nil, "jwt-secret-for-testing-123456789")

	t.Run("Empty fields", func(t *testing.T) {
		_, err := svc.Register(context.Background(), service.RegisterInput{
			Email:    "",
			Password: "password123",
			Name:     "Test",
		})
		if err != service.ErrMissingFields {
			t.Errorf("expected ErrMissingFields, got %v", err)
		}
	})

	t.Run("Invalid email format", func(t *testing.T) {
		_, err := svc.Register(context.Background(), service.RegisterInput{
			Email:    "plainaddress",
			Password: "password123",
			Name:     "Test",
		})
		if err != service.ErrInvalidEmail {
			t.Errorf("expected ErrInvalidEmail, got %v", err)
		}
	})

	t.Run("Weak password", func(t *testing.T) {
		_, err := svc.Register(context.Background(), service.RegisterInput{
			Email:    "test@example.com",
			Password: "short",
			Name:     "Test",
		})
		if err != service.ErrWeakPassword {
			t.Errorf("expected ErrWeakPassword, got %v", err)
		}
	})

	t.Run("Invalid role", func(t *testing.T) {
		_, err := svc.Register(context.Background(), service.RegisterInput{
			Email:    "test@example.com",
			Password: "password123",
			Name:     "Test",
			Role:     models.UserRole("superhero"),
		})
		if err != service.ErrInvalidRole {
			t.Errorf("expected ErrInvalidRole, got %v", err)
		}
	})
}
