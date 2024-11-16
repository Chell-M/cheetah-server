import { findOrCreateGame } from "../services/gameService.js";

export const findOrCreateGameHandler = async (req, res) => {
  const { userId } = req.body;

  try {
    const game = await findOrCreateGame(userId);
    res.status(200).json(game);
  } catch (error) {
    console.error("Error finding or creating game:", error);
    res.status(500).json({ message: "Server error" });
  }
};
