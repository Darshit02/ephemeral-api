package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"ephemeral/apps/core-api/internal/service"
	"ephemeral/packages/go-shared/middleware"
	"ephemeral/packages/go-shared/response"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var input service.RegisterInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Malformed JSON request body")
		return
	}

	profile, err := h.authService.Register(r.Context(), input)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrEmailTaken):
			response.Error(w, http.StatusConflict, "EMAIL_TAKEN", "An account with this email already exists")
		case errors.Is(err, service.ErrInvalidEmail):
			response.Error(w, http.StatusBadRequest, "INVALID_EMAIL", "Invalid email address format")
		case errors.Is(err, service.ErrWeakPassword):
			response.Error(w, http.StatusBadRequest, "WEAK_PASSWORD", "Password must be at least 8 characters long")
		case errors.Is(err, service.ErrInvalidRole):
			response.Error(w, http.StatusBadRequest, "INVALID_ROLE", "Invalid user role specified")
		case errors.Is(err, service.ErrMissingFields):
			response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Missing required fields")
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to register user")
		}
		return
	}

	response.Success(w, http.StatusCreated, profile)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var input service.LoginInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Malformed JSON request body")
		return
	}

	result, err := h.authService.Login(r.Context(), input)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			response.Error(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid email or password")
			return
		}
		response.Error(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Failed to authenticate user")
		return
	}

	response.Success(w, http.StatusOK, result)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	user := middleware.GetAuthUser(r.Context())
	if user == nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
		return
	}

	response.Success(w, http.StatusOK, user.ToProfile())
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	response.Success(w, http.StatusOK, map[string]string{
		"message": "logged out successfully",
	})
}
