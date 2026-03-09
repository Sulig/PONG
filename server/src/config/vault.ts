import vault from 'node-vault';
import fs from 'node:fs';

interface VaultSecrets {
    jwt: {
        secret: string;
    };
    database: {
        user: string;
        password: string;
        host: string;
        port: string;
        database: string;
    };
    oauth?: {
        '42'?: {
            client_id: string;
            client_secret: string;
            redirect_uri: string;
        };
        google?: {
            client_id: string;
            client_secret: string;
        };
        github?: {
            client_id: string;
            client_secret: string;
        };
    };
}

class VaultClient {
    private client: vault.client;
    private secrets: VaultSecrets | null = null;
    private initialized: boolean = false;

    constructor() {
        const vaultAddr = process.env.VAULT_ADDR || 'http://localhost:8200';
        let vaultToken = process.env.VAULT_TOKEN || '';
        if (!vaultToken && process.env.VAULT_TOKEN_FILE) {
            try {
                vaultToken = fs.readFileSync(process.env.VAULT_TOKEN_FILE, 'utf8').trim();
            } catch {
                vaultToken = '';
            }
        }
        if (!vaultToken) {
            vaultToken = 'dev-root-token-change-in-production';
        }

        this.client = vault({
            endpoint: vaultAddr,
            token: vaultToken,
        });
    }

    /**
     * Initializes the Vault client and loads all secrets.
     * Must be called before accessing any secret.
     */
    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        try {
            // Check Vault health
            await this.client.health();

            // Load secrets from Vault
            const [jwtSecret, dbSecret, oauthSecret, googleOauth, githubOauth] = await Promise.all([
                this.client.read('transcendence/data/jwt').catch(() => null),
                this.client.read('transcendence/data/database').catch(() => null),
                this.client.read('transcendence/data/oauth/42').catch(() => null),
                this.client.read('transcendence/data/oauth/google').catch(() => null),
                this.client.read('transcendence/data/oauth/github').catch(() => null),
            ]);

            this.secrets = {
                jwt: {
                    secret: jwtSecret?.data?.data?.secret || process.env.JWT_SECRET || '',
                },
                database: {
                    user: dbSecret?.data?.data?.user || process.env.PGUSER || 'postgres',
                    password: dbSecret?.data?.data?.password || process.env.PGPASSWORD || '',
                    host: dbSecret?.data?.data?.host || process.env.PGHOST || 'localhost',
                    port: dbSecret?.data?.data?.port || process.env.PGPORT || '5432',
                    database: dbSecret?.data?.data?.database || process.env.PGDATABASE || 'transcendence',
                },
            };

            if (oauthSecret?.data?.data || googleOauth?.data?.data || githubOauth?.data?.data) {
                this.secrets.oauth = {};

                if (oauthSecret?.data?.data) {
                    this.secrets.oauth['42'] = {
                        client_id: oauthSecret.data.data.client_id || '',
                        client_secret: oauthSecret.data.data.client_secret || '',
                        redirect_uri: oauthSecret.data.data.redirect_uri || '',
                    };
                }

                if (googleOauth?.data?.data) {
                    this.secrets.oauth.google = {
                        client_id: googleOauth.data.data.client_id || '',
                        client_secret: googleOauth.data.data.client_secret || '',
                    };
                }

                if (githubOauth?.data?.data) {
                    this.secrets.oauth.github = {
                        client_id: githubOauth.data.data.client_id || '',
                        client_secret: githubOauth.data.data.client_secret || '',
                    };
                }
            }

            // Validate that critical secrets are present
            if (!this.secrets.jwt.secret) {
                throw new Error('JWT_SECRET not found in Vault nor in environment variables');
            }

            if (!this.secrets.database.password) {
                throw new Error('Database password not found in Vault nor in environment variables');
            }

            this.initialized = true;
            console.log('Vault initialized successfully. Secrets loaded.');
        } catch (error) {
            console.error('Error initializing Vault:', error);
            // In development, allow fallback to environment variables
            if (process.env.NODE_ENV === 'production') {
                throw error;
            }
            console.warn('Falling back to environment variables');
            this.initialized = true;
        }
    }

    /**
     * Returns the JWT secret.
     */
    getJwtSecret(): string {
        if (!this.initialized) {
            throw new Error('Vault is not initialized. Call initialize() first.');
        }
        return this.secrets!.jwt.secret;
    }

    /**
     * Returns the database credentials.
     */
    getDatabaseConfig() {
        if (!this.initialized) {
            throw new Error('Vault is not initialized. Call initialize() first.');
        }
        return this.secrets!.database;
    }

    /**
     * Returns the full database connection URL (for Prisma).
     */
    getDatabaseUrl(): string {
        if (!this.initialized) {
            throw new Error('Vault is not initialized. Call initialize() first.');
        }
        const db = this.secrets!.database;
        return `postgresql://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`;
    }

    /**
     * Returns OAuth config for the specified provider.
     */
    getOAuthConfig(provider: '42' | 'google' | 'github') {
        if (!this.initialized) {
            throw new Error('Vault is not initialized. Call initialize() first.');
        }
        return this.secrets!.oauth?.[provider];
    }

    /**
     * Reloads secrets from Vault (useful for secret rotation).
     */
    async refresh(): Promise<void> {
        this.initialized = false;
        await this.initialize();
    }
}

// Singleton instance
const vaultClient = new VaultClient();

export default vaultClient;
