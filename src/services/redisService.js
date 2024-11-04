import redisClient from "../config/redisClient.js";
import { saveGameResultsToMongo } from "./mongoService.js";

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

    const resultCount = await redisClient.hIncrBy(gameKey, "resultCount", 1);

    const gameData = await redisClient.hGetAll(gameKey);
    const participants = JSON.parse(gameData.participants);

    if (resultCount === participants.length) {
      setTimeout(async () => {
        await saveGameResultsToMongo(gameId, participants, existingResults);
        console.log(`Results for Game ${gameId} saved to MongoDB`);
        // Reset the game state in Redis

        await redisClient.del(gameKey);
        console.log(`Redis key ${gameKey} deleted after MongoDB save`);
      }, 0);
    }
    return existingResults;
  } catch (error) {
    console.error(`Error saving game results for game ${gameId}:`, error);
    throw error;
  }
};
