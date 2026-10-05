package service_test

import (
	"context"
	"testing"

	"ephemeral/apps/core-api/internal/service"
)

func TestAPIServiceValidation(t *testing.T) {
	svc := service.NewAPIService(nil)

	t.Run("Empty name", func(t *testing.T) {
		_, err := svc.Create(context.Background(), "provider-id", service.CreateAPIInput{
			Name:    "",
			Slug:    "valid-slug",
			BaseURL: "https://api.example.com",
		})
		if err == nil || err.Error() != "name is required" {
			t.Errorf("expected 'name is required', got %v", err)
		}
	})

	t.Run("Invalid slug", func(t *testing.T) {
		invalidSlugs := []string{"", "Invalid Slug", "slug_underscore", "-start-hyphen", "end-hyphen-", "special$char"}
		for _, slug := range invalidSlugs {
			_, err := svc.Create(context.Background(), "provider-id", service.CreateAPIInput{
				Name:    "Test API",
				Slug:    slug,
				BaseURL: "https://api.example.com",
			})
			if err != service.ErrInvalidSlug {
				t.Errorf("expected ErrInvalidSlug for '%s', got %v", slug, err)
			}
		}
	})

	t.Run("Invalid base_url", func(t *testing.T) {
		invalidURLs := []string{"", "not-a-url", "ftp://example.com", "/relative/path"}
		for _, u := range invalidURLs {
			_, err := svc.Create(context.Background(), "provider-id", service.CreateAPIInput{
				Name:    "Test API",
				Slug:    "test-api",
				BaseURL: u,
			})
			if err != service.ErrInvalidBaseURL {
				t.Errorf("expected ErrInvalidBaseURL for '%s', got %v", u, err)
			}
		}
	})
}
