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
      socket.to(gameId).emit("opponentCursor", { cursorIndex });
    });

    socket.on("submitResults", async ({ results, gameId }) => {
      console.log("submitted results:", results, gameId);

      const updatedGame = await saveGameResultsToMongo(gameId, results);
      io.to(gameId).emit("updateGameState", updatedGame);
      console.log("saved game results", saveGameResultsToMongo);

      if (updatedGame.results.length === updatedGame.participants.length) {
        io.to(gameId).emit("raceFinished", updatedGame.results);
      }
    });

    socket.on("listRooms", () => {
      console.log("Listing all rooms:");
      for (const [room, sockets] of io.sockets.adapter.rooms) {
        if (io.sockets.adapter.sids.get(room)) continue;
        console.log(`Room: ${room}, Sockets: ${Array.from(sockets)}`);
      }
    });

    socket.on("resetGame", () => {
      socket.disconnect();
      console.log("User reset game and left all rooms:", socket.id);
    });
  });
};

export default socketHandler;
