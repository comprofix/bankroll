#!/bin/sh
set -e

echo "Applying database migrations..."
attempt=0
max_attempts=30
until npm run db:migrate; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Migrations failed after $max_attempts attempts (database never became reachable) — giving up."
    exit 1
  fi
  echo "Migration attempt $attempt failed (database likely still starting up) — retrying in 2s..."
  sleep 2
done

# Idempotent (no-ops if a user already exists), but skip entirely rather than
# fail the whole deploy if these were intentionally removed after first setup.
if [ -n "$SEED_EMAIL" ] && [ -n "$SEED_PASSWORD" ]; then
  echo "Ensuring the seed user exists..."
  npm run db:seed
else
  echo "SEED_EMAIL/SEED_PASSWORD not set, skipping seed step."
fi

echo "Starting server..."
exec npm run start
