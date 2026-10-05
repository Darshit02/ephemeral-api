package service_test

import (
	"context"
	"testing"

	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/models"
)

func TestSubscriptionServiceValidation(t *testing.T) {
	svc := service.NewSubscriptionService(nil, nil, nil, nil, nil, nil)
	if svc == nil {
		t.Fatal("expected non-nil service")
	}

	t.Run("Empty plan_id returns error", func(t *testing.T) {
		user := &models.User{ID: "user-1"}
		_, err := svc.Subscribe(context.Background(), user, service.SubscribeInput{PlanID: ""})
		if err == nil || err.Error() != "plan_id is required" {
			t.Errorf("expected plan_id is required, got %v", err)
		}
	})
}
