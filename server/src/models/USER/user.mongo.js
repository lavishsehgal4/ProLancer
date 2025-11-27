const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // REQUIRED ONLY FOR LOCAL USERS
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

    phoneNumber: {
      type: String,
    },

    profilePicture: {
      type: String,
    },

    country: {
      type: String,
      default: "india",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", userSchema);
