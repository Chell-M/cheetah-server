import Game from "../models/Game.js";
import User from "../models/User.js";

export const saveGameResultsToMongo = async (gameId, participants, results) => {
  try {
    const game = await Game.findOne({ gameId });
    if (game) {
      console.log("Game found. Updating results");
      game.participants = participants;
      game.results = results;
      await game.save();
      console.log(`Game updated and saved for gameId: ${gameId}`);
    } else {
      await Game.create({ gameId, participants, results });
      console.log(`game data saved for gameId: ${gameId}`);
    }

    // Update each participant's stats
    await updateUsersStats(results);
  } catch (error) {
    console.error(
      `Error saving game results to MongoDB for game ${gameId}:`,
      error
    );
    throw error;
  }
};

export const updateUsersStats = async (results) => {
  try {
    for (const result of results) {
      const user = await User.findById(result.userId);
      if (user) {
        console.log(`User found. Updating stats for userId: ${user.id}`);

        // Update highestWPM if the result WPM is higher
        if (result.wpm > user.userStats.highestWPM) {
          user.userStats.highestWPM = result.wpm;
        }

        // Calculate average WPM
        user.userStats.averageWPM =
          (user.userStats.averageWPM * user.gameStats.gamesPlayed +
            result.wpm) /
          (user.gameStats.gamesPlayed + 1);

        // Calculate  average Accuracy
        user.userStats.averageAccuracy =
          (user.userStats.averageAccuracy * user.gameStats.gamesPlayed +
            result.accuracy) /
          (user.gameStats.gamesPlayed + 1);

        // Update game statistics
        user.gameStats.gamesPlayed += 1;

        await user.save();
        console.log(`User stats saved for userId: ${user.id}`);
      } else {
        console.log(`User not found for userId: ${result.userId}`);
      }
    }
  } catch (error) {
    console.error(`Error updating user stats:`, error);
    throw error;
  }
};
