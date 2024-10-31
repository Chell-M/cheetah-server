import { findOrCreateGame } from "../services/gameService.js";
import redisClient from "../config/redisClient.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id); //check 1

    socket.on("joinGame", async ({ gameId, userId }) => {
      try {
        console.log(`joining Game: ${gameId}, userId: ${userId}`); //check 2
        if (!gameId || !userId) {
          throw new Error("Game ID and User ID must be provided");
        }
        const { gameId: updatedGameId, participants } = await findOrCreateGame(
          userId,
          gameId
        );

        socket.join(updatedGameId);
        console.log(`User ${userId} joined game ${updatedGameId}`); //check 3

        await redisClient.hIncrBy(
          `game:${updatedGameId}`,
          "activeConnections",
          1
        );

        io.to(updatedGameId).emit("gameUpdate", {
          gameId: updatedGameId,
          participants: participants.map((participant) => participant.userId),
        });

        console.log("Game state emitted to participants");

        if (participants.length === 2) {
          console.log(
            `2 users in Game${JSON.stringify(
              participants,
              gameId
            )} Starting countdown.`
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

    socket.on("cursorUpdate", ({ gameId, userId, cursorIndex }) => {
      console.log(
        `Cursor update for user ${userId}, gameId: ${gameId}: ${cursorIndex}`
      );
      socket.to(gameId).emit("opponentCursorUpdate", { cursorIndex });
    });

    socket.on("gameResults", async ({ gameId, results }) => {
      console.log(`Game results for gameId: ${gameId}`, results);
      try {
        const gameKey = `game:${gameId}`;
        let existingResults = await redisClient.hGet(gameKey, "results");
        existingResults = existingResults ? JSON.parse(existingResults) : [];
        existingResults.push(results);

        await redisClient.hSet(
          gameKey,
          "results",
          JSON.stringify(existingResults)
        );

        console.log(`Results for Game ${gameId} saved to Redis`);

        // Emit the results to all participants
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
