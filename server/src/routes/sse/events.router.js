const express = require("express");
const {verifyTokenByQueryPara} = require("../../auth/auth.middleware2");
const { sseConnect } = require("./events.controller");

const sseRouter = express.Router();

sseRouter.get("/", verifyTokenByQueryPara, sseConnect);

module.exports = sseRouter;
