package handler

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"ephemeral/apps/admin-api/internal/service"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/response"
)

type AnalyticsHandler struct {
	svc *service.AnalyticsService
}

func NewAnalyticsHandler(svc *service.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{svc: svc}
}

// GET /admin/apis/:id/usage
func (h *AnalyticsHandler) GetAPIUsage(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apiID := chi.URLParam(r, "id")
	fromStr := r.URL.Query().Get("from")
	toStr := r.URL.Query().Get("to")
	interval := r.URL.Query().Get("interval")

	stats, err := h.svc.GetAPIUsage(r.Context(), user, apiID, fromStr, toStr, interval)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API")
		default:
			if err.Error() == "invalid date format; use RFC3339 or YYYY-MM-DD" {
				response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
				return
			}
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to retrieve usage analytics")
		}
		return
	}

	response.Success(w, http.StatusOK, stats)
}

// GET /admin/apis/:id/consumers
func (h *AnalyticsHandler) GetAPIConsumers(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apiID := chi.URLParam(r, "id")
	consumers, err := h.svc.GetAPIConsumers(r.Context(), user, apiID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to retrieve API consumers")
		}
		return
	}

	response.Success(w, http.StatusOK, consumers)
}

// GET /admin/revenue
func (h *AnalyticsHandler) GetRevenueSummary(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	summary, err := h.svc.GetRevenueSummary(r.Context(), user)
	if err != nil {
		if errors.Is(err, service.ErrForbidden) {
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "Provider role required")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to retrieve revenue summary")
		return
	}

	response.Success(w, http.StatusOK, summary)
}
