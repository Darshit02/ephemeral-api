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

type APIHandler struct {
	apiService *service.APIService
}

func NewAPIHandler(apiService *service.APIService) *APIHandler {
	return &APIHandler{apiService: apiService}
}

// POST /admin/apis
func (h *APIHandler) Create(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	var input service.CreateAPIInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Malformed JSON request body")
		return
	}

	api, err := h.apiService.Create(r.Context(), user.ID, input)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrSlugTaken):
			response.Error(w, http.StatusConflict, "SLUG_TAKEN", "An API with this slug already exists")
		case errors.Is(err, service.ErrInvalidSlug):
			response.Error(w, http.StatusBadRequest, "INVALID_SLUG", "Slug must contain only lowercase letters, numbers, and hyphens")
		case errors.Is(err, service.ErrInvalidBaseURL):
			response.Error(w, http.StatusBadRequest, "INVALID_BASE_URL", "base_url must be a valid http or https URL")
		default:
			response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
		}
		return
	}

	response.Success(w, http.StatusCreated, api)
}

// GET /admin/apis
func (h *APIHandler) ListOwn(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apis, err := h.apiService.ListProviderAPIs(r.Context(), user)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to list APIs")
		return
	}

	response.Success(w, http.StatusOK, apis)
}

// GET /admin/apis/:id
func (h *APIHandler) GetOwn(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apiID := chi.URLParam(r, "id")
	api, err := h.apiService.GetProviderAPI(r.Context(), user, apiID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API listing")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to fetch API")
		}
		return
	}

	response.Success(w, http.StatusOK, api)
}

// PUT /admin/apis/:id
func (h *APIHandler) Update(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apiID := chi.URLParam(r, "id")
	var input service.UpdateAPIInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Malformed JSON request body")
		return
	}

	api, err := h.apiService.Update(r.Context(), user, apiID, input)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API listing")
		case errors.Is(err, service.ErrSlugTaken):
			response.Error(w, http.StatusConflict, "SLUG_TAKEN", "An API with this slug already exists")
		case errors.Is(err, service.ErrInvalidSlug):
			response.Error(w, http.StatusBadRequest, "INVALID_SLUG", "Slug must contain only lowercase letters, numbers, and hyphens")
		case errors.Is(err, service.ErrInvalidBaseURL):
			response.Error(w, http.StatusBadRequest, "INVALID_BASE_URL", "base_url must be a valid http or https URL")
		case errors.Is(err, service.ErrInvalidStatus):
			response.Error(w, http.StatusBadRequest, "INVALID_STATUS", "Invalid API status")
		default:
			response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", err.Error())
		}
		return
	}

	response.Success(w, http.StatusOK, api)
}

// DELETE /admin/apis/:id
func (h *APIHandler) Delete(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	apiID := chi.URLParam(r, "id")
	api, err := h.apiService.SoftDelete(r.Context(), user, apiID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAPINotFound):
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
		case errors.Is(err, service.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not own this API listing")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to delete API")
		}
		return
	}

	response.Success(w, http.StatusOK, api)
}

// GET /apis
func (h *APIHandler) ListPublic(w http.ResponseWriter, r *http.Request) {
	apis, err := h.apiService.ListPublic(r.Context())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to list public APIs")
		return
	}

	response.Success(w, http.StatusOK, apis)
}

// GET /apis/:slug
func (h *APIHandler) GetPublic(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	api, err := h.apiService.GetPublicBySlug(r.Context(), slug)
	if err != nil {
		if errors.Is(err, service.ErrAPINotFound) {
			response.Error(w, http.StatusNotFound, "API_NOT_FOUND", "API listing not found")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to fetch API")
		return
	}

	response.Success(w, http.StatusOK, api)
}
