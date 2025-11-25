import { Router, Request, Response } from "express";
import { connectToDatabase } from "../lib/mongodb";
import { ChatSession, ChatMessage } from "../models";

const router = Router();

/**
 * GET /api/chat/sessions
 * Returns all chat sessions for the authenticated user
 * Query params:
 *   - type: optional filter by "agent" or "peer"
 */
router.get("/sessions", async (req: Request, res: Response) => {
    try {
        // Extract userId from auth middleware or request
        // For now, we'll accept it from query/body until auth is fully implemented
        const userId = req.query.userId as string || req.body.userId;

        if (!userId) {
            return res.status(400).json({
                ok: false,
                error: "userId is required"
            });
        }

        await connectToDatabase();

        // Build query filter
        const filter: any = { userId };

        // Optional type filter
        const typeFilter = req.query.type as string;
        if (typeFilter && (typeFilter === "agent" || typeFilter === "peer")) {
            filter.type = typeFilter;
        }

        // Fetch sessions sorted by most recent activity
        const sessions = await ChatSession.find(filter)
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .select("sessionId type status lastMessageAt peerAdvocateId createdAt updatedAt")
            .lean();

        return res.json({
            ok: true,
            sessions
        });
    } catch (error) {
        console.error("❌ Error fetching chat sessions:", error);
        return res.status(500).json({
            ok: false,
            error: "Failed to fetch chat sessions"
        });
    }
});

/**
 * GET /api/chat/:sessionId/messages
 * Returns all messages for a specific session
 * Auth: User can only see their own sessions
 * NOTE: This route is primarily for student dashboard
 * Peer advocates should use /api/chat/handoff/sessions/:sessionId/messages instead
 */
router.get("/:sessionId/messages", async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const userId = req.query.userId as string || req.body.userId;

        if (!sessionId || !userId) {
            return res.status(400).json({
                ok: false,
                error: "sessionId and userId are required"
            });
        }

        await connectToDatabase();

        // Verify session belongs to user
        const session = await ChatSession.findOne({ sessionId, userId }).lean();

        if (!session) {
            return res.status(404).json({
                ok: false,
                error: "Session not found or access denied"
            });
        }

        // Fetch messages sorted by creation time
        const messages = await ChatMessage.find({ sessionId })
            .sort({ createdAt: 1 })
            .lean();

        return res.json({
            ok: true,
            messages,
            session
        });
    } catch (error: any) {
        console.error("❌ Error fetching chat messages:", error);
        return res.status(500).json({
            ok: false,
            error: "Failed to fetch messages",
            details: error?.message || "Unknown error"
        });
    }
});

export default router;
