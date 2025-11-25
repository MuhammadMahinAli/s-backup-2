import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name: string;
    role: 'student' | 'peer' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['student', 'peer', 'admin'],
            default: 'student',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false, // We're managing timestamps manually
    }
);

// Index for efficient email lookups and uniqueness
UserSchema.index({ email: 1 }, { unique: true });

// Update updatedAt before saving
UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Export the model
export const User = mongoose.model<IUser>('User', UserSchema);
