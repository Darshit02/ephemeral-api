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
	ErrDuplicateEmail = errors.New("email already taken")
	ErrUserNotFound   = errors.New("user not found")
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) Create(ctx context.Context, u *models.User) (*models.User, error) {
	query := `
		INSERT INTO users (email, name, password_hash, role, stripe_customer_id, stripe_account_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, email, name, password_hash, role, stripe_customer_id, stripe_account_id, created_at, updated_at
	`

	var user models.User
	var roleStr string
	err := r.pool.QueryRow(ctx, query,
		u.Email,
		u.Name,
		u.PasswordHash,
		string(u.Role),
		u.StripeCustomerID,
		u.StripeAccountID,
	).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.PasswordHash,
		&roleStr,
		&user.StripeCustomerID,
		&user.StripeAccountID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" { // unique_violation
			return nil, ErrDuplicateEmail
		}
		return nil, fmt.Errorf("failed to insert user: %w", err)
	}

	user.Role = models.UserRole(roleStr)
	return &user, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
		SELECT id, email, name, password_hash, role, stripe_customer_id, stripe_account_id, created_at, updated_at
		FROM users
		WHERE LOWER(email) = LOWER($1)
	`

	var user models.User
	var roleStr string
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.PasswordHash,
		&roleStr,
		&user.StripeCustomerID,
		&user.StripeAccountID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user by email: %w", err)
	}

	user.Role = models.UserRole(roleStr)
	return &user, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*models.User, error) {
	query := `
		SELECT id, email, name, password_hash, role, stripe_customer_id, stripe_account_id, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	var user models.User
	var roleStr string
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.PasswordHash,
		&roleStr,
		&user.StripeCustomerID,
		&user.StripeAccountID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to query user by id: %w", err)
	}

	user.Role = models.UserRole(roleStr)
	return &user, nil
}
