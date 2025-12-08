const express = require('express');
const { httpAddUserJob, httpGetAllRequests, httpRejectRequest, httpGetAllClientRequest } = require('./jobs.controller');
const verifyToken = require("../../auth/auth.middleware");
const jobsRouter = express.Router();

jobsRouter.post("/jobrequest/:serviceId", verifyToken, httpAddUserJob);
jobsRouter.get("/alljobs", verifyToken, httpGetAllRequests);
jobsRouter.put("/rejectjob/:jobId", verifyToken, httpRejectRequest);
jobsRouter.get("/client/alljobs", verifyToken, httpGetAllClientRequest);

module.exports = jobsRouter;