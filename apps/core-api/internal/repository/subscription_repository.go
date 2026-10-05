package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"ephemeral/packages/go-shared/models"
)

var (
	ErrSubscriptionNotFound = errors.New("subscription not found")
)

type SubscriptionRepository struct {
	pool *pgxpool.Pool
}

func NewSubscriptionRepository(pool *pgxpool.Pool) *SubscriptionRepository {
	return &SubscriptionRepository{pool: pool}
}

func (r *SubscriptionRepository) Create(ctx context.Context, s *models.Subscription) (*models.Subscription, error) {
	query := `
		INSERT INTO subscriptions (user_id, plan_id, api_key_hash, api_key_prefix, stripe_subscription_id, status, current_period_start, current_period_end)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, user_id, plan_id, api_key_hash, api_key_prefix, stripe_subscription_id, status, current_period_start, current_period_end, created_at
	`

	var sub models.Subscription
	var statusStr string
	err := r.pool.QueryRow(ctx, query,
		s.UserID,
		s.PlanID,
		s.APIKeyHash,
		s.APIKeyPrefix,
		s.StripeSubscriptionID,
		string(s.Status),
		s.CurrentPeriodStart,
		s.CurrentPeriodEnd,
	).Scan(
		&sub.ID,
		&sub.UserID,
		&sub.PlanID,
		&sub.APIKeyHash,
		&sub.APIKeyPrefix,
		&sub.StripeSubscriptionID,
		&statusStr,
		&sub.CurrentPeriodStart,
		&sub.CurrentPeriodEnd,
		&sub.CreatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to insert subscription: %w", err)
	}

	sub.Status = models.SubscriptionStatus(statusStr)
	return &sub, nil
}

func (r *SubscriptionRepository) FindActiveByUserAndPlan(ctx context.Context, userID, planID string) (*models.Subscription, error) {
	query := `
		SELECT id, user_id, plan_id, api_key_hash, api_key_prefix, stripe_subscription_id, status, current_period_start, current_period_end, created_at
		FROM subscriptions
		WHERE user_id = $1 AND plan_id = $2 AND status = 'active'
	`

	var sub models.Subscription
	var statusStr string
	err := r.pool.QueryRow(ctx, query, userID, planID).Scan(
		&sub.ID,
		&sub.UserID,
		&sub.PlanID,
		&sub.APIKeyHash,
		&sub.APIKeyPrefix,
		&sub.StripeSubscriptionID,
		&statusStr,
		&sub.CurrentPeriodStart,
		&sub.CurrentPeriodEnd,
		&sub.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to query active subscription: %w", err)
	}

	sub.Status = models.SubscriptionStatus(statusStr)
	return &sub, nil
}

func (r *SubscriptionRepository) FindByID(ctx context.Context, id string) (*models.Subscription, error) {
	query := `
		SELECT id, user_id, plan_id, api_key_hash, api_key_prefix, stripe_subscription_id, status, current_period_start, current_period_end, created_at
		FROM subscriptions
		WHERE id = $1
	`

	var sub models.Subscription
	var statusStr string
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&sub.ID,
		&sub.UserID,
		&sub.PlanID,
		&sub.APIKeyHash,
		&sub.APIKeyPrefix,
		&sub.StripeSubscriptionID,
		&statusStr,
		&sub.CurrentPeriodStart,
		&sub.CurrentPeriodEnd,
		&sub.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrSubscriptionNotFound
		}
		return nil, fmt.Errorf("failed to query subscription by id: %w", err)
	}

	sub.Status = models.SubscriptionStatus(statusStr)
	return &sub, nil
}

func (r *SubscriptionRepository) ListByUserID(ctx context.Context, userID string) ([]models.Subscription, error) {
	query := `
		SELECT id, user_id, plan_id, api_key_hash, api_key_prefix, stripe_subscription_id, status, current_period_start, current_period_end, created_at
		FROM subscriptions
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user subscriptions: %w", err)
	}
	defer rows.Close()

	var subs []models.Subscription
	for rows.Next() {
		var s models.Subscription
		var statusStr string
		if err := rows.Scan(
			&s.ID,
			&s.UserID,
			&s.PlanID,
			&s.APIKeyHash,
			&s.APIKeyPrefix,
			&s.StripeSubscriptionID,
			&statusStr,
			&s.CurrentPeriodStart,
			&s.CurrentPeriodEnd,
			&s.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan subscription row: %w", err)
		}
		s.Status = models.SubscriptionStatus(statusStr)
		subs = append(subs, s)
	}

	if subs == nil {
		subs = []models.Subscription{}
	}

	return subs, nil
}

func (r *SubscriptionRepository) UpdateAPIKey(ctx context.Context, id, apiKeyHash, apiKeyPrefix string) (*models.Subscription, error) {
	query := `
		UPDATE subscriptions
		SET api_key_hash = $1, api_key_prefix = $2
		WHERE id = $3
		RETURNING id, user_id, plan_id, api_key_hash, api_key_prefix, stripe_subscription_id, status, current_period_start, current_period_end, created_at
	`

	var sub models.Subscription
	var statusStr string
	err := r.pool.QueryRow(ctx, query, apiKeyHash, apiKeyPrefix, id).Scan(
		&sub.ID,
		&sub.UserID,
		&sub.PlanID,
		&sub.APIKeyHash,
		&sub.APIKeyPrefix,
		&sub.StripeSubscriptionID,
		&statusStr,
		&sub.CurrentPeriodStart,
		&sub.CurrentPeriodEnd,
		&sub.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrSubscriptionNotFound
		}
		return nil, fmt.Errorf("failed to update subscription api key: %w", err)
	}

	sub.Status = models.SubscriptionStatus(statusStr)
	return &sub, nil
}

func (r *SubscriptionRepository) UpdateStatus(ctx context.Context, id string, status models.SubscriptionStatus) (*models.Subscription, error) {
	query := `
		UPDATE subscriptions
		SET status = $1
		WHERE id = $2
		RETURNING id, user_id, plan_id, api_key_hash, api_key_prefix, stripe_subscription_id, status, current_period_start, current_period_end, created_at
	`

	var sub models.Subscription
	var statusStr string
	err := r.pool.QueryRow(ctx, query, string(status), id).Scan(
		&sub.ID,
		&sub.UserID,
		&sub.PlanID,
		&sub.APIKeyHash,
		&sub.APIKeyPrefix,
		&sub.StripeSubscriptionID,
		&statusStr,
		&sub.CurrentPeriodStart,
		&sub.CurrentPeriodEnd,
		&sub.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrSubscriptionNotFound
		}
		return nil, fmt.Errorf("failed to update subscription status: %w", err)
	}

	sub.Status = models.SubscriptionStatus(statusStr)
	return &sub, nil
}
