const express = require("express");
const { httpInsertUser, httpSignUpUser } = require("./user.controller");

const userRouter = express.Router();

userRouter.post("/signup/:role", httpSignUpUser);

module.exports = userRouter;
