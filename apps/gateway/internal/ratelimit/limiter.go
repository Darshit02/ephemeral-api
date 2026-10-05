package ratelimit

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/redis/go-redis/v9"
)

type Result struct {
	Allowed    bool
	Limit      int
	Remaining  int
	ResetUnix  int64
	RetryAfter int
	Current    int64
}

type Limiter interface {
	Allow(ctx context.Context, subID, apiID string, limitPerHour int) (*Result, error)
}

type RedisLimiter struct {
	client *redis.Client
	script *redis.Script
}

// Lua script increments the counter and sets expiration to resetUnix if no TTL is set.
var rateLimitScript = redis.NewScript(`
local current = redis.call('INCR', KEYS[1])
local ttl = redis.call('TTL', KEYS[1])
if ttl < 0 then
    redis.call('EXPIREAT', KEYS[1], ARGV[1])
end
return current
`)

func NewRedisLimiter(client *redis.Client) *RedisLimiter {
	return &RedisLimiter{
		client: client,
		script: rateLimitScript,
	}
}

func (r *RedisLimiter) Allow(ctx context.Context, subID, apiID string, limitPerHour int) (*Result, error) {
	now := time.Now().UTC()
	windowEnd := time.Date(now.Year(), now.Month(), now.Day(), now.Hour()+1, 0, 0, 0, time.UTC)
	resetUnix := windowEnd.Unix()
	retryAfter := int(math.Ceil(windowEnd.Sub(now).Seconds()))
	if retryAfter < 1 {
		retryAfter = 1
	}

	if limitPerHour <= 0 {
		return &Result{
			Allowed:    true,
			Limit:      limitPerHour,
			Remaining:  0,
			ResetUnix:  resetUnix,
			RetryAfter: retryAfter,
			Current:    0,
		}, nil
	}

	key := fmt.Sprintf("rl:%s:%s:%s", subID, apiID, now.Format("2006010215"))

	val, err := r.script.Run(ctx, r.client, []string{key}, resetUnix).Int64()
	if err != nil {
		return nil, fmt.Errorf("rate limit redis error: %w", err)
	}

	remaining := limitPerHour - int(val)
	if remaining < 0 {
		remaining = 0
	}

	return &Result{
		Allowed:    int(val) <= limitPerHour,
		Limit:      limitPerHour,
		Remaining:  remaining,
		ResetUnix:  resetUnix,
		RetryAfter: retryAfter,
		Current:    val,
	}, nil
}
