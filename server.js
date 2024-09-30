import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";

dotenv.config();

const app = express();

//cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

connectDB();

app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
