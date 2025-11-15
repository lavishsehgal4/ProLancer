const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // Each profile has its own fields
    title: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    description: { type: String, trim: true },

    skills: [{ type: String }],
    primarySkills: [{ type: String }],
    categories: [{ type: String }],

    hourlyRate: { type: Number, required: true },
    currency: { type: String, default: "USD" },

    availability: {
      type: String,
      enum: ["full-time", "part-time", "contract", "flexible"],
      default: "flexible",
    },

    availableFrom: { type: Date },

    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
    },

    yearsOfExperience: { type: Number, default: 0 },

    // ✔ Added profile picture for this specific role
    profilePicture: { type: String, default: "" },

    // Per-profile ratings (optional)
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true } // timestamps for each profile
);

const freelancerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Array of multiple independent profiles
    profiles: [profileSchema],

    // Global stats for freelancer (not per-profile)
    totalEarnings: { type: Number, default: 0 },
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
