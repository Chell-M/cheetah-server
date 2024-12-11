import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";
import leaderboardRoutes from "./src/routes/leaderboardRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import socketHandler from "./src/sockets/socketHandler.js";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api", profileRoutes);
app.use("/api", leaderboardRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io",
});

//socket.io debugging
instrument(io, {
  auth: false,
  mode: "",
});

socketHandler(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
