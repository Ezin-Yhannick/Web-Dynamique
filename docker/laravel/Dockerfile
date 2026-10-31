# syntax=docker/dockerfile:1
# Image partagée par api-dmp et les 4 services de référence.
# Contexte de build = racine du dépôt ; APP_DIR = dossier du projet Laravel.
FROM php:8.3-cli-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql bcmath zip gd opcache pcntl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/laravel/php.ini /usr/local/etc/php/conf.d/zz-dmp.ini

WORKDIR /var/www/html
ARG APP_DIR

# 1) dépendances (couche mise en cache tant que composer.json ne change pas)
COPY ${APP_DIR}/composer.json ${APP_DIR}/composer.lock* ./
RUN --mount=type=cache,target=/root/.composer/cache \
    composer config --global process-timeout 600 \
    && composer install --no-interaction --prefer-dist --no-scripts --no-autoloader

# 2) code source, puis autoload (les dépendances de dev restent : tests exécutables dans le conteneur)
COPY ${APP_DIR}/ ./
RUN composer dump-autoload --optimize

COPY docker/laravel/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

ENV PHP_CLI_SERVER_WORKERS=4
EXPOSE 8000
ENTRYPOINT ["entrypoint.sh"]
# --no-reload : sans cet indicateur, « artisan serve » ignore les variables d'environnement du conteneur
# dès qu'un fichier .env existe.
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000", "--no-reload"]
