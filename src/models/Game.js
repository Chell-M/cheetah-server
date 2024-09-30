import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true }, // Unique game ID
  /* participants: [
    {
      userId: { type: String, required: true },
      username: { type: String, required: true },
    },
  ], */
  status: {
    type: String,
    enum: ["open", "full", "completed"],
    default: "open",
  }, // Game status
  createdAt: { type: Date, default: Date.now },
  /*   winner: { userId: String }, */
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
