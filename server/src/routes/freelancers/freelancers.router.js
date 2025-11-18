const express = require("express");
const { 
  httpGetFreelancerData,
  httpUpdateFreelancerProfile,
  httpCreateFreelancerService,
  httpUpdateFreelancerService,
  httpDeleteService,
  httpCreateReview,
  httpGetServiceReviews,
  httpCreateOrder,
  httpGetUserOrders,
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

// Review routes
freelancerRouter.post("/services/:serviceId/reviews", verifyToken, httpCreateReview);
freelancerRouter.get("/services/:serviceId/reviews", httpGetServiceReviews); // Public route

// Order routes
freelancerRouter.post("/orders", verifyToken, httpCreateOrder);
freelancerRouter.get("/orders/user", verifyToken, httpGetUserOrders);
module.exports = freelancerRouter;
