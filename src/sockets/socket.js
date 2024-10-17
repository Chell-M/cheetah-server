export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // When a user joins a game room
    socket.on("joinGame", ({ gameId, userId }) => {
      console.log(`User ${userId} attempting to join game: ${gameId}`);
      socket.join(gameId);

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
