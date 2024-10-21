/* export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // When a user joins a game room
    socket.on("joinGame", ({ gameId, userId }) => {
      console.log(`User ${userId} attempting to join game: ${gameId}`);
      socket.join(gameId);

      const clients = io.sockets.adapter.rooms.get(gameId);

      if (clients && clients.size === 2) {
        console.log(`Both users are in game: ${gameId}. starting game...`);
        io.in(gameId).emit("startGame", { gameId });

        // Listen for cursor updates and broadcast to the other user
        /* socket.on("cursorUpdate", ({ gameId, userId, cursorIndex }) => {
          socket
            .to(gameId)
            .emit("updateOpponentsCursor", { userId, cursorIndex });
        });
*/
/* }

      // Emit participantJoined event to all clients in the room
      io.in(gameId).emit("participantJoined", {
        gameId,
        participants: Array.from(clients).map((clientId) => {
          const clientSocket = io.sockets.sockets.get(clientId);
          return {
            userId: clientSocket.userId,
            username: clientSocket.username,
          };
        }),
      });
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}; */
