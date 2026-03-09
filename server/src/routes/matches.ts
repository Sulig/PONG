import express, { Response } from "express";
import { prisma } from "../prisma/client";
import { protect } from "../middleware/auth";
import { PlayMode, AiLevel, Paddle } from "../prisma/generated/prisma/enums";

const router = express.Router();

const calculateLevel = (xp: number) => {
    let level = 1;
    let threshold = 200;
    while (xp >= threshold) {
        level++;
        threshold += (level + 1) * 100;
    }
    return level;
};

// Users are ranked by total wins
// If two users have the same number of wins, 
// we break the tie using win rate
export const getRankedUsers = async () => {
    const allUsers = await prisma.user.findMany({
        include: {
            profile: true,
            matches: { where: { status: "closed" } }
        }
    });

    return allUsers
        .map(u => {
            const wins = u.matches.filter(
                m => m.userScore > m.opponentScore
            ).length;

            const gamesPlayed = u.matches.length;

            const winRate = gamesPlayed === 0
                ? 0
                : wins / gamesPlayed;

            return {
                userId: u.id,
                name: u.profile?.name,
                avatarUrl: u.profile?.avatarUrl,
                level: u.profile?.level,
                wins,
                gamesPlayed,
                winRate: Number(winRate.toFixed(2))
            };
        })
        .sort((a, b) => {

            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }


            return b.winRate - a.winRate;
        });
};


/**
 * @swagger
 * /api/v1/matches:
 *   post:
 *     summary: Create a match
 *     description: Creates a new match for the authenticated user against AI or a guest.
 *     tags:
 *       - Matches
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestName:
 *                 type: string
 *                 description: Name of the guest player (only for LOCAL mode)
 *               winPoints:
 *                 type: integer
 *                 description: Points needed to win (default 5, minimum 1)
 *               playMode:
 *                 type: string
 *                 enum: [AI, LOCAL]
 *                 description: Game mode (default AI)
 *               aiLevel:
 *                 type: string
 *                 enum: [EASY, MID, HARD]
 *                 description: AI difficulty (default EASY)
 *               paddle:
 *                 type: string
 *                 enum: [LEFT, RIGHT]
 *                 description: Paddle side (default LEFT)
 *     responses:
 *       201:
 *         description: Match created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 guestName:
 *                   type: string
 *                 userScore:
 *                   type: integer
 *                 opponentScore:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                 winPoints:
 *                   type: integer
 *                 playMode:
 *                   type: string
 *                   enum: [AI, LOCAL]
 *                 aiLevel:
 *                   type: string
 *                   enum: [EASY, MID, HARD]
 *                 paddle:
 *                   type: string
 *                   enum: [LEFT, RIGHT]
 *       400:
 *         description: Validation error (invalid settings)
 *       500:
 *         description: Internal server error
 */
router.post("/", protect, async (req: any, res) => {
    try {
        const { guestName, winPoints, playMode, aiLevel, paddle } = req.body;

        if (playMode && !Object.values(PlayMode).includes(playMode)) {
            return res.status(400).json({ message: "Invalid play mode" });
        }
        if (aiLevel && !Object.values(AiLevel).includes(aiLevel)) {
            return res.status(400).json({ message: "Invalid AI level" });
        }
        if (paddle && !Object.values(Paddle).includes(paddle)) {
            return res.status(400).json({ message: "Invalid paddle" });
        }
        if (winPoints !== undefined && (typeof winPoints !== "number" || winPoints < 1)) {
            return res.status(400).json({ message: "Invalid win points" });
        }

        const match = await prisma.match.create({
            data: {
                userId: req.user.id,
                guestName,
                winPoints,
                playMode,
                aiLevel,
                paddle
            }
        });
        
        return res.status(201).json(match);


    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/matches/{id}:
 *   patch:
 *     summary: Update match result
 *     description: Updates a match with the final scores, marks it as closed, updates XP/level, and awards any earned achievements (first_game, first_win, perfect_game, five_games).
 *     tags:
 *       - Matches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userScore
 *               - opponentScore
 *             properties:
 *               userScore:
 *                 type: integer
 *                 description: Final score of the logged-in user
 *               opponentScore:
 *                 type: integer
 *                 description: Final score of the opponent
 *     responses:
 *       200:
 *         description: Match updated, profile XP/level updated, and achievements awarded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 match:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     opponent:
 *                       type: string
 *                     guestName:
 *                       type: string
 *                     userScore:
 *                       type: integer
 *                     opponentScore:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                 profile:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     level:
 *                       type: integer
 *                     xp:
 *                       type: integer
 *                 achievements:
 *                   type: array
 *                   description: Newly unlocked achievements (empty if none)
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       type:
 *                         type: string
 *                         enum: [first_game, first_win, perfect_game, five_games]
 *                       unlockedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Match is already closed
 *       403:
 *         description: Forbidden (match does not belong to the authenticated user)
 *       404:
 *         description: Match or profile not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", protect, async (req: any, res) => {
    try {
        const { userScore, opponentScore } = req.body;
        const matchId = Number(req.params.id);

        if (isNaN(matchId)) {
            return res.status(400).json({ message: "Invalid match ID" });
        }
        if (typeof userScore !== "number" || typeof opponentScore !== "number" ||
            !Number.isInteger(userScore) || !Number.isInteger(opponentScore) ||
            userScore < 0 || opponentScore < 0) {
            return res.status(400).json({ message: "Scores must be non-negative integers" });
        }

        const match = await prisma.match.findUnique({ where: { id: matchId } });
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
        if (match.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (match.status === "closed") {
            return res.status(400).json({ message: "Match is already closed" });
        }
        const userId = match.userId;

        const gainedXp = userScore > opponentScore ? 50 : 10;
        const profile = await prisma.profile.findFirst({
            where: { userId }
        });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        const newXp = gainedXp + profile.xp;

        const newLevel = calculateLevel(newXp);

        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: {
                level: newLevel,
                xp: newXp
            }
        });

        const updatedMatch = await prisma.match.update({
            where: { id: matchId },
            data: {
                userScore,
                opponentScore,
                status: "closed",
                completedAt: new Date()
            }
        });

        // achievements
        const closedMatches = await prisma.match.count({
            where: { userId, status: "closed" }
        });

        const won = userScore > opponentScore;
        const perfect = won && opponentScore === 0;

        const newAchievements: string[] = [];

        if (closedMatches === 1) newAchievements.push("first_game");
        if (closedMatches === 5) newAchievements.push("five_games");

        if (won) {
            const closedWonMatches = await prisma.match.findMany({
                where: { userId, status: "closed" }
            });
            const totalWins = closedWonMatches.filter(m => m.userScore > m.opponentScore).length;
            if (totalWins === 1) newAchievements.push("first_win");
        }

        if (perfect) newAchievements.push("perfect_game");

        let unlockedAchievements: any[] = [];

        if (newAchievements.length > 0) {
            await prisma.achievement.createMany({
                data: newAchievements.map(type => ({ userId, type })),
                skipDuplicates: true
            });

            unlockedAchievements = await prisma.achievement.findMany({
                where: { userId, type: { in: newAchievements } }
            });
        }

        return res.status(200).json({ match: updatedMatch, profile: updatedProfile, achievements: unlockedAchievements });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/matches/stats/{id}:
 *   get:
 *     summary: Get user statistics
 *     description: Returns game statistics for the authenticated user or a specific user by ID.
 *     tags:
 *       - Matches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *         description: User ID (optional, defaults to authenticated user)
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                   description: All achievements unlocked by the user
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       type:
 *                         type: string
 *                         enum: [first_game, first_win, perfect_game, five_games]
 *                       unlockedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/stats/:id{0,1}", protect, async (req: any, res) => {
    try {

        const userId = req.params.id ? Number(req.params.id) : req.user.id;

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
                userId : userId
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
 * /api/v1/matches/leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     description: Returns all users ranked by wins, with win rate as tiebreaker.
 *     tags:
 *       - Matches
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   avatarUrl:
 *                     type: string
 *                   level:
 *                     type: integer
 *                   wins:
 *                     type: integer
 *                   gamesPlayed:
 *                     type: integer
 *                   winRate:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/history/:id", protect, async (req: any, res) => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const matches = await prisma.match.findMany({
            where: { userId, status: "closed" },
            orderBy: { completedAt: "desc" },
        });

        return res.status(200).json(matches);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/leaderboard", protect, async (req, res) => {
    try {
        const ranked = await getRankedUsers();
        return res.status(200).json(ranked);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
