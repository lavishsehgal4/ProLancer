const express = require("express");
const verifyToken = require("../../auth/auth.middleware");
const { sseConnect } = require("./events.controller");

const sseRouter = express.Router();

sseRouter.get("/", verifyToken, sseConnect);

module.exports = sseRouter;
