const mongoose = require("mongoose");

const fileUploadSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectRequest",
      required: true,
      index: true,
    },

    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "zip", "img", "doc", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FileUpload", fileUploadSchema);
