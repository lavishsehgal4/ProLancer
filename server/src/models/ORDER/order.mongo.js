const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    freelancerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "in_progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Additional fields for order management
    acceptedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  { 
    timestamps: true,
    indexes: [
      { clientId: 1, status: 1 },
      { freelancerId: 1, status: 1 },
      { serviceId: 1 },
    ]
  }
);

module.exports = mongoose.model("Order", orderSchema);