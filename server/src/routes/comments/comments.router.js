const express = require("express");
const { httpAddComment,httpGetCommentsByServiceId } = require("./comments.controller");
const verifyToken = require("../../auth/auth.middleware");

const commentRouter = express.Router();

/**
 * Add comment to a service
 * POST /services/comments?serviceId=xxxx
 */
commentRouter.post(
  "/services/comments",
  verifyToken,
  httpAddComment
);

commentRouter.get(
  "/services/comments",
  httpGetCommentsByServiceId
);

module.exports = commentRouter;
