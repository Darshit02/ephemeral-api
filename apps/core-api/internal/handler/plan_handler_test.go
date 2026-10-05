package handler_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/apps/core-api/internal/handler"
)

func TestPlanHandlerUnauthorized(t *testing.T) {
	h := handler.NewPlanHandler(nil)

	t.Run("Create without auth user returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/admin/apis/api-1/plans", bytes.NewBufferString(`{}`))
		rr := httptest.NewRecorder()

		h.Create(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("ListByAPI without auth user returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/admin/apis/api-1/plans", nil)
		rr := httptest.NewRecorder()

		h.ListByAPI(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("Update without auth user returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPut, "/admin/plans/plan-1", bytes.NewBufferString(`{}`))
		rr := httptest.NewRecorder()

		h.Update(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("Delete without auth user returns 401", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodDelete, "/admin/plans/plan-1", nil)
		rr := httptest.NewRecorder()

		h.Delete(rr, req)
		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})
}
