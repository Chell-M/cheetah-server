import express from "express";

import { createGame } from "../controllers/gameController.js";

const router = express.Router();

/* //Route to find open game
router.get("/searchOpenGame", searchOpenGame); */

// Route to create a new game
router.post("/createGame", createGame);

export default router;
