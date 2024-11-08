import { v4 as uuidv4 } from "uuid";

import {
  getGameFromRedis,
  saveGameToRedis,
  addUserToGame,
  updateGameStatusInRedis,
} from "../services/redisService.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGame", async ({ userId }) => {
      console.log(`Received joinGame event for userId: ${userId}`);
      try {
        // 1. Check for an available game
        let game = await getGameFromRedis();
        console.log("Checked for available game:", game);

        if (!game) {
          // 2. No open game found, so create a new game
          const gameId = uuidv4();
          game = { gameId, participants: [{ userId }], status: "waiting" };
          await saveGameToRedis(game);
          console.log(`Created new game with ID: ${gameId}`);
        } else {
          // 3. Open game found, so add the user to this game
          game = await addUserToGame(game.gameId, userId);
          console.log(`User ${userId} joined existing game ${game.gameId}`);
        }

        // 4. Join the user to the Socket.IO room based on `gameId`
        socket.join(game.gameId);
        console.log(`User ${userId} joined room for game ${game.gameId}`);

        // 5. Notify all participants in the room with the updated game state
        io.to(game.gameId).emit("gameUpdate", game);
        console.log(`Emitted gameUpdate for game ${game.gameId}`);

        // 6. If two participants have joined, start the game
        if (game.participants.length === 2) {
          game.status = "active";
          await updateGameStatusInRedis(game.gameId, "active");
          io.to(game.gameId).emit("startGame", game);
          console.log(`Game ${game.gameId} started with 2 participants`);
        }
      } catch (error) {
        console.error("Error joining game:", error);
        socket.emit("error", {
          message: "Failed to join game",
          error: error.message,
        });
      }
    });

    // Handler for cursor updates
    socket.on("cursorUpdate", ({ gameId, userId, cursorIndex }) => {
      console.log(
        `Cursor update from user ${userId} in game ${gameId}: ${cursorIndex}`
      );
      socket.to(gameId).emit("opponentCursorUpdate", { userId, cursorIndex });
      console.log(`Emitted opponentCursorUpdate for game ${gameId}`);
    });

    // Handler for game results (e.g., end of the game)
    socket.on("gameResults", async ({ gameId, results }) => {
      console.log(`Game results for gameId: ${gameId}`, results);
      io.to(gameId).emit("gameResultsUpdate", results);
      console.log(`Emitted gameResultsUpdate for game ${gameId}`);
      // Update Redis or perform additional cleanup if needed
    });

    // Handler for disconnections
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      // Handle disconnection logic, e.g., update Redis, notify remaining participants
    });
  });
};

export default socketHandler;
