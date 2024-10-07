import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";
import { socketHandler } from "./src/sockets/socket.js";

import http from "http";

import { Server } from "socket.io";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

connectDB();

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io",
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

socketHandler(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
