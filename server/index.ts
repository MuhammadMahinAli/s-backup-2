import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import { createPost } from "./routes/post";
import { getFeed } from "./routes/feed";
import { createComment, getComments } from "./routes/comment";
import { reportPost } from "./routes/report";
import { deletePost } from "./routes/delete";
import chatRouter from "./routes/chat";
import chatSessionsRouter from "./routes/chat-sessions";
import handoffRouter from "./routes/handoff";
import peerChatRouter from "./routes/peer-chat";
import authRouter from "./routes/auth";
import { signupPeerAdvocate, loginPeerAdvocate, getAllPeerAdvocates, checkPeerAdvocate } from "./routes/peer-advocate";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Example API routes
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Chatbot API route
  app.use("/api", chatRouter);

  // Chat session management routes
  app.use("/api/chat", chatSessionsRouter);
  app.use("/api/chat/handoff", handoffRouter);

  // Peer chat routes
  app.use("/api/peer-chat", peerChatRouter);

  // Auth routes
  app.use("/api/auth", authRouter);

  // Community API routes
  app.post("/api/post", createPost);
  app.get("/api/feed", getFeed);
  app.post("/api/comment", createComment);
  app.get("/api/comments", getComments);
  app.post("/api/report", reportPost);
  app.delete("/api/post/:postId", deletePost);

  // Peer Advocate API routes
  app.post("/api/peer-advocate/signup", signupPeerAdvocate);
  app.post("/api/peer-advocate/login", loginPeerAdvocate);
  app.get("/api/peer-advocate/all", getAllPeerAdvocates);
  app.get("/api/peer-advocate/check", checkPeerAdvocate);

  return app;
}
