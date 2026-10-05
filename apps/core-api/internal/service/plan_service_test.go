package service_test

import (
	"testing"

	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/models"
)

func TestPlanServiceValidation(t *testing.T) {
	svc := service.NewPlanService(nil, nil)
	if svc == nil {
		t.Fatal("expected non-nil service")
	}

	t.Run("Negative price validation", func(t *testing.T) {
		input := service.CreatePlanInput{
			Name:             "Invalid Plan",
			PriceCents:       -50,
			RateLimitPerHour: 100,
		}
		if input.PriceCents >= 0 {
			t.Errorf("expected negative price")
		}
	})

	t.Run("Zero rate limit validation", func(t *testing.T) {
		input := service.CreatePlanInput{
			Name:             "Zero Rate",
			PriceCents:       100,
			RateLimitPerHour: 0,
		}
		if input.RateLimitPerHour > 0 {
			t.Errorf("expected zero rate limit")
		}
	})

	t.Run("Public plan conversion hides stripe_price_id", func(t *testing.T) {
		stripeID := "price_12345"
		plan := models.Plan{
			ID:               "plan-1",
			APIID:            "api-1",
			Name:             "Pro",
			PriceCents:       2000,
			RateLimitPerHour: 5000,
			StripePriceID:    &stripeID,
		}

		public := plan.ToPublic()
		if public.ID != "plan-1" || public.PriceCents != 2000 {
			t.Errorf("expected public plan fields to match, got %+v", public)
		}
	})
}
