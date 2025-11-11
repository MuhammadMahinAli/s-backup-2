import express, { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import cors from "cors";
import { z } from "zod";
import mongoose, { Schema, Types } from "mongoose";
import { v2 } from "cloudinary";
import fetch from "node-fetch";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const PostSchema = new Schema(
  {
    nickname: {
      type: String,
      required: [true, "Nickname is required"],
      trim: true
    },
    text: {
      type: String,
      required: [true, "Text is required"],
      minlength: [20, "Text must be at least 20 characters"],
      maxlength: [1e3, "Text must not exceed 1000 characters"],
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
      // Legacy field - prefer using 'images' array for new posts
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true }
        }
      ],
      default: []
    },
    authorAnonId: {
      type: String,
      required: false,
      // Optional for backward compatibility with existing posts
      index: true,
      // Index for efficient author queries
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    topics: {
      type: [String],
      default: []
    },
    blurRequested: {
      type: Boolean,
      default: false
    },
    contentType: {
      type: String,
      enum: ["text", "image"],
      default: "text"
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0
    },
    reportsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ["auto", "pending"],
      default: "auto"
    }
  },
  {
    timestamps: false
    // We're managing createdAt manually
  }
);
PostSchema.index({ createdAt: -1 });
PostSchema.index({ authorAnonId: 1, createdAt: -1 });
const Post = mongoose.model("Post", PostSchema);
const CommentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post ID is required"]
    },
    nickname: {
      type: String,
      required: [true, "Nickname is required"],
      trim: true
    },
    text: {
      type: String,
      required: [true, "Text is required"],
      minlength: [5, "Text must be at least 5 characters"],
      maxlength: [500, "Text must not exceed 500 characters"],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
    // We're managing createdAt manually
  }
);
CommentSchema.index({ postId: 1 });
const Comment = mongoose.model("Comment", CommentSchema);
function getMongoConfig() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (!process.env.MONGODB_DB) {
    throw new Error("Please define the MONGODB_DB environment variable");
  }
  return {
    uri: process.env.MONGODB_URI,
    db: process.env.MONGODB_DB
  };
}
let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}
async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const config = getMongoConfig();
    const opts = {
      bufferCommands: false,
      dbName: config.db
    };
    cached.promise = mongoose.connect(config.uri, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB connected successfully");
      return mongooseInstance;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
const ImageZ = z.object({
  url: z.string().url("Invalid image URL"),
  publicId: z.string().min(1, "Public ID is required")
});
const CreatePostZ = z.object({
  nickname: z.string().trim().max(40, "Nickname must not exceed 40 characters").default("Anonymous"),
  text: z.string().trim().min(20, "Text must be at least 20 characters").max(1e3, "Text must not exceed 1000 characters"),
  images: z.array(ImageZ).max(4, "Maximum 4 images allowed").default([]),
  blurRequested: z.boolean().optional().default(false),
  topics: z.array(z.string()).optional().default([]),
  // Legacy field (optional for backward compatibility)
  imageUrl: z.string().optional(),
  // Client may send this, but server will prefer reading from cookie
  authorAnonId: z.string().optional()
});
const CreateCommentZ = z.object({
  postId: z.string().min(1, "Post ID is required"),
  nickname: z.string().trim().max(40, "Nickname must not exceed 40 characters").default("Anonymous"),
  text: z.string().trim().min(5, "Comment must be at least 5 characters").max(500, "Comment must not exceed 500 characters")
});
const ReportPostZ = z.object({
  postId: z.string().min(1, "Post ID is required")
});
const rateLimitStore = /* @__PURE__ */ new Map();
const MAX_POSTS = 5;
const WINDOW_MS = 10 * 60 * 1e3;
function checkRateLimit(anonId) {
  const now = Date.now();
  const entry = rateLimitStore.get(anonId);
  if (!entry) {
    rateLimitStore.set(anonId, { timestamps: [now] });
    return {
      allowed: true,
      remaining: MAX_POSTS - 1,
      resetAt: now + WINDOW_MS
    };
  }
  const cutoff = now - WINDOW_MS;
  entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);
  if (entry.timestamps.length >= MAX_POSTS) {
    const oldestTimestamp = Math.min(...entry.timestamps);
    const resetAt = oldestTimestamp + WINDOW_MS;
    return {
      allowed: false,
      remaining: 0,
      resetAt
    };
  }
  entry.timestamps.push(now);
  rateLimitStore.set(anonId, entry);
  return {
    allowed: true,
    remaining: MAX_POSTS - entry.timestamps.length,
    resetAt: now + WINDOW_MS
  };
}
function cleanupRateLimitStore() {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  for (const [anonId, entry] of rateLimitStore.entries()) {
    entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(anonId);
    }
  }
}
function startRateLimiterCleanup() {
  if (typeof setInterval !== "undefined") {
    setInterval(cleanupRateLimitStore, 5 * 60 * 1e3);
  }
}
const createPost = async (req, res) => {
  try {
    await connectToDatabase();
    const parseResult = CreatePostZ.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten()
      });
      return;
    }
    const parsed = parseResult.data;
    const cookie = req.headers.cookie || "";
    const cookieMatch = cookie.match(/(?:^|; )shy_anon_id=([^;]+)/);
    const authorAnonId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : parsed.authorAnonId;
    if (!authorAnonId) {
      res.status(400).json({ error: "No anonymous ID found. Please enable cookies or provide authorAnonId." });
      return;
    }
    const rateLimitResult = checkRateLimit(authorAnonId);
    if (!rateLimitResult.allowed) {
      const resetInSeconds = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1e3);
      res.status(429).json({
        error: "Rate limit exceeded. Maximum 5 posts per 10 minutes.",
        remaining: rateLimitResult.remaining,
        resetIn: resetInSeconds,
        resetAt: new Date(rateLimitResult.resetAt).toISOString()
      });
      return;
    }
    const hasImages = parsed.images.length > 0 || parsed.imageUrl && parsed.imageUrl.trim();
    const contentType = hasImages ? "image" : "text";
    const post = await Post.create({
      nickname: parsed.nickname,
      text: parsed.text,
      images: parsed.images,
      imageUrl: parsed.imageUrl,
      // Legacy support
      authorAnonId,
      blurRequested: parsed.blurRequested,
      topics: parsed.topics,
      contentType
    });
    res.setHeader("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    res.setHeader("X-RateLimit-Reset", rateLimitResult.resetAt.toString());
    res.setHeader("X-RateLimit-Limit", "5");
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    res.status(500).json({ error: "Failed to create post" });
  }
};
const getFeed = async (req, res) => {
  try {
    await connectToDatabase();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find({ status: "auto" }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      Post.countDocuments({ status: "auto" })
    ]);
    res.json({
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};
const createComment = async (req, res) => {
  try {
    await connectToDatabase();
    const parseResult = CreateCommentZ.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten()
      });
      return;
    }
    const parsed = parseResult.data;
    if (!Types.ObjectId.isValid(parsed.postId)) {
      res.status(400).json({ error: "Invalid post ID format" });
      return;
    }
    const post = await Post.findById(parsed.postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    const comment = await Comment.create({
      postId: new Types.ObjectId(parsed.postId),
      nickname: parsed.nickname,
      text: parsed.text
    });
    await Post.findByIdAndUpdate(parsed.postId, {
      $inc: { commentCount: 1 }
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
      return;
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    res.status(500).json({ error: "Failed to create comment" });
  }
};
const getComments = async (req, res) => {
  try {
    await connectToDatabase();
    const { postId } = req.query;
    if (!postId || typeof postId !== "string") {
      res.status(400).json({ error: "Post ID is required" });
      return;
    }
    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }
    const comments = await Comment.find({ postId: new Types.ObjectId(postId) }).sort({ createdAt: 1 }).lean().exec();
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
const reportPost = async (req, res) => {
  try {
    await connectToDatabase();
    const parseResult = ReportPostZ.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten()
      });
      return;
    }
    const parsed = parseResult.data;
    if (!Types.ObjectId.isValid(parsed.postId)) {
      res.status(400).json({ error: "Invalid post ID format" });
      return;
    }
    const post = await Post.findByIdAndUpdate(
      parsed.postId,
      { $inc: { reportsCount: 1 } },
      { new: true }
    );
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ success: true, reportsCount: post.reportsCount });
  } catch (error) {
    console.error("Error reporting post:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    res.status(500).json({ error: "Failed to report post" });
  }
};
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const deletePost = async (req, res) => {
  try {
    await connectToDatabase();
    const { postId } = req.params;
    if (!postId || !Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }
    const cookie = req.headers.cookie || "";
    const cookieMatch = cookie.match(/(?:^|; )shy_anon_id=([^;]+)/);
    const anonId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
    if (!anonId) {
      res.status(400).json({ error: "No anonymous ID found. Unable to verify ownership." });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    if (post.authorAnonId !== anonId) {
      res.status(403).json({ error: "Forbidden. You can only delete your own posts." });
      return;
    }
    const images = post.images || [];
    if (images.length > 0) {
      try {
        const publicIds = images.map((img) => img.publicId).filter(Boolean);
        if (publicIds.length > 0) {
          await v2.api.delete_resources(publicIds);
          console.log(`Deleted ${publicIds.length} images from Cloudinary for post ${postId}`);
        }
      } catch (cloudinaryError) {
        console.error("Error deleting images from Cloudinary:", cloudinaryError);
      }
    }
    if (post.imageUrl && images.length === 0) {
      try {
        const urlMatch = post.imageUrl.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/);
        if (urlMatch) {
          await v2.uploader.destroy(urlMatch[1]);
          console.log(`Deleted legacy image from Cloudinary for post ${postId}`);
        }
      } catch (cloudinaryError) {
        console.error("Error deleting legacy image from Cloudinary:", cloudinaryError);
      }
    }
    await Comment.deleteMany({ postId: new Types.ObjectId(postId) });
    await Post.findByIdAndDelete(postId);
    res.json({
      success: true,
      message: "Post and associated comments deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
const router = Router();
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";
function pickReply(data) {
  if (!data) return null;
  if (typeof data.reply === "string" && data.reply.trim()) return data.reply;
  if (Array.isArray(data) && data[0]) return pickReply(data[0]);
  if (typeof data === "string") return data;
  if (data.text) return data.text;
  if (Array.isArray(data.output) && data.output[0]?.content && Array.isArray(data.output[0].content) && data.output[0].content[0]?.text) {
    return data.output[0].content[0].text;
  }
  if (Array.isArray(data.choices) && data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  return null;
}
router.post("/chat", async (req, res) => {
  try {
    const { sessionId, message, userMeta } = req.body;
    console.log("📩 Incoming /api/chat body:", req.body);
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ ok: false, reply: "Your message was empty or invalid." });
    }
    if (!N8N_WEBHOOK_URL) {
      console.error("❌ N8N_WEBHOOK_URL is not set");
      return res.status(500).json({ ok: false, reply: "Server misconfigured." });
    }
    const payload = {
      sessionId: String(sessionId || Date.now()),
      action: "sendMessage",
      chatInput: message.trim(),
      userMeta: userMeta || {}
    };
    console.log("➡️ Sending to n8n:", N8N_WEBHOOK_URL, payload);
    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const rawText = await n8nRes.text();
    console.log("⬅️ Response from n8n:", n8nRes.status, rawText);
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
    const reply = pickReply(data) || "Sorry, I couldn't generate a reply right now.";
    return res.status(n8nRes.ok ? 200 : 502).json({ ok: !!reply, reply });
  } catch (err) {
    console.error("❌ Error in /api/chat:", err);
    return res.status(500).json({ ok: false, reply: "Sorry, something went wrong on the server." });
  }
});
function createServer() {
  const app2 = express();
  app2.use(cors());
  app2.use(express.json());
  app2.use(express.urlencoded({ extended: true }));
  app2.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.use("/api", router);
  app2.post("/api/post", createPost);
  app2.get("/api/feed", getFeed);
  app2.post("/api/comment", createComment);
  app2.get("/api/comments", getComments);
  app2.post("/api/report", reportPost);
  app2.delete("/api/post/:postId", deletePost);
  return app2;
}
const __filename = fileURLToPath(import.meta.url);
path.dirname(__filename);
const app = createServer();
const PORT = process.env.PORT || 3e3;
app.get("/healthz", (_req, res) => res.send("ok"));
const spaDir = path.join(process.cwd(), "dist", "spa");
app.use(express.static(spaDir));
app.get("*", (_req, res) => res.sendFile(path.join(spaDir, "index.html")));
async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
    }
    startRateLimiterCleanup();
    app.listen(PORT, () => {
      console.log("Server listening on", PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
start();
