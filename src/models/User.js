import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userStats: {
    highestWPM: { type: Number, default: "" },
    averageWPM: { type: Number, default: "" },
    averageAccuracy: { type: Number, default: "" },
  },
  gameStats: {
    gamesPlayed: { type: Number, default: "" },
    gamesWon: { type: Number, default: "" },
    gamesLost: { type: Number, default: "" },
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
