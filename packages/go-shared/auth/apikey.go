package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/big"
)

const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

// Base62Encode encodes bytes into a base62 string.
func Base62Encode(b []byte) string {
	var i big.Int
	i.SetBytes(b)

	base := big.NewInt(62)
	zero := big.NewInt(0)
	mod := new(big.Int)

	var res []byte
	for i.Cmp(zero) > 0 {
		i.DivMod(&i, base, mod)
		res = append(res, base62Chars[mod.Int64()])
	}

	for j, k := 0, len(res)-1; j < k; j, k = j+1, k-1 {
		res[j], res[k] = res[k], res[j]
	}

	if len(res) == 0 {
		return "0"
	}

	return string(res)
}

// GenerateAPIKey generates a 32-byte crypto/rand base62 encoded key with the given prefix,
// returning the full key, its SHA-256 hex hash, and the first 12 chars as keyPrefix.
func GenerateAPIKey(prefix string) (fullKey string, hash string, keyPrefix string, err error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", "", "", fmt.Errorf("failed to read random bytes: %w", err)
	}

	encoded := Base62Encode(b)
	fullKey = prefix + encoded

	h := sha256.Sum256([]byte(fullKey))
	hash = hex.EncodeToString(h[:])

	if len(fullKey) >= 12 {
		keyPrefix = fullKey[:12]
	} else {
		keyPrefix = fullKey
	}

	return fullKey, hash, keyPrefix, nil
}

// HashAPIKey returns the SHA-256 hex string of the given API key.
func HashAPIKey(apiKey string) string {
	h := sha256.Sum256([]byte(apiKey))
	return hex.EncodeToString(h[:])
}
