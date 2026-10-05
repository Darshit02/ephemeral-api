package auth

import (
	"context"

	"ephemeral/apps/gateway/internal/repository"
	"ephemeral/packages/go-shared/models"
)

type contextKey string

const (
	subscriptionKey contextKey = "gateway:subscription"
	apiKey          contextKey = "gateway:api"
)

func WithSubscription(ctx context.Context, sub *repository.SubscriptionAuthInfo) context.Context {
	return context.WithValue(ctx, subscriptionKey, sub)
}

func GetSubscription(ctx context.Context) *repository.SubscriptionAuthInfo {
	if val, ok := ctx.Value(subscriptionKey).(*repository.SubscriptionAuthInfo); ok {
		return val
	}
	return nil
}

func WithAPI(ctx context.Context, api *models.API) context.Context {
	return context.WithValue(ctx, apiKey, api)
}

func GetAPI(ctx context.Context) *models.API {
	if val, ok := ctx.Value(apiKey).(*models.API); ok {
		return val
	}
	return nil
}
