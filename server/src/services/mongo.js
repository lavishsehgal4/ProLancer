const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI not found in environment variables");
    }

    const conn = await mongoose.connect(MONGO_URI);

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
