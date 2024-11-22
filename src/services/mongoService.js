import Game from "../models/Game.js";

export const saveGameResultsToMongo = async (gameId, result) => {
  try {
    const game = await Game.findOne({ gameId });
    if (game) {
      console.log("Game found. Updating results");
      game.results.push(result);

      if (game.results.length === game.participants.length) {
        game.results.sort((a, b) => b.wpm - a.wpm);
        game.results[0].isWinner = true;
      }
      await game.save();
      console.log(`Game updated and saved for gameId: ${gameId}`);
      return game;
    } else {
      throw new Error("Game not found");
    }
    // await updateUsersStats(results);
  } catch (error) {
    console.error(`Error saving game results to MongoDB for game ${gameId}:`, error);
    throw error;
  }
};

// export const updateUsersStats = async (results) => {
//   try {
//     for (const result of results) {
//       const user = await User.findById(result.userId);
//       if (user) {
//         console.log(`User found. Updating stats for userId: ${user.id}`);

//         if (result.wpm > user.userStats.highestWPM) {
//           user.userStats.highestWPM = result.wpm;
//         }

//         // Calculate average WPM
//         user.userStats.averageWPM =
//           (user.userStats.averageWPM * user.gameStats.gamesPlayed + result.wpm) / (user.gameStats.gamesPlayed + 1);

//         // Calculate  average Accuracy
//         user.userStats.averageAccuracy =
//           (user.userStats.averageAccuracy * user.gameStats.gamesPlayed + result.accuracy) /
//           (user.gameStats.gamesPlayed + 1);

//         // Update game statistics
//         user.gameStats.gamesPlayed += 1;

//         await user.save();
//         console.log(`User stats saved for userId: ${user.id}`);
//       } else {
//         console.log(`User not found for userId: ${result.userId}`);
//       }
//     }
//   } catch (error) {
//     console.error(`Error updating user stats:`, error);
//     throw error;
//   }
// };
