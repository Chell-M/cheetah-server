import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  wpm: { type: Number, required: true },
});
leaderboardSchema.index({ wpm: -1 });

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
