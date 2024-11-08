// import redisClient from "../config/redisClient";

// const getGameKey = (gameId) => `game:${gameId}`;

// // Helper function to fetch game data by gameId
// const fetchGameData = async (gameId) => {
//   const gameData = await redisClient.hGetAll(getGameKey(gameId));
//   return {
//     gameId,
//     participants: JSON.parse(gameData.participants),
//     status: gameData.status,
//   };
// };

// // Helper function to save game data by gameId
// const setGameData = async (gameId, data) => {
//   await redisClient.hSet(getGameKey(gameId), {
//     participants: JSON.stringify(data.participants),
//     status: data.status,
//   });
// };

// // Find an available game in Redis
// export const getGameFromRedis = async () => {
//   try {
//     const keys = await redisClient.keys("game:*");

//     for (const key of keys) {
//       const game = await fetchGameData(key.split(":")[1]); // Use helper to fetch game data

//       if (game.participants.length === 1 && game.status === "waiting") {
//         return game;
//       }
//     }

//     return null;
//   } catch (error) {
//     console.error("Error finding available game:", error);
//     throw error;
//   }
// };

// // Save a new game to Redis
// export const saveGameToRedis = async (game) => {
//   try {
//     await setGameData(game.gameId, game); // Use helper to set game data
//     console.log(`Game saved with ID: ${game.gameId}`);
//   } catch (error) {
//     console.error("Error saving new game:", error);
//     throw error;
//   }
// };

// // Add a user to an existing game in Redis
// export const addUserToGame = async (gameId, userId) => {
//   try {
//     const game = await fetchGameData(gameId); // Fetch existing game data
//     game.participants.push({ userId }); // Add the new participant

//     await setGameData(gameId, game); // Save the updated game data
//     console.log(`User ${userId} added to game ${gameId}`);
//     return game;
//   } catch (error) {
//     console.error("Error adding user to game:", error);
//     throw error;
//   }
// };

// // Update the game status in Redis
// export const updateGameStatusInRedis = async (gameId, status) => {
//   try {
//     const game = await fetchGameData(gameId); // Fetch existing game data
//     game.status = status; // Update the status

//     await setGameData(gameId, game); // Save the updated game data
//     console.log(`Game ${gameId} status updated to ${status}`);
//   } catch (error) {
//     console.error("Error updating game status:", error);
//     throw error;
//   }
// };
