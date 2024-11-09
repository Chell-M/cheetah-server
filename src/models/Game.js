import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true },

  participants: [
    {
      userId: { type: String, required: true },
      _id: false,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  results: [
    {
      userId: { type: String, required: true },
      wpm: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      isWinner: { type: Boolean, default: false },
    },
  ],
  status: { type: String, default: "open" },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
