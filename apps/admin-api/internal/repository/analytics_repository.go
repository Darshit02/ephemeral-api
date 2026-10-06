package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ephemeral/packages/go-shared/models"
)

var (
	ErrAPINotFound = errors.New("api not found")
)

type UsageSeriesPoint struct {
	TS       string `json:"ts"`
	Requests int    `json:"requests"`
	Errors   int    `json:"errors"`
	P95Ms    int    `json:"p95_ms"`
}

type UsageAnalytics struct {
	TotalRequests int                `json:"total_requests"`
	TotalErrors   int                `json:"total_errors"`
	AvgLatencyMs  int                `json:"avg_latency_ms"`
	Series        []UsageSeriesPoint `json:"series"`
}

type ConsumerStat struct {
	UserID         string     `json:"user_id"`
	UserName       string     `json:"user_name"`
	UserEmail      string     `json:"user_email"`
	SubscriptionID string     `json:"subscription_id"`
	PlanName       string     `json:"plan_name"`
	PlanPriceCents int        `json:"plan_price_cents"`
	Status         string     `json:"status"`
	TotalRequests  int        `json:"total_requests"`
	LastRequestAt  *time.Time `json:"last_request_at"`
	CreatedAt      time.Time  `json:"created_at"`
}

type APIRevenueStat struct {
	APIID             string `json:"api_id"`
	APIName           string `json:"api_name"`
	ActiveSubscribers int    `json:"active_subscribers"`
	RevenueCents      int    `json:"revenue_cents"`
}

type PlanRevenueStat struct {
	PlanID            string `json:"plan_id"`
	PlanName          string `json:"plan_name"`
	APIName           string `json:"api_name"`
	PriceCents        int    `json:"price_cents"`
	ActiveSubscribers int    `json:"active_subscribers"`
	RevenueCents      int    `json:"revenue_cents"`
}

type RevenueSummary struct {
	GrossRevenueCents int               `json:"gross_revenue_cents"`
	PlatformFeeCents  int               `json:"platform_fee_cents"`
	NetRevenueCents   int               `json:"net_revenue_cents"`
	ActiveSubscribers int               `json:"active_subscribers"`
	ByAPI             []APIRevenueStat  `json:"by_api"`
	ByPlan            []PlanRevenueStat `json:"by_plan"`
}

type AnalyticsRepository struct {
	pool *pgxpool.Pool
}

func NewAnalyticsRepository(pool *pgxpool.Pool) *AnalyticsRepository {
	return &AnalyticsRepository{pool: pool}
}

func (r *AnalyticsRepository) FindAPIByID(ctx context.Context, apiID string) (*models.API, error) {
	query := `
		SELECT id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
		FROM apis
		WHERE id = $1
	`
	var a models.API
	var statusStr string
	err := r.pool.QueryRow(ctx, query, apiID).Scan(
		&a.ID,
		&a.ProviderID,
		&a.Name,
		&a.Slug,
		&a.Description,
		&a.BaseURL,
		&a.OpenAPISpec,
		&statusStr,
		&a.CreatedAt,
		&a.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrAPINotFound
		}
		return nil, fmt.Errorf("failed to query api by id: %w", err)
	}
	a.Status = models.APIStatus(statusStr)
	return &a, nil
}

func (r *AnalyticsRepository) GetAPIUsageStats(ctx context.Context, apiID string, from, to time.Time, interval string) (*UsageAnalytics, error) {
	validIntervals := map[string]bool{
		"minute": true,
		"hour":   true,
		"day":    true,
		"month":  true,
	}
	if !validIntervals[interval] {
		interval = "day"
	}

	aggQuery := `
		SELECT
			COUNT(*),
			COUNT(*) FILTER (WHERE response_status >= 400),
			COALESCE(ROUND(AVG(response_time_ms)), 0)
		FROM usage_events
		WHERE api_id = $1 AND created_at >= $2 AND created_at <= $3
	`

	var analytics UsageAnalytics
	err := r.pool.QueryRow(ctx, aggQuery, apiID, from, to).Scan(
		&analytics.TotalRequests,
		&analytics.TotalErrors,
		&analytics.AvgLatencyMs,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to aggregate usage events: %w", err)
	}

	seriesQuery := fmt.Sprintf(`
		SELECT
			date_trunc('%s', created_at) AS ts,
			COUNT(*) AS requests,
			COUNT(*) FILTER (WHERE response_status >= 400) AS errors,
			COALESCE(ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms)), 0) AS p95_ms
		FROM usage_events
		WHERE api_id = $1 AND created_at >= $2 AND created_at <= $3
		GROUP BY ts
		ORDER BY ts ASC
	`, interval)

	rows, err := r.pool.Query(ctx, seriesQuery, apiID, from, to)
	if err != nil {
		return nil, fmt.Errorf("failed to query usage series: %w", err)
	}
	defer rows.Close()

	series := make([]UsageSeriesPoint, 0)
	for rows.Next() {
		var pt UsageSeriesPoint
		var t time.Time
		if err := rows.Scan(&t, &pt.Requests, &pt.Errors, &pt.P95Ms); err != nil {
			return nil, fmt.Errorf("failed to scan series point: %w", err)
		}
		pt.TS = t.UTC().Format(time.RFC3339)
		series = append(series, pt)
	}

	analytics.Series = series
	return &analytics, nil
}

func (r *AnalyticsRepository) GetAPIConsumers(ctx context.Context, apiID string) ([]ConsumerStat, error) {
	query := `
		SELECT
			u.id AS user_id,
			u.name AS user_name,
			u.email AS user_email,
			s.id AS subscription_id,
			p.name AS plan_name,
			p.price_cents AS plan_price_cents,
			s.status AS status,
			COUNT(ue.id) AS total_requests,
			MAX(ue.created_at) AS last_request_at,
			s.created_at AS created_at
		FROM subscriptions s
		JOIN users u ON u.id = s.user_id
		JOIN plans p ON p.id = s.plan_id
		LEFT JOIN usage_events ue ON ue.subscription_id = s.id AND ue.api_id = p.api_id
		WHERE p.api_id = $1
		GROUP BY u.id, u.name, u.email, s.id, p.name, p.price_cents, s.status, s.created_at
		ORDER BY total_requests DESC, s.created_at DESC
	`

	rows, err := r.pool.Query(ctx, query, apiID)
	if err != nil {
		return nil, fmt.Errorf("failed to query consumers: %w", err)
	}
	defer rows.Close()

	consumers := make([]ConsumerStat, 0)
	for rows.Next() {
		var c ConsumerStat
		var statusStr string
		if err := rows.Scan(
			&c.UserID,
			&c.UserName,
			&c.UserEmail,
			&c.SubscriptionID,
			&c.PlanName,
			&c.PlanPriceCents,
			&statusStr,
			&c.TotalRequests,
			&c.LastRequestAt,
			&c.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan consumer row: %w", err)
		}
		c.Status = statusStr
		consumers = append(consumers, c)
	}

	return consumers, nil
}

func (r *AnalyticsRepository) GetProviderRevenue(ctx context.Context, providerID string) (*RevenueSummary, error) {
	summaryQuery := `
		SELECT
			COALESCE(SUM(p.price_cents), 0) AS gross_revenue_cents,
			COUNT(DISTINCT s.user_id) AS active_subscribers
		FROM apis a
		JOIN plans p ON p.api_id = a.id
		JOIN subscriptions s ON s.plan_id = p.id
		WHERE a.provider_id = $1 AND s.status = 'active'
	`

	var summary RevenueSummary
	err := r.pool.QueryRow(ctx, summaryQuery, providerID).Scan(
		&summary.GrossRevenueCents,
		&summary.ActiveSubscribers,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query provider revenue summary: %w", err)
	}

	summary.PlatformFeeCents = int(float64(summary.GrossRevenueCents) * 0.20)
	summary.NetRevenueCents = summary.GrossRevenueCents - summary.PlatformFeeCents

	apiBreakdownQuery := `
		SELECT
			a.id AS api_id,
			a.name AS api_name,
			COUNT(DISTINCT s.user_id) AS active_subscribers,
			COALESCE(SUM(CASE WHEN s.id IS NOT NULL THEN p.price_cents ELSE 0 END), 0) AS revenue_cents
		FROM apis a
		LEFT JOIN plans p ON p.api_id = a.id
		LEFT JOIN subscriptions s ON s.plan_id = p.id AND s.status = 'active'
		WHERE a.provider_id = $1
		GROUP BY a.id, a.name
		ORDER BY revenue_cents DESC, a.name ASC
	`

	apiRows, err := r.pool.Query(ctx, apiBreakdownQuery, providerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query api revenue breakdown: %w", err)
	}
	defer apiRows.Close()

	byAPI := make([]APIRevenueStat, 0)
	for apiRows.Next() {
		var stat APIRevenueStat
		if err := apiRows.Scan(&stat.APIID, &stat.APIName, &stat.ActiveSubscribers, &stat.RevenueCents); err != nil {
			return nil, fmt.Errorf("failed to scan api revenue stat: %w", err)
		}
		byAPI = append(byAPI, stat)
	}
	summary.ByAPI = byAPI

	planBreakdownQuery := `
		SELECT
			p.id AS plan_id,
			p.name AS plan_name,
			a.name AS api_name,
			p.price_cents AS price_cents,
			COUNT(s.id) AS active_subscribers,
			COALESCE(SUM(CASE WHEN s.id IS NOT NULL THEN p.price_cents ELSE 0 END), 0) AS revenue_cents
		FROM apis a
		JOIN plans p ON p.api_id = a.id
		LEFT JOIN subscriptions s ON s.plan_id = p.id AND s.status = 'active'
		WHERE a.provider_id = $1
		GROUP BY p.id, p.name, a.name, p.price_cents
		ORDER BY revenue_cents DESC, p.name ASC
	`

	planRows, err := r.pool.Query(ctx, planBreakdownQuery, providerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query plan revenue breakdown: %w", err)
	}
	defer planRows.Close()

	byPlan := make([]PlanRevenueStat, 0)
	for planRows.Next() {
		var stat PlanRevenueStat
		if err := planRows.Scan(
			&stat.PlanID,
			&stat.PlanName,
			&stat.APIName,
			&stat.PriceCents,
			&stat.ActiveSubscribers,
			&stat.RevenueCents,
		); err != nil {
			return nil, fmt.Errorf("failed to scan plan revenue stat: %w", err)
		}
		byPlan = append(byPlan, stat)
	}
	summary.ByPlan = byPlan

	return &summary, nil
}
