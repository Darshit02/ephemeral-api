package models

import "time"

type Plan struct {
	ID               string    `json:"id"`
	APIID            string    `json:"api_id"`
	Name             string    `json:"name"`
	PriceCents       int       `json:"price_cents"`
	RateLimitPerHour int       `json:"rate_limit_per_hour"`
	MonthlyQuota     *int      `json:"monthly_quota"` // null = unlimited
	StripePriceID    *string   `json:"stripe_price_id,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
}

type PublicPlan struct {
	ID               string    `json:"id"`
	APIID            string    `json:"api_id"`
	Name             string    `json:"name"`
	PriceCents       int       `json:"price_cents"`
	RateLimitPerHour int       `json:"rate_limit_per_hour"`
	MonthlyQuota     *int      `json:"monthly_quota"`
	CreatedAt        time.Time `json:"created_at"`
}

func (p *Plan) ToPublic() PublicPlan {
	return PublicPlan{
		ID:               p.ID,
		APIID:            p.APIID,
		Name:             p.Name,
		PriceCents:       p.PriceCents,
		RateLimitPerHour: p.RateLimitPerHour,
		MonthlyQuota:     p.MonthlyQuota,
		CreatedAt:        p.CreatedAt,
	}
}
