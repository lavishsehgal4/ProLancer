const mongoose = require("mongoose");

const freelancerServiceMapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    }
  },
  { timestamps: true }
);

// Compound index (fast lookups)
freelancerServiceMapSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

module.exports = mongoose.model("FreelancerServiceMap", freelancerServiceMapSchema);
