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
FROM php:8.5.7-apache

WORKDIR /var/www/html

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
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
        gd

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy application source
COPY . /var/www/html

# Copy Composer dependencies
COPY --from=vendor /app/vendor /var/www/html/vendor

# Copy compiled frontend assets
COPY --from=frontend /app/public/build /var/www/html/public/build

# Optimize Composer autoloader
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer dump-autoload --optimize --no-scripts

# Set directory permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

# Configure Apache
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Force Apache to listen to Railway's dynamic port
RUN sed -i 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf && \
    sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/' /etc/apache2/sites-available/000-default.conf

# Clear caches, run migrations, and launch Apache
CMD php artisan config:clear && php artisan migrate --force && apache2-foreground