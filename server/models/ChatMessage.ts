import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
    sessionId: string;
    userId?: string;
    peerAdvocateId?: string;
    role: 'user' | 'agent' | 'peer';
    source: 'agent' | 'peer';
    content: string;
    createdAt: Date;
    readAt?: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
    {
        sessionId: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        userId: {
            type: String,
            required: false,
            index: true,
            trim: true,
        },
        peerAdvocateId: {
            type: String,
            required: false,
            index: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'agent', 'peer'],
            required: true,
        },
        source: {
            type: String,
            enum: ['agent', 'peer'],
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        readAt: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: false, // We're managing createdAt manually
    }
);

// Compound index for efficient session message queries
ChatMessageSchema.index({ sessionId: 1, createdAt: 1 });

// Index for user-based queries
ChatMessageSchema.index({ userId: 1, createdAt: -1 });

// Export the model
export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
