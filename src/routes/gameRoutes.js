import express from "express";
import {
  createNewGameHandler,
  addUserToGameHandler,
  getOpenGamesHandler,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/open", getOpenGamesHandler);
router.post("/create", createNewGameHandler);
router.post("/addUser", addUserToGameHandler);

export default router;
