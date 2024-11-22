import { findOrCreateGame } from "../services/gameService.js";
import { saveGameResultsToMongo, updateUserStats } from "../services/mongoService.js";

const socketHandler = (io) => {
  console.log("socketHandler initialized");

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("joinGame", async ({ username }) => {
      try {
        const game = await findOrCreateGame(username);
        console.log(`User ${username} joined game ${game.gameId}`);
        socket.join(game.gameId);
        io.to(game.gameId).emit("updateGameState", game);

        if (game.status === "full") {
          setTimeout(() => {
            io.to(game.gameId).emit("beginRace");
          }, 3000);
        }
      } catch (error) {
        console.error("Error in joinGame:", error);
        socket.emit("error", {
          message: error.message || "Failed to join game",
        });
      }
    });

    socket.on("cursorUpdate", ({ gameId, cursorIndex, username }) => {
      if (!gameId || !username) {
        console.error("Missing gameId or username for cursor update");
        return;
      }
      socket.to(gameId).emit("opponentCursor", { cursorIndex });
    });

    socket.on("submitResults", async ({ results, gameId }) => {
      try {
        const updatedGame = await saveGameResultsToMongo(gameId, results);
        console.log("Submitted results:", results, gameId);
        io.to(gameId).emit("updateGameState", updatedGame);

        if (updatedGame.results.length === updatedGame.participants.length && !updatedGame.statsUpdated) {
          await updateUserStats(updatedGame.results, gameId);
          updatedGame.statsUpdated = true;
          await updatedGame.save();
          console.log(`User statistics updated for gameId: ${gameId}`);

          io.to(gameId).emit("raceFinished", updatedGame.results);
          console.log(`Race finished for gameId: ${gameId}`);
        }
      } catch (error) {
        console.error("Error in submitResults:", error);
        socket.emit("error", {
          message: error.message || "Failed to submit results",
        });
      }
    });

    socket.on("resetGame", (gameId) => {
      io.in(gameId).socketsLeave(gameId);
      socket.disconnect();
      console.log("User reset game and left all rooms:", socket.id);
    });

    // socket.on("listRooms", () => {
    //   console.log("Listing all rooms:");
    //   for (const [room, sockets] of io.sockets.adapter.rooms) {
    //     if (io.sockets.adapter.sids.get(room)) continue;
    //     console.log(`Room: ${room}, Sockets: ${Array.from(sockets)}`);
    //   }
    // });
  });
};

export default socketHandler;
