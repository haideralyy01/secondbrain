import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
const secret = process.env.JWT_SECRET;
if (!secret) {
    console.error("JWT_SECRET is not set in environment variables");
    process.exit(1);
}
export const JWT_SECRET: string = secret;