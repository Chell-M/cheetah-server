import { createClient } from "redis";

// Initialize Redis client
const redisClient = createClient({
  url: "redis://localhost:6379",
});

// Handle connection errors
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// Connect to Redis with retry strategy
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully.");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    // Retry connection after a delay
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

// smooth shutdown
const gracefulShutdown = async () => {
  try {
    await redisClient.quit();
    console.log("Redis client disconnected gracefully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during Redis disconnection:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default redisClient;
