package service_test

import (
	"context"
	"errors"
	"testing"

	"ephemeral/apps/admin-api/internal/service"
	"ephemeral/packages/go-shared/models"
)

func TestAnalyticsServiceAuthorization(t *testing.T) {
	svc := service.NewAnalyticsService(nil)

	t.Run("RevenueSummary forbidden for non-provider", func(t *testing.T) {
		consumer := &models.User{
			ID:   "u-consumer",
			Role: models.RoleConsumer,
		}

		_, err := svc.GetRevenueSummary(context.Background(), consumer)
		if !errors.Is(err, service.ErrForbidden) {
			t.Fatalf("expected ErrForbidden for consumer on revenue summary, got %v", err)
		}
	})
}
