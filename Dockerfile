# ==========================================
# Stage 1: Install PHP Dependencies
# ==========================================
FROM composer:2 AS vendor

WORKDIR /app

# Copy Composer files
COPY composer.json composer.lock ./

# Install production dependencies
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

# Copy application source
COPY . .

# Copy Composer dependencies for Ziggy
COPY --from=vendor /app/vendor ./vendor

# Install Node dependencies
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Build Vite assets
RUN npm run build


# ==========================================
# Stage 3: Production Image
# ==========================================
FROM php:8.3-apache

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
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        opcache \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite
RUN a2enmod rewrite

# Ensure only the prefork MPM is enabled
RUN a2dismod mpm_event || true && \
    a2dismod mpm_worker || true && \
    a2enmod mpm_prefork

# Copy application
COPY . /var/www/html

# Copy Composer dependencies
COPY --from=vendor /app/vendor /var/www/html/vendor

# Copy compiled frontend assets
COPY --from=frontend /app/public/build /var/www/html/public/build

# Set permissions
RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache && \
    chmod -R 775 \
    storage \
    bootstrap/cache

# Configure Apache to serve Laravel's public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri \
    -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

# Suppress Apache FQDN warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Startup:
# - Configure Apache to listen on Railway's runtime PORT
# - Clear Laravel caches
# - Run migrations
# - Start Apache
CMD sed -i "s/^Listen 80$/Listen ${PORT:-80}/" /etc/apache2/ports.conf && \
    sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT:-80}>/" /etc/apache2/sites-available/000-default.conf && \
    php artisan optimize:clear && \
    php artisan migrate --force && \
    exec apache2-foreground