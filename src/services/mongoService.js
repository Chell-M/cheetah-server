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
    }
    await game.save();

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

      let isNewHighWPM = false;

      // highest WPM
      if (result.wpm > user.userStats.highestWPM) {
        isNewHighWPM = true;
        user.userStats.highestWPM = result.wpm;
      }

      // average WPM
      user.userStats.averageWPM =
        (user.userStats.averageWPM * user.gameStats.gamesPlayed + result.wpm) / (user.gameStats.gamesPlayed + 1);

      // average Accuracy
      user.userStats.averageAccuracy =
        (user.userStats.averageAccuracy * user.gameStats.gamesPlayed + result.accuracy) /
        (user.gameStats.gamesPlayed + 1);

      // amount of games played
      user.gameStats.gamesPlayed += 1;

      // games win/loss
      if (result.isWinner) {
        user.gameStats.gamesWon = (user.gameStats.gamesWon || 0) + 1;
      } else {
        user.gameStats.gamesLost = (user.gameStats.gamesLost || 0) + 1;
      }

      await user.save();
      console.log(`User stats saved for username: ${user.username}`);
      if (isNewHighWPM) {
        const existingLeaderboardEntry = await Leaderboard.findOne({ username: user.username });

        if (existingLeaderboardEntry) {
          existingLeaderboardEntry.wpm = user.userStats.highestWPM;
          console.log(existingLeaderboardEntry, "user already has existing");
          await existingLeaderboardEntry.save();
        } else {
          const newLeaderboardEntry = new Leaderboard({ username: user.username, wpm: user.userStats.highestWPM });
          console.log(newLeaderboardEntry, "new leader board entry");
          await newLeaderboardEntry.save();
        }
      }
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};
