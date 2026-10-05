package handler_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/apps/core-api/internal/handler"
)

func TestSubscriptionHandlerUnauthorized(t *testing.T) {
	h := handler.NewSubscriptionHandler(nil)

	t.Run("Subscribe without auth returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/subscriptions", bytes.NewBufferString(`{}`))
		rr := httptest.NewRecorder()

		h.Subscribe(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("ListMy without auth returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/subscriptions", nil)
		rr := httptest.NewRecorder()

		h.ListMy(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("RotateKey without auth returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/subscriptions/sub-1/rotate-key", nil)
		rr := httptest.NewRecorder()

		h.RotateKey(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})
}
