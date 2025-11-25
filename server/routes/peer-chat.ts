import { Router, Request, Response } from "express";
import { connectToDatabase } from "../lib/mongodb";
import { ChatSession, ChatMessage } from "../models";

const router = Router();

/**
 * Generate a random string for session IDs
 */
function generateRandomString(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * POST /api/peer-chat/start
 * Start a new peer advocate chat session
 * Body: { userId?, peerAdvocateId? }
 */
router.post("/start", async (req: Request, res: Response) => {
    try {
        const { userId, peerAdvocateId } = req.body;

        await connectToDatabase();

        // Generate session ID: "peer-" + timestamp + random
        const sessionId = `peer-${Date.now()}-${generateRandomString()}`;

        // Create new peer chat session
        const session = await ChatSession.create({
            sessionId,
            userId: userId || undefined,
            type: "peer",
            peerAdvocateId: peerAdvocateId || undefined,
            status: "open",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log("✅ Created peer chat session:", sessionId);

        return res.json({
            ok: true,
            sessionId: session.sessionId,
            peerAdvocateId: session.peerAdvocateId,
        });
    } catch (error) {
        console.error("❌ Error starting peer chat:", error);
        return res.status(500).json({
            ok: false,
            error: "Failed to start peer chat session",
        });
    }
});

/**
 * POST /api/peer-chat/:sessionId/message
 * Send a message in a peer chat session
 * Body: { content, from } where from = "user" | "peer"
 */
router.post("/:sessionId/message", async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const { content, from } = req.body;

        // Validation
        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                ok: false,
                error: "Message content is required",
            });
        }

        if (from !== "user" && from !== "peer") {
            return res.status(400).json({
                ok: false,
                error: "Invalid 'from' value. Must be 'user' or 'peer'",
            });
        }

        await connectToDatabase();

        // Verify session exists
        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({
                ok: false,
                error: "Session not found",
            });
        }

        if (session.type !== "peer") {
            return res.status(400).json({
                ok: false,
                error: "This endpoint is only for peer chat sessions",
            });
        }

        // Determine role and prepare message data
        const role = from === "user" ? "user" : "peer";
        const messageData: any = {
            sessionId,
            role,
            source: "peer",
            content: content.trim(),
            createdAt: new Date(),
        };

        // Add userId or peerAdvocateId based on sender
        if (from === "user" && session.userId) {
            messageData.userId = session.userId;
        } else if (from === "peer" && session.peerAdvocateId) {
            messageData.peerAdvocateId = session.peerAdvocateId;
        }

        // Create message
        const message = await ChatMessage.create(messageData);

        // Update session timestamps
        await ChatSession.updateOne(
            { sessionId },
            {
                $set: {
                    updatedAt: new Date(),
                    lastMessageAt: new Date(),
                },
            }
        );

        console.log(`✅ Peer message sent in session ${sessionId} from ${from}`);

        return res.json({
            ok: true,
            message: message.toObject(),
        });
    } catch (error) {
        console.error("❌ Error sending peer chat message:", error);
        return res.status(500).json({
            ok: false,
            error: "Failed to send message",
        });
    }
});

export default router;
