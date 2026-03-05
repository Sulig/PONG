#!/bin/sh
# Script to generate self-signed SSL certificates for development
# In production, use Let's Encrypt or valid certificates from a CA

mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/key.pem 2048

# Generate self-signed certificate (valid for 365 days)
openssl req -new -x509 -key ssl/key.pem -out ssl/cert.pem -days 365 -subj "/C=ES/ST=Madrid/L=Madrid/O=42School/OU=Transcendence/CN=localhost"

# Set appropriate permissions
chmod 600 ssl/key.pem
chmod 644 ssl/cert.pem

echo "SSL certificates generated in nginx/ssl/"
echo "IMPORTANT: These are self-signed certificates for development only."
echo "In production, use Let's Encrypt certificates or a valid CA."

