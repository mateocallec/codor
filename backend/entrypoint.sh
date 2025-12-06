#!/bin/sh
set -e

echo "Initializing container..."

chmod 777 -R /storage

# Enable default Apache site
a2ensite 000-default.conf > /dev/null

# Ensure Apache listens on port 80
sed -i 's/^Listen .*/Listen 80/' /etc/apache2/ports.conf

echo "Starting Apache..."
exec apache2-foreground
