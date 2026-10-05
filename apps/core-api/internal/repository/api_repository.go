package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"ephemeral/packages/go-shared/models"
)

var (
	ErrDuplicateSlug = errors.New("slug already taken")
	ErrAPINotFound   = errors.New("api not found")
)

type APIRepository struct {
	pool *pgxpool.Pool
}

func NewAPIRepository(pool *pgxpool.Pool) *APIRepository {
	return &APIRepository{pool: pool}
}

func (r *APIRepository) Create(ctx context.Context, a *models.API) (*models.API, error) {
	query := `
		INSERT INTO apis (provider_id, name, slug, description, base_url, openapi_spec, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
	`

	var api models.API
	var statusStr string
	err := r.pool.QueryRow(ctx, query,
		a.ProviderID,
		a.Name,
		a.Slug,
		a.Description,
		a.BaseURL,
		a.OpenAPISpec,
		string(a.Status),
	).Scan(
		&api.ID,
		&api.ProviderID,
		&api.Name,
		&api.Slug,
		&api.Description,
		&api.BaseURL,
		&api.OpenAPISpec,
		&statusStr,
		&api.CreatedAt,
		&api.UpdatedAt,
	)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrDuplicateSlug
		}
		return nil, fmt.Errorf("failed to insert api: %w", err)
	}

	api.Status = models.APIStatus(statusStr)
	return &api, nil
}

func (r *APIRepository) ListByProvider(ctx context.Context, providerID string) ([]models.API, error) {
	query := `
		SELECT id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
		FROM apis
		WHERE provider_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.pool.Query(ctx, query, providerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query apis by provider: %w", err)
	}
	defer rows.Close()

	var apis []models.API
	for rows.Next() {
		var a models.API
		var statusStr string
		if err := rows.Scan(
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
		); err != nil {
			return nil, fmt.Errorf("failed to scan api row: %w", err)
		}
		a.Status = models.APIStatus(statusStr)
		apis = append(apis, a)
	}

	if apis == nil {
		apis = []models.API{}
	}

	return apis, nil
}

func (r *APIRepository) FindByID(ctx context.Context, id string) (*models.API, error) {
	query := `
		SELECT id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
		FROM apis
		WHERE id = $1
	`

	var a models.API
	var statusStr string
	err := r.pool.QueryRow(ctx, query, id).Scan(
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

func (r *APIRepository) FindBySlug(ctx context.Context, slug string) (*models.API, error) {
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

func (r *APIRepository) Update(ctx context.Context, a *models.API) (*models.API, error) {
	query := `
		UPDATE apis
		SET name = $1, slug = $2, description = $3, base_url = $4, openapi_spec = $5, status = $6, updated_at = NOW()
		WHERE id = $7
		RETURNING id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
	`

	var updated models.API
	var statusStr string
	err := r.pool.QueryRow(ctx, query,
		a.Name,
		a.Slug,
		a.Description,
		a.BaseURL,
		a.OpenAPISpec,
		string(a.Status),
		a.ID,
	).Scan(
		&updated.ID,
		&updated.ProviderID,
		&updated.Name,
		&updated.Slug,
		&updated.Description,
		&updated.BaseURL,
		&updated.OpenAPISpec,
		&statusStr,
		&updated.CreatedAt,
		&updated.UpdatedAt,
	)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, ErrDuplicateSlug
		}
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrAPINotFound
		}
		return nil, fmt.Errorf("failed to update api: %w", err)
	}

	updated.Status = models.APIStatus(statusStr)
	return &updated, nil
}

func (r *APIRepository) SoftDelete(ctx context.Context, id string) (*models.API, error) {
	query := `
		UPDATE apis
		SET status = 'deprecated', updated_at = NOW()
		WHERE id = $1
		RETURNING id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
	`

	var updated models.API
	var statusStr string
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&updated.ID,
		&updated.ProviderID,
		&updated.Name,
		&updated.Slug,
		&updated.Description,
		&updated.BaseURL,
		&updated.OpenAPISpec,
		&statusStr,
		&updated.CreatedAt,
		&updated.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrAPINotFound
		}
		return nil, fmt.Errorf("failed to soft delete api: %w", err)
	}

	updated.Status = models.APIStatus(statusStr)
	return &updated, nil
}

func (r *APIRepository) ListLive(ctx context.Context) ([]models.API, error) {
	query := `
		SELECT id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
		FROM apis
		WHERE status = 'live'
		ORDER BY created_at DESC
	`

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query live apis: %w", err)
	}
	defer rows.Close()

	var apis []models.API
	for rows.Next() {
		var a models.API
		var statusStr string
		if err := rows.Scan(
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
		); err != nil {
			return nil, fmt.Errorf("failed to scan live api row: %w", err)
		}
		a.Status = models.APIStatus(statusStr)
		apis = append(apis, a)
	}

	if apis == nil {
		apis = []models.API{}
	}

	return apis, nil
}

func (r *APIRepository) FindLiveBySlug(ctx context.Context, slug string) (*models.API, error) {
	query := `
		SELECT id, provider_id, name, slug, description, base_url, openapi_spec, status, created_at, updated_at
		FROM apis
		WHERE slug = $1 AND status = 'live'
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
		return nil, fmt.Errorf("failed to query live api by slug: %w", err)
	}

	a.Status = models.APIStatus(statusStr)
	return &a, nil
}
