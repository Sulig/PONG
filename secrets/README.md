# Secrets Directory

This directory is intentionally ignored by git (except this README).
Create secret files here and mount them via Docker Compose secrets.
Use the helper script: ./scripts/setup-secrets.sh

Required files for production-like usage:
- secrets/postgres_password
- secrets/vault_root_token
- secrets/vault_backend_token

Optional files (only if OAuth is enabled):
- secrets/google_client_secret
- secrets/github_client_secret

Each file should contain only the secret value (no trailing spaces).
