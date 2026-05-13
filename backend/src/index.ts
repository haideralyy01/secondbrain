import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import mongoose from 'mongoose';
import { UserModel, ContentModel, LinkModel } from './db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import { PORT } from './config.js';
import { userMiddleware } from './middleware.js';
import { random } from './utils.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.post("/api/v1/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await UserModel.create({ name, email, password });
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(200).json({
            message: "User signed up successfully",
            user: { name: user.name, email: user.email },
            token
        });
    } catch (e: any) {
        console.error("Error signing up user:", e);
        if (e.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ msg: "User does not exist" });
        }

        if (user.password !== password) {
            return res.status(401).json({ msg: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
            }
         });
    } catch (e) {
        console.error("Error during signin:", e);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { title, link, body, type } = req.body;
    if (!title || !type) {
        return res.status(400).json({ message: "Title and type are required" });
    }
    try{
        const content = await ContentModel.create({
            userId: new mongoose.Types.ObjectId(req.userId),
            title,
            type,
            link: link || "",
            body: body || "",
            tags: [],
        });
        res.status(200).json({ message: "Content created successfully", content });
    } catch (e) {
        console.error("Error creating content:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/api/v1/contents", userMiddleware, async (req, res) => {
    const UserId = req.userId;
    try {
        const content = await ContentModel.find({ userId:  new mongoose.Types.ObjectId(UserId) }).populate('userId', '-password');
        res.status(200).json({
            content
        })
    } catch (e) {
        console.error("Error fetching content:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const { share } = req.body;
    if (share) {
        const shareLink = await LinkModel.create({
            userId:  new mongoose.Types.ObjectId(req.userId),
            hash: random(10)
        })
        res.status(200).json({
        message: "Share linkk created successfully",
        shareLink: shareLink.hash
    })
    } else {
        await LinkModel.deleteOne({
            userId: new mongoose.Types.ObjectId(req.userId)
        })
        res.status(200).json({
        message: "Share status updated successfully",
    })
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const Link = await LinkModel.findOne({
        hash
    });

    if (!Link) {
        return res.status(404).json({ message: "Shared brain not found" });
    }

    const content = await ContentModel.find({
        userId: Link.userId
    });

    const user = await UserModel.findOne({
        _id: Link.userId
    });

    res.status(200).json({
        email: user?.name,
        content: content
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});