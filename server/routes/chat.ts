import { Router } from "express";
import fetch from "node-fetch";

const router = Router();
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

function pickReply(data) {
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

    const payload = {
      sessionId: String(sessionId || Date.now()),
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

    return res.status(n8nRes.ok ? 200 : 502).json({ ok: !!reply, reply });
  } catch (err) {
    console.error("❌ Error in /api/chat:", err);
    return res.status(500).json({ ok: false, reply: "Sorry, something went wrong on the server." });
  }
});

export default router;
