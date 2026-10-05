package handler

import (
	"io"
	"net/http"

	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/response"
)

type WebhookHandler struct {
	subService *service.SubscriptionService
}

func NewWebhookHandler(subService *service.SubscriptionService) *WebhookHandler {
	return &WebhookHandler{subService: subService}
}

// POST /webhooks/stripe
func (h *WebhookHandler) HandleStripe(w http.ResponseWriter, r *http.Request) {
	const maxBodyBytes = int64(65536)
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)

	payload, err := io.ReadAll(r.Body)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Failed to read request body")
		return
	}

	sigHeader := r.Header.Get("Stripe-Signature")

	if err := h.subService.HandleStripeWebhook(r.Context(), payload, sigHeader); err != nil {
		response.Error(w, http.StatusBadRequest, "WEBHOOK_ERROR", err.Error())
		return
	}

	response.Success(w, http.StatusOK, map[string]bool{
		"received": true,
	})
}
