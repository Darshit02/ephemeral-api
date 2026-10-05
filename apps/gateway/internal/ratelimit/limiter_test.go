package ratelimit_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"ephemeral/apps/gateway/internal/auth"
	"ephemeral/apps/gateway/internal/ratelimit"
	"ephemeral/apps/gateway/internal/repository"
	"ephemeral/packages/go-shared/models"
)

type mockLimiter struct {
	mu      sync.Mutex
	counts  map[string]int64
	failErr error
}

func newMockLimiter() *mockLimiter {
	return &mockLimiter{
		counts: make(map[string]int64),
	}
}

func (m *mockLimiter) Allow(ctx context.Context, subID, apiID string, limitPerHour int) (*ratelimit.Result, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.failErr != nil {
		return nil, m.failErr
	}

	key := subID + ":" + apiID
	m.counts[key]++
	current := m.counts[key]

	remaining := limitPerHour - int(current)
	if remaining < 0 {
		remaining = 0
	}

	resetUnix := time.Now().Add(time.Hour).Unix()
	return &ratelimit.Result{
		Allowed:    int(current) <= limitPerHour,
		Limit:      limitPerHour,
		Remaining:  remaining,
		ResetUnix:  resetUnix,
		RetryAfter: 3600,
		Current:    current,
	}, nil
}

func TestRateLimitMiddleware(t *testing.T) {
	sub := &repository.SubscriptionAuthInfo{
		ID:               "sub-1",
		APIID:            "api-1",
		RateLimitPerHour: 5,
		Status:           models.SubscriptionStatusActive,
		CurrentPeriodEnd: time.Now().Add(time.Hour),
	}
	api := &models.API{
		ID:     "api-1",
		Slug:   "weather-api",
		Status: models.APIStatusLive,
	}

	t.Run("allows requests within rate limit and sets headers", func(t *testing.T) {
		limiter := newMockLimiter()
		nextCalled := 0
		nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			nextCalled++
			w.WriteHeader(http.StatusOK)
		})

		handler := ratelimit.Middleware(limiter, nil)(nextHandler)

		for i := 1; i <= 5; i++ {
			req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
			ctx := auth.WithSubscription(req.Context(), sub)
			ctx = auth.WithAPI(ctx, api)
			req = req.WithContext(ctx)

			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req)

			if rr.Code != http.StatusOK {
				t.Fatalf("request %d: expected 200, got %d", i, rr.Code)
			}

			limitH := rr.Header().Get("X-RateLimit-Limit")
			if limitH != "5" {
				t.Fatalf("request %d: expected X-RateLimit-Limit 5, got %s", i, limitH)
			}

			expectedRemaining := strconv.Itoa(5 - i)
			remH := rr.Header().Get("X-RateLimit-Remaining")
			if remH != expectedRemaining {
				t.Fatalf("request %d: expected X-RateLimit-Remaining %s, got %s", i, expectedRemaining, remH)
			}

			resetH := rr.Header().Get("X-RateLimit-Reset")
			if resetH == "" {
				t.Fatalf("request %d: expected X-RateLimit-Reset to be present", i)
			}
		}

		if nextCalled != 5 {
			t.Fatalf("expected nextHandler called 5 times, got %d", nextCalled)
		}
	})

	t.Run("blocks 6th request with 429 RATE_LIMIT_EXCEEDED and Retry-After", func(t *testing.T) {
		limiter := newMockLimiter()
		nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
		})

		handler := ratelimit.Middleware(limiter, nil)(nextHandler)

		// Fire 5 requests
		for i := 1; i <= 5; i++ {
			req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
			ctx := auth.WithSubscription(req.Context(), sub)
			ctx = auth.WithAPI(ctx, api)
			rr := httptest.NewRecorder()
			handler.ServeHTTP(rr, req.WithContext(ctx))
		}

		// 6th request
		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api", nil)
		ctx := auth.WithSubscription(req.Context(), sub)
		ctx = auth.WithAPI(ctx, api)
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req.WithContext(ctx))

		if rr.Code != http.StatusTooManyRequests {
			t.Fatalf("expected 429, got %d", rr.Code)
		}

		if !strings.Contains(rr.Body.String(), "RATE_LIMIT_EXCEEDED") {
			t.Fatalf("expected RATE_LIMIT_EXCEEDED in body, got %s", rr.Body.String())
		}

		retryAfter := rr.Header().Get("Retry-After")
		if retryAfter == "" {
			t.Fatal("expected Retry-After header on 429")
		}

		remH := rr.Header().Get("X-RateLimit-Remaining")
		if remH != "0" {
			t.Fatalf("expected X-RateLimit-Remaining 0, got %s", remH)
		}

		limitH := rr.Header().Get("X-RateLimit-Limit")
		if limitH != "5" {
			t.Fatalf("expected X-RateLimit-Limit 5, got %s", limitH)
		}
	})
}
