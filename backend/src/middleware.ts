import type { NextFunction, Request, Response }  from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    try {
        if (!token) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (!JWT_SECRET) {
          return res.status(500).json({ message: "JWT secret is not set in environment variables" });
        }
        const decodedData = jwt.verify(token as string, JWT_SECRET) as {id: string};
        req.userId = decodedData.id;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Unauthorized", });
    }
} 