package handler_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/apps/core-api/internal/handler"
	"ephemeral/apps/core-api/internal/service"
)

func TestWebhookHandler(t *testing.T) {
	stripeSvc := service.NewStripeService("sk_test_mock", "whsec_mock", nil)
	subSvc := service.NewSubscriptionService(nil, nil, nil, nil, stripeSvc, nil)
	h := handler.NewWebhookHandler(subSvc)

	t.Run("invalid json returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/webhooks/stripe", bytes.NewBufferString(`invalid json`))
		rr := httptest.NewRecorder()

		h.HandleStripe(rr, req)
		if rr.Code != http.StatusBadRequest {
			t.Fatalf("expected 400, got %d", rr.Code)
		}
	})

	t.Run("empty type returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/webhooks/stripe", bytes.NewBufferString(`{}`))
		rr := httptest.NewRecorder()

		h.HandleStripe(rr, req)
		if rr.Code != http.StatusBadRequest {
			t.Fatalf("expected 400, got %d", rr.Code)
		}
	})
}
