package handler_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/apps/admin-api/internal/handler"
	"ephemeral/apps/admin-api/internal/service"
)

func TestAnalyticsHandlerUnauthorized(t *testing.T) {
	svc := service.NewAnalyticsService(nil)
	h := handler.NewAnalyticsHandler(svc)

	t.Run("GetAPIUsage without auth returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/admin/apis/api-123/usage", nil)
		rr := httptest.NewRecorder()

		h.GetAPIUsage(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("GetAPIConsumers without auth returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/admin/apis/api-123/consumers", nil)
		rr := httptest.NewRecorder()

		h.GetAPIConsumers(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("GetRevenueSummary without auth returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/admin/revenue", nil)
		rr := httptest.NewRecorder()

		h.GetRevenueSummary(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", rr.Code)
		}
	})
}
