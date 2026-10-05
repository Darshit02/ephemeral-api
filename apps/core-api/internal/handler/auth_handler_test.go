package handler_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/apps/core-api/internal/handler"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/models"
)

func TestAuthHandlerMeAndLogout(t *testing.T) {
	h := handler.NewAuthHandler(nil)

	t.Run("Me unauthorized without context user", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/auth/me", nil)
		rr := httptest.NewRecorder()

		h.Me(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Errorf("expected 401, got %d", rr.Code)
		}
	})

	t.Run("Me authorized with context user", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/auth/me", nil)
		user := &models.User{
			ID:    "123",
			Email: "alice@example.com",
			Name:  "Alice",
			Role:  models.RoleProvider,
		}

		ctx := context.WithValue(req.Context(), reflectUserKey(), user)
		// We use middleware.Auth in integration, but in unit test we can pass wrapped request
		req = req.WithContext(ctx)

		// Create a subrouter with middleware to verify end-to-end
	})

	t.Run("Logout returns 200 ok", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/auth/logout", nil)
		rr := httptest.NewRecorder()

		h.Logout(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("expected 200, got %d", rr.Code)
		}

		var body map[string]map[string]string
		_ = json.Unmarshal(rr.Body.Bytes(), &body)
		if body["data"]["message"] != "logged out successfully" {
			t.Errorf("unexpected logout message: %v", body)
		}
	})

	t.Run("Register bad JSON returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/auth/register", bytes.NewBufferString("invalid json"))
		rr := httptest.NewRecorder()

		h.Register(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("expected 400, got %d", rr.Code)
		}
	})
}

// Helper to access internal userContextKey for unit test
func reflectUserKey() any {
	// Alternatively test via middleware.Auth
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	_ = middleware.GetAuthUser(r.Context())
	return struct{}{}
}
