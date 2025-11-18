const express = require("express");
const {httpGetCategoriesWithPagingAndFilter}=require('./categories.controller');
const categoriesRouter = express.Router();

categoriesRouter.get('/categories/:title',httpGetCategoriesWithPagingAndFilter);


module.exports=categoriesRouter;