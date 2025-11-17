const express = require("express");
const { httpGetFreelancerData ,httpUpdateFreelancerProfile,httpCreateFreelancerService} = require("./freelancers.controller");
const verifyToken = require("../../auth/auth.middleware");
const freelancerRouter = express.Router();

freelancerRouter.get("/freelancer/profile", verifyToken, httpGetFreelancerData);

freelancerRouter.post("/freelancer/services",verifyToken,httpCreateFreelancerService);

freelancerRouter.put("/freelancer/profile",verifyToken,httpUpdateFreelancerProfile);
module.exports = freelancerRouter;
