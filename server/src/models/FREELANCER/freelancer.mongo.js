const mongoose = require("mongoose");

// Service Schema - embedded in freelancer schema
const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    hourlyRate: {
      type: Number,
      default: 50,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Freelancer Schema
const freelancerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Freelancer profile fields
    aboutMe: {
      type: String,
      trim: true,
      default: "",
    },
    education: {
      type: String,
      trim: true,
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Services array - array of service schema
    services: [serviceSchema],

    // Profile completion status
    isComplete: {
      type: Boolean,
      default: false,
    },

    completedJobs: { type: Number, default: 0 },
    activeJobs: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },

    // Global verification
    isVerified: { type: Boolean, default: false },
    verificationBadges: [{ type: String }],

    // Overall profile completion
    profileCompleted: { type: Boolean, default: false },
    profileCompletionPercentage: { type: Number, default: 0 },

    lastActiveAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Freelancer", freelancerSchema);
