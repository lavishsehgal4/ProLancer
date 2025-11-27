const mongoose = require("mongoose");

// Service Schema - embedded in freelancer schema
const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 200, // limit short bio
      required: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: 300,
      required: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      trim: true,
      required: true,
    },

    skills: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],

    hourlyRate: {
      type: Number,
      required: true,
      min: 1,
    },

    profilePicture: {
      type: String,
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
