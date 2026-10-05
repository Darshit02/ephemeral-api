package auth_test

import (
	"strings"
	"testing"

	"ephemeral/packages/go-shared/auth"
)

func TestAPIKeyGeneration(t *testing.T) {
	prefix := "ephemeral_live_"
	fullKey, hash, prefix12, err := auth.GenerateAPIKey(prefix)
	if err != nil {
		t.Fatalf("unexpected error generating api key: %v", err)
	}

	if !strings.HasPrefix(fullKey, prefix) {
		t.Errorf("expected full key to start with '%s', got '%s'", prefix, fullKey)
	}

	if len(hash) != 64 {
		t.Errorf("expected 64 char hex hash, got len %d", len(hash))
	}

	if len(prefix12) > 12 {
		t.Errorf("expected prefix <= 12 chars, got len %d (%s)", len(prefix12), prefix12)
	}

	if auth.HashAPIKey(fullKey) != hash {
		t.Errorf("expected HashAPIKey to match returned hash")
	}
}
