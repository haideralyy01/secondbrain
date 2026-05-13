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
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

const authSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signinSchema = authSchema.pick({ email: true, password: true });

const contentSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    type: z.enum(["youtube", "twitter", "note"]),
    link: z.string().trim().optional(),
    body: z.string().trim().optional(),
});

function getValidationMessage(error: z.ZodError) {
    return error.issues[0]?.message || "Validation failed";
}

app.post("/api/v1/signup", async (req, res) => {
    const parsed = authSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: getValidationMessage(parsed.error) });
    }

    const { name, email, password } = parsed.data;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(200).json({
            message: "User signed up successfully",
            user: { name: user.name, email: user.email },
            token
        });
    } catch (e: any) {
        console.error("Error signing up user:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: getValidationMessage(parsed.error) });
    }

    const { email, password } = parsed.data;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "User does not exist" });
        }

        const isPasswordValid = user.password.startsWith("$2")
            ? await bcrypt.compare(password, user.password)
            : user.password === password;

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
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
    const parsed = contentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: getValidationMessage(parsed.error) });
    }

    const { title, link, body, type } = parsed.data;
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
        const userId = new mongoose.Types.ObjectId(req.userId);
        // Use an atomic upsert to avoid duplicate-key errors when multiple requests happen concurrently
        const link = await LinkModel.findOneAndUpdate(
            { userId },
            { $setOnInsert: { hash: random(10), userId } },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Share link created successfully",
            shareLink: link?.hash,
        });
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
        name: user?.name,
        email: user?.email,
        content: content
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});