const express = require('express');
const { httpAddUserJob, httpGetAllRequests } = require('./jobs.controller');
const verifyToken = require("../../auth/auth.middleware");
const jobsRouter = express.Router();

jobsRouter.post("/jobrequest/:serviceId", verifyToken, httpAddUserJob);
jobsRouter.get("/alljobs", verifyToken, httpGetAllRequests);


module.exports = jobsRouter;