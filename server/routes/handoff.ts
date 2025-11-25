import { Router, Request, Response } from "express";
import { connectToDatabase } from "../lib/mongodb";
import { ChatSession, ChatMessage } from "../models";

const router = Router();

// Get active sessions for a Peer Advocate
router.get("/active", async (req: Request, res: Response) => {
    try {
        const peerAdvocateId = req.query.peerAdvocateId as string;

        if (!peerAdvocateId) {
            return res.status(400).json({ ok: false, error: "peerAdvocateId is required" });
        }

        await connectToDatabase();

        const activeSessions = await ChatSession.find({
            status: "active_peer",
            peerAdvocateId: peerAdvocateId
        }).sort({ lastMessageAt: -1 }); // Most recent first

        return res.json({ ok: true, sessions: activeSessions });
    } catch (error) {
        console.error("❌ Error fetching active sessions:", error);
        return res.status(500).json({ ok: false, error: "Failed to fetch active sessions" });
    }
});

// Get messages for a specific session as a Peer Advocate
router.get("/sessions/:sessionId/messages", async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const peerAdvocateId = req.query.peerAdvocateId as string;

        if (!sessionId || !peerAdvocateId) {
            return res.status(400).json({ ok: false, error: "sessionId and peerAdvocateId are required" });
        }

        await connectToDatabase();

        // Verify the session belongs to this peer advocate
        const session = await ChatSession.findOne({ sessionId, peerAdvocateId }).lean();
        if (!session) {
            return res.status(404).json({ ok: false, error: "Session not found or access denied" });
        }

        // Fetch all messages for this session
        const messages = await ChatMessage.find({ sessionId })
            .sort({ createdAt: 1 })
            .lean();

        return res.json({ ok: true, messages, session });
    } catch (error) {
        console.error("❌ Error fetching messages for peer advocate:", error);
        return res.status(500).json({ ok: false, error: "Failed to fetch messages" });
    }
});

// Send a message as a Peer Advocate
router.post("/message", async (req: Request, res: Response) => {
    try {
        const { sessionId, peerAdvocateId, message } = req.body;

        if (!sessionId || !peerAdvocateId || !message) {
            return res.status(400).json({ ok: false, error: "Missing required fields" });
        }

        await connectToDatabase();

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ ok: false, error: "Session not found" });
        }

        if (session.peerAdvocateId !== peerAdvocateId) {
            return res.status(403).json({ ok: false, error: "Not authorized for this session" });
        }

        // Log the message as 'peer'
        await ChatMessage.create({
            sessionId,
            peerAdvocateId: peerAdvocateId, // Store PA ID in peerAdvocateId field
            role: "peer",
            source: "peer",
            content: message,
            createdAt: new Date()
        });

        // Update session
        session.lastMessageAt = new Date();
        session.updatedAt = new Date();
        await session.save();

        return res.json({ ok: true });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        return res.status(500).json({ ok: false, error: "Failed to send message" });
    }
});

// Request a handoff to a human
router.post("/request", async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ ok: false, error: "sessionId is required" });
        }

        await connectToDatabase();

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ ok: false, error: "Session not found" });
        }

        // Update status to handoff_pending
        session.status = "handoff_pending";
        session.handoffRequestedAt = new Date();
        session.updatedAt = new Date();
        await session.save();

        console.log(`🔄 Handoff requested for session ${sessionId}`);

        return res.json({ ok: true, message: "Handoff requested" });
    } catch (error) {
        console.error("❌ Error requesting handoff:", error);
        return res.status(500).json({ ok: false, error: "Failed to request handoff" });
    }
});

// Get pending handoff requests (for Peer Advocates)
router.get("/pending", async (req: Request, res: Response) => {
    try {
        const peerAdvocateId = req.query.peerAdvocateId as string;

        if (!peerAdvocateId) {
            return res.status(400).json({ ok: false, error: "peerAdvocateId is required" });
        }

        await connectToDatabase();

        // Find sessions that are pending handoff and NOT declined by this PA
        const pendingSessions = await ChatSession.find({
            status: "handoff_pending",
            declinedBy: { $ne: peerAdvocateId }
        }).sort({ handoffRequestedAt: 1 }); // Oldest first

        return res.json({ ok: true, sessions: pendingSessions });
    } catch (error) {
        console.error("❌ Error fetching pending handoffs:", error);
        return res.status(500).json({ ok: false, error: "Failed to fetch pending handoffs" });
    }
});

// Accept a handoff
router.post("/accept", async (req: Request, res: Response) => {
    try {
        const { sessionId, peerAdvocateId, peerAdvocateName } = req.body;

        if (!sessionId || !peerAdvocateId) {
            return res.status(400).json({ ok: false, error: "sessionId and peerAdvocateId are required" });
        }

        await connectToDatabase();

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ ok: false, error: "Session not found" });
        }

        if (session.status !== "handoff_pending") {
            return res.status(400).json({ ok: false, error: "Session is not pending handoff" });
        }

        // Assign to PA
        session.status = "active_peer";
        session.type = "peer";
        session.peerAdvocateId = peerAdvocateId;
        // We don't store peerAdvocateName in the session model currently, but we could if needed.
        // For now, we rely on the ID.
        session.updatedAt = new Date();
        await session.save();

        console.log(`✅ Session ${sessionId} accepted by PA ${peerAdvocateId}`);

        return res.json({ ok: true, message: "Handoff accepted" });
    } catch (error) {
        console.error("❌ Error accepting handoff:", error);
        return res.status(500).json({ ok: false, error: "Failed to accept handoff" });
    }
});

// Decline a handoff
router.post("/decline", async (req: Request, res: Response) => {
    try {
        const { sessionId, peerAdvocateId } = req.body;

        if (!sessionId || !peerAdvocateId) {
            return res.status(400).json({ ok: false, error: "sessionId and peerAdvocateId are required" });
        }

        await connectToDatabase();

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ ok: false, error: "Session not found" });
        }

        // Add PA to declinedBy list
        if (!session.declinedBy) {
            session.declinedBy = [];
        }

        if (!session.declinedBy.includes(peerAdvocateId)) {
            session.declinedBy.push(peerAdvocateId);
            session.updatedAt = new Date();
            await session.save();
        }

        console.log(`🚫 Session ${sessionId} declined by PA ${peerAdvocateId}`);

        return res.json({ ok: true, message: "Handoff declined" });
    } catch (error) {
        console.error("❌ Error declining handoff:", error);
        return res.status(500).json({ ok: false, error: "Failed to decline handoff" });
    }
});

// Check status (for student polling)
router.get("/status/:sessionId", async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        await connectToDatabase();

        const session = await ChatSession.findOne({ sessionId }).select("status peerAdvocateId");

        if (!session) {
            return res.status(404).json({ ok: false, error: "Session not found" });
        }

        return res.json({
            ok: true,
            status: session.status,
            peerAdvocateId: session.peerAdvocateId
        });
    } catch (error) {
        console.error("❌ Error checking status:", error);
        return res.status(500).json({ ok: false, error: "Failed to check status" });
    }
});

// End/close a chat session
router.post("/end", async (req: Request, res: Response) => {
    try {
        const { sessionId, userId, peerAdvocateId } = req.body;

        if (!sessionId || (!userId && !peerAdvocateId)) {
            return res.status(400).json({ ok: false, error: "sessionId and either userId or peerAdvocateId are required" });
        }

        await connectToDatabase();

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ ok: false, error: "Session not found" });
        }

        // Verify authorization - either the student (userId) or the assigned peer advocate can end the chat
        const isAuthorized = (userId && session.userId === userId) ||
            (peerAdvocateId && session.peerAdvocateId === peerAdvocateId);

        if (!isAuthorized) {
            return res.status(403).json({ ok: false, error: "Not authorized to end this session" });
        }

        // Only allow ending active peer sessions
        if (session.status !== "active_peer") {
            return res.status(400).json({ ok: false, error: "Can only end active peer advocate sessions" });
        }

        // Update session status to closed
        session.status = "closed";
        session.updatedAt = new Date();
        await session.save();

        console.log(`🔚 Chat session ${sessionId} ended by ${userId ? 'student' : 'peer advocate'}`);

        return res.json({ ok: true, message: "Chat session ended successfully" });
    } catch (error) {
        console.error("❌ Error ending chat session:", error);
        return res.status(500).json({ ok: false, error: "Failed to end chat session" });
    }
});

export default router;
