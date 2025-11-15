const express = require("express");
const {
  httpSignUpUser,
  httpLoginUser,
  httpGetUserData,
} = require("./user.controller");
const verifyToken = require("../../auth/auth.middleware");
const userRouter = express.Router();

userRouter.post("/signup/:role", httpSignUpUser);
userRouter.post("/users/login", httpLoginUser);

userRouter.get("/users/basicprofile", verifyToken, httpGetUserData);
module.exports = userRouter;
