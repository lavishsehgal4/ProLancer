const express = require("express");
const {
  httpVerifyEmail,
  httpResendVerification,
  httpForgotPassword,
  httpResetPassword
} = require("./email.controller");
const emailRouter = express.Router();

// VERIFY EMAIL (user clicks link)
emailRouter.get("/verify-email", httpVerifyEmail);

// RESEND VERIFICATION EMAIL
emailRouter.post("/resend-verification", httpResendVerification);

// Add these to server/src/routes/email/email.router.js
emailRouter.post("/forgot-password", httpForgotPassword);
emailRouter.post("/reset-password", httpResetPassword);

module.exports=emailRouter;