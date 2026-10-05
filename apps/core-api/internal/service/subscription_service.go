package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/stripe/stripe-go/v78"

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
	subRepo   *repository.SubscriptionRepository
	planRepo  *repository.PlanRepository
	apiRepo   *repository.APIRepository
	userRepo  *repository.UserRepository
	stripeSvc *StripeService
	logger    *slog.Logger
}

func NewSubscriptionService(
	subRepo *repository.SubscriptionRepository,
	planRepo *repository.PlanRepository,
	apiRepo *repository.APIRepository,
	userRepo *repository.UserRepository,
	stripeSvc *StripeService,
	logger *slog.Logger,
) *SubscriptionService {
	if logger == nil {
		logger = slog.Default()
	}
	return &SubscriptionService{
		subRepo:   subRepo,
		planRepo:  planRepo,
		apiRepo:   apiRepo,
		userRepo:  userRepo,
		stripeSvc: stripeSvc,
		logger:    logger,
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

	// Paid plan: create Stripe Customer (if not exists) and Checkout Session
	if plan.PriceCents > 0 {
		var customerID string
		if user.StripeCustomerID != nil && *user.StripeCustomerID != "" {
			customerID = *user.StripeCustomerID
		} else {
			custID, err := s.stripeSvc.CreateCustomer(ctx, user.Email, user.Name)
			if err != nil {
				return nil, fmt.Errorf("failed to create stripe customer: %w", err)
			}
			customerID = custID
			if err := s.userRepo.UpdateStripeCustomerID(ctx, user.ID, customerID); err != nil {
				s.logger.Error("failed to update user stripe_customer_id", slog.Any("error", err))
			}
			user.StripeCustomerID = &customerID
		}

		// Look up provider to get Stripe Connect account ID
		var providerStripeAccountID *string
		provider, err := s.userRepo.FindByID(ctx, api.ProviderID)
		if err == nil && provider != nil && provider.StripeAccountID != nil {
			providerStripeAccountID = provider.StripeAccountID
		}

		checkoutURL, err := s.stripeSvc.CreateCheckoutSession(ctx, CreateCheckoutParams{
			CustomerID:              customerID,
			PriceCents:              plan.PriceCents,
			StripePriceID:           plan.StripePriceID,
			PlanName:                plan.Name,
			ProviderStripeAccountID: providerStripeAccountID,
			Metadata: map[string]string{
				"user_id": user.ID,
				"plan_id": plan.ID,
				"api_id":  api.ID,
			},
		})
		if err != nil {
			return nil, fmt.Errorf("failed to create checkout session: %w", err)
		}

		return &models.SubscriptionResponse{
			CheckoutURL: checkoutURL,
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

func (s *SubscriptionService) HandleStripeWebhook(ctx context.Context, payload []byte, sigHeader string) error {
	event, err := s.stripeSvc.ParseWebhook(payload, sigHeader)
	if err != nil {
		return fmt.Errorf("webhook parse error: %w", err)
	}

	s.logger.Info("received stripe webhook event", slog.String("type", string(event.Type)))

	switch event.Type {
	case "checkout.session.completed":
		var sess stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &sess); err != nil {
			return fmt.Errorf("failed to unmarshal checkout session: %w", err)
		}

		userID := sess.Metadata["user_id"]
		planID := sess.Metadata["plan_id"]
		if userID == "" || planID == "" {
			s.logger.Warn("checkout session missing user_id or plan_id in metadata", slog.String("session_id", sess.ID))
			return nil
		}

		stripeSubID := ""
		if sess.Subscription != nil {
			stripeSubID = sess.Subscription.ID
		}
		if stripeSubID == "" {
			stripeSubID = "sub_stripe_" + sess.ID
		}

		// Idempotency: skip if already created
		existing, _ := s.subRepo.FindByStripeSubscriptionID(ctx, stripeSubID)
		if existing != nil {
			s.logger.Info("subscription already exists for stripe_subscription_id", slog.String("stripe_sub_id", stripeSubID))
			return nil
		}

		keyPrefix := "ephemeral_live_"
		fullKey, hash, prefix12, err := auth.GenerateAPIKey(keyPrefix)
		if err != nil {
			return fmt.Errorf("failed to generate api key: %w", err)
		}

		now := time.Now()
		periodEnd := now.AddDate(0, 1, 0)

		sub := &models.Subscription{
			UserID:               userID,
			PlanID:               planID,
			APIKeyHash:           hash,
			APIKeyPrefix:         prefix12,
			StripeSubscriptionID: &stripeSubID,
			Status:               models.SubscriptionStatusActive,
			CurrentPeriodStart:   now,
			CurrentPeriodEnd:     periodEnd,
		}

		created, err := s.subRepo.Create(ctx, sub)
		if err != nil {
			return fmt.Errorf("failed to create subscription: %w", err)
		}

		consumer, _ := s.userRepo.FindByID(ctx, userID)
		consumerEmail := "unknown"
		if consumer != nil {
			consumerEmail = consumer.Email
		}

		s.logger.Info("subscription activated, emailed api key to consumer",
			slog.String("consumer_email", consumerEmail),
			slog.String("api_key", fullKey),
			slog.String("subscription_id", created.ID),
			slog.String("stripe_subscription_id", stripeSubID),
		)

	case "invoice.paid":
		var inv stripe.Invoice
		if err := json.Unmarshal(event.Data.Raw, &inv); err != nil {
			return fmt.Errorf("failed to unmarshal invoice: %w", err)
		}

		stripeSubID := ""
		if inv.Subscription != nil {
			stripeSubID = inv.Subscription.ID
		}
		if stripeSubID != "" {
			newEnd := time.Now().AddDate(0, 1, 0)
			_, err := s.subRepo.UpdateStatusByStripeID(ctx, stripeSubID, models.SubscriptionStatusActive, &newEnd)
			if err != nil && !errors.Is(err, repository.ErrSubscriptionNotFound) {
				return fmt.Errorf("failed to update subscription on invoice.paid: %w", err)
			}
			s.logger.Info("invoice paid, subscription extended", slog.String("stripe_sub_id", stripeSubID))
		}

	case "customer.subscription.deleted":
		var stripeSub stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &stripeSub); err != nil {
			return fmt.Errorf("failed to unmarshal stripe subscription: %w", err)
		}

		if stripeSub.ID != "" {
			_, err := s.subRepo.UpdateStatusByStripeID(ctx, stripeSub.ID, models.SubscriptionStatusCanceled, nil)
			if err != nil && !errors.Is(err, repository.ErrSubscriptionNotFound) {
				return fmt.Errorf("failed to cancel subscription on customer.subscription.deleted: %w", err)
			}
			s.logger.Info("subscription canceled via stripe webhook", slog.String("stripe_sub_id", stripeSub.ID))
		}

	default:
		s.logger.Info("unhandled stripe webhook event type", slog.String("type", string(event.Type)))
	}

	return nil
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
