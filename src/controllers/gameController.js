import Game from "../models/Game.js";
import { v4 as uuidv4 } from "uuid";

/* export const searchOpenGame = async (req, res) => {
  try {
    const openGame = await Game.findOne({ status: "open" });

    if (openGame) {
      res.status(200).json(openGame);
    } else {
      res.status(404).json({ message: "No open game found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

  console.log(searchOpenGame, "search open game");
}; */

export const createGame = async (req, res) => {
  try {
    const { userId, username } = req.body;

    console.log("Received request to create game:", { userId, username });

    if (!userId || !username) {
      console.error("Invalid user data:", { userId, username });
      return res
        .status(400)
        .json({ message: "Invalid user ID, user must have account" });
    }

    const newGameId = uuidv4();
    console.log(newGameId, "created uuid");

    const newGame = new Game({
      gameId: newGameId,
      gameStatus: "open",
      /*       results: [], */
    });

    // Save the game in the database and check for errors
    const savedGame = await newGame.save();
    console.log("Game saved successfully:", savedGame);

    console.log(`Game created with ID: ${newGame.gameId} by user: ${username}`);

    return res.status(201).json({ success: true, data: newGame });
  } catch (error) {
    // Log the error to debug what's failing
    console.error("Error creating game:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* // Join an existing game
export const joinGame = async (req, res) => {
  try {
    const { gameId, userId } = req.body;

    // Fetch the user's username
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const game = await Game.findOne({ gameId });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.participants.length >= 2) {
      return res.status(400).json({ message: "Game is full" });
    }

    game.participants.push({ userId: user._id, username: user.username });

    console.log(searchOpenGame, "search open game");

    if (game.participants.length === 2) {
      game.status = "full"; // Set the status to 'full' when 2 players join
    }

    await game.save();
    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}; */
