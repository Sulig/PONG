import { protectApiKey } from "../middleware/api-keys";
import express, { Response } from "express";
import { prisma } from "../prisma/client";
import { getRankedUsers } from "./matches";

const router = express.Router();

/**
 * @swagger
 * /api/v1/public/leaderboard:
 *   get:
 *     summary: Get the game leaderboard
 *     description: Returns a ranked list of all users based on their game performance
 *     tags: [Public]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *       500:
 *         description: Internal server error
 */
router.get("/leaderboard", protectApiKey, async (req, res) => {
    try {
        const ranked = await getRankedUsers();
        return res.status(200).json(ranked);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/public/stats/{id}:
 *   get:
 *     summary: Get player statistics
 *     description: Retrieve detailed statistics for a specific player including games played, wins, losses, rank, and achievements
 *     tags: [Public]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successfully retrieved player stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gamesPlayed:
 *                   type: integer
 *                 wins:
 *                   type: integer
 *                 losses:
 *                   type: integer
 *                 rank:
 *                   type: integer
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *       500:
 *         description: Internal server error
 */
router.get("/stats/:id", protectApiKey, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const matches = await prisma.match.findMany({
            where: {
                userId: userId,
                status: "closed"
            }
        });

        const gamesPlayed = matches.length;
        const wins = matches.filter(m => m.userScore > m.opponentScore).length;
        const losses = matches.filter(m => m.userScore < m.opponentScore).length;
        const ranked = await getRankedUsers();
        const rank = ranked.findIndex(r => r.userId === userId) + 1;
        const achievements = await prisma.achievement.findMany({
            where: {
                userId: userId
            }
        });

        return res.status(200).json({
            gamesPlayed,
            wins,
            losses,
            rank,
            achievements
        })


    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/public/feedback:
 *   post:
 *     summary: Submit feedback
 *     description: Submit feedback text from the authenticated user (max 500 characters)
 *     tags: [Public]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 500
 *                 description: Feedback message
 *                 example: "Great game, love the AI difficulty levels!"
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 text:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Missing or invalid feedback text
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *       500:
 *         description: Internal server error
 */
router.post("/feedback", protectApiKey, async (req, res) => {
    try {
        const userId = (req.user as { id: number }).id;
        const text = req.body.text;

        if (!text || typeof text !== 'string' || text.length > 500){
            return res.status(400).json({message: "Invalid feedback"});
        }

        const feedback = await prisma.feedback.create({
            data: {
                userId,
                text
            }
        });

        return res.status(201).json(feedback);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})



/**
 * @swagger
 * /api/v1/public/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile (name and/or bio)
 *     tags: [Public]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Display name
 *                 example: "JohnDoe"
 *               bio:
 *                 type: string
 *                 description: User biography (max 255 characters)
 *                 example: "Competitive pong player"
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *       400:
 *         description: Bad request - At least one field required
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *       500:
 *         description: Internal server error
 */
router.put("/profile", protectApiKey, async (req, res) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, bio } = req.body;

        // Validate that at least one field is provided
        if (!name && !bio) {
            return res.status(400).json({ message: "At least one field (name, bio) is required" });
        }

        // Build update object with only provided fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;

        // Update or create profile
        const profile = await prisma.profile.upsert({
            where: { userId: userId },
            update: updateData,
            create: {
                userId: userId,
                name: name || "Anonymous",
                bio: bio || ""
            }
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            profile: profile
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/public/account:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently delete the authenticated user's account and all associated data (profile, matches, achievements, API keys)
 *     tags: [Public]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/account", protectApiKey, async (req, res) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete all related data in a transaction
        await prisma.$transaction(async (tx) => {
            // Delete achievements (related to profile)
            await tx.achievement.deleteMany({
                where: { userId: userId }
            });

            // Delete matches
            await tx.match.deleteMany({
                where: { userId: userId }
            });

            // Delete API keys
            await tx.apiKeys.deleteMany({
                where: { userId: userId }
            });

            // Delete profile (will cascade from user deletion, but explicit is safer)
            await tx.profile.delete({
                where: { userId: userId }
            }).catch(() => {
                // Profile might not exist, that's okay
            });

            // Finally, delete the user
            await tx.user.delete({
                where: { id: userId }
            });
        });

        return res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;