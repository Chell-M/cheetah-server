import express from "express";
import { getLeaderboard, updateLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

// GET /api/leaderboard - Retrieve the leaderboard
router.get("/leaderboard", getLeaderboard);

// POST /api/leaderboard - Update the leaderboard with a new highest WPM
router.post("/leaderboard", updateLeaderboard);

export default router;
