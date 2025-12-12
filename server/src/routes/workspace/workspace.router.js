const express = require("express");
const { httpCreateGithubRepo, httpGetGithubRepoStatus, httpAddCollaborator } = require("./workspace.controller");
const {
  httpCreateTask,
  httpGetTasks,
  httpUpdateTaskStatus,
  httpDeleteTask,
} = require("./workspace.controller");
const verifyToken = require("../../auth/auth.middleware");

const workspaceRouter = express.Router();

// CREATE REPO (Freelancer only)
workspaceRouter.post(
  "/repo/create/:jobId",
  verifyToken,
  httpCreateGithubRepo
);

workspaceRouter.get(
  "/repo/status/:jobId",
  verifyToken,
  httpGetGithubRepoStatus
);

workspaceRouter.post(
  "/repo/:jobId/collaborator",
  verifyToken,
  httpAddCollaborator
);

workspaceRouter.post("/:jobId", verifyToken, httpCreateTask);

// GET ALL TASKS FOR A JOB
workspaceRouter.get("/:jobId", verifyToken, httpGetTasks);

// UPDATE TASK STATUS (checkbox toggle)
workspaceRouter.put("/update/:taskId", verifyToken, httpUpdateTaskStatus);

// DELETE TASK
workspaceRouter.delete("/:taskId", verifyToken, httpDeleteTask);
module.exports = workspaceRouter;
