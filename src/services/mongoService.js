import Game from "../models/Game.js";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";

export const saveGameResultsToMongo = async (gameId, result) => {
  try {
    const game = await Game.findOne({ gameId });

    if (!game) {
      throw new Error("Game not found");
    }
    console.log(`Game found. Updating results for gameId: ${gameId}`);
    game.results.push(result);

    if (game.results.length === game.participants.length && !game.statsUpdated) {
      game.results.sort((a, b) => b.wpm - a.wpm);
      game.results[0].isWinner = true;
      console.log("All results received. Winner determined.");
    }

    await game.save();
    console.log(`Game updated and saved for gameId: ${gameId}`);

    return game;
  } catch (error) {
    console.error(`Error saving game results to MongoDB for game ${gameId}:`, error);
    throw error;
  }
};

export const updateUserStats = async (results, gameId) => {
  try {
    for (const result of results) {
      const user = await User.findOne({ username: result.username });
      if (!user) {
        console.warn(`User not found for username: ${result.username}`);
        continue;
      }

      console.log(`Updating stats for user: ${user.username}`);

      let isNewHighWPM = false;

      // Update highest WPM
      if (result.wpm > user.userStats.highestWPM) {
        isNewHighWPM = true;
        user.userStats.highestWPM = result.wpm;
      }

      // Calculate average WPM
      user.userStats.averageWPM =
        (user.userStats.averageWPM * user.gameStats.gamesPlayed + result.wpm) / (user.gameStats.gamesPlayed + 1);

      // Calculate average Accuracy
      user.userStats.averageAccuracy =
        (user.userStats.averageAccuracy * user.gameStats.gamesPlayed + result.accuracy) /
        (user.gameStats.gamesPlayed + 1);

      // Update game statistics
      user.gameStats.gamesPlayed += 1;

      // Update games won or lost
      if (result.isWinner) {
        user.gameStats.gamesWon = (user.gameStats.gamesWon || 0) + 1;
      } else {
        user.gameStats.gamesLost = (user.gameStats.gamesLost || 0) + 1;
      }

      await user.save();
      console.log(`User stats saved for username: ${user.username}`);
      // Update Leaderboard if a new high WPM is set
      if (isNewHighWPM) {
        const existingLeaderboardEntry = await Leaderboard.findOne({ username: user.username });

        if (existingLeaderboardEntry) {
          existingLeaderboardEntry.wpm = user.userStats.highestWPM;
          await existingLeaderboardEntry.save();
          console.log(`Leaderboard updated for user: ${user.username}`);
        } else {
          // If the user isn't on the leaderboard yet
          const newLeaderboardEntry = new Leaderboard({ username: user.username, wpm: user.userStats.highestWPM });
          await newLeaderboardEntry.save();
          console.log(`Leaderboard entry created for user: ${user.username}`);
        }
      }
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};
