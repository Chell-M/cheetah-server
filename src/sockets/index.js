import { findOrCreateGame } from "../services/gameService.js";
import Game from "../models/Game.js"; // Ensure you have access to the Game model

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle game joining
    socket.on("joinGame", async ({ gameId, userId }) => {
      try {
        if (!gameId || !userId) {
          throw new Error("Game ID and User ID must be provided");
        }

        // Add user to the game
        const updatedGameId = await findOrCreateGame(userId, gameId);

        // Join the socket room
        socket.join(updatedGameId);
        console.log(`User ${userId} joined game ${updatedGameId}`);

        // Fetch the updated game state
        const game = await Game.findOne({ gameId: updatedGameId });

        // Emit the updated game state to all participants
        io.to(updatedGameId).emit("gameUpdate", {
          gameId: updatedGameId,
          participants: game.participants.map(
            (participant) => participant.userId
          ),
          status: game.status,
          results: game.result,
        });
      } catch (error) {
        socket.emit("error", {
          message: "Failed to join game",
          error: error.message,
        });
        console.error(`Error joining game ${gameId}:`, error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Handle any cleanup or notifications here if necessary
    });
  });
};

export default socketHandler;
