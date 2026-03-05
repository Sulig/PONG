import { Request, Response, NextFunction } from "express";
import {createHash} from "node:crypto"
import {prisma} from "../prisma/client";

export const protectApiKey = async (req: any, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers.authorization; //check capitalization for when doing it from frontend
        if (!authHeader){
            return res.status(401).json({message : "Not Authorized: missing API key header "});
        }
        
        const apiKey = authHeader.replace("Bearer ", ""); //extract only the key, no "bearer"

        if (!apiKey) {
            return res.status(401).json({message : "Not Authorized: missing API key"});
        }

        //check if hashed key is in database
        const hashedKey = createHash("sha256").update(apiKey).digest("hex");

        const keyRecord = await prisma.apiKeys.findFirst({
            where: {
                hashedKey : hashedKey
            },
            include: {
                user: true  // This fetches the user who owns the key
        }})
        
        if(!keyRecord){
            return res.status(401).json({message : "Not Authorized: API key does not match"});
        }

        
        if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
            return res.status(401).json({ message: "Not Authorized: API key expired" });
        }

        req.apiKey = req.keyRecord;
        req.user = keyRecord.user;

        next();

        
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}
