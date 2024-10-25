import redisClient from "../config/redisClient.js";

export const findOrCreateGame = async (userId, gameId = "test-game-id") => {
  try {
    // Set default gameId if not provided
    if (!gameId) {
      gameId = "test-game-id";
    }

    const gameKey = `game:${gameId}`;

    // Check if the game exists
    const gameExists = await redisClient.exists(gameKey);

    if (gameExists) {
      const gameData = await redisClient.hGetAll(gameKey);
      const participants = JSON.parse(gameData.participants);

      const isParticipant = participants.some(
        (participant) => participant.userId === userId
      );

      if (!isParticipant) {
        participants.push({ userId });
        await redisClient.hSet(gameKey, {
          participants: JSON.stringify(participants),
        });
        console.log(`User (${userId}) joined game ${gameId}`);
      } else {
        console.log(`User (${userId}) is already in game ${gameId}`);
      }

      return { gameId, participants };
    } else {
      // Create a new game
      const participants = [{ userId }];
      const game = {
        gameId,
        participants: JSON.stringify(participants),
      };
      await redisClient.hSet(gameKey, game);
      console.log(`New game created with ID: ${gameId} by user ${userId}`);

      return { gameId, participants };
    }
  } catch (error) {
    console.error(`Error in findOrCreateGame: ${error.message}`);
    throw new Error(`Error in findOrCreateGame: ${error.message}`);
  }
};
