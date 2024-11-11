import {
  getOpenGames,
  createNewGame,
  addUserToGameService,
} from "../services/gameService.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGame", async ({ userId }) => {
      try {
        // Fetch open games
        const openGames = await getOpenGames();
        console.log("Open games:", openGames);
        let game;

        if (openGames.length === 0) {
          // No open games found; create a new game
          game = await createNewGame(userId);
          console.log(`Created new game with ID: ${game.gameId}`);
        } else {
          // Join the first available open game
          const gameId = openGames[0].gameId;
          game = await addUserToGameService(gameId, userId);
          console.log(`User ${userId} joined game ${game.gameId}`);
        }

        // Join the Socket.IO room based on `gameId`
        socket.join(game.gameId);
        console.log(socket.rooms);
        const room = io.sockets.adapter.rooms.get(game.gameId);
        const numberOfClients = room ? room.size : 0;
        console.log(`Number of clients in ${game.gameId} ${numberOfClients}`);

        // Emit the updated game state to all participants
        io.to(game.gameId).emit("updateGameState", game);
      } catch (error) {
        console.error("Error handling join game:", error);
        socket.emit("error", {
          message: error.message || "Failed to join game",
        });
      }
    });

    socket.on("cursorUpdate", ({ gameId, userId, cursorIndex }) => {
      socket.to(gameId).emit("cursorUpdate", { userId, cursorIndex });
    });

    socket.on("gameResults", ({ gameId, results }) => {
      io.to(gameId).emit("gameResults", results);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;
