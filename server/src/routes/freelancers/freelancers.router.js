const express = require("express");
const { 
  httpGetFreelancerData,
  httpUpdateFreelancerProfile,
  httpCreateFreelancerService,
  httpUpdateFreelancerService,
  httpDeleteService,
 
} = require("./freelancers.controller");
const verifyToken = require("../../auth/auth.middleware");
const freelancerRouter = express.Router();

// Freelancer profile routes
freelancerRouter.get("/freelancer/profile", verifyToken, httpGetFreelancerData);
freelancerRouter.put("/freelancer/profile", verifyToken, httpUpdateFreelancerProfile);

// Service routes
freelancerRouter.post("/freelancer/services", verifyToken, httpCreateFreelancerService);
freelancerRouter.put("/freelancer/services",verifyToken,httpUpdateFreelancerService);
freelancerRouter.delete("/freelancer/services/:serviceId", verifyToken, httpDeleteService);


module.exports = freelancerRouter;
