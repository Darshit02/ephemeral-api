package middleware

import (
	"context"
	"net/http"
	"strings"

	"ephemeral/packages/go-shared/auth"
	"ephemeral/packages/go-shared/models"
	"ephemeral/packages/go-shared/response"
)

type userContextKeyType struct{}

var userContextKey = userContextKeyType{}

type UserFetcherFunc func(ctx context.Context, userID string) (*models.User, error)

// Auth returns a middleware that validates JWT tokens and injects the user into the request context.
func Auth(jwtSecret string, fetchUser UserFetcherFunc) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing Authorization header")
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Malformed Authorization header; expected Bearer token")
				return
			}

			tokenString := parts[1]
			claims, err := auth.ValidateJWT(jwtSecret, tokenString)
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid or expired token")
				return
			}

			var user *models.User
			if fetchUser != nil {
				dbUser, err := fetchUser(r.Context(), claims.Subject)
				if err != nil || dbUser == nil {
					response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User not found or inactive")
					return
				}
				user = dbUser
			} else {
				user = &models.User{
					ID:   claims.Subject,
					Role: models.UserRole(claims.Role),
				}
			}

			ctx := context.WithValue(r.Context(), userContextKey, user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetAuthUser retrieves the authenticated *models.User from context.
func GetAuthUser(ctx context.Context) *models.User {
	if ctx == nil {
		return nil
	}
	if user, ok := ctx.Value(userContextKey).(*models.User); ok {
		return user
	}
	return nil
}

// RequireRole enforces that the authenticated user has one of the allowed roles.
func RequireRole(allowedRoles ...models.UserRole) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := GetAuthUser(r.Context())
			if user == nil {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Authentication required")
				return
			}

			for _, role := range allowedRoles {
				if user.Role == role {
					next.ServeHTTP(w, r)
					return
				}
			}

			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You do not have permission to access this resource")
		})
	}
}
