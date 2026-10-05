package service

import (
	"context"
	"encoding/json"
	"errors"
	"net/url"
	"regexp"
	"strings"

	"ephemeral/apps/core-api/internal/repository"
	"ephemeral/packages/go-shared/models"
)

var (
	ErrSlugTaken      = errors.New("slug already taken")
	ErrAPINotFound    = errors.New("api not found")
	ErrForbidden      = errors.New("forbidden: you do not own this API")
	ErrInvalidSlug    = errors.New("invalid slug: must contain only lowercase letters, numbers, and hyphens")
	ErrInvalidBaseURL = errors.New("invalid base_url: must be a valid http or https URL")
	ErrInvalidStatus  = errors.New("invalid status: must be draft, live, maintenance, or deprecated")
)

var slugRegex = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

type APIService struct {
	apiRepo *repository.APIRepository
}

func NewAPIService(apiRepo *repository.APIRepository) *APIService {
	return &APIService{apiRepo: apiRepo}
}

type CreateAPIInput struct {
	Name        string          `json:"name"`
	Slug        string          `json:"slug"`
	Description string          `json:"description"`
	BaseURL     string          `json:"base_url"`
	OpenAPISpec json.RawMessage `json:"openapi_spec,omitempty"`
}

type UpdateAPIInput struct {
	Name        *string          `json:"name,omitempty"`
	Slug        *string          `json:"slug,omitempty"`
	Description *string          `json:"description,omitempty"`
	BaseURL     *string          `json:"base_url,omitempty"`
	OpenAPISpec *json.RawMessage `json:"openapi_spec,omitempty"`
	Status      *string          `json:"status,omitempty"`
}

func (s *APIService) Create(ctx context.Context, providerID string, input CreateAPIInput) (*models.API, error) {
	name := strings.TrimSpace(input.Name)
	if name == "" {
		return nil, errors.New("name is required")
	}

	slug := strings.TrimSpace(strings.ToLower(input.Slug))
	if slug == "" || !slugRegex.MatchString(slug) {
		return nil, ErrInvalidSlug
	}

	baseURL := strings.TrimSpace(input.BaseURL)
	u, err := url.ParseRequestURI(baseURL)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") {
		return nil, ErrInvalidBaseURL
	}

	api := &models.API{
		ProviderID:  providerID,
		Name:        name,
		Slug:        slug,
		Description: strings.TrimSpace(input.Description),
		BaseURL:     baseURL,
		OpenAPISpec: input.OpenAPISpec,
		Status:      models.APIStatusDraft,
	}

	created, err := s.apiRepo.Create(ctx, api)
	if err != nil {
		if errors.Is(err, repository.ErrDuplicateSlug) {
			return nil, ErrSlugTaken
		}
		return nil, err
	}

	return created, nil
}

func (s *APIService) ListProviderAPIs(ctx context.Context, user *models.User) ([]models.API, error) {
	return s.apiRepo.ListByProvider(ctx, user.ID)
}

func (s *APIService) GetProviderAPI(ctx context.Context, user *models.User, apiID string) (*models.API, error) {
	api, err := s.apiRepo.FindByID(ctx, apiID)
	if err != nil {
		if errors.Is(err, repository.ErrAPINotFound) {
			return nil, ErrAPINotFound
		}
		return nil, err
	}

	if api.ProviderID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	return api, nil
}

func (s *APIService) Update(ctx context.Context, user *models.User, apiID string, input UpdateAPIInput) (*models.API, error) {
	api, err := s.apiRepo.FindByID(ctx, apiID)
	if err != nil {
		if errors.Is(err, repository.ErrAPINotFound) {
			return nil, ErrAPINotFound
		}
		return nil, err
	}

	if api.ProviderID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	if input.Name != nil {
		name := strings.TrimSpace(*input.Name)
		if name == "" {
			return nil, errors.New("name cannot be empty")
		}
		api.Name = name
	}

	if input.Slug != nil {
		slug := strings.TrimSpace(strings.ToLower(*input.Slug))
		if slug == "" || !slugRegex.MatchString(slug) {
			return nil, ErrInvalidSlug
		}
		api.Slug = slug
	}

	if input.Description != nil {
		api.Description = strings.TrimSpace(*input.Description)
	}

	if input.BaseURL != nil {
		baseURL := strings.TrimSpace(*input.BaseURL)
		u, err := url.ParseRequestURI(baseURL)
		if err != nil || (u.Scheme != "http" && u.Scheme != "https") {
			return nil, ErrInvalidBaseURL
		}
		api.BaseURL = baseURL
	}

	if input.OpenAPISpec != nil {
		api.OpenAPISpec = *input.OpenAPISpec
	}

	if input.Status != nil {
		st := models.APIStatus(strings.ToLower(strings.TrimSpace(*input.Status)))
		if !st.IsValid() {
			return nil, ErrInvalidStatus
		}
		api.Status = st
	}

	updated, err := s.apiRepo.Update(ctx, api)
	if err != nil {
		if errors.Is(err, repository.ErrDuplicateSlug) {
			return nil, ErrSlugTaken
		}
		return nil, err
	}

	return updated, nil
}

func (s *APIService) SoftDelete(ctx context.Context, user *models.User, apiID string) (*models.API, error) {
	api, err := s.apiRepo.FindByID(ctx, apiID)
	if err != nil {
		if errors.Is(err, repository.ErrAPINotFound) {
			return nil, ErrAPINotFound
		}
		return nil, err
	}

	if api.ProviderID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	return s.apiRepo.SoftDelete(ctx, apiID)
}

func (s *APIService) ListPublic(ctx context.Context) ([]models.API, error) {
	return s.apiRepo.ListLive(ctx)
}

func (s *APIService) GetPublicBySlug(ctx context.Context, slug string) (*models.API, error) {
	api, err := s.apiRepo.FindLiveBySlug(ctx, strings.ToLower(slug))
	if err != nil {
		if errors.Is(err, repository.ErrAPINotFound) {
			return nil, ErrAPINotFound
		}
		return nil, err
	}
	return api, nil
}
