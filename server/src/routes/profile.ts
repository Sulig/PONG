import express, { Response } from "express";
import { prisma } from "../prisma/client";
import { protect } from "../middleware/auth";
import { onlineUsers } from "../socket/onlineUsers";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads/avatars"))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})



const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("Only PNG and JPEG files are allowed"));
    }
};

const upload = multer({storage, fileFilter});

/**
 * @swagger
 * /api/v1/profile/me:
 *   get:
 *     summary: Get current user's profile
 *     description: Returns the authenticated user's profile.
 *     tags:
 *       - Profile
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.get("/me", protect, async (req: any, res: Response) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user.id },
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/profile/{id}:
 *   get:
 *     summary: Get a user's public profile
 *     description: Returns the public profile for the given user ID.
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", protect, async (req: any, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json(profile);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/profile/upload:
 *   patch:
 *     summary: Upload avatar
 *     description: Uploads a new avatar image for the authenticated user. Only PNG and JPEG files are accepted.
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *       400:
 *         description: No file uploaded or invalid file type
 *       500:
 *         description: Internal server error
 */
router.patch("/upload", protect, upload.single("avatar"), async (req: any, res) => {
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const updated = await prisma.profile.update({
            where: {userId: req.user.id},
            data: {
                avatarUrl: `/avatars/${req.file.filename}`
            }
        })

        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})

/**
 * @swagger
 * /api/v1/profile/me:
 *   patch:
 *     summary: Update profile
 *     description: Updates the authenticated user's profile name and/or bio.
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Display name (cannot be empty)
 *               bio:
 *                 type: string
 *                 description: User bio (max 255 characters)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *       400:
 *         description: Validation error (invalid name or bio)
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.patch("/me", protect, async (req: any, res: Response) => {
    try {
        const { name, bio } = req.body as {
      name?: string;
      bio?: string;
    };

    // ---- validation ----
    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ message: "name must be a string" });
    }
    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({ message: "bio must be a string" });
    }

    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({ message: "name cannot be empty" });
    }

   
    if (bio !== undefined && bio.length > 255) {
      return res.status(400).json({ message: "bio must be 255 characters or less" });
    }

    
    const existing = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Profile not found" });
    }

    
    const updated = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(bio !== undefined ? { bio } : {}),
      },
    });

    return res.status(200).json(updated);
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/profile/password:
 *   patch:
 *     summary: Update password
 *     description: Updates the authenticated user's password.
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password
 *               newPassword:
 *                 type: string
 *                 description: The new password (minimum 12 characters)
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated
 *       400:
 *         description: Validation error (missing fields or password too short)
 *       401:
 *         description: Old password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/password", protect, async (req: any, res) => {
    try {
        const {oldPassword, newPassword} = req.body;

        if (!oldPassword || typeof oldPassword !== "string") {
            return res.status(400).json({ message: "Old password is required" });
        }

        if (!newPassword || typeof newPassword !== "string") {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
		
		//to bypass error where bcrypt expect a string - but the schema.prisma
		//defines password as optional, aka string || null. Either we make 
		//pssword mandatory or check for null here	
		if (!user.password) {
    		return res.status(400).json({ message: "Invalid credentials" });
		}

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        if (newPassword.length < 12 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            return res.status(400).json({ message: 'Password must be at least 12 characters long and contain at least one letter and one number.'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id : req.user.id
            },
            data: {
                password: hashedPassword
            }
        });
        return res.status(200).json({message: "Password updated"});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/v1/profile/{id}:
 *   get:
 *     summary: Get a user's profile by ID
 *     description: Returns the profile of any user by their ID, including their online status
 *     tags:
 *       - Profile
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 level:
 *                   type: integer
 *                 xp:
 *                   type: integer
 *                 isOnline:
 *                   type: boolean
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", protect, async (req: any, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({
            ...profile,
            isOnline: onlineUsers.has(userId),
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
