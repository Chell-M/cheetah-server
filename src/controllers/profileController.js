import User from "../models/User.js";

// Fetch user profile by userId or username
export const getUserProfile = async (req, res) => {
  const { userId, username } = req.query;

  try {
    let user;
    if (userId) {
      user = await User.findById(userId).select("-password -__v");
    } else {
      user = await User.findOne({ username }).select("-password -__v");
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
