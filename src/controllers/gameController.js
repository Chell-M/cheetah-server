import Game from "../models/Game.js";
import { v4 as uuidv4 } from "uuid";

export const createGame = async (req, res) => {
  try {
    const { userId, username } = req.body;

    console.log("Received request to create game:", { userId, username });

    const newGameId = uuidv4();
    const addParticipant = [{ userId: userId, username: username }];
    console.log("generated GameId:", newGameId);

    const newGame = new Game({
      gameId: newGameId,
      status: "open",
      participants: addParticipant,
      /*       results: [], */
    });

    // Save the game in the database and check for errors
    const savedGame = await newGame.save();
    console.log("Game saved successfully:", savedGame);

    return res.status(201).json({ success: true, data: newGame });
  } catch (error) {
    // Log the error to debug what's failing
    console.error("Error creating game:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
