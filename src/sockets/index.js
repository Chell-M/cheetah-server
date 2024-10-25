import { findOrCreateGame } from "../services/gameService.js";
import redisClient from "../config/redisClient.js";

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
        const { gameId: updatedGameId, participants } = await findOrCreateGame(
          userId,
          gameId
        );

        // // Join the socket room
        // socket.join(updatedGameId);
        // console.log(`User ${userId} joined game ${updatedGameId}`);

        // Emit the updated game state to all participants
        io.to(updatedGameId).emit("gameUpdate", {
          gameId: updatedGameId,
          participants: participants.map((participant) => participant.userId),
        });
      } catch (error) {
        socket.emit("error", {
          message: "Failed to join game",
          error: error.message,
        });
        console.error(`Error joining game ${gameId}:`, error.message);
      }
    });

    // Event to get game data
    socket.on("getGameData", async (gameId) => {
      try {
        const gameKey = `game:${gameId}`;
        const gameData = await redisClient.hGetAll(gameKey);

        if (Object.keys(gameData).length === 0) {
          throw new Error("Game not found");
        }

        const participants = JSON.parse(gameData.participants);

        socket.emit("gameData", {
          gameId: gameData.gameId,
          participants: participants.map((participant) => participant.userId),
        });
      } catch (error) {
        console.error(
          `Error retrieving game data for ${gameId}:`,
          error.message
        );
        socket.emit("error", "Error retrieving game data");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Handle any cleanup or notifications here if necessary
    });
  });
};

export default socketHandler;
