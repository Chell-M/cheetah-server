import Game from "../models/Game.js";
import { v4 as uuidv4 } from "uuid";

export const getOpenGames = async () => {
  try {
    const openGames = await Game.find({ status: "open" });
    return openGames;
  } catch (error) {
    console.error("Error fetching open games:", error);
    throw error;
  }
};
export const createNewGame = async (userId) => {
  try {
    const gameId = uuidv4();
    const newGame = new Game({
      gameId,
      participants: [{ userId }],
      status: "open",
    });
    await newGame.save();
    return newGame;
  } catch (error) {
    console.error("Error creating new game:", error);
    throw error;
  }
};

export const addUserToGameService = async (gameId, userId) => {
  try {
    const game = await Game.findOne({ gameId });
    // Check if the game is already full
    if (game.participants.length >= 2) {
      throw new Error("Game is already full");
    }
    game.participants.push({ userId });

    if (game.participants.length === 2) {
      game.status = "closed";
    }

    await game.save();

    return game;
  } catch (error) {
    console.error("Error adding user to game:", error);
    throw error;
  }
};

export const getUserGame = async (userId) => {
  try {
    const game = await Game.findOne({ "participants.userId": userId });
    if (!game) {
      throw new Error("User is not in any game");
    }
    return game;
  } catch (error) {
    console.error("Error fetching user's game:", error);
    throw error;
  }
};
