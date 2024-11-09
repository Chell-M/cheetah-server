import {
  getOpenGames,
  createNewGame,
  addUserToGameService,
} from "../services/gameService.js";

export const getOpenGamesHandler = async (req, res) => {
  try {
    const openGames = await getOpenGames();
    res.status(200).json(openGames);
  } catch (error) {
    console.error("Error fetching open games:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createNewGameHandler = async (req, res) => {
  const { userId } = req.body;
  try {
    const newGame = await createNewGame(userId);
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error creating new game:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addUserToGameHandler = async (req, res) => {
  const { gameId, userId } = req.body;
  try {
    const updatedGame = await addUserToGameService(gameId, userId);
    res.status(200).json(updatedGame);
  } catch (error) {
    if (error.message === "Game not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Game is already full") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to add user to game" });
    }
  }
};
