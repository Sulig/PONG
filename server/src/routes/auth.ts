import express, { CookieOptions, Request, Response } from "express";
import { prisma } from "../prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { protect } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";
import vaultClient from "../config/vault";
import passport from 'passport';

const router = express.Router();

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
};

const generateToken = (id: number): string => {
    const jwtSecret = vaultClient.getJwtSecret();
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '30d',
    });
};

function validateEmail(email: string): string | null {
    const trimmed = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) return null;
    return trimmed;
}

function validatePassword(password: string): boolean {
    if (password.length < 12) {
        return false;
    }
    return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}
//Register endpoint
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register
 *     description: Creates a new user and sets a JWT in an HTTP-only cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: nemo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nemo@example.com
 *               password:
 *                 type: string
 *                 minLength: 12
 *                 example: my_password_123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing the JWT
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: nemo
 *                     email:
 *                       type: string
 *                       example: nemo@example.com
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/register", authRateLimiter, async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body as {
            name?: unknown;
            email?: unknown;
            password?: unknown;
        };

        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid input" });
        }

        const trimmedName = name.trim();
        const normalizedEmail = validateEmail(email);
        if (!trimmedName || !normalizedEmail) {
            return res.status(400).json({ message: "Invalid name or email" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Invalid password. Password must be at least 12 characters long and contain at least one letter and one number.",
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: { email: normalizedEmail },
            select: { id: true },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                profile: {
                    create: {
                        name: trimmedName,
                        bio: "",
                    },
                },
            },
            select: {
                id: true,
                email: true,
                profile: { select: { name: true } },
            },
        });

        const token = generateToken(newUser.id);
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.profile?.name ?? trimmedName,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Error in register:", process.env.NODE_ENV === "development" ? error : "Registration error");
        return res.status(500).json({ message: "Internal server error" });
    }
});

//login checkpoint
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticates a user and sets a JWT in an HTTP-only cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: nemo
 *               password:
 *                 type: string
 *                 example: my_password
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing the JWT
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: nemo
 *       400:
 *         description: Invalid input or invalid credentials
 */

router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: unknown; password?: unknown };

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid input" });
        }

        const normalizedEmail = validateEmail(email);
        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const user = await prisma.user.findFirst({
            where: { email: normalizedEmail },
            select: {
                id: true,
                email: true,
                password: true,
                profile: { select: { name: true } },
            },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
		//to bypass error where bcrypt expect a string - but the schema.prisma
		//defines password as optional, aka string || null. Either we make 
		//pssword mandatory or check for null here	
		if (!user.password) {
    		return res.status(400).json({ message: "Invalid credentials" });
		}
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user.id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.profile?.name ?? null,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error in login:", process.env.NODE_ENV === "development" ? error : "Login error");
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the currently logged-in user based on the JWT cookie.
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: nemo
 *       401:
 *         description: Not authorized
 */
router.get('/me', protect, async (req: any, res: Response) => {
    res.json(req.user);
});

router.get('/users', async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
                profile: {
                    select: {
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        return res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Clears the authentication cookie.
 *     responses:
 *       200:
 *         description: Logged out
 *         headers:
 *           Set-Cookie:
 *             description: Clears the auth cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
router.post('/logout', (req: Request, res: Response) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
    res.json({ message: 'Logged out successfully' });
});

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     description: Redirects to Google for authentication.
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 */
router.get('/google', passport.authenticate("google", {
    scope: ['profile', 'email']
}));

/**
 * @swagger
 * /api/v1/auth/google/redirect:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google OAuth, sets JWT cookie, and redirects to frontend.
 *     responses:
 *       302:
 *         description: Redirects to frontend after successful authentication
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing the JWT
 *             schema:
 *               type: string
 *       401:
 *         description: Authentication failed
 */
router.get('/google/redirect', passport.authenticate('google', { session: false }), (req, res) => {
    const user = req.user as { id: number };
    const token = generateToken(user.id);
    res.cookie('token', token, cookieOptions);
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
});

/**
 * @swagger
 * /api/v1/auth/github:
 *   get:
 *     summary: GitHub OAuth login
 *     description: Redirects to GitHub for authentication.
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth consent screen
 */
router.get('/github', passport.authenticate("github", {
    scope: ['profile', 'email']
}));

/**
 * @swagger
 * /api/v1/auth/github/redirect:
 *   get:
 *     summary: GitHub OAuth callback
 *     description: Handles the callback from GitHub OAuth, sets JWT cookie, and redirects to frontend.
 *     responses:
 *       302:
 *         description: Redirects to frontend after successful authentication
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing the JWT
 *             schema:
 *               type: string
 *       401:
 *         description: Authentication failed
 */
router.get('/github/redirect', passport.authenticate('github', { session: false }), (req, res) => {
    const user = req.user as { id: number };
    const token = generateToken(user.id);
    res.cookie('token', token, cookieOptions);
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
});

export default router;
