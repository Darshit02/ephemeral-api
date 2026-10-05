package models

import (
	"encoding/json"
	"time"
)

type APIStatus string

const (
	APIStatusDraft       APIStatus = "draft"
	APIStatusLive        APIStatus = "live"
	APIStatusMaintenance APIStatus = "maintenance"
	APIStatusDeprecated  APIStatus = "deprecated"
)

func (s APIStatus) IsValid() bool {
	switch s {
	case APIStatusDraft, APIStatusLive, APIStatusMaintenance, APIStatusDeprecated:
		return true
	default:
		return false
	}
}

type API struct {
	ID          string          `json:"id"`
	ProviderID  string          `json:"provider_id"`
	Name        string          `json:"name"`
	Slug        string          `json:"slug"`
	Description string          `json:"description"`
	BaseURL     string          `json:"base_url"`
	OpenAPISpec json.RawMessage `json:"openapi_spec,omitempty"`
	Status      APIStatus       `json:"status"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}
