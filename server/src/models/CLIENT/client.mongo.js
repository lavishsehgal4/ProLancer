const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    // Relationship with User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each user can have only one client profile
      index: true,
    },

    // Company Info
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

    companyWebsite: {
      type: String,
      trim: true,
    },

    companySize: {
      type: String,
      enum: ["1-10", "10-50", "50-200", "200+"],
      default: "1-10",
    },

    industry: {
      type: String,
      trim: true,
    },

    // Active Job References
    activeJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    // Ratings
    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },

  // Automatically adds createdAt, updatedAt
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
