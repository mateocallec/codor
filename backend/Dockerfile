# Use the official PHP image with Apache
FROM php:8.2-apache

# Enable Apache rewrite module
RUN a2enmod rewrite

# Copy application source code to Apache document root
COPY app/ /var/www/html/

# Copy Apache virtual host configuration
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod +x /usr/local/bin/entrypoint.sh

# Expose HTTP port
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["entrypoint.sh"]
