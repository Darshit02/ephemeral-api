package service

import (
	"context"
	"errors"
	"strings"

	"ephemeral/apps/core-api/internal/repository"
	"ephemeral/packages/go-shared/models"
)

var (
	ErrInvalidPlanPrice = errors.New("price_cents must be greater than or equal to 0")
	ErrInvalidRateLimit = errors.New("rate_limit_per_hour must be greater than 0")
	ErrInvalidQuota     = errors.New("monthly_quota must be greater than or equal to 0")
)

type PlanService struct {
	planRepo *repository.PlanRepository
	apiRepo  *repository.APIRepository
}

func NewPlanService(planRepo *repository.PlanRepository, apiRepo *repository.APIRepository) *PlanService {
	return &PlanService{
		planRepo: planRepo,
		apiRepo:  apiRepo,
	}
}

type CreatePlanInput struct {
	Name             string  `json:"name"`
	PriceCents       int     `json:"price_cents"`
	RateLimitPerHour int     `json:"rate_limit_per_hour"`
	MonthlyQuota     *int    `json:"monthly_quota"` // null = unlimited
	StripePriceID    *string `json:"stripe_price_id,omitempty"`
}

type UpdatePlanInput struct {
	Name             *string `json:"name,omitempty"`
	PriceCents       *int    `json:"price_cents,omitempty"`
	RateLimitPerHour *int    `json:"rate_limit_per_hour,omitempty"`
	MonthlyQuota     *int    `json:"monthly_quota,omitempty"`
	StripePriceID    *string `json:"stripe_price_id,omitempty"`
}

func (s *PlanService) Create(ctx context.Context, user *models.User, apiID string, input CreatePlanInput) (*models.Plan, error) {
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

	name := strings.TrimSpace(input.Name)
	if name == "" {
		return nil, errors.New("name is required")
	}

	if input.PriceCents < 0 {
		return nil, ErrInvalidPlanPrice
	}

	rateLimit := input.RateLimitPerHour
	if rateLimit <= 0 {
		return nil, ErrInvalidRateLimit
	}

	if input.MonthlyQuota != nil && *input.MonthlyQuota < 0 {
		return nil, ErrInvalidQuota
	}

	plan := &models.Plan{
		APIID:            api.ID,
		Name:             name,
		PriceCents:       input.PriceCents,
		RateLimitPerHour: rateLimit,
		MonthlyQuota:     input.MonthlyQuota,
		StripePriceID:    input.StripePriceID,
	}

	return s.planRepo.Create(ctx, plan)
}

func (s *PlanService) ListByAPI(ctx context.Context, user *models.User, apiID string) ([]models.Plan, error) {
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

	return s.planRepo.ListByAPIID(ctx, apiID)
}

func (s *PlanService) Update(ctx context.Context, user *models.User, planID string, input UpdatePlanInput) (*models.Plan, error) {
	plan, err := s.planRepo.FindByID(ctx, planID)
	if err != nil {
		if errors.Is(err, repository.ErrPlanNotFound) {
			return nil, repository.ErrPlanNotFound
		}
		return nil, err
	}

	api, err := s.apiRepo.FindByID(ctx, plan.APIID)
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
		plan.Name = name
	}

	if input.PriceCents != nil {
		if *input.PriceCents < 0 {
			return nil, ErrInvalidPlanPrice
		}
		plan.PriceCents = *input.PriceCents
	}

	if input.RateLimitPerHour != nil {
		if *input.RateLimitPerHour <= 0 {
			return nil, ErrInvalidRateLimit
		}
		plan.RateLimitPerHour = *input.RateLimitPerHour
	}

	if input.MonthlyQuota != nil {
		if *input.MonthlyQuota < 0 {
			return nil, ErrInvalidQuota
		}
		plan.MonthlyQuota = input.MonthlyQuota
	}

	if input.StripePriceID != nil {
		plan.StripePriceID = input.StripePriceID
	}

	return s.planRepo.Update(ctx, plan)
}

func (s *PlanService) Delete(ctx context.Context, user *models.User, planID string) error {
	plan, err := s.planRepo.FindByID(ctx, planID)
	if err != nil {
		if errors.Is(err, repository.ErrPlanNotFound) {
			return repository.ErrPlanNotFound
		}
		return err
	}

	api, err := s.apiRepo.FindByID(ctx, plan.APIID)
	if err != nil {
		if errors.Is(err, repository.ErrAPINotFound) {
			return ErrAPINotFound
		}
		return err
	}

	if api.ProviderID != user.ID && user.Role != models.RoleAdmin {
		return ErrForbidden
	}

	return s.planRepo.Delete(ctx, planID)
}

func (s *PlanService) ListPublicPlans(ctx context.Context, slug string) ([]models.PublicPlan, error) {
	api, err := s.apiRepo.FindLiveBySlug(ctx, strings.ToLower(slug))
	if err != nil {
		if errors.Is(err, repository.ErrAPINotFound) {
			return nil, ErrAPINotFound
		}
		return nil, err
	}

	plans, err := s.planRepo.ListByAPIID(ctx, api.ID)
	if err != nil {
		return nil, err
	}

	publicPlans := make([]models.PublicPlan, len(plans))
	for i, p := range plans {
		publicPlans[i] = p.ToPublic()
	}

	return publicPlans, nil
}
