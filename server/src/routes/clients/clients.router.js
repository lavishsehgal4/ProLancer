const express = require("express");
const verifyToken = require("../../auth/auth.middleware");
const { httpGetClientData, httpUpsertClientData,httpGetPublicClientView } = require("./clients.controller");

const clientRouter = express.Router();

clientRouter.get("/client/data", verifyToken, httpGetClientData);

clientRouter.put("/client/data", verifyToken, httpUpsertClientData);

clientRouter.get(
  "/clients/public",
  httpGetPublicClientView
);
module.exports = clientRouter;
