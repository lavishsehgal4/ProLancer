const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
    },

    accountType: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
      index: true,
    },

    phone: {
      type: String,
    },

    profilePicture: {
      type: String,
    },

    country: {
      type: String,
      default: "india",
    },

    city: {
      type: String,
    },

    timezone: {
      type: String,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", userSchema);
