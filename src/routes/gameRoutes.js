import express from "express";
import { findOrCreateGameHandler } from "../controllers/gameController.js";

const router = express.Router();

router.post("/findOrCreate", findOrCreateGameHandler);

export default router;
