const express = require("express");
const { httpInsertUser, httpSignUpUser } = require("./user.controller");

const userRouter = express.Router();

userRouter.post("/addUser", httpSignUpUser);

module.exports = userRouter;
