const GithubRepo = require("./GithubRepo.mongo");


// 1️⃣ Create a repo record BEFORE actually creating GitHub repo
async function createGithubRepoRecord(jobId, freelancerGithub, clientGithub) {
  try {
    let existing = await GithubRepo.findOne({ jobId });
    if (existing) {
      return {
        success: false,
        message: "A GitHub repo record already exists for this job",
      };
    }

    const record = await GithubRepo.create({
      jobId,
      freelancerGithub: freelancerGithub || null,
      clientGithub: clientGithub || null,
      status: "creating",
    });

    return {
      success: true,
      data: record,
    };

  } catch (err) {
    return {
      success: false,
      message: "Failed to create GitHub repo record",
      error: err.message,
    };
  }
}



// 2️⃣ Update status ("creating" → "created" or "failed")
async function updateGithubStatus(jobId, status, lastError = null) {
  try {
    const repo = await GithubRepo.findOneAndUpdate(
      { jobId },
      { $set: { status, lastError } },
      { new: true }
    );

    return {
      success: true,
      data: repo,
    };

  } catch (err) {
    return {
      success: false,
      message: "Failed to update GitHub status",
      error: err.message,
    };
  }
}



// 3️⃣ Save repo name + repo URL after successful creation
async function saveGithubRepoInfo(jobId, repoName, repoUrl) {
  try {
    const repo = await GithubRepo.findOneAndUpdate(
      { jobId },
      {
        $set: {
          repoName,
          repoUrl,
          status: "created",
          lastError: null,
        },
      },
      { new: true }
    );

    return {
      success: true,
      data: repo,
    };

  } catch (err) {
    return {
      success: false,
      message: "Failed to save GitHub repo info",
      error: err.message,
    };
  }
}



// 4️⃣ Get repo details for workspace page
async function getGithubRepoByJobId(jobId) {
  try {
    const repo = await GithubRepo.findOne({ jobId });

    if (!repo) {
      return {
        success: false,
        message: "No GitHub repo found for this job",
      };
    }

    return {
      success: true,
      data: repo,
    };

  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}


module.exports = {
  createGithubRepoRecord,
  updateGithubStatus,
  saveGithubRepoInfo,
  getGithubRepoByJobId,
};
