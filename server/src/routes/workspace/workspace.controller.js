const { getGithubUsernameById } = require("../../models/USER/user.model");
const { getJobById } = require("../../models/RequestJob/RequestJob.model");

const {
    createGithubRepoRecord,
    updateGithubStatus,
    saveGithubRepoInfo,
    getGithubRepoByJobId
} = require("../../models/GithubRepo/GithubRepo.model");
const {
  createTask,
  getTasksByJobId,
  updateTaskStatus,
  deleteTask,
} = require("../../models/Task/Task.model");

const { createRepository,addCollaborator } = require("../../github/github.service");


async function httpCreateGithubRepo(req, res) {
    try {
        const { jobId } = req.params;
        const { repoName, repoDescription } = req.body;
        const freelancerId = req.user.userId; // from JWT

        if (!repoName) {
            return res.status(400).json({
                success: false,
                message: "Repository name is required",
            });
        }

        // 1️⃣ Validate job exists
        const jobRes = await getJobById(jobId);

        if (!jobRes.success) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const job = jobRes.data;

        // 2️⃣ Validate freelancer is assigned to this job
        if (String(job.freelancerId) !== String(freelancerId)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to create a repo for this job",
            });
        }

        // 3️⃣ Fetch freelancer GitHub username
        const ghRes = await getGithubUsernameById(freelancerId);

        if (!ghRes.success || !ghRes.githubUsername) {
            return res.status(400).json({
                success: false,
                message: "Freelancer GitHub username is missing from profile",
            });
        }

        const freelancerGithub = ghRes.githubUsername;

        // 4️⃣ Create DB record
        await createGithubRepoRecord(jobId, freelancerGithub, null);
        await updateGithubStatus(jobId, "creating");

        // 5️⃣ Attempt repo creation
        const repoRes = await createRepository(
            repoName,
            repoDescription,
            freelancerGithub,
            null
        );

        if (!repoRes.success) {
            await updateGithubStatus(jobId, "failed", repoRes.message);

            return res.status(500).json({
                success: false,
                message: "GitHub repo creation failed",
                error: repoRes.error,
            });
        }

        const { repoUrl, repoName: finalRepoName } = repoRes;

        // 6️⃣ Save repo info
        await saveGithubRepoInfo(jobId, finalRepoName, repoUrl);

        // 7️⃣ Set status to created
        await updateGithubStatus(jobId, "created");

        return res.status(200).json({
            success: true,
            message: "Repository created successfully",
            repoUrl,
            repoName: finalRepoName,
        });

    } catch (err) {
        console.error("Repo Creation Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while creating GitHub repository",
        });
    }
}

async function httpGetGithubRepoStatus(req, res) {
  try {
    const { jobId } = req.params;

    const repoRes = await getGithubRepoByJobId(jobId);

    if (!repoRes.success) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: "No repo created for this job yet",
      });
    }

    const repo = repoRes.data;

    return res.status(200).json({
      success: true,
      exists: true,
      status: repo.status,
      repoName: repo.repoName,
      repoUrl: repo.repoUrl,
    });

  } catch (err) {
    console.error("Error fetching repo status:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function httpAddCollaborator(req, res) {
  try {
    const { jobId } = req.params;
    const loggedInUserId = req.user.userId;
    const accountType = req.user.accountType; // comes from JWT

    // 1️⃣ Only CLIENT is allowed to add collaborator → himself only
    if (accountType !== "client") {
      return res.status(403).json({
        success: false,
        message: "Only clients can add themselves as collaborators",
      });
    }

    // 2️⃣ Client collaborates only himself → override userId
    const userIdToAdd = loggedInUserId;

    // 3️⃣ Get repo by jobId
    const repoRes = await getGithubRepoByJobId(jobId);
    if (!repoRes.success) {
      return res.status(404).json({
        success: false,
        message: "Repository not found for this job",
      });
    }

    const repo = repoRes.data;

    if (!repo.repoName) {
      return res.status(400).json({
        success: false,
        message: "Repository exists but repoName is missing",
      });
    }

    // 4️⃣ Get GitHub username of the client (cannot add someone else)
    const userRes = await getGithubUsernameById(userIdToAdd);

    if (!userRes.success || !userRes.githubUsername) {
      return res.status(400).json({
        success: false,
        message: "Client must add GitHub username in their profile first",
      });
    }

    const username = userRes.githubUsername;

    // 5️⃣ Force permission = pull (read-only)
    const permission = "pull";

    // 6️⃣ Add collaborator through GitHub API
    const collabRes = await addCollaborator(repo.repoName, username, permission);

    if (!collabRes.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to add collaborator",
        error: collabRes.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Client ${username} added as read-only collaborator`,
      username,
      permission,
    });

  } catch (err) {
    console.error("Add Collaborator Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// 1️⃣ CREATE TASK
async function httpCreateTask(req, res) {
  try {
    const { jobId } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // Validate job belongs to freelancer OR client
    const jobRes = await getJobById(jobId);
    if (!jobRes.success) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const job = jobRes.data;

    if (
      String(job.freelancerId) !== String(userId) &&
      String(job.clientId) !== String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add tasks",
      });
    }

    const taskRes = await createTask(jobId, title);

    return res.status(201).json(taskRes);

  } catch (err) {
    console.error("Create Task Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



// 2️⃣ GET ALL TASKS FOR JOB
async function httpGetTasks(req, res) {
  try {
    const { jobId } = req.params;

    const taskRes = await getTasksByJobId(jobId);

    return res.status(200).json(taskRes);

  } catch (err) {
    console.error("Get Tasks Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



// 3️⃣ TOGGLE CHECKBOX (update task completion)
async function httpUpdateTaskStatus(req, res) {
  try {
    const { taskId } = req.params;
    const { isCompleted } = req.body;

    const updateRes = await updateTaskStatus(taskId, isCompleted);

    return res.status(200).json(updateRes);

  } catch (err) {
    console.error("Update Task Status Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



// 4️⃣ DELETE TASK
async function httpDeleteTask(req, res) {
  try {
    const { taskId } = req.params;

    const deleteRes = await deleteTask(taskId);

    return res.status(200).json(deleteRes);

  } catch (err) {
    console.error("Delete Task Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


module.exports = { httpCreateGithubRepo ,httpGetGithubRepoStatus,httpAddCollaborator,httpCreateTask,
  httpGetTasks,
  httpUpdateTaskStatus,
  httpDeleteTask,};
