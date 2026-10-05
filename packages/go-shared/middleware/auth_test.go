package middleware_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/packages/go-shared/auth"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/models"
)

func TestAuthMiddleware(t *testing.T) {
	jwtSecret := "my-jwt-test-secret-32-chars-long!"
	userID := "00000000-0000-0000-0000-000000000001"
	token, _ := auth.GenerateJWT(jwtSecret, userID, "provider")

	mockFetchUser := func(ctx context.Context, id string) (*models.User, error) {
		if id == userID {
			return &models.User{
				ID:    userID,
				Email: "test@example.com",
				Name:  "Test Provider",
				Role:  models.RoleProvider,
			}, nil
		}
		return nil, nil
	}

	handler := middleware.Auth(jwtSecret, mockFetchUser)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := middleware.GetAuthUser(r.Context())
		if user == nil {
			t.Fatal("expected user in context")
		}
		if user.ID != userID {
			t.Errorf("expected user ID %s, got %s", userID, user.ID)
		}
		w.WriteHeader(http.StatusOK)
	}))

	t.Run("Valid Token", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/protected", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Fatalf("expected status 200, got %d", rr.Code)
		}
	})

	t.Run("Missing Authorization Header", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/protected", nil)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected status 401, got %d", rr.Code)
		}

		var res map[string]map[string]string
		_ = json.Unmarshal(rr.Body.Bytes(), &res)
		if res["error"]["code"] != "UNAUTHORIZED" {
			t.Errorf("expected UNAUTHORIZED, got %s", res["error"]["code"])
		}
	})

	t.Run("Garbage Authorization Header", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/protected", nil)
		req.Header.Set("Authorization", "Bearer garbage-token")
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Fatalf("expected status 401, got %d", rr.Code)
		}
	})

	t.Run("RequireRole Allowed", func(t *testing.T) {
		roleHandler := middleware.Auth(jwtSecret, mockFetchUser)(
			middleware.RequireRole(models.RoleProvider, models.RoleAdmin)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			})),
		)

		req := httptest.NewRequest(http.MethodGet, "/admin", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		rr := httptest.NewRecorder()

		roleHandler.ServeHTTP(rr, req)
		if rr.Code != http.StatusOK {
			t.Fatalf("expected status 200, got %d", rr.Code)
		}
	})

	t.Run("RequireRole Forbidden", func(t *testing.T) {
		roleHandler := middleware.Auth(jwtSecret, mockFetchUser)(
			middleware.RequireRole(models.RoleConsumer)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(http.StatusOK)
			})),
		)

		req := httptest.NewRequest(http.MethodGet, "/consumer-only", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		rr := httptest.NewRecorder()

		roleHandler.ServeHTTP(rr, req)
		if rr.Code != http.StatusForbidden {
			t.Fatalf("expected status 403, got %d", rr.Code)
		}

		var res map[string]map[string]string
		_ = json.Unmarshal(rr.Body.Bytes(), &res)
		if res["error"]["code"] != "FORBIDDEN" {
			t.Errorf("expected FORBIDDEN, got %s", res["error"]["code"])
		}
	})
}
