import { findOrCreateGame } from "../services/gameService.js";
import redisClient from "../config/redisClient.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGame", async ({ gameId, userId }) => {
      try {
        if (!gameId || !userId) {
          throw new Error("Game ID and User ID must be provided");
        }
        const { gameId: updatedGameId, participants } = await findOrCreateGame(
          userId,
          gameId
        );

        // Join the socket room
        socket.join(updatedGameId);
        console.log(`User ${userId} joined game ${updatedGameId}`);

        // Increment active connections
        await redisClient.hIncrBy(
          `game:${updatedGameId}`,
          "activeConnections",
          1
        );

        // Emit the updated game state to all participants
        io.to(updatedGameId).emit("gameUpdate", {
          gameId: updatedGameId,
          participants: participants.map((participant) => participant.userId),
        });

        // Check if there are two participants
        if (participants.length === 2) {
          console.log(
            `Two participants connected for game ${updatedGameId}. Starting countdown.`
          );
          setTimeout(() => {
            io.to(updatedGameId).emit("startRace", {
              message: "Countdown over, start race!",
            });
          }, 5000); // 5-second countdown
        }
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

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;
