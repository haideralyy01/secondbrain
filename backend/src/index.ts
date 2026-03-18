import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { UserModel } from './db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await UserModel.create({ username, password });
        res.status(200).json({
            message: "User signed up successfully",
            user: { username: user.username }
        });
    } catch (e: any) {
        console.error("Error signing up user:", e);
        if (e.code === 11000) {
            return res.status(409).json({ message: "Username already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(403).json({ msg: "User does not exist" });
        }

        if (user.password !== password) {
            return res.status(401).json({ msg: "Invalid password" });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({ msg: "JWT secret is not set in environment variables" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.status(200).json({ token });
    } catch (e) {
        console.error("Error during signin:", e);
        res.status(500).json({ msg: "Internal server error" });
    }
});