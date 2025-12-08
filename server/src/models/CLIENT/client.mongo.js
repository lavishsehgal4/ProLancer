const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    // Link to User (identity stored there)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // BUSINESS DETAILS
    isCompany: {
      type: Boolean,
      default: false,
    },

    companyName: {
      type: String,
      trim: true,
    },

    companyDescription: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
    },

    // CLIENT PERFORMANCE / TRUST METRICS
    clientRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
    },

    clientLevel: {
      type: String,
      enum: ["new", "intermediate", "premium"],
      default: "new",
    },

    // VERIFICATION STATUS
    isVerified: {
      type: Boolean,
      default: false,
    },

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
