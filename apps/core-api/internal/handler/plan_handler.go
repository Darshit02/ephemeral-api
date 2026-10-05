package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"ephemeral/apps/core-api/internal/repository"
	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/response"
)

type PlanHandler struct {
	planService *service.PlanService
}

func NewPlanHandler(planService *service.PlanService) *PlanHandler {
	return &PlanHandler{planService: planService}
}

// POST /admin/apis/:id/plans
func (h *PlanHandler) Create(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apiID := chi.URLParam(r, "id")
	var input service.CreatePlanInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Malformed JSON request body")
		return
	}

	plan, err := h.planService.Create(r.Context(), user, apiID, input)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API listing")
		case errors.Is(err, service.ErrInvalidPlanPrice):
			response.Error(w, http.StatusBadRequest, "INVALID_PRICE", "price_cents must be >= 0")
		case errors.Is(err, service.ErrInvalidRateLimit):
			response.Error(w, http.StatusBadRequest, "INVALID_RATE_LIMIT", "rate_limit_per_hour must be > 0")
		case errors.Is(err, service.ErrInvalidQuota):
			response.Error(w, http.StatusBadRequest, "INVALID_QUOTA", "monthly_quota must be >= 0")
		default:
			response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
		}
		return
	}

	response.Success(w, http.StatusCreated, plan)
}

// GET /admin/apis/:id/plans
func (h *PlanHandler) ListByAPI(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apiID := chi.URLParam(r, "id")
	plans, err := h.planService.ListByAPI(r.Context(), user, apiID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API listing")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to list plans")
		}
		return
	}

	response.Success(w, http.StatusOK, plans)
}

// PUT /admin/plans/:planID
func (h *PlanHandler) Update(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	planID := chi.URLParam(r, "planID")
	var input service.UpdatePlanInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Malformed JSON request body")
		return
	}

	plan, err := h.planService.Update(r.Context(), user, planID, input)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrPlanNotFound):
			response.Error(w, http.StatusNotFound, "PLAN_NOT_FOUND", "Plan not found")
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API listing")
		case errors.Is(err, service.ErrInvalidPlanPrice):
			response.Error(w, http.StatusBadRequest, "INVALID_PRICE", "price_cents must be >= 0")
		case errors.Is(err, service.ErrInvalidRateLimit):
			response.Error(w, http.StatusBadRequest, "INVALID_RATE_LIMIT", "rate_limit_per_hour must be > 0")
		case errors.Is(err, service.ErrInvalidQuota):
			response.Error(w, http.StatusBadRequest, "INVALID_QUOTA", "monthly_quota must be >= 0")
		default:
			response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
		}
		return
	}

	response.Success(w, http.StatusOK, plan)
}

// DELETE /admin/plans/:planID
func (h *PlanHandler) Delete(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	planID := chi.URLParam(r, "planID")
	err := h.planService.Delete(r.Context(), user, planID)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrPlanNotFound):
			response.Error(w, http.StatusNotFound, "PLAN_NOT_FOUND", "Plan not found")
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API listing")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to delete plan")
		}
		return
	}

	response.Success(w, http.StatusOK, map[string]string{
		"id":      planID,
		"message": "Plan deleted successfully",
	})
}

// GET /apis/:slug/plans
func (h *PlanHandler) ListPublic(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	plans, err := h.planService.ListPublicPlans(r.Context(), slug)
	if err != nil {
		if errors.Is(err, service.ErrAPINotFound) {
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to list public plans")
		return
	}

	response.Success(w, http.StatusOK, plans)
}
