import Game from "../models/Game.js";
import { v4 as uuidv4 } from "uuid";
import { generateWordSequence } from "../utils/wordShuffler.js";

export const findOrCreateGame = async (username) => {
  try {
    let game = await Game.findOne({ status: "open" });

    if (!game) {
      const gameId = uuidv4();
      game = new Game({
        gameId,
        participants: [{ username }],
        status: "open",
        words: generateWordSequence(25),
      });
      console.log("no open games found, Created new Game:", game.gameId);
    } else {
      if (game.participants.length >= 2) {
        throw new Error("Game is already full");
      }
      game.participants.push({ username });
      if (game.participants.length === 2) {
        game.status = "full";
      }
    }

    await game.save();
    return game;
  } catch (error) {
    console.error("Error finding or creating game:", error);
    throw error;
  }
};
