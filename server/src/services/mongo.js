const mongoose = require("mongoose");
const MONGO_URI = "mongodb://localhost:27017/FreelancingDB";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // await user.syncIndexes();
    // console.log("indexes synced");
    await console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop the server if DB fails
  }
};

module.exports = connectDB;
