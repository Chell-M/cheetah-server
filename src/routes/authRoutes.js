import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

//route to register
router.post("/register", registerUser);

//route to login
router.post("/login", loginUser);

export default router;
