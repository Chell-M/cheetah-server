import Game from "../models/Game.js";

export const findOrCreateGame = async (userId, gameId = "test-game-id") => {
  try {
    let game = await Game.findOne({ gameId });

    if (game) {
      const isParticipant = game.participants.some(
        (participant) => participant.userId === userId
      );

      if (!isParticipant) {
        game.participants.push({ userId });
        await game.save();
        console.log(`User (${userId}) joined game ${game.gameId}`);
      } else {
        console.log(`User (${userId}) is already in game ${game.gameId}`);
      }
    } else {
      // Create a new game with the fixed gameId
      game = new Game({
        gameId: "test-game-id",
        participants: [{ userId }],
      });
      await game.save();
      console.log(`New game created with ID: ${game.gameId} by user ${userId}`);
    }

    return game.gameId;
  } catch (error) {
    console.error(`Error in findOrCreateGame: ${error.message}`);
    throw new Error(`Error in findOrCreateGame: ${error.message}`);
  }
};
