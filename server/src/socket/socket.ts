import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import vaultClient from "../config/vault";
import { prisma } from "../prisma/client";
import { onlineUsers } from "./onlineUsers";
import { FriendStatus } from "../prisma/generated/prisma/enums";

export function initSocket(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "https://localhost",
            credentials: true,
        },
    });

    // Auth middleware — verify JWT from cookie
    io.use((socket, next) => {
        const cookie = socket.handshake.headers.cookie;
        const token = cookie
            ?.split(";")
            .find(c => c.trim().startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        try {
            const decoded = jwt.verify(token, vaultClient.getJwtSecret()) as { id: number };
            socket.data.userId = decoded.id;
            next();
        } catch {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", async (socket) => {
        const userId: number = socket.data.userId;

        // Join personal room and mark as online
        socket.join(`user:${userId}`);
        onlineUsers.add(userId);

        // Notify friends this user is now online
        const friendIds = await getFriendIds(userId);
        friendIds.forEach(friendId => {
            io.to(`user:${friendId}`).emit("friend:online", { userId });
        });

        socket.on("disconnect", async () => {
            onlineUsers.delete(userId);

            // Notify friends this user went offline
            const friendIds = await getFriendIds(userId);
            friendIds.forEach(friendId => {
                io.to(`user:${friendId}`).emit("friend:offline", { userId });
            });
        });
    });

    return io;
}

async function getFriendIds(userId: number): Promise<number[]> {
    const friendships = await prisma.friends.findMany({
        where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
            status: FriendStatus.ACCEPTED,
        },
        select: { senderId: true, receiverId: true },
    });
    return friendships.map(f => f.senderId === userId ? f.receiverId : f.senderId);
}
