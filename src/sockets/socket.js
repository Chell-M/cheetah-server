// src/sockets/socket.js
export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // When a user joins a game room
    socket.on("joinGame", ({ gameId, userId }) => {
      console.log(`User ${userId} attempting to join game: ${gameId}`);
      socket.join(gameId);

      // Check how many users are in the room
      const clients = io.sockets.adapter.rooms.get(gameId);
      if (clients && clients.size === 2) {
        console.log(`Both users are in game: ${gameId}. Starting game...`);
        io.in(gameId).emit("startGame", { gameId });
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
/* export const socketHandler = (io) => {
/* io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
  });
}; */
/* // When a user joins a game
    socket.on("joinGameRoom", ({ gameId }) => {
      socket.roomId = gameId;
      socket.join(gameId); // Join the WebSocket room for the game
      console.log(`User ${socket.userId} joined game room: ${gameId}`);

      io.in(gameId).emit("userJoined", { userId: socket.id });
      // Emit game update right after a new user joins
      Game.findOne({ gameId }).then((game) => {
        io.in(gameId).emit("gameUpdated", game);
      });
    });
*/
/* // Emit game updates to all users in the room
    socket.on("gameUpdated", (gameData) => {
      io.in(gameData.gameId).emit("gameUpdated", gameData);
      console.log("gameUpdated");
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
}; */
