import express from "express";
import { prisma } from "../prisma/client";
import { protect } from "../middleware/auth";
import { FriendStatus } from "../prisma/generated/prisma/enums";
import { onlineUsers } from "../socket/onlineUsers";

const router = express.Router();


/**
 * @swagger
 * /api/v1/friends:
 *   get:
 *     summary: List accepted friends
 *     description: Returns all accepted friends of the authenticated user with their profile info and online status
 *     tags: [Friends]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   friendshipId:
 *                     type: integer
 *                   since:
 *                     type: string
 *                     format: date-time
 *                   isOnline:
 *                     type: boolean
 *                   friend:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       profile:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           avatarUrl:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", protect, async (req, res) => {
    try {
        const userId = (req.user as { id: number }).id;

        const friendships = await prisma.friends.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
                status: FriendStatus.ACCEPTED,
            },
            include: {
                sender:   { select: { id: true, profile: { select: { name: true, avatarUrl: true } } } },
                receiver: { select: { id: true, profile: { select: { name: true, avatarUrl: true } } } },
            },
        });

        const result = friendships.map(f => {
            const friend = f.senderId === userId ? f.receiver : f.sender;
            return {
                friendshipId: f.id,
                since: f.createdAt,
                friend,
                isOnline: onlineUsers.has(friend.id),
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});


/**
 * @swagger
 * /api/v1/friends/request/{id}:
 *   post:
 *     summary: Send a friend request
 *     description: Send a friend request to the user with the given ID
 *     tags: [Friends]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to send the request to
 *     responses:
 *       201:
 *         description: Friend request sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 senderId:
 *                   type: integer
 *                 receiverId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   example: PENDING
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid ID or cannot send request to yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Friend request already exists
 *       500:
 *         description: Internal server error
 */
router.post("/request/:id", protect, async (req, res) => {
    try {
        const receiverId = parseInt(req.params.id);
        const senderId = (req.user as { id: number }).id;

        if (isNaN(receiverId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot send a friend request to yourself" });
        }

        const target = await prisma.user.findUnique({ where: { id: receiverId } });
        if (!target) {
            return res.status(404).json({ message: "User not found" });
        }

        const existing = await prisma.friends.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
        });
        if (existing) {
            return res.status(409).json({ message: "Friend request already exists" });
        }

        const request = await prisma.friends.create({
            data: { senderId, receiverId, status: FriendStatus.PENDING },
        });

        return res.status(201).json(request);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/friends/requests:
 *   get:
 *     summary: List incoming friend requests
 *     description: Returns all pending friend requests received by the authenticated user
 *     tags: [Friends]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of pending friend requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   senderId:
 *                     type: integer
 *                   receiverId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     example: PENDING
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   sender:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       profile:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           avatarUrl:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/requests", protect, async (req, res) => {
    try {
        const userId = (req.user as { id: number }).id;

        const requests = await prisma.friends.findMany({
            where: {
                receiverId: userId,
                status: FriendStatus.PENDING,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        profile: { select: { name: true, avatarUrl: true } },
                    },
                },
            },
        });

        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/friends/requests/sent:
 *   get:
 *     summary: List outgoing friend requests
 *     tags: [Friends]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of sent pending friend requests
 */
router.get("/requests/sent", protect, async (req, res) => {
    try {
        const userId = (req.user as { id: number }).id;

        const sent = await prisma.friends.findMany({
            where: {
                senderId: userId,
                status: FriendStatus.PENDING,
            },
            include: {
                receiver: {
                    select: {
                        id: true,
                        profile: { select: { name: true, avatarUrl: true } },
                    },
                },
            },
        });

        return res.status(200).json(sent);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/friends/accept/{id}:
 *   put:
 *     summary: Accept a friend request
 *     description: Accept a pending friend request from the user with the given ID
 *     tags: [Friends]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose request to accept
 *     responses:
 *       200:
 *         description: Friend request accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend request accepted
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Friend request not found
 *       500:
 *         description: Internal server error
 */
router.put("/accept/:id", protect, async (req, res) => {
    try {
        const userId = (req.user as { id: number }).id;
        const senderId = parseInt(req.params.id);

        if (isNaN(senderId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const request = await prisma.friends.findFirst({
            where: {
                senderId: senderId,
                receiverId: userId,
                status: FriendStatus.PENDING,
            },
        });

        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        await prisma.friends.update({
            where: { id: request.id },
            data: { status: FriendStatus.ACCEPTED },
        });

        return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/friends/{id}:
 *   delete:
 *     summary: Remove a friend or reject/cancel a request
 *     description: Remove an accepted friend, reject an incoming request, or cancel an outgoing request
 *     tags: [Friends]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the other user
 *     responses:
 *       200:
 *         description: Friend removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend removed
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not a friend
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", protect, async (req, res) => {
    try {
        const userId = (req.user as { id: number }).id;
        const targetId = parseInt(req.params.id);

        if (isNaN(targetId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const result = await prisma.friends.deleteMany({
            where: {
                OR: [
                    { senderId: userId,   receiverId: targetId },
                    { senderId: targetId, receiverId: userId   },
                ],
            },
        });

        if (result.count === 0) {
            return res.status(404).json({ message: "Not a friend" });
        }

        return res.status(200).json({ message: "Friend removed" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
