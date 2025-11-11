import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createPost } from "./routes/post";
import { getFeed } from "./routes/feed";
import { createComment, getComments } from "./routes/comment";
import { reportPost } from "./routes/report";
import { deletePost } from "./routes/delete";
import chatRouter from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Community API routes
  app.post("/api/post", createPost);
  app.get("/api/feed", getFeed);
  app.post("/api/comment", createComment);
  app.get("/api/comments", getComments);
  app.post("/api/report", reportPost);
  app.delete("/api/post/:postId", deletePost);

  return app;
}
