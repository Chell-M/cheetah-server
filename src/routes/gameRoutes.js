import express from "express";

import {
  createGame,
  addParticipant,
  getOpenGames,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/openGames", getOpenGames);
router.post("/createGame", createGame);
router.post("/:gameId/addParticipant", addParticipant);

export default router;
