import redisClient from "../config/redisClient.js";

const getGameKey = (gameId) => `game:${gameId}`;

// Helper function to fetch game data by gameId
const fetchGameData = async (gameId) => {
  const gameData = await redisClient.hGetAll(getGameKey(gameId));
  return {
    gameId,
    participants: JSON.parse(gameData.participants),
    status: gameData.status,
  };
};

// Helper function to save game data by gameId
const setGameData = async (gameId, data) => {
  await redisClient.hSet(getGameKey(gameId), {
    participants: JSON.stringify(data.participants),
    status: data.status,
  });
};

// Find an available game in Redis
export const getGameFromRedis = async () => {
  try {
    const keys = await redisClient.keys("game:*");

    for (const key of keys) {
      const game = await fetchGameData(key.split(":")[1]); // Use helper to fetch game data

      if (game.participants.length === 1 && game.status === "waiting") {
        return game;
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding available game:", error);
    throw error;
  }
};

// Save a new game to Redis
export const saveGameToRedis = async (game) => {
  try {
    await setGameData(game.gameId, game); // Use helper to set game data
    console.log(`Game saved with ID: ${game.gameId}`);
  } catch (error) {
    console.error("Error saving new game:", error);
    throw error;
  }
};

// Add a user to an existing game in Redis
export const addUserToGame = async (gameId, userId) => {
  try {
    const game = await fetchGameData(gameId); // Fetch existing game data
    game.participants.push({ userId }); // Add the new participant

    await setGameData(gameId, game); // Save the updated game data
    console.log(`User ${userId} added to game ${gameId}`);
    return game;
  } catch (error) {
    console.error("Error adding user to game:", error);
    throw error;
  }
};

// Update the game status in Redis
export const updateGameStatusInRedis = async (gameId, status) => {
  try {
    const game = await fetchGameData(gameId); // Fetch existing game data
    game.status = status; // Update the status

    await setGameData(gameId, game); // Save the updated game data
    console.log(`Game ${gameId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating game status:", error);
    throw error;
  }
};

// import redisClient from "../config/redisClient.js";
// import { saveGameResultsToMongo } from "./mongoService.js";

// export const incrementActiveConnections = async (gameId) => {
//   try {
//     await redisClient.hIncrBy(`game:${gameId}`, "activeConnections", 1);
//   } catch (error) {
//     console.error(
//       `Error incrementing active connections for game ${gameId}:`,
//       error
//     );
//     throw error;
//   }
// };

// export const saveGameResults = async (gameId, results) => {
//   try {
//     const gameKey = `game:${gameId}`;
//     let existingResults = await redisClient.hGet(gameKey, "results");
//     existingResults = existingResults ? JSON.parse(existingResults) : [];
//     existingResults.push(results);

//     await redisClient.hSet(gameKey, "results", JSON.stringify(existingResults));

//     const resultCount = await redisClient.hIncrBy(gameKey, "resultCount", 1);

//     const gameData = await redisClient.hGetAll(gameKey);
//     const participants = JSON.parse(gameData.participants);

//     if (resultCount === participants.length) {
//       setTimeout(async () => {
//         await saveGameResultsToMongo(gameId, participants, existingResults);
//         console.log(`Results for Game ${gameId} saved to MongoDB`);
//         // Reset the game state in Redis

//         await redisClient.del(gameKey);
//         console.log(`Redis key ${gameKey} deleted after MongoDB save`);
//       }, 0);
//     }
//     return existingResults;
//   } catch (error) {
//     console.error(`Error saving game results for game ${gameId}:`, error);
//     throw error;
//   }
// };
