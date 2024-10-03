import User from "../models/User.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  // Check both
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both username and password" });
  }

  try {
    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    console.log("account created", newUser);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Log in existing user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both username and password" });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Logged In:", user.username);
    return res.status(200).json({ userId: user._id, username: user.username });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
