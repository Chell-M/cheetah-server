import { handleJoinGame } from "./events/joinGame.js";
import { handleCursorUpdate } from "./events/cursorUpdate.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("joinGame", (data) => {
      handleJoinGame(socket, data, io);
    });

    socket.on("cursorUpdate", (data) => {
      handleCursorUpdate(socket, data, io);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
