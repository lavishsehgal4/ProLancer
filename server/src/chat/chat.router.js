const express = require("express");
const { httpGetJobMessages } = require("./chat.controller");
const verifyToken = require("../auth/auth.middleware");

const router = express.Router();

router.get("/:jobId/messages", verifyToken, httpGetJobMessages);

module.exports = router;
