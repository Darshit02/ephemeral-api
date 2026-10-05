package models

import "time"

type UsageEvent struct {
	ID             int64     `json:"id"`
	SubscriptionID string    `json:"subscription_id"`
	APIID          string    `json:"api_id"`
	Endpoint       string    `json:"endpoint"`
	Method         string    `json:"method"`
	ResponseStatus int       `json:"response_status"`
	ResponseTimeMS int       `json:"response_time_ms"`
	CreatedAt      time.Time `json:"created_at"`
}
