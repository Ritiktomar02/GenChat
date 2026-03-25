import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db-connection.js";
import initializeSocket from "./config/socket.js";
import userRoute from "./routes/user-route.js";
import projectRoute from "./routes/project-route.js";
import aiRoutes from "./routes/ai-route.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));


app.use("/user", userRoute);
app.use("/projects", projectRoute);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const httpServer = http.createServer(app);
initializeSocket(httpServer);

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Server running on port ${PORT}`);
    }
  });
};

startServer();
