import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import vaultClient from "../config/vault";
import { prisma } from "../prisma/client";

export const protect = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Get JWT secret from Vault
        const jwtSecret = vaultClient.getJwtSecret();

        // Verify token
        const decoded = jwt.verify(token, jwtSecret) as { id: number };

        const user = await prisma.user.findFirst({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                googleId: true,
                githubId: true,
                createdAt: true,
                profile: { select: { name: true } },
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.profile?.name ?? null,
            googleId: user.googleId,
            githubId: user.githubId,
            createdAt: user.createdAt,
        };
        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        console.error('Error in protect middleware:', process.env.NODE_ENV === 'development' ? err : 'Auth error');
        res.status(401).json({ message: "Not authorized" });
    }
};
