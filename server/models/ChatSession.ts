import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSession extends Document {
    userId: string;
    sessionId: string;
    type: 'agent' | 'peer';
    peerAdvocateId?: string;
    status: 'open' | 'closed' | 'handoff_pending' | 'active_peer';
    createdAt: Date;
    updatedAt: Date;
    lastMessageAt?: Date;
    handoffRequestedAt?: Date;
    declinedBy?: string[];
}

const ChatSessionSchema = new Schema<IChatSession>(
    {
        userId: {
            type: String,
            required: false, // Optional for anonymous users
            index: true,
            trim: true,
        },
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['agent', 'peer'],
            required: true,
            default: 'agent',
        },
        peerAdvocateId: {
            type: String,
            required: false,
            index: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['open', 'closed', 'handoff_pending', 'active_peer'],
            default: 'open',
        },
        handoffRequestedAt: {
            type: Date,
            required: false,
        },
        declinedBy: {
            type: [String],
            default: [],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        lastMessageAt: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: false, // We're managing timestamps manually
    }
);

// Compound index for user-based queries with time sorting
ChatSessionSchema.index({ userId: 1, createdAt: -1 });

// Index for peer advocate queries
ChatSessionSchema.index({ peerAdvocateId: 1, createdAt: -1 });

// Index for filtering by type
ChatSessionSchema.index({ type: 1, createdAt: -1 });

// Export the model
export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
