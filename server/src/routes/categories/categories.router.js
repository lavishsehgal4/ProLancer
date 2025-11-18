const express = require("express");
const {httpGetCategoriesWithPagingAndFilter,httpGetFreelancerFromServiceId}=require('./categories.controller');
const categoriesRouter = express.Router();

categoriesRouter.get("/categories/service/:serviceId",httpGetFreelancerFromServiceId);
categoriesRouter.get('/categories/:title',httpGetCategoriesWithPagingAndFilter);

module.exports=categoriesRouter;