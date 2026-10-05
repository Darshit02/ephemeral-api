package auth_test

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"ephemeral/packages/go-shared/auth"
)

func TestPasswordHashing(t *testing.T) {
	password := "superSecret123!"

	hash, err := auth.HashPassword(password)
	if err != nil {
		t.Fatalf("unexpected error hashing password: %v", err)
	}

	if hash == password {
		t.Fatal("hash should not equal raw password")
	}

	if !auth.CheckPasswordHash(password, hash) {
		t.Fatal("password verification failed for matching password")
	}

	if auth.CheckPasswordHash("wrongPassword", hash) {
		t.Fatal("password verification succeeded for wrong password")
	}
}

func TestJWTGenerationAndValidation(t *testing.T) {
	secret := "test-secret-key-1234567890123456"
	userID := "c56a4180-65aa-42ec-a945-5fd21dec0538"
	role := "provider"

	tokenString, err := auth.GenerateJWT(secret, userID, role)
	if err != nil {
		t.Fatalf("unexpected error generating JWT: %v", err)
	}

	claims, err := auth.ValidateJWT(secret, tokenString)
	if err != nil {
		t.Fatalf("unexpected error validating JWT: %v", err)
	}

	if claims.Subject != userID {
		t.Errorf("expected Subject %s, got %s", userID, claims.Subject)
	}
	if claims.Role != role {
		t.Errorf("expected Role %s, got %s", role, claims.Role)
	}

	// Test invalid secret
	_, err = auth.ValidateJWT("wrong-secret-key", tokenString)
	if err == nil {
		t.Fatal("expected error with wrong secret, got nil")
	}

	// Test malformed token
	_, err = auth.ValidateJWT(secret, "not.a.valid.jwt")
	if err == nil {
		t.Fatal("expected error with malformed token, got nil")
	}

	// Test expired token
	expiredClaims := auth.JWTClaims{
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-1 * time.Hour)),
		},
	}
	expiredToken := jwt.NewWithClaims(jwt.SigningMethodHS256, expiredClaims)
	expiredStr, _ := expiredToken.SignedString([]byte(secret))

	_, err = auth.ValidateJWT(secret, expiredStr)
	if err == nil {
		t.Fatal("expected error with expired token, got nil")
	}
}
