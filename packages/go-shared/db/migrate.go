package db

import (
	"errors"
	"fmt"
	"io/fs"
	"log/slog"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

// RunMigrations runs all up migrations found in fsys directory dir.
func RunMigrations(databaseURL string, fsys fs.FS, dir string, logger *slog.Logger) error {
	if logger == nil {
		logger = slog.Default()
	}

	d, err := iofs.New(fsys, dir)
	if err != nil {
		return fmt.Errorf("failed to create migration iofs driver: %w", err)
	}

	m, err := migrate.NewWithSourceInstance("iofs", d, databaseURL)
	if err != nil {
		return fmt.Errorf("failed to initialize migration instance: %w", err)
	}
	defer func() {
		srcErr, dbErr := m.Close()
		if srcErr != nil {
			logger.Warn("error closing migration source", slog.Any("error", srcErr))
		}
		if dbErr != nil {
			logger.Warn("error closing migration db", slog.Any("error", dbErr))
		}
	}()

	currentVersion, dirty, err := m.Version()
	if err != nil && !errors.Is(err, migrate.ErrNilVersion) {
		logger.Warn("unable to read current migration version", slog.Any("error", err))
	} else if errors.Is(err, migrate.ErrNilVersion) {
		logger.Info("no previous database migrations applied")
	} else {
		logger.Info("current database migration version", slog.Uint64("version", uint64(currentVersion)), slog.Bool("dirty", dirty))
	}

	if err := m.Up(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			logger.Info("database schema up to date (no change)")
			return nil
		}
		return fmt.Errorf("failed to apply migrations: %w", err)
	}

	newVersion, _, err := m.Version()
	if err != nil {
		logger.Warn("unable to read post-migration version", slog.Any("error", err))
	} else {
		logger.Info("applied database migrations successfully", slog.Uint64("current_version", uint64(newVersion)))
	}

	return nil
}
