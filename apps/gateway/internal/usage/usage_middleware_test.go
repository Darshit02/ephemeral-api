package usage_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
	"time"

	"ephemeral/apps/gateway/internal/auth"
	"ephemeral/apps/gateway/internal/repository"
	"ephemeral/apps/gateway/internal/usage"
	"ephemeral/packages/go-shared/models"
)

type mockRepo struct {
	mu           sync.Mutex
	recordedSubs []string
	recordedAPIs []string
	recordedStat []int
}

func (m *mockRepo) FindSubscriptionsByPrefix(ctx context.Context, prefix string) ([]repository.SubscriptionAuthInfo, error) {
	return nil, nil
}

func (m *mockRepo) FindAPIBySlug(ctx context.Context, slug string) (*models.API, error) {
	return nil, nil
}

func (m *mockRepo) RecordUsage(ctx context.Context, subID, apiID, endpoint, method string, status, latencyMs int) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.recordedSubs = append(m.recordedSubs, subID)
	m.recordedAPIs = append(m.recordedAPIs, apiID)
	m.recordedStat = append(m.recordedStat, status)
	return nil
}

func TestUsageMiddleware(t *testing.T) {
	repo := &mockRepo{}
	sub := &repository.SubscriptionAuthInfo{
		ID:    "sub-usage-1",
		APIID: "api-usage-1",
	}
	api := &models.API{
		ID:   "api-usage-1",
		Slug: "weather-api",
	}

	t.Run("records usage event with correct status code", func(t *testing.T) {
		handler := usage.Middleware(repo, nil)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"error":{"code":"RATE_LIMIT_EXCEEDED"}}`))
		}))

		req := httptest.NewRequest(http.MethodGet, "/v1/weather-api/forecast", nil)
		ctx := auth.WithSubscription(req.Context(), sub)
		ctx = auth.WithAPI(ctx, api)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req.WithContext(ctx))

		if rr.Code != http.StatusTooManyRequests {
			t.Fatalf("expected 429, got %d", rr.Code)
		}

		// Wait briefly for the async goroutine to execute
		time.Sleep(50 * time.Millisecond)

		repo.mu.Lock()
		defer repo.mu.Unlock()
		if len(repo.recordedSubs) != 1 {
			t.Fatalf("expected 1 recorded event, got %d", len(repo.recordedSubs))
		}
		if repo.recordedSubs[0] != "sub-usage-1" || repo.recordedAPIs[0] != "api-usage-1" {
			t.Fatalf("unexpected ids: sub=%s, api=%s", repo.recordedSubs[0], repo.recordedAPIs[0])
		}
		if repo.recordedStat[0] != http.StatusTooManyRequests {
			t.Fatalf("expected status 429 recorded, got %d", repo.recordedStat[0])
		}
	})
}
