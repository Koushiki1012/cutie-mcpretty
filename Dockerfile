# ==========================================
# Stage 1: Install PHP Dependencies
# ==========================================
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-reqs \
    --no-scripts

# ==========================================
# Stage 2: Build Frontend Assets
# ==========================================
FROM node:20 AS frontend

WORKDIR /app

COPY . .
COPY --from=vendor /app/vendor ./vendor

RUN npm install --legacy-peer-deps --no-audit --no-fund
RUN npm run build

# ==========================================
# Stage 3: Production
# ==========================================
FROM php:8.5.7-apache

WORKDIR /var/www/html

# Install system packages and PHP extensions
RUN apt-get update && apt-get install -y \
        git \
        curl \
        unzip \
        zip \
        libzip-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libonig-dev \
        libxml2-dev \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        bcmath \
        exif \
        gd \
        zip \
        opcache \
    && rm -rf /var/lib/apt/lists/*

# Copy application
COPY . /var/www/html

# Copy vendor
COPY --from=vendor /app/vendor /var/www/html/vendor

# Copy built frontend assets
COPY --from=frontend /app/public/build /var/www/html/public/build

# Enable required Apache modules
RUN a2enmod rewrite

# ----------------------------------------------------
# Resolve Apache MPM conflict
# ----------------------------------------------------
RUN set -eux; \
    a2dismod mpm_event || true; \
    a2dismod mpm_worker || true; \
    a2enmod mpm_prefork; \
    apache2ctl -M | grep mpm

# Configure Laravel document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri \
    -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

# Suppress Apache FQDN warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configure Apache for Railway dynamic PORT
RUN sed -i 's/^Listen 80$/Listen ${PORT}/' /etc/apache2/ports.conf && \
    sed -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' \
    /etc/apache2/sites-available/000-default.conf

# Permissions
RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache && \
    chmod -R 775 \
    storage \
    bootstrap/cache

# Startup
CMD php artisan optimize:clear && \
    php artisan migrate --force && \
    exec apache2-foreground