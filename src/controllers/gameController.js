import { findOrCreateGame } from "../services/gameService.js";

export const initializeGame = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const gameId = await findOrCreateGame(userId);

    console.log(`Game initialized with ID: ${gameId} by user (${userId})`);

    // Respond with the gameId
    res.status(200).json({
      gameId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding/creating game", error: error.message });
  }
};
