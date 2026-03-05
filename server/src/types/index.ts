import { user } from '../prisma/generated/prisma/client';

// Export the full Prisma user type
export type User = user;

// Export a sanitized user type (without password) for API responses
export type UserResponse = Omit<User, 'password'>;

// Export a public user type (only what frontend needs)
export type PublicUser = Pick<User, 'id' | 'email' | 'googleId' | 'githubId' | 'password' | 'createdAt'>;
