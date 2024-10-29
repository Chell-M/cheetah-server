import express from "express";
import { initializeGame } from "../controllers/gameController.js";

const router = express.Router();

router.post("/initialize", initializeGame);

export default router;
