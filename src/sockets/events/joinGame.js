import Game from "../../models/Game.js";

export const handleJoinGame = (socket, data, io) => {
  const { gameId, userId } = data;
  console.log(`User ${userId} attempting to join game: ${gameId}`);

  socket.join(gameId);
  console.log(`User ${userId} has joined room: ${gameId}`);

  // Emit userJoined event
  io.in(gameId).emit("userJoined", { userId: socket.id });

  // Fetch game and handle events
  Game.findOne({ gameId })
    .then((game) => {
      if (!game) {
        console.log(`Game not found: ${gameId}`);
        return socket.emit("error", { message: "Game not found" });
      }

      console.log(`Game found: ${gameId}. Emitting gameUpdated event.`);
      io.in(gameId).emit("gameUpdated", game);

      const clients = io.sockets.adapter.rooms.get(gameId) || new Set();
      console.log(
        `Current clients in game room ${gameId}:`,
        Array.from(clients)
      );

      // Emit participantJoined event
      const participants = Array.from(clients).map((clientId) => {
        const clientSocket = io.sockets.sockets.get(clientId);
        return {
          userId: clientSocket.userId,
          username: clientSocket.username,
        };
      });

      io.in(gameId).emit("participantJoined", {
        gameId,
        participants,
      });

      if (clients.size === 2) {
        console.log(`Both users are in game: ${gameId}. Starting game...`);
        io.in(gameId).emit("startGame", { gameId });
      } else {
        console.log(
          `Waiting for more players. Current number of participants: ${clients.size}`
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching game:", error);
      socket.emit("error", { message: "Server error" });
    });
};
