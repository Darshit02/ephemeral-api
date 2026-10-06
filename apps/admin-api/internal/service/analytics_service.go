package service

import (
	"context"
	"errors"
	"time"

	"ephemeral/apps/admin-api/internal/repository"
	"ephemeral/packages/go-shared/models"
)

var (
	ErrAPINotFound = repository.ErrAPINotFound
	ErrForbidden   = errors.New("forbidden")
)

type AnalyticsService struct {
	repo *repository.AnalyticsRepository
}

func NewAnalyticsService(repo *repository.AnalyticsRepository) *AnalyticsService {
	return &AnalyticsService{repo: repo}
}

func parseTimeParam(val string, defaultVal time.Time, isEnd bool) (time.Time, error) {
	if val == "" {
		return defaultVal, nil
	}

	if t, err := time.Parse(time.RFC3339, val); err == nil {
		return t, nil
	}

	if t, err := time.Parse("2006-01-02", val); err == nil {
		if isEnd {
			return t.Add(23*time.Hour + 59*time.Minute + 59*time.Second), nil
		}
		return t, nil
	}

	return time.Time{}, errors.New("invalid date format; use RFC3339 or YYYY-MM-DD")
}

func (s *AnalyticsService) GetAPIUsage(ctx context.Context, user *models.User, apiID, fromStr, toStr, interval string) (*repository.UsageAnalytics, error) {
	api, err := s.repo.FindAPIByID(ctx, apiID)
	if err != nil {
		return nil, err
	}

	if api.ProviderID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	now := time.Now().UTC()
	defaultFrom := now.AddDate(0, 0, -30)

	from, err := parseTimeParam(fromStr, defaultFrom, false)
	if err != nil {
		return nil, err
	}

	to, err := parseTimeParam(toStr, now, true)
	if err != nil {
		return nil, err
	}

	if interval == "" {
		interval = "day"
	}

	return s.repo.GetAPIUsageStats(ctx, apiID, from, to, interval)
}

func (s *AnalyticsService) GetAPIConsumers(ctx context.Context, user *models.User, apiID string) ([]repository.ConsumerStat, error) {
	api, err := s.repo.FindAPIByID(ctx, apiID)
	if err != nil {
		return nil, err
	}

	if api.ProviderID != user.ID && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	return s.repo.GetAPIConsumers(ctx, apiID)
}

func (s *AnalyticsService) GetRevenueSummary(ctx context.Context, user *models.User) (*repository.RevenueSummary, error) {
	if user.Role != models.RoleProvider && user.Role != models.RoleAdmin {
		return nil, ErrForbidden
	}

	return s.repo.GetProviderRevenue(ctx, user.ID)
}
