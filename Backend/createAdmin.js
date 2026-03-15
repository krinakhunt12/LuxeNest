import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import User model
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    emailVerified: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

dotenv.config();

const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxenest';
        console.log('Connecting to database...');
        await mongoose.connect(mongoUri);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@luxenest.com' });
        
        if (existingAdmin) {
            console.log('\n⚠️  Admin account already exists!');
            console.log('Email: admin@luxenest.com');
            console.log('Role: ADMIN');
            console.log('Status: Active');
            console.log('Created:', existingAdmin.createdAt);
            await mongoose.disconnect();
            return;
        }

        // Create admin account
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@luxenest.com',
            phone: '+1234567890',
            password: 'Admin@123',
            role: 'ADMIN',
            emailVerified: true,
            isActive: true
        });

        await adminUser.save();

        console.log('\n✅ SUCCESS: Admin account created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    admin@luxenest.com');
        console.log('🔑 Password: Admin@123');
        console.log('👤 Role:     ADMIN');
        console.log('✅ Status:    Active');
        console.log('📅 Created:  ' + new Date().toLocaleString());
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🌐 You can now log in to the admin panel at:');
        console.log('   http://localhost:5173/admin-auth');
        console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (error.code === 11000) {
            console.log('Admin account with this email already exists.');
        }
        process.exit(1);
    }
};

createAdmin();
