import { findOrCreateGame } from "../services/gameService.js";
import { saveGameResultsToMongo } from "../services/mongoService.js";

const socketHandler = (io) => {
  console.log("socketHandler initialized");

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("joinGame", async ({ userId }) => {
      try {
        const game = await findOrCreateGame(userId);
        console.log(`User ${userId} joined game ${game.gameId}`);

        socket.join(game.gameId);

        io.to(game.gameId).emit("updateGameState", game);

        if (game.status === "full") {
          io.to(game.gameId).emit("beginRace");
        }
      } catch (error) {
        socket.emit("error", {
          message: error.message || "Failed to join game",
        });
      }
    });

    socket.on("cursorUpdate", ({ gameId, userId, cursorIndex }) => {
      if (!gameId || !userId) {
        console.error("Missing gameId or userId for cursor update");
        return;
      }
      // Broadcast the cursor position to other participants in the game room
      socket.to(gameId).emit("opponentCursor", { cursorIndex });
    });

    socket.on("submitResults", async ({ results, gameId }) => {
      console.log("submitted results:", results, gameId);

      // Save the results to the database
      const updatedGame = await saveGameResultsToMongo(gameId, results);
      io.to(gameId).emit("updateGameState", updatedGame);
      console.log("saved game results", saveGameResultsToMongo);

      // If all participants have submitted results, emit the raceFinished event
      if (updatedGame.results.length === updatedGame.participants.length) {
        io.to(gameId).emit("raceFinished", updatedGame.results);
      }
    });

    // if (!game) {
    //   socket.on("gameData", ({ gameState }) => {
    //     console.log(gameState);
    //     game = gameState;
    //     console.log(game, "game");
    //   });
    // }

    // if (numberOfClients === 2) {
    //   // Emit the updated game state to all participants
    //   console.log(game.status, "GAME STATUS");
    //   io.to(game.gameId).emit("beginRace");
    //   console.log(game);
    // }

    // socket.on("cursorUpdate", ({ gameId, userId, cursorIndex }) => {
    //   socket.to(gameId).emit("cursorUpdate", { userId, cursorIndex });
    // });

    // socket.on("gameResults", ({ gameId, results }) => {
    //   io.to(gameId).emit("gameResults", results);
    // });
  });
};

export default socketHandler;
