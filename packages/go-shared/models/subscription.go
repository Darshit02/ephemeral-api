package models

import "time"

type SubscriptionStatus string

const (
	SubscriptionStatusActive   SubscriptionStatus = "active"
	SubscriptionStatusPastDue  SubscriptionStatus = "past_due"
	SubscriptionStatusCanceled SubscriptionStatus = "canceled"
)

type Subscription struct {
	ID                   string             `json:"id"`
	UserID               string             `json:"user_id"`
	PlanID               string             `json:"plan_id"`
	APIKeyHash           string             `json:"-"` // Never serialized in JSON
	APIKeyPrefix         string             `json:"api_key_prefix"`
	StripeSubscriptionID *string            `json:"stripe_subscription_id,omitempty"`
	Status               SubscriptionStatus `json:"status"`
	CurrentPeriodStart   time.Time          `json:"current_period_start"`
	CurrentPeriodEnd     time.Time          `json:"current_period_end"`
	CreatedAt            time.Time          `json:"created_at"`
}

type SubscriptionResponse struct {
	ID               string             `json:"id,omitempty"`
	Status           SubscriptionStatus `json:"status,omitempty"`
	APIKey           string             `json:"api_key,omitempty"` // Shown ONLY on creation or rotation
	APIKeyPrefix     string             `json:"api_key_prefix,omitempty"`
	CurrentPeriodEnd *time.Time         `json:"current_period_end,omitempty"`
	CheckoutURL      string             `json:"checkout_url,omitempty"`
}
