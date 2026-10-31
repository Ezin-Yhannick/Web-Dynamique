#!/bin/sh
set -e
cd /var/www/html

mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views \
         storage/logs bootstrap/cache

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  if [ "${DB_CONNECTION:-}" = "sqlite" ]; then
    mkdir -p "$(dirname "$DB_DATABASE")" && touch "$DB_DATABASE"
  fi
  php artisan migrate --force

  # Seeders exécutés une seule fois (marqueur dans storage/). Pour recharger : docker compose down -v
  if [ "${RUN_SEEDERS:-false}" = "true" ] && [ ! -f storage/.seeded ]; then
    php artisan db:seed --force
    touch storage/.seeded
  fi
fi

exec "$@"
