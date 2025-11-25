import { Router } from "express";
import fetch from "node-fetch";
import { connectToDatabase } from "../lib/mongodb";
import { ChatSession, ChatMessage } from "../models";

const router = Router();
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

function pickReply(data: any) {
  if (!data) return null;
  if (typeof data.reply === "string" && data.reply.trim()) return data.reply;
  if (Array.isArray(data) && data[0]) return pickReply(data[0]);
  if (typeof data === "string") return data;
  if (data.text) return data.text;
  if (Array.isArray(data.output) &&
    data.output[0]?.content &&
    Array.isArray(data.output[0].content) &&
    data.output[0].content[0]?.text) {
    return data.output[0].content[0].text;
  }
  if (Array.isArray(data.choices) &&
    data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  return null;
}

router.post("/chat", async (req, res) => {
  try {
    const { sessionId, message, action: bodyAction, location, userMeta } = req.body;

    console.log("📩 Incoming /api/chat body:", req.body);

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ ok: false, reply: "Your message was empty or invalid." });
    }

    if (!N8N_WEBHOOK_URL) {
      console.error("❌ N8N_WEBHOOK_URL is not set");
      return res.status(500).json({ ok: false, reply: "Server misconfigured." });
    }

    const action = bodyAction ?? "sendMessage";
    const chatInput = message.trim();
    const finalSessionId = String(sessionId || Date.now());

    // Extract userId from request (could be from auth middleware, userMeta, or undefined for anonymous)
    const userId = req.body.userId || userMeta?.userId || undefined;

    // Ensure database connection
    await connectToDatabase();

    // 1. Ensure ChatSession exists (create if needed)
    try {
      let session = await ChatSession.findOne({ sessionId: finalSessionId });
      if (!session) {
        session = await ChatSession.create({
          sessionId: finalSessionId,
          userId,
          type: "agent",
          status: "open",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("✅ Created new ChatSession:", finalSessionId);
      }
    } catch (dbError) {
      console.error("⚠️ Failed to create/find ChatSession:", dbError);
      // Continue - don't block chat if DB logging fails
    }

    // 2. Log user message before calling n8n
    try {
      await ChatMessage.create({
        sessionId: finalSessionId,
        userId,
        role: "user",
        source: "agent",
        content: chatInput,
        createdAt: new Date(),
      });
      console.log("✅ Logged user message");
    } catch (dbError) {
      console.error("⚠️ Failed to log user message:", dbError);
      // Continue - don't block chat if DB logging fails
    }

    // Check session status - if handoff pending or active peer, DO NOT call AI
    let session = await ChatSession.findOne({ sessionId: finalSessionId });
    if (session && (session.status === "active_peer" || session.status === "handoff_pending")) {
      console.log(`ℹ️ Session ${finalSessionId} is in ${session.status} mode. Skipping AI reply.`);

      // Update lastMessageAt so it bubbles up in the dashboard
      await ChatSession.updateOne(
        { sessionId: finalSessionId },
        { $set: { updatedAt: new Date(), lastMessageAt: new Date() } }
      );

      return res.json({ ok: true, reply: "", status: session.status });
    }

    const payload = {
      sessionId: finalSessionId,
      action,
      chatInput,
      location: location ?? undefined,
      userMeta: {
        ...(userMeta || {}),
      },
    };

    console.log("➡️ Sending to n8n:", N8N_WEBHOOK_URL, payload);

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const rawText = await n8nRes.text();
    console.log("⬅️ Response from n8n:", n8nRes.status, rawText);

    let data;
    try { data = JSON.parse(rawText); } catch { data = rawText; }
    const reply = pickReply(data) || "Sorry, I couldn't generate a reply right now.";

    // 3. Log agent reply and update session timestamps
    try {
      await ChatMessage.create({
        sessionId: finalSessionId,
        userId,
        role: "agent",
        source: "agent",
        content: reply,
        createdAt: new Date(),
      });

      await ChatSession.updateOne(
        { sessionId: finalSessionId },
        {
          $set: {
            updatedAt: new Date(),
            lastMessageAt: new Date()
          }
        }
      );
      console.log("✅ Logged agent reply and updated session");
    } catch (dbError) {
      console.error("⚠️ Failed to log agent reply:", dbError);
      // Continue - don't block chat if DB logging fails
    }

    return res.status(n8nRes.ok ? 200 : 502).json({ ok: !!reply, reply });
  } catch (err) {
    console.error("❌ Error in /api/chat:", err);
    return res.status(500).json({ ok: false, reply: "Sorry, something went wrong on the server." });
  }
});

export default router;