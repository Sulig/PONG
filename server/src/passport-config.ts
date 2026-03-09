import passport from 'passport';
import fs from 'node:fs';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import { prisma } from './prisma/client';
import vaultClient from './config/vault';

dotenv.config();

const clientUrl = process.env.CLIENT_URL || 'https://localhost';

const vaultGoogle = vaultClient.getOAuthConfig('google');
const vaultGithub = vaultClient.getOAuthConfig('github');

const googleClientId = vaultGoogle?.client_id || process.env.GOOGLE_ID_CLIENT || '';
const googleClientSecret =
    vaultGoogle?.client_secret ||
    process.env.GOOGLE_CLIENT_SECRET ||
    (process.env.GOOGLE_CLIENT_SECRET_FILE
        ? fs.readFileSync(process.env.GOOGLE_CLIENT_SECRET_FILE, 'utf8').trim()
        : '');

const githubClientId = vaultGithub?.client_id || process.env.GITHUB_ID_CLIENT || '';
const githubClientSecret =
    vaultGithub?.client_secret ||
    process.env.GITHUB_CLIENT_SECRET ||
    (process.env.GITHUB_CLIENT_SECRET_FILE
        ? fs.readFileSync(process.env.GITHUB_CLIENT_SECRET_FILE, 'utf8').trim()
        : '');

// Google OAuth Strategy (only if keys are configured)
if (googleClientId && googleClientSecret) {
    passport.use(
        new GoogleStrategy({
            clientID: googleClientId,
            clientSecret: googleClientSecret,
            callbackURL: `https://localhost/api/v1/auth/google/redirect`,
        }, async (_accessToken, _refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findFirst({
                    where: { googleId: profile.id },
                });

                if (user) {
                    return done(null, user);
                }

                user = await prisma.user.create({
                    data: {
                        email: profile.emails?.[0]?.value || '',
                        googleId: profile.id,
                        password: '',
                        profile: {
                            create: {
                                name: profile.displayName || 'Google User',
                                bio: '',
                            },
                        },
                    },
                });

                done(null, user);
            } catch (err) {
                done(err as Error, undefined);
            }
        })
    );
}

// GitHub OAuth Strategy (only if keys are configured)
if (githubClientId && githubClientSecret) {
    passport.use(
        new GithubStrategy({
            clientID: githubClientId,
            clientSecret: githubClientSecret,
            callbackURL: `https://localhost/api/v1/auth/github/redirect`,
        }, async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
            try {
                let user = await prisma.user.findFirst({
                    where: { githubId: profile.id },
                });

                if (user) {
                    return done(null, user);
                }

                user = await prisma.user.create({
                    data: {
                        email: profile.emails?.[0]?.value || '',
                        githubId: profile.id,
                        password: '',
                        profile: {
                            create: {
                                name: profile.displayName || profile.username || 'GitHub User',
                                bio: '',
                            },
                        },
                    },
                });

                done(null, user);
            } catch (err) {
                done(err as Error, undefined);
            }
        })
    );
}
