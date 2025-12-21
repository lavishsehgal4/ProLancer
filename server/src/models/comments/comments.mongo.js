const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },

    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // client
      required: true,
      index: true,
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // freelancer
      required: true,
      index: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // reviewed service
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🚫 One review per client per service
commentSchema.index(
  { clientId: 1, serviceId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Comment", commentSchema);
