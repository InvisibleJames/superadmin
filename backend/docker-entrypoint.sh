#!/bin/sh
set -e
cd /app

# Ensure an .env exists (compose env vars override its DB_*/URLs at runtime).
[ -f .env ] || cp .env.example .env

# Generate an app key once if missing.
grep -q '^APP_KEY=base64:' .env || php artisan key:generate --force

# Wait for MySQL to accept connections.
echo "Waiting for database at ${DB_HOST:-mysql}:${DB_PORT:-3306}…"
until php -r "new PDO('mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" 2>/dev/null; do
  sleep 2
done
echo "Database is up."

# Idempotent migrate + seed (all seeders use updateOrCreate).
php artisan migrate --seed --force

exec php artisan serve --host=0.0.0.0 --port=8000
