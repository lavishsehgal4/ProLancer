const express = require("express");
const { httpSignUpUser, httpLoginUser } = require("./user.controller");

const userRouter = express.Router();

userRouter.post("/signup/:role", httpSignUpUser);
userRouter.post("/users/login", httpLoginUser);
module.exports = userRouter;
