import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true }, // Unique game ID
  participants: [
    {
      userId: { type: String, required: true },
      _id: false,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  result: { userId: String },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
