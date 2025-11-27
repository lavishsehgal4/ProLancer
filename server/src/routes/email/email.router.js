const express = require("express");
const {
  httpVerifyEmail,
  httpResendVerification,
} = require("./email.controller");
const emailRouter = express.Router();

// VERIFY EMAIL (user clicks link)
emailRouter.get("/verify-email", httpVerifyEmail);

// RESEND VERIFICATION EMAIL
emailRouter.post("/resend-verification", httpResendVerification);

module.exports=emailRouter;