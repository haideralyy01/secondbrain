import mongoose, { model, Schema } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


(async () => {
    try {
        const dbUri = process.env.DB_CONNECTION_STRING;
        if (!dbUri) {
            throw new Error('DB_CONNECTION_STRING not set in .env');
        }
        await mongoose.connect(dbUri);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
})();

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String
});

const ContentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    link: String,
    tags: [{type: Schema.Types.ObjectId, ref: 'Tags'}]
});

const LinkSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    hash: String,
});

const ContentModel = model('Content', ContentSchema)
const UserModel = model('User', UserSchema);
const LinkModel = model('Link', LinkSchema);

export { UserModel, ContentModel, LinkModel }
