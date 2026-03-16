import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


import { ContentModel, LinkModel, UserModel } from './db.js';

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
    if (e.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

