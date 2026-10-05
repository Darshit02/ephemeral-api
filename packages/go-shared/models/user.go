package models

import "time"

type UserRole string

const (
	RoleConsumer UserRole = "consumer"
	RoleProvider UserRole = "provider"
	RoleAdmin    UserRole = "admin"
)

func (r UserRole) IsValid() bool {
	switch r {
	case RoleConsumer, RoleProvider, RoleAdmin:
		return true
	default:
		return false
	}
}

type User struct {
	ID               string    `json:"id"`
	Email            string    `json:"email"`
	Name             string    `json:"name"`
	PasswordHash     string    `json:"-"`
	Role             UserRole  `json:"role"`
	StripeCustomerID *string   `json:"stripe_customer_id,omitempty"`
	StripeAccountID  *string   `json:"stripe_account_id,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type UserProfile struct {
	ID    string   `json:"id"`
	Email string   `json:"email"`
	Name  string   `json:"name"`
	Role  UserRole `json:"role"`
}

func (u *User) ToProfile() UserProfile {
	return UserProfile{
		ID:    u.ID,
		Email: u.Email,
		Name:  u.Name,
		Role:  u.Role,
	}
}
