import { getOpenGames, createNewGame, addUserToGameService } from "../services/gameService.js";

const socketHandler = (io) => {
  console.log("socketHandler initialized");

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("joinGame", async ({ userId }) => {
      try {
        const openGames = await getOpenGames();
        console.log("Open games:", openGames);
        let game;
        if (openGames.length === 0) {
          game = await createNewGame(userId);
          console.log(`Created new game with ID: ${game.gameId}`);
        } else {
          const gameId = openGames[0].gameId;
          game = await addUserToGameService(gameId, userId);
          console.log(`User ${userId} joined game ${game.gameId}`);
        }
        socket.join(game.gameId);

        io.to(game.gameId).emit("updateGameState", game);

        const room = io.sockets.adapter.rooms.get(game.gameId);
        const numberOfClients = room ? room.size : 0;
        console.log(`Number of clients in ${game.gameId} ${numberOfClients}`);

        // if (numberOfClients === 2) {
        //   // Emit the updated game state to all participants
        //   console.log(game.status, "GAME STATUS");
        //   io.to(game.gameId).emit("beginRace");
        //   console.log(game);
        // }

        console.log(numberOfClients);
      } catch (error) {
        socket.emit("error", {
          message: error.message || "Failed to join game",
        });
      }
    });

    socket.on("gameData", ({ gameState }) => {
      console.log("recieved gameId:", { gameState });
    });

    socket.on("cursorUpdate", ({ gameId, userId, cursorIndex }) => {
      socket.to(gameId).emit("cursorUpdate", { userId, cursorIndex });
    });

    socket.on("gameResults", ({ gameId, results }) => {
      io.to(gameId).emit("gameResults", results);
    });
  });
};

export default socketHandler;
