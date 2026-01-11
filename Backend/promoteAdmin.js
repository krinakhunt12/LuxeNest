import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models using full paths to avoid issues with ES modules
const UserSchema = new mongoose.Schema({
    email: String,
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

dotenv.config();

const emailToPromote = process.argv[2];

if (!emailToPromote) {
    console.error('Please provide an email address. Example: node promoteAdmin.js admin@example.com');
    process.exit(1);
}

const promote = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxenest';
        console.log('Connecting to database...');
        await mongoose.connect(mongoUri);

        const user = await User.findOneAndUpdate(
            { email: emailToPromote.toLowerCase() },
            { role: 'ADMIN' },
            { new: true }
        );

        if (user) {
            console.log(`\n✅ SUCCESS: User ${emailToPromote} has been promoted to ADMIN!`);
            console.log(`Please log out and log back in on the website for changes to take effect.\n`);
        } else {
            console.log(`\n❌ ERROR: User with email ${emailToPromote} was not found in the database.`);
            console.log(`Make sure you have registered first.\n`);
        }
        process.exit();
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    }
};

promote();
