const express = require('express');
const { httpAddUserJob, httpGetJobs, httpUpdateJobStatus } = require('./jobs.controller');
const verifyToken = require("../../auth/auth.middleware");
const jobsRouter = express.Router();

jobsRouter.post("/jobrequest/:serviceId", verifyToken, httpAddUserJob);
jobsRouter.get("/jobs", verifyToken, httpGetJobs);
jobsRouter.patch("/job/:jobId/status", verifyToken, httpUpdateJobStatus);


module.exports = jobsRouter;