package db_test

import (
	"log/slog"
	"os"
	"testing"
	"testing/fstest"

	"ephemeral/packages/go-shared/db"
)

func TestRunMigrationsWithInvalidFS(t *testing.T) {
	// Testing handling of invalid migration files
	memFS := fstest.MapFS{
		"invalid.sql": &fstest.MapFile{
			Data: []byte("CREATE TABLE dummy (id int);"),
		},
	}

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	err := db.RunMigrations("postgres://invalid:invalid@localhost:5432/invalid?sslmode=disable", memFS, ".", logger)
	if err == nil {
		t.Fatal("expected error with unreachable database, got nil")
	}
}
