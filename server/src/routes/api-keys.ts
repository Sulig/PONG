import express, {Request, Response} from "express"
import {randomBytes, createHash} from "node:crypto"
import {protect} from "../middleware/auth"
import {prisma} from "../prisma/client"

const router = express.Router();

const hashApiKey =  (apiKey: string) => {

    const hasher = createHash("sha256");

    hasher.update(apiKey);

    const hashedApiKey = hasher.digest("hex");

    return hashedApiKey;
}

const generateApiKey = () => {
    
    const plainApiKey = randomBytes(16).toString("hex");
    const hashedApiKey =  hashApiKey(plainApiKey);
    
    return {
        hashed: hashedApiKey,
        plain: plainApiKey
    }
}

router.post("/", protect, async (req: any, res) => {

    try {
    const {name, expiresAt} = req.body;

    const {hashed, plain} =  generateApiKey();

    //store hashed in db
    //expiresAt example in frontend: - expiresAt: date.toISOString()  like "2024-12-31T00:00:00.000Z"
    //the backend receives a ISOstring or null if there is no expiration
    await prisma.apiKeys.create({
        data: {
            userId: req.user.id,
            name: name,
            hashedKey: hashed,
            expiresAt: expiresAt ? new Date(expiresAt) : null 
        }
    })

    //return plain to user
    res.json({
        apiKey: {
            plainKey: plain,
            name: name,
            expiresAt: expiresAt
        }
    })

}
catch(error) {
        res.status(500).json({ message: "Failed to create API key" });
    }
});

router.get("/", protect, async (req, res) => {

    //put inside try catch 

   const user = req.user as { id: number };
    
    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const apiKeys = await prisma.apiKeys.findMany({
        where: {
            userId : user.id
        }
    })
    res.json({apiKeys});
});

//endpoint to delete api key
router.delete("/:id", protect,  async (req, res) => {

    try {

        const keyId = parseInt(req.params.id);

        //check if key exists and if it does not return error

        await prisma.apiKeys.delete({
            where: {
                id: keyId
            }
        })

        res.json({ message: "API key deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to delete API key"});
    }
})

export default router;
