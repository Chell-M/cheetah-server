import express from "express";
import { getLeaderboard, updateLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.post("/leaderboard", updateLeaderboard);

export default router;
