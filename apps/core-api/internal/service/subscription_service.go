package service

import (
	"context"
	"errors"
	"time"

	"ephemeral/apps/core-api/internal/repository"
	"ephemeral/packages/go-shared/auth"
	"ephemeral/packages/go-shared/models"
)

var (
	ErrSubscribeToOwnAPI        = errors.New("cannot subscribe to your own API")
	ErrActiveSubscriptionExists = errors.New("you already have an active subscription to this plan")
	ErrSubscriptionNotFound     = errors.New("subscription not found")
	ErrSubscriptionInactive     = errors.New("subscription is not active")
	ErrPlanNotFound             = repository.ErrPlanNotFound
)

type SubscriptionService struct {
	subRepo  *repository.SubscriptionRepository
	planRepo *repository.PlanRepository
	apiRepo  *repository.APIRepository
}

func NewSubscriptionService(
	subRepo *repository.SubscriptionRepository,
	planRepo *repository.PlanRepository,
	apiRepo *repository.APIRepository,
) *SubscriptionService {
	return &SubscriptionService{
		subRepo:  subRepo,
		planRepo: planRepo,
		apiRepo:  apiRepo,
	}
}

type SubscribeInput struct {
	PlanID string `json:"plan_id"`
}

func (s *SubscriptionService) Subscribe(ctx context.Context, user *models.User, input SubscribeInput) (*models.SubscriptionResponse, error) {
	if input.PlanID == "" {
		return nil, errors.New("plan_id is required")
	}

	plan, err := s.planRepo.FindByID(ctx, input.PlanID)
	if err != nil {
		if errors.Is(err, repository.ErrPlanNotFound) {
			return nil, ErrPlanNotFound
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

	if api.ProviderID == user.ID {
		return nil, ErrSubscribeToOwnAPI
	}

	existing, err := s.subRepo.FindActiveByUserAndPlan(ctx, user.ID, plan.ID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, ErrActiveSubscriptionExists
	}

	// Paid plan: return Stripe checkout URL placeholder (integrated in Phase 9)
	if plan.PriceCents > 0 {
		return &models.SubscriptionResponse{
			CheckoutURL: "https://checkout.stripe.com/c/pay/cs_test_placeholder_phase9",
		}, nil
	}

	// Free plan: instant activation with API key
	keyPrefix := "ephemeral_live_"
	fullKey, hash, prefix12, err := auth.GenerateAPIKey(keyPrefix)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	periodEnd := now.AddDate(0, 1, 0) // 1 month

	sub := &models.Subscription{
		UserID:             user.ID,
		PlanID:             plan.ID,
		APIKeyHash:         hash,
		APIKeyPrefix:       prefix12,
		Status:             models.SubscriptionStatusActive,
		CurrentPeriodStart: now,
		CurrentPeriodEnd:   periodEnd,
	}

	created, err := s.subRepo.Create(ctx, sub)
	if err != nil {
		return nil, err
	}

	return &models.SubscriptionResponse{
		ID:               created.ID,
		Status:           created.Status,
		APIKey:           fullKey,
		APIKeyPrefix:     created.APIKeyPrefix,
		CurrentPeriodEnd: &created.CurrentPeriodEnd,
	}, nil
}

func (s *SubscriptionService) ListMySubscriptions(ctx context.Context, user *models.User) ([]models.Subscription, error) {
	return s.subRepo.ListByUserID(ctx, user.ID)
}

func (s *SubscriptionService) GetSubscription(ctx context.Context, user *models.User, subID string) (*models.Subscription, error) {
	sub, err := s.subRepo.FindByID(ctx, subID)
	if err != nil {
		if errors.Is(err, repository.ErrSubscriptionNotFound) {
			return nil, ErrSubscriptionNotFound
		}
		return nil, err
	}

	if sub.UserID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	return sub, nil
}

func (s *SubscriptionService) CancelSubscription(ctx context.Context, user *models.User, subID string) (*models.Subscription, error) {
	sub, err := s.subRepo.FindByID(ctx, subID)
	if err != nil {
		if errors.Is(err, repository.ErrSubscriptionNotFound) {
			return nil, ErrSubscriptionNotFound
		}
		return nil, err
	}

	if sub.UserID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	return s.subRepo.UpdateStatus(ctx, subID, models.SubscriptionStatusCanceled)
}

func (s *SubscriptionService) RotateKey(ctx context.Context, user *models.User, subID string) (*models.SubscriptionResponse, error) {
	sub, err := s.subRepo.FindByID(ctx, subID)
	if err != nil {
		if errors.Is(err, repository.ErrSubscriptionNotFound) {
			return nil, ErrSubscriptionNotFound
		}
		return nil, err
	}

	if sub.UserID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	if sub.Status != models.SubscriptionStatusActive {
		return nil, ErrSubscriptionInactive
	}

	keyPrefix := "ephemeral_live_"
	fullKey, hash, prefix12, err := auth.GenerateAPIKey(keyPrefix)
	if err != nil {
		return nil, err
	}

	updated, err := s.subRepo.UpdateAPIKey(ctx, subID, hash, prefix12)
	if err != nil {
		return nil, err
	}

	return &models.SubscriptionResponse{
		ID:               updated.ID,
		Status:           updated.Status,
		APIKey:           fullKey,
		APIKeyPrefix:     updated.APIKeyPrefix,
		CurrentPeriodEnd: &updated.CurrentPeriodEnd,
	}, nil
}
