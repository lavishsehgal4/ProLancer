const express = require("express");
const passport = require("passport");
require("../../auth/googleStrategy");

const { googleLoginController } = require("./googleAuth.controller");

const router = express.Router();

// Start Google Login
router.get(
  "/auth/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Login Callback
router.get(
  "/auth/google/login/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login?error=not_registered" }),
  googleLoginController
);

module.exports = router;
