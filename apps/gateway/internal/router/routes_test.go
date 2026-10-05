package router_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/apps/gateway/internal/router"
)

func TestGatewayRouterHealth(t *testing.T) {
	r := router.New(router.GatewayRouterDeps{
		ServiceName: "gateway",
		DB:          nil,
		Redis:       nil,
		Logger:      nil,
	})

	t.Run("GET /health returns 200 with service info", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/health", nil)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Fatalf("expected status 200, got %d", rr.Code)
		}

		var body map[string]string
		if err := json.Unmarshal(rr.Body.Bytes(), &body); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if body["status"] != "ok" || body["service"] != "gateway" {
			t.Fatalf("unexpected body: %v", body)
		}
	})

	t.Run("GET /health/redis returns 503 when redis is nil", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/health/redis", nil)
		rr := httptest.NewRecorder()
		r.ServeHTTP(rr, req)

		if rr.Code != http.StatusServiceUnavailable {
			t.Fatalf("expected status 503, got %d", rr.Code)
		}

		var body map[string]map[string]string
		if err := json.Unmarshal(rr.Body.Bytes(), &body); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if body["error"]["code"] != "SERVICE_UNAVAILABLE" {
			t.Fatalf("expected code SERVICE_UNAVAILABLE, got %s", body["error"]["code"])
		}
	})
}
