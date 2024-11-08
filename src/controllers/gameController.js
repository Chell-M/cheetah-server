// import { CreateGameKey } from "../services/gameService.js";

// export const initializeGame = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID required" });
//     }
//     const { gameId } = await CreateGameKey(userId);
//     return res
//       .status(200)
//       .json({ gameId, message: "Game initialized successfully" });
//   } catch (error) {
//     console.error("Error initializing game:", error);
//     res
//       .status(500)
//       .json({ message: "Error initializing game", error: error.message });
//   }
// };
