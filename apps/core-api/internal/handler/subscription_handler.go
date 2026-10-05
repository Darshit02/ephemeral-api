package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/response"
)

type SubscriptionHandler struct {
	subService *service.SubscriptionService
}

func NewSubscriptionHandler(subService *service.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{subService: subService}
}

// POST /subscriptions
func (h *SubscriptionHandler) Subscribe(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	var input service.SubscribeInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Malformed JSON request body")
		return
	}

	subResp, err := h.subService.Subscribe(r.Context(), user, input)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrSubscribeToOwnAPI):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "Cannot subscribe to your own API")
		case errors.Is(err, service.ErrActiveSubscriptionExists):
			response.Error(w, http.StatusConflict, "SUBSCRIPTION_EXISTS", "You already have an active subscription to this plan")
		case errors.Is(err, service.ErrPlanNotFound):
			response.Error(w, http.StatusNotFound, "PLAN_NOT_FOUND", "Plan not found")
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		default:
			response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
		}
		return
	}

	response.Success(w, http.StatusCreated, subResp)
}

// GET /subscriptions
func (h *SubscriptionHandler) ListMy(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	subs, err := h.subService.ListMySubscriptions(r.Context(), user)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to list subscriptions")
		return
	}

	response.Success(w, http.StatusOK, subs)
}

// GET /subscriptions/:id
func (h *SubscriptionHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	subID := chi.URLParam(r, "id")
	sub, err := h.subService.GetSubscription(r.Context(), user, subID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrSubscriptionNotFound):
			response.Error(w, http.StatusNotFound, "SUBSCRIPTION_NOT_FOUND", "Subscription not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this subscription")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to get subscription")
		}
		return
	}

	response.Success(w, http.StatusOK, sub)
}

// DELETE /subscriptions/:id
func (h *SubscriptionHandler) Cancel(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	subID := chi.URLParam(r, "id")
	sub, err := h.subService.CancelSubscription(r.Context(), user, subID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrSubscriptionNotFound):
			response.Error(w, http.StatusNotFound, "SUBSCRIPTION_NOT_FOUND", "Subscription not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this subscription")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to cancel subscription")
		}
		return
	}

	response.Success(w, http.StatusOK, map[string]string{
		"id":      sub.ID,
		"status":  string(sub.Status),
		"message": "Subscription canceled successfully",
	})
}

// POST /subscriptions/:id/rotate-key
func (h *SubscriptionHandler) RotateKey(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	subID := chi.URLParam(r, "id")
	resp, err := h.subService.RotateKey(r.Context(), user, subID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrSubscriptionNotFound):
			response.Error(w, http.StatusNotFound, "SUBSCRIPTION_NOT_FOUND", "Subscription not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this subscription")
		case errors.Is(err, service.ErrSubscriptionInactive):
			response.Error(w, http.StatusBadRequest, "SUBSCRIPTION_INACTIVE", "Subscription is not active")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to rotate API key")
		}
		return
	}

	response.Success(w, http.StatusOK, resp)
}
