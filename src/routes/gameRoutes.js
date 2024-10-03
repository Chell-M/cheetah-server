/* import express from "express";

import {
  searchOpenGame,
  createGame,
  joinGame,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/searchOpenGame", searchOpenGame);
router.post("/createGame", createGame);
router.post("/joinGame", joinGame);

export default router; */

import express from "express";
import { createGame } from "../controllers/gameController.js";

const router = express.Router();

// Route to create a new game
router.post("/createGame", createGame);

export default router;
