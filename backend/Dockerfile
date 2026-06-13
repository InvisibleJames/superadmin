# MedReco API — Laravel on PHP 8.3 (dev container; uses `php artisan serve`).
FROM php:8.3-cli

# System deps + PHP extensions Laravel/MySQL need.
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libonig-dev default-mysql-client \
    && docker-php-ext-install pdo_mysql bcmath zip \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP deps first (better layer caching).
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --prefer-dist

# App source
COPY . .
RUN composer dump-autoload --optimize

RUN chmod +x docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["./docker-entrypoint.sh"]
