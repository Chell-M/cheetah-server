import Leaderboard from "../models/Leaderboard.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find({}).select("username wpm -_id").sort({ wpm: -1 });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateLeaderboard = async (req, res) => {
  const { username, wpm } = req.body;

  if (!username || typeof wpm !== "number") {
    return res.status(400).json({ message: "Invalid data provided." });
  }
  try {
    const existingEntry = await Leaderboard.findOne({ username });

    if (existingEntry) {
      if (wpm > existingEntry.wpm) {
        existingEntry.wpm = wpm;
        await existingEntry.save();
        console.log(`Leaderboard updated for user: ${username}`);
      }
    } else {
      const newEntry = new Leaderboard({ username, wpm });
      await newEntry.save();
      console.log(`New leaderboard entry created for user: ${username}`);
    }

    const leaderboard = await Leaderboard.find({}).sort({ wpm: -1 }).select("username wpm -_id");

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
