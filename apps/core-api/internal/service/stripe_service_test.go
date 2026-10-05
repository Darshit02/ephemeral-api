package service_test

import (
	"context"
	"strings"
	"testing"

	"ephemeral/apps/core-api/internal/service"
)

func TestStripeServiceMock(t *testing.T) {
	svc := service.NewStripeService("sk_test_mock", "whsec_mock", nil)

	t.Run("CreateCustomer returns mock customer ID", func(t *testing.T) {
		custID, err := svc.CreateCustomer(context.Background(), "alice@test.com", "Alice")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if !strings.HasPrefix(custID, "cus_mock_") {
			t.Fatalf("expected prefix cus_mock_, got %s", custID)
		}
	})

	t.Run("CreateCheckoutSession returns checkout url", func(t *testing.T) {
		url, err := svc.CreateCheckoutSession(context.Background(), service.CreateCheckoutParams{
			CustomerID: "cus_123",
			PriceCents: 990,
			PlanName:   "Basic",
			Metadata: map[string]string{
				"user_id": "u1",
				"plan_id": "p1",
			},
		})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if !strings.HasPrefix(url, "https://checkout.stripe.com/c/pay/cs_test_") {
			t.Fatalf("expected checkout url prefix, got %s", url)
		}
	})

	t.Run("ParseWebhook parses event json", func(t *testing.T) {
		payload := []byte(`{
			"id": "evt_test_123",
			"type": "checkout.session.completed",
			"data": {
				"object": {
					"id": "cs_test_abc",
					"mode": "subscription",
					"metadata": {
						"user_id": "u1",
						"plan_id": "p1"
					}
				}
			}
		}`)

		event, err := svc.ParseWebhook(payload, "")
		if err != nil {
			t.Fatalf("unexpected error parsing webhook: %v", err)
		}
		if string(event.Type) != "checkout.session.completed" {
			t.Fatalf("expected checkout.session.completed, got %s", event.Type)
		}
	})
}
