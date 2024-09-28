import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  //TODO: complete the schema//include user stats
});

const User = mongoose.model("User", UserSchema);

export default User;
