import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { UserModel, ContentModel } from './db.js';

dotenv.config();

async function seed() {
    try {
        const dbUri = process.env.DB_CONNECTION_STRING;
        if (!dbUri) {
            throw new Error('DB_CONNECTION_STRING not set in .env');
        }

        // Ensure we are connected
        if (mongoose.connection.readyState !== 1) {
            console.log("Connecting to database...");
            await mongoose.connect(dbUri);
        }

        const email = 'haideralyy01@gmail.com';
        const rawPassword = 'Haideraly@15';
        const name = 'Haider Ali';

        console.log(`Checking if user ${email} exists...`);
        let user = await UserModel.findOne({ email });

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        if (!user) {
            console.log(`Creating user ${email}...`);
            user = await UserModel.create({
                name,
                email,
                password: hashedPassword
            });
            console.log("User created successfully!");
        } else {
            console.log(`User ${email} already exists. Updating password...`);
            user.password = hashedPassword;
            await user.save();
            console.log("User password updated successfully!");
        }

        const userId = user._id;

        console.log("Clearing existing content for this user...");
        await ContentModel.deleteMany({ userId });

        console.log("Seeding new content...");

        const contents = [
            // YouTube Videos
            {
                userId,
                title: "Build a Second Brain with Notion",
                type: "youtube",
                link: "https://www.youtube.com/watch?v=KzRTM76N46o",
                body: "A great guide on how to implement the BASB (Build a Second Brain) system using Notion for note-taking and knowledge management.",
                tags: []
            },
            {
                userId,
                title: "How I use Claude 3.5 Sonnet to Code 10x Faster",
                type: "youtube",
                link: "https://www.youtube.com/watch?v=J737482_fFA",
                body: "Demonstration of prompt engineering, code generation, and iterative design using Claude 3.5 Sonnet.",
                tags: []
            },
            {
                userId,
                title: "Web3 & Blockchain Tutorial for Beginners",
                type: "youtube",
                link: "https://www.youtube.com/watch?v=coQ5dg8wM2o",
                body: "A comprehensive video explaining the fundamentals of Web3, blockchain, smart contracts, and decentralized applications.",
                tags: []
            },
            // Twitter Tweets
            {
                userId,
                title: "Claude 3.5 Sonnet Announcement",
                type: "twitter",
                link: "https://twitter.com/AnthropicAI/status/1803803276632420485",
                body: "Anthropic releases Claude 3.5 Sonnet, setting new industry benchmarks for graduate-level reasoning, undergraduate-level knowledge, and coding proficiency.",
                tags: []
            },
            {
                userId,
                title: "Gemini 1.5 Pro Update",
                type: "twitter",
                link: "https://twitter.com/GoogleDeepMind/status/1790432321481105740",
                body: "Google DeepMind shares details about Gemini 1.5 Pro's 2M token context window capability and its applications in multimodal processing.",
                tags: []
            },
            {
                userId,
                title: "Web3 Ethereum Roadmap",
                type: "twitter",
                link: "https://twitter.com/vitallik_eth/status/1234567890123456789",
                body: "Vitalik Buterin discusses the upcoming Ethereum upgrades, emphasizing scaling solutions, rollups, and security improvements.",
                tags: []
            },
            // Notes about AI, Web3, Claude, Gemini, ChatGPT
            {
                userId,
                title: "Thoughts on Gemini 1.5 Pro",
                type: "note",
                link: "",
                body: "Google's Gemini 1.5 Pro features an industry-leading 2 million token context window. This makes it incredibly powerful for analyzing entire repositories, long videos, or hundreds of documents at once.",
                tags: []
            },
            {
                userId,
                title: "Claude 3.5 Sonnet Capabilities",
                type: "note",
                link: "",
                body: "Claude 3.5 Sonnet has set a new benchmark for code intelligence. It generates clean, production-ready code, exhibits strong reasoning capabilities, and supports an interactive Artifacts UI that makes web development highly collaborative.",
                tags: []
            },
            {
                userId,
                title: "Web3 & Decentralization Notes",
                type: "note",
                link: "",
                body: "Web3 represents the decentralized era of the web, driven by blockchain technologies, smart contracts, and tokenomics. Key technologies include Solidity, Rust, IPFS, and zero-knowledge proofs.",
                tags: []
            },
            {
                userId,
                title: "Maximizing ChatGPT Performance",
                type: "note",
                link: "",
                body: "Custom instructions and system prompts are vital for ChatGPT. By defining output styles, constraints, and context in advance, you can dramatically improve coding help and text generation.",
                tags: []
            },
            {
                userId,
                title: "The Paradigm Shift of AI Agents",
                type: "note",
                link: "",
                body: "The next frontier of AI is autonomous agents that can plan, execute terminal commands, interact with databases, and collaborate with other agents to solve high-level goals without human intervention.",
                tags: []
            }
        ];

        const createdContents = await ContentModel.insertMany(contents);
        console.log(`Successfully seeded ${createdContents.length} items!`);

    } catch (error) {
        console.error("Error seeding the database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

seed();
