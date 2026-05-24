import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "../models/project-model.js";
import { generateResult } from "../controllers/ai-controller.js";
import { formatFileTree } from "../utils/format-code.js";

const projectAiBusy = new Map();

const authenticate = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const projectId = socket.handshake.query.projectId;

    if (!token) return next(new Error("Authentication error"));
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid projectId"));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const project = await Project.findById(projectId);

    if (!project) return next(new Error("Project not found"));
    if (!project.users.some((u) => u.toString() === decoded.userId)) {
      return next(new Error("You don't belong to this project"));
    }

    socket.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

const handleAiPrompt = async (io, socket, message) => {
  const roomId = socket.project._id.toString();

  if (projectAiBusy.get(roomId)) {
    socket.emit("ai-error", {
      message: "Another collaborator is currently using AI. Please wait.",
    });
    return;
  }

  projectAiBusy.set(roomId, true);
  io.to(roomId).emit("ai-busy", true);

  try {
    const result = await generateResult(message.replace("@ai", ""));
    let outgoing = result;

    try {
      const parsed = JSON.parse(result);
      if (parsed?.fileTree && typeof parsed.fileTree === "object") {
        parsed.fileTree = await formatFileTree(parsed.fileTree);
        await Project.findByIdAndUpdate(roomId, { fileTree: parsed.fileTree });
        outgoing = JSON.stringify(parsed);
      }
    } catch {
      // result is not JSON or has no fileTree — broadcast raw text
    }

    io.to(roomId).emit("project-message", {
      message: outgoing,
      sender: { _id: "ai", email: "AI" },
    });
  } catch (error) {
    console.error("AI error:", error.message);
    io.to(roomId).emit("ai-error", {
      message: "AI is currently unavailable. Please try again later.",
    });
  } finally {
    projectAiBusy.delete(roomId);
    io.to(roomId).emit("ai-busy", false);
  }
};

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(authenticate);

  io.on("connection", (socket) => {
    const roomId = socket.project._id.toString();
    socket.join(roomId);

    socket.on("project-message", (data) => {
      socket.broadcast.to(roomId).emit("project-message", data);
      if (data.message.trim().startsWith("@ai")) {
        handleAiPrompt(io, socket, data.message);
      }
    });
  });

  return io;
};

export default initializeSocket;
