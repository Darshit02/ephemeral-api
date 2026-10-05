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
	ErrPlanNotFound = errors.New("plan not found")
)

type PlanRepository struct {
	pool *pgxpool.Pool
}

func NewPlanRepository(pool *pgxpool.Pool) *PlanRepository {
	return &PlanRepository{pool: pool}
}

func (r *PlanRepository) Create(ctx context.Context, p *models.Plan) (*models.Plan, error) {
	query := `
		INSERT INTO plans (api_id, name, price_cents, rate_limit_per_hour, monthly_quota, stripe_price_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, api_id, name, price_cents, rate_limit_per_hour, monthly_quota, stripe_price_id, created_at
	`

	var plan models.Plan
	err := r.pool.QueryRow(ctx, query,
		p.APIID,
		p.Name,
		p.PriceCents,
		p.RateLimitPerHour,
		p.MonthlyQuota,
		p.StripePriceID,
	).Scan(
		&plan.ID,
		&plan.APIID,
		&plan.Name,
		&plan.PriceCents,
		&plan.RateLimitPerHour,
		&plan.MonthlyQuota,
		&plan.StripePriceID,
		&plan.CreatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to insert plan: %w", err)
	}

	return &plan, nil
}

func (r *PlanRepository) ListByAPIID(ctx context.Context, apiID string) ([]models.Plan, error) {
	query := `
		SELECT id, api_id, name, price_cents, rate_limit_per_hour, monthly_quota, stripe_price_id, created_at
		FROM plans
		WHERE api_id = $1
		ORDER BY price_cents ASC, created_at ASC
	`

	rows, err := r.pool.Query(ctx, query, apiID)
	if err != nil {
		return nil, fmt.Errorf("failed to query plans by api: %w", err)
	}
	defer rows.Close()

	var plans []models.Plan
	for rows.Next() {
		var p models.Plan
		if err := rows.Scan(
			&p.ID,
			&p.APIID,
			&p.Name,
			&p.PriceCents,
			&p.RateLimitPerHour,
			&p.MonthlyQuota,
			&p.StripePriceID,
			&p.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan plan row: %w", err)
		}
		plans = append(plans, p)
	}

	if plans == nil {
		plans = []models.Plan{}
	}

	return plans, nil
}

func (r *PlanRepository) FindByID(ctx context.Context, id string) (*models.Plan, error) {
	query := `
		SELECT id, api_id, name, price_cents, rate_limit_per_hour, monthly_quota, stripe_price_id, created_at
		FROM plans
		WHERE id = $1
	`

	var p models.Plan
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&p.ID,
		&p.APIID,
		&p.Name,
		&p.PriceCents,
		&p.RateLimitPerHour,
		&p.MonthlyQuota,
		&p.StripePriceID,
		&p.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrPlanNotFound
		}
		return nil, fmt.Errorf("failed to query plan by id: %w", err)
	}

	return &p, nil
}

func (r *PlanRepository) Update(ctx context.Context, p *models.Plan) (*models.Plan, error) {
	query := `
		UPDATE plans
		SET name = $1, price_cents = $2, rate_limit_per_hour = $3, monthly_quota = $4, stripe_price_id = $5
		WHERE id = $6
		RETURNING id, api_id, name, price_cents, rate_limit_per_hour, monthly_quota, stripe_price_id, created_at
	`

	var updated models.Plan
	err := r.pool.QueryRow(ctx, query,
		p.Name,
		p.PriceCents,
		p.RateLimitPerHour,
		p.MonthlyQuota,
		p.StripePriceID,
		p.ID,
	).Scan(
		&updated.ID,
		&updated.APIID,
		&updated.Name,
		&updated.PriceCents,
		&updated.RateLimitPerHour,
		&updated.MonthlyQuota,
		&updated.StripePriceID,
		&updated.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrPlanNotFound
		}
		return nil, fmt.Errorf("failed to update plan: %w", err)
	}

	return &updated, nil
}

func (r *PlanRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM plans WHERE id = $1`
	cmd, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete plan: %w", err)
	}
	if cmd.RowsAffected() == 0 {
		return ErrPlanNotFound
	}
	return nil
}
