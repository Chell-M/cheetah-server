import Game from "../models/Game.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for the joinGame event
    socket.on("connectUser", ({ userId }) => {
      socket.userId = userId;
      let socketId = socket.id;
      console.log(`User ${userId} connected with socketId: ${socketId}`);
    });

    // When a user joins a game
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

    // Emit game updates to all users in the room
    socket.on("gameUpdated", (gameData) => {
      io.in(gameData.gameId).emit("gameUpdated", gameData);
      console.log("gameUPdated");
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};
