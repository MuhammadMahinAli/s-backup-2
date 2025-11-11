import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import mongoose, { Schema, Types } from "mongoose";
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
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
if (!process.env.MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable");
}
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}
async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
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
const createPost = async (req, res) => {
  try {
    await connectToDatabase();
    const { nickname, text, imageUrl, blurRequested, topics } = req.body;
    if (!nickname || typeof nickname !== "string") {
      res.status(400).json({ error: "Nickname is required" });
      return;
    }
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Text is required" });
      return;
    }
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      res.status(400).json({ error: "Text cannot be empty" });
      return;
    }
    if (trimmedText.length < 20) {
      res.status(400).json({ error: "Text must be at least 20 characters" });
      return;
    }
    if (trimmedText.length > 1e3) {
      res.status(400).json({ error: "Text must not exceed 1000 characters" });
      return;
    }
    const contentType = imageUrl && imageUrl.trim() ? "image" : "text";
    const post = await Post.create({
      nickname: nickname.trim(),
      text: trimmedText,
      imageUrl: imageUrl?.trim() || void 0,
      blurRequested: blurRequested === true,
      topics: Array.isArray(topics) ? topics : [],
      contentType
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
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
    const { postId, nickname, text } = req.body;
    if (!postId || typeof postId !== "string") {
      res.status(400).json({ error: "Post ID is required" });
      return;
    }
    if (!nickname || typeof nickname !== "string") {
      res.status(400).json({ error: "Nickname is required" });
      return;
    }
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Text is required" });
      return;
    }
    const trimmedText = text.trim();
    if (trimmedText.length < 5) {
      res.status(400).json({ error: "Text must be at least 5 characters" });
      return;
    }
    if (trimmedText.length > 500) {
      res.status(400).json({ error: "Text must not exceed 500 characters" });
      return;
    }
    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    const comment = await Comment.create({
      postId: new Types.ObjectId(postId),
      nickname: nickname.trim(),
      text: trimmedText
    });
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 }
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
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
    const { postId } = req.body;
    if (!postId || typeof postId !== "string") {
      res.status(400).json({ error: "Post ID is required" });
      return;
    }
    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }
    const post = await Post.findByIdAndUpdate(
      postId,
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
    res.status(500).json({ error: "Failed to report post" });
  }
};
const deletePost = async (req, res) => {
  try {
    await connectToDatabase();
    const { postId } = req.params;
    if (!postId || !Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: "Invalid post ID" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
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
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.post("/api/post", createPost);
  app2.get("/api/feed", getFeed);
  app2.post("/api/comment", createComment);
  app2.get("/api/comments", getComments);
  app2.post("/api/report", reportPost);
  app2.delete("/api/post/:postId", deletePost);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
