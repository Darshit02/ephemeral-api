package handler_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/apps/core-api/internal/handler"
)

func TestAPIHandlerValidation(t *testing.T) {
	h := handler.NewAPIHandler(nil)

	t.Run("Create without auth user returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/admin/apis", bytes.NewBufferString(`{}`))
		rr := httptest.NewRecorder()

		h.Create(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("ListOwn without auth user returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/admin/apis", nil)
		rr := httptest.NewRecorder()

		h.ListOwn(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})
}
