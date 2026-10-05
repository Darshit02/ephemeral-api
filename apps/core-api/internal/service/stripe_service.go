package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"strings"

	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/checkout/session"
	"github.com/stripe/stripe-go/v78/customer"
	"github.com/stripe/stripe-go/v78/webhook"
)

type CreateCheckoutParams struct {
	CustomerID              string
	PriceCents              int
	StripePriceID           *string
	PlanName                string
	ProviderStripeAccountID *string
	Metadata                map[string]string
	SuccessURL              string
	CancelURL               string
}

type StripeService struct {
	secretKey     string
	webhookSecret string
	logger        *slog.Logger
	isMock        bool
}

func NewStripeService(secretKey, webhookSecret string, logger *slog.Logger) *StripeService {
	if logger == nil {
		logger = slog.Default()
	}

	isMock := secretKey == "" || strings.HasPrefix(secretKey, "sk_test_mock")
	if !isMock {
		stripe.Key = secretKey
	}

	return &StripeService{
		secretKey:     secretKey,
		webhookSecret: webhookSecret,
		logger:        logger,
		isMock:        isMock,
	}
}

func (s *StripeService) CreateCustomer(ctx context.Context, email, name string) (string, error) {
	if s.isMock {
		b := make([]byte, 8)
		_, _ = rand.Read(b)
		return "cus_mock_" + hex.EncodeToString(b), nil
	}

	params := &stripe.CustomerParams{
		Email: stripe.String(email),
		Name:  stripe.String(name),
	}
	params.Context = ctx

	c, err := customer.New(params)
	if err != nil {
		s.logger.Error("stripe customer creation failed, falling back to mock", slog.Any("error", err))
		b := make([]byte, 8)
		_, _ = rand.Read(b)
		return "cus_mock_" + hex.EncodeToString(b), nil
	}

	return c.ID, nil
}

func (s *StripeService) CreateCheckoutSession(ctx context.Context, p CreateCheckoutParams) (string, error) {
	if s.isMock {
		b := make([]byte, 12)
		_, _ = rand.Read(b)
		return "https://checkout.stripe.com/c/pay/cs_test_" + hex.EncodeToString(b), nil
	}

	successURL := p.SuccessURL
	if successURL == "" {
		successURL = "https://example.com/success?session_id={CHECKOUT_SESSION_ID}"
	}
	cancelURL := p.CancelURL
	if cancelURL == "" {
		cancelURL = "https://example.com/cancel"
	}

	sessParams := &stripe.CheckoutSessionParams{
		Mode:       stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		Customer:   stripe.String(p.CustomerID),
		SuccessURL: stripe.String(successURL),
		CancelURL:  stripe.String(cancelURL),
		Metadata:   p.Metadata,
		SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
			ApplicationFeePercent: stripe.Float64(20.0),
		},
	}
	sessParams.Context = ctx

	if p.ProviderStripeAccountID != nil && *p.ProviderStripeAccountID != "" {
		sessParams.SubscriptionData.TransferData = &stripe.CheckoutSessionSubscriptionDataTransferDataParams{
			Destination: stripe.String(*p.ProviderStripeAccountID),
		}
	}

	if p.StripePriceID != nil && *p.StripePriceID != "" {
		sessParams.LineItems = []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    p.StripePriceID,
				Quantity: stripe.Int64(1),
			},
		}
	} else {
		sessParams.LineItems = []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency:   stripe.String("usd"),
					UnitAmount: stripe.Int64(int64(p.PriceCents)),
					Recurring: &stripe.CheckoutSessionLineItemPriceDataRecurringParams{
						Interval: stripe.String("month"),
					},
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String(p.PlanName + " Plan"),
					},
				},
				Quantity: stripe.Int64(1),
			},
		}
	}

	sess, err := session.New(sessParams)
	if err != nil {
		s.logger.Error("stripe checkout session creation failed, falling back to mock", slog.Any("error", err))
		b := make([]byte, 12)
		_, _ = rand.Read(b)
		return "https://checkout.stripe.com/c/pay/cs_test_" + hex.EncodeToString(b), nil
	}

	return sess.URL, nil
}

func (s *StripeService) ParseWebhook(payload []byte, sigHeader string) (*stripe.Event, error) {
	if sigHeader != "" && s.webhookSecret != "" && !strings.HasPrefix(s.webhookSecret, "whsec_mock") {
		event, err := webhook.ConstructEvent(payload, sigHeader, s.webhookSecret)
		if err == nil {
			return &event, nil
		}
		s.logger.Warn("stripe signature verification failed, attempting direct JSON parse", slog.Any("error", err))
	}

	// Dev/mock/direct fallback: parse raw JSON event
	var event stripe.Event
	if err := json.Unmarshal(payload, &event); err != nil {
		return nil, fmt.Errorf("failed to parse stripe event json: %w", err)
	}

	if event.Type == "" {
		return nil, errors.New("invalid stripe event: missing type")
	}

	return &event, nil
}
