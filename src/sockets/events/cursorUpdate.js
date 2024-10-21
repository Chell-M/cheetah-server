export const handleCursorUpdate = (socket, data, io) => {
  const { gameId, userId, cursorIndex } = data;
  console.log(`Received cursor update from user ${userId}: ${cursorIndex}`);

  // Broadcast to the other user in the game room
  socket.to(gameId).emit("updateOpponentsCursor", { userId, cursorIndex });
};
