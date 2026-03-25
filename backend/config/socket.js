import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "../models/project-model.js";
import { generateResult } from "../controllers/ai-controller.js";

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      // Parse accessToken from cookies (httpOnly cookie sent via withCredentials)
      const cookieHeader = socket.handshake.headers.cookie || "";
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c) => {
          const [key, ...val] = c.trim().split("=");
          return [key, val.join("=")];
        })
      );
      const token = cookies.accessToken;
      const projectId = socket.handshake.query.projectId;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new Error("Invalid projectId"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.user = decoded;

      const project = await Project.findById(projectId);

      if (!project) {
        return next(new Error("Project not found"));
      }

      if (!project.users.some((u) => u.toString() === decoded.userId)) {
        return next(new Error("You don't belong to this project"));
      }

      socket.project = project;

      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.roomId = socket.project._id.toString();

    console.log("a user connected");

    socket.join(socket.roomId);

    socket.on("project-message", async (data) => {
      const message = data.message;

      const aiIsPresentInMessage = message.includes("@ai");
      socket.broadcast.to(socket.roomId).emit("project-message", data);

      if (aiIsPresentInMessage) {
        try {
          const prompt = message.replace("@ai", "");
          const result = await generateResult(prompt);

          io.to(socket.roomId).emit("project-message", {
            message: result,
            sender: {
              _id: "ai",
              email: "AI",
            },
          });
        } catch (error) {
          console.error("AI error:", error.message);
          io.to(socket.roomId).emit("project-message", {
            message: JSON.stringify({ text: "AI is currently unavailable. Please try again later." }),
            sender: {
              _id: "ai",
              email: "AI",
            },
          });
        }

        return;
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      socket.leave(socket.roomId);
    });
  });

  return io;
};

export default initializeSocket;
