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
        console.log("Game state emitted to participants"); // check 4

        if (participants.length === 2) {
          console.log(
            `2 users in Game${JSON.stringify(
              gameId
            )}, participants: ${JSON.stringify(
              participants
            )}. Starting countdown.` //check 5
          );
          setTimeout(() => {
            io.to(updatedGameId).emit("startRace", {
              message: "countdown over, start race!",
            });
          }, 5000);
        }
      } catch (error) {
        socket.emit("error", {
          message: "Failed to join game",
          error: error.message,
        });
        console.error(`Error joining game ${gameId}:`, error.message);
      }
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected: check ", socket.id);
    });
  });
};

export default socketHandler;
