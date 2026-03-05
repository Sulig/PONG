#!/bin/sh
# Script to initialize HashiCorp Vault with project secrets

VAULT_ADDR=${VAULT_ADDR:-http://127.0.0.1:8200}
if [ -z "${VAULT_TOKEN}" ] && [ -f /run/secrets/vault_root_token ]; then
  VAULT_TOKEN="$(cat /run/secrets/vault_root_token)"
fi
VAULT_TOKEN=${VAULT_TOKEN:-${VAULT_DEV_ROOT_TOKEN_ID:-dev-root-token-change-in-production}}
export VAULT_ADDR VAULT_TOKEN

# Wait for Vault to be ready
echo "Waiting for Vault to be ready..."
until vault status > /dev/null 2>&1; do
    sleep 1
done

echo "Vault is ready. Initializing secrets..."

# Enable KV secrets engine v2
vault secrets enable -version=2 -path=transcendence kv

# Create policies
vault policy write transcendence-backend - <<EOF
# Policy for transcendence backend
path "transcendence/data/*" {
  capabilities = ["read"]
}

path "transcendence/metadata/*" {
  capabilities = ["list", "read"]
}
EOF

# Create a backend token with the pre-shared ID from the secrets file
# so the backend can authenticate with the token it already has
if [ -f /run/secrets/vault_backend_token ]; then
  BACKEND_TOKEN_ID="$(cat /run/secrets/vault_backend_token | tr -d '[:space:]')"
  vault token create -id="${BACKEND_TOKEN_ID}" -policy=transcendence-backend -format=json > /dev/null
  BACKEND_TOKEN="${BACKEND_TOKEN_ID}"
else
  BACKEND_TOKEN=$(vault token create -policy=transcendence-backend -format=json | \
    awk -F'"' '/client_token/ {print $4}' | head -n 1)
fi

# Generate JWT secret (use /dev/urandom; openssl is not in the Vault image)
JWT_SECRET=$(od -A n -t x1 -N 32 /dev/urandom 2>/dev/null | tr -d ' \n' | head -c 64)
# Use same DB password as Postgres container (from .env) so backend can connect
if [ -f /run/secrets/postgres_password ]; then
  DB_PASSWORD="$(cat /run/secrets/postgres_password)"
else
  DB_PASSWORD="${POSTGRES_PASSWORD:-changeme}"
fi

# Store secrets in Vault
vault kv put transcendence/jwt secret="$JWT_SECRET"
vault kv put transcendence/database \
    user="${POSTGRES_USER:-postgres}" \
    password="$DB_PASSWORD" \
    host="postgres" \
    port="5432" \
    database="${POSTGRES_DB:-transcendence}"

# Store OAuth client secrets (example for 42 API)
# In production, these values must be configured manually
vault kv put transcendence/oauth/42 \
    client_id="your-42-client-id" \
    client_secret="your-42-client-secret" \
    redirect_uri="https://localhost/api/v1/auth/oauth/42/callback"

# Store Google OAuth secrets from env vars and Docker secrets
if [ -f /run/secrets/google_client_secret ]; then
  GOOGLE_CLIENT_SECRET="$(cat /run/secrets/google_client_secret)"
else
  GOOGLE_CLIENT_SECRET=""
fi

if [ -n "${GOOGLE_ID_CLIENT}" ] && [ -n "${GOOGLE_CLIENT_SECRET}" ]; then
  vault kv put transcendence/oauth/google \
      client_id="${GOOGLE_ID_CLIENT}" \
      client_secret="${GOOGLE_CLIENT_SECRET}"
  echo "Google OAuth secrets stored."
else
  echo "WARNING: Google OAuth credentials not found, skipping."
fi

# Store GitHub OAuth secrets from env vars and Docker secrets
if [ -f /run/secrets/github_client_secret ]; then
  GITHUB_CLIENT_SECRET="$(cat /run/secrets/github_client_secret)"
else
  GITHUB_CLIENT_SECRET=""
fi

if [ -n "${GITHUB_ID_CLIENT}" ] && [ -n "${GITHUB_CLIENT_SECRET}" ]; then
  vault kv put transcendence/oauth/github \
      client_id="${GITHUB_ID_CLIENT}" \
      client_secret="${GITHUB_CLIENT_SECRET}"
  echo "GitHub OAuth secrets stored."
else
  echo "WARNING: GitHub OAuth credentials not found, skipping."
fi

echo "Vault initialized successfully."
echo "JWT_SECRET generated and stored."
echo "Database credentials stored."
echo "Backend token created (least privilege): ${BACKEND_TOKEN}"

# Signal that init is complete (used by healthcheck)
touch /tmp/vault-init-done
