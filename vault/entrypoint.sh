#!/bin/sh
set -e

if [ -f /run/secrets/vault_root_token ]; then
  VAULT_ROOT_TOKEN="$(cat /run/secrets/vault_root_token)"
else
  VAULT_ROOT_TOKEN="${VAULT_DEV_ROOT_TOKEN_ID:-dev-root-token-change-in-production}"
fi

export VAULT_TOKEN="${VAULT_ROOT_TOKEN}"

# Start Vault in the background
vault server -dev -dev-root-token-id="${VAULT_ROOT_TOKEN}" &
VAULT_PID=$!

# Wait for Vault to be ready, then seed secrets
echo "Waiting for Vault to start..."
until vault status > /dev/null 2>&1; do
  sleep 1
done

# Run the init script to seed all secrets
sh /vault/init-vault.sh

# Keep Vault in the foreground
wait $VAULT_PID
