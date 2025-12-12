const mongoose = require("mongoose");

const githubRepoSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectRequest",
      required: true,
      index: true,
    },

    repoName: {
      type: String,
      default: null,
    },

    repoUrl: {
      type: String,
      default: null,
    },

    // GitHub usernames (optional if not linked yet)
    freelancerGithub: {
      type: String,
      default: null,
    },

    clientGithub: {
      type: String,
      default: null,
    },

    // Status of repository creation
    status: {
      type: String,
      enum: ["not_created", "creating", "created", "failed"],
      default: "not_created",
    },

    // Error logs (optional — for debugging failed repo creation)
    lastError: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GithubRepo", githubRepoSchema);
