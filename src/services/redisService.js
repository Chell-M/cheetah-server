import redisClient from "../config/redisClient.js";

export const incrementActiveConnections = async (gameId) => {
  try {
    await redisClient.hIncrBy(`game:${gameId}`, "activeConnections", 1);
  } catch (error) {
    console.error(
      `Error incrementing active connections for game ${gameId}:`,
      error
    );
    throw error;
  }
};

export const saveGameResults = async (gameId, results) => {
  try {
    const gameKey = `game:${gameId}`;
    let existingResults = await redisClient.hGet(gameKey, "results");
    existingResults = existingResults ? JSON.parse(existingResults) : [];
    existingResults.push(results);

    await redisClient.hSet(gameKey, "results", JSON.stringify(existingResults));
    return existingResults;
  } catch (error) {
    console.error(`Error saving game results for game ${gameId}:`, error);
    throw error;
  }
};
