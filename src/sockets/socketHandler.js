import { findOrCreateGame } from "../services/gameService.js";
import {
  incrementActiveConnections,
  saveGameResults,
} from "../services/redisService.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGame", async ({ gameId, userId }) => {
      try {
        console.log(`joining Game: ${gameId}, userId: ${userId}`);
        if (!gameId || !userId) {
          throw new Error("Game ID and User ID must be provided");
        }
        const { gameId: updatedGameId, participants } = await findOrCreateGame(
          userId,
          gameId
        );

        socket.join(updatedGameId);
        console.log(`User ${userId} joined game ${updatedGameId}`);

        await incrementActiveConnections(updatedGameId);

        io.to(updatedGameId).emit("gameUpdate", {
          gameId: updatedGameId,
          participants: participants.map((participant) => participant.userId),
        });

        if (participants.length === 2) {
          console.log(
            `2 users in Game${JSON.stringify(participants)} Starting countdown.`
          );
        }
      } catch (error) {
        socket.emit("error", {
          message: "Failed to join game",
          error: error.message,
        });
        console.error(`Error joining game ${gameId}:`, error.message);
      }
    });

    socket.on("gameResults", async ({ gameId, results }) => {
      console.log(`Game results for gameId: ${gameId}`, results);
      try {
        const existingResults = await saveGameResults(gameId, results);
        console.log(`Results for Game ${gameId} saved to Redis`);

        io.to(gameId).emit("gameResultsUpdate", existingResults);
      } catch (error) {
        console.error(`Error saving game results for GameID ${gameId}:`, error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected: check ", socket.id);
    });
  });
};

export default socketHandler;
