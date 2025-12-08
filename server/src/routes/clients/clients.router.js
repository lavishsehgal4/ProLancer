const express = require("express");
const verifyToken = require("../../auth/auth.middleware");
const { httpGetClientData, httpUpsertClientData } = require("./clients.controller");

const clientRouter = express.Router();

clientRouter.get("/client/data", verifyToken, httpGetClientData);

clientRouter.put("/client/data", verifyToken, httpUpsertClientData);

module.exports = clientRouter;
