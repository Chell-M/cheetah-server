import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userStats: {
    highestWPM: { type: Number, default: 0 },
    averageWPM: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
  },
  gameStats: {
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    gamesLost: { type: Number, default: 0 },
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
