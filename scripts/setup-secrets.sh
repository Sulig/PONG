#!/bin/sh
set -e

mkdir -p secrets

# Generate secure random secrets (hex = URL-safe)
# Required secrets
printf '%s' "$(openssl rand -hex 32)" > secrets/postgres_password
printf '%s' "$(openssl rand -hex 32)" > secrets/vault_root_token
printf '%s' "$(openssl rand -hex 32)" > secrets/vault_backend_token

# OAuth secrets
printf '%s' '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' > secrets/google_client_secret
printf '%s' '5d301aa53e7dfee6bbdf098632cf760287375c51' > secrets/github_client_secret

echo "Secrets created in ./secrets"
