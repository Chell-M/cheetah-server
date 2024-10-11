import Game from "../models/Game.js";
import { v4 as uuidv4 } from "uuid";

export const getOpenGames = async (req, res) => {
  try {
    console.log("Fetching open games...");
    const openGames = await Game.find({ status: "open" });
    console.log("Open games found:", openGames);
    res.status(200).json({ success: true, data: openGames });
  } catch (error) {
    console.error("Error fetching open games:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addParticipant = async (req, res) => {
  const { gameId } = req.params;
  const { userId, username } = req.body;

  const updateGameStatus = (game) => {
    if (game.participants.length >= 2) {
      game.status = "full";
    } else {
      game.status = "open";
    }
    return game;
  };

  try {
    console.log(
      `Adding participant to game. Game ID: ${gameId}, User ID: ${userId}, Username: ${username}`,
    );
    const game = await Game.findOne({ gameId });

    if (!game) {
      console.log("Game not found with ID:", gameId);
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    console.log("Game found:", game);
    const participantExists = game.participants.some(
      (participant) => participant.userId === userId,
    );

    if (participantExists) {
      console.log("Participant already in game:", userId);
      return res
        .status(400)
        .json({ success: false, message: "Participant already in game" });
    }

    const participant = { userId, username };
    console.log("Adding new participant:", participant);
    game.participants.push(participant);

    const updatedGame = updateGameStatus(game);

    await updatedGame.save();
    console.log("Game updated successfully:", game);

    res.status(200).json({ success: true, data: game });
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createGame = async (req, res) => {
  try {
    const { userId, username } = req.body;
    console.log("Creating new game");

    const newGameId = uuidv4();
    console.log("Generated new game ID:", newGameId);
    const participant = { userId, username };

    const newGame = new Game({
      gameId: newGameId,
      status: "open",
      participants: [participant],
    });

    const savedGame = await newGame.save();

    console.log("Game saved successfully:", savedGame);

    return res.status(201).json({ success: true, data: savedGame });
  } catch (error) {
    console.error("Error creating game:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
