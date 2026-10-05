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
	ErrSubscriptionNotFound = errors.New("subscription not found")
	ErrAPINotFound          = errors.New("api not found")
)

type SubscriptionAuthInfo struct {
	ID               string
	UserID           string
	PlanID           string
	APIID            string
	APIKeyHash       string
	APIKeyPrefix     string
	Status           models.SubscriptionStatus
	CurrentPeriodEnd time.Time
	RateLimitPerHour int
}

type Repository interface {
	FindSubscriptionsByPrefix(ctx context.Context, prefix string) ([]SubscriptionAuthInfo, error)
	FindAPIBySlug(ctx context.Context, slug string) (*models.API, error)
	RecordUsage(ctx context.Context, subID, apiID, endpoint, method string, status, latencyMs int) error
}

type GatewayRepository struct {
	pool *pgxpool.Pool
}

func NewGatewayRepository(pool *pgxpool.Pool) *GatewayRepository {
	return &GatewayRepository{pool: pool}
}

func (r *GatewayRepository) FindSubscriptionsByPrefix(ctx context.Context, prefix string) ([]SubscriptionAuthInfo, error) {
	query := `
		SELECT s.id, s.user_id, s.plan_id, p.api_id, s.api_key_hash, s.api_key_prefix, s.status, s.current_period_end, p.rate_limit_per_hour
		FROM subscriptions s
		JOIN plans p ON p.id = s.plan_id
		WHERE s.api_key_prefix = $1
	`

	rows, err := r.pool.Query(ctx, query, prefix)
	if err != nil {
		return nil, fmt.Errorf("failed to query subscriptions by prefix: %w", err)
	}
	defer rows.Close()

	var subs []SubscriptionAuthInfo
	for rows.Next() {
		var sub SubscriptionAuthInfo
		var statusStr string
		if err := rows.Scan(
			&sub.ID,
			&sub.UserID,
			&sub.PlanID,
			&sub.APIID,
			&sub.APIKeyHash,
			&sub.APIKeyPrefix,
			&statusStr,
			&sub.CurrentPeriodEnd,
			&sub.RateLimitPerHour,
		); err != nil {
			return nil, fmt.Errorf("failed to scan subscription row: %w", err)
		}
		sub.Status = models.SubscriptionStatus(statusStr)
		subs = append(subs, sub)
	}

	return subs, nil
}

func (r *GatewayRepository) FindAPIBySlug(ctx context.Context, slug string) (*models.API, error) {
	query := `
		SELECT id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
		FROM apis
		WHERE slug = $1
	`

	var a models.API
	var statusStr string
	err := r.pool.QueryRow(ctx, query, slug).Scan(
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
		return nil, fmt.Errorf("failed to query api by slug: %w", err)
	}

	a.Status = models.APIStatus(statusStr)
	return &a, nil
}

func (r *GatewayRepository) RecordUsage(ctx context.Context, subID, apiID, endpoint, method string, status, latencyMs int) error {
	query := `
		INSERT INTO usage_events (subscription_id, api_id, endpoint, method, response_status, response_time_ms, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW())
	`
	_, err := r.pool.Exec(ctx, query, subID, apiID, endpoint, method, status, latencyMs)
	if err != nil {
		return fmt.Errorf("failed to insert usage event: %w", err)
	}
	return nil
}
