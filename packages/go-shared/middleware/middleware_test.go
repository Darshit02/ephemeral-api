package middleware_test

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"ephemeral/packages/go-shared/middleware"
)

func TestRequestID(t *testing.T) {
	handler := middleware.RequestID(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqID := middleware.GetRequestID(r.Context())
		if reqID == "" {
			t.Errorf("expected request id in context, got empty")
		}
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	rr := httptest.NewRecorder()

	handler.ServeHTTP(rr, req)

	resHeader := rr.Header().Get(middleware.RequestIDHeader)
	if resHeader == "" {
		t.Errorf("expected %s header, got empty", middleware.RequestIDHeader)
	}

	// Test passing existing header
	req2 := httptest.NewRequest(http.MethodGet, "/test", nil)
	req2.Header.Set(middleware.RequestIDHeader, "custom-id-123")
	rr2 := httptest.NewRecorder()

	handler.ServeHTTP(rr2, req2)
	if rr2.Header().Get(middleware.RequestIDHeader) != "custom-id-123" {
		t.Errorf("expected preserved request id, got %s", rr2.Header().Get(middleware.RequestIDHeader))
	}
}

func TestLogger(t *testing.T) {
	var buf bytes.Buffer
	logger := slog.New(slog.NewJSONHandler(&buf, nil))

	handler := middleware.RequestID(middleware.Logger(logger)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})))

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rr := httptest.NewRecorder()

	handler.ServeHTTP(rr, req)

	var logEntry map[string]any
	if err := json.Unmarshal(buf.Bytes(), &logEntry); err != nil {
		t.Fatalf("failed to parse log json: %v, raw: %s", err, buf.String())
	}

	if logEntry["path"] != "/health" {
		t.Errorf("expected path /health, got %v", logEntry["path"])
	}
	if logEntry["method"] != "GET" {
		t.Errorf("expected method GET, got %v", logEntry["method"])
	}
	if logEntry["status"] != float64(200) {
		t.Errorf("expected status 200, got %v", logEntry["status"])
	}
	if _, ok := logEntry["duration_ms"]; !ok {
		t.Errorf("expected duration_ms field in log")
	}
	if _, ok := logEntry["request_id"]; !ok {
		t.Errorf("expected request_id field in log")
	}
}

func TestRecoverer(t *testing.T) {
	var buf bytes.Buffer
	logger := slog.New(slog.NewJSONHandler(&buf, nil))

	handler := middleware.RequestID(middleware.Recoverer(logger)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("something went terribly wrong")
	})))

	req := httptest.NewRequest(http.MethodGet, "/panic", nil)
	rr := httptest.NewRecorder()

	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Fatalf("expected status 500, got %d", rr.Code)
	}

	var res map[string]map[string]string
	if err := json.Unmarshal(rr.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if res["error"]["code"] != "INTERNAL_SERVER_ERROR" {
		t.Errorf("expected error code INTERNAL_SERVER_ERROR, got %s", res["error"]["code"])
	}
}

func TestCORS(t *testing.T) {
	handler := middleware.CORS()(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest(http.MethodOptions, "/health", nil)
	req.Header.Set("Origin", "http://example.com")
	req.Header.Set("Access-Control-Request-Method", "GET")
	rr := httptest.NewRecorder()

	handler.ServeHTTP(rr, req)

	if rr.Header().Get("Access-Control-Allow-Origin") != "*" {
		t.Errorf("expected Access-Control-Allow-Origin: *, got %s", rr.Header().Get("Access-Control-Allow-Origin"))
	}
}
