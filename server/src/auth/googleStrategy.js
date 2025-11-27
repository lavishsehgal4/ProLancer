const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { doesUserExist } = require("../models/USER/user.model");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/login/callback", // keep your working URL
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        // ----------------------------
        // 1️⃣ GET EMAIL FROM GOOGLE
        // ----------------------------
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        if (!email) {
          return done(null, false, { message: "Google account has no email." });
        }

       
        // ----------------------------
        // 3️⃣ CHECK IF USER EXISTS IN DB
        // ----------------------------
        const existing = await doesUserExist(email);

        if (!existing.success) {
          // ❌ user NOT found in database
          return done(null, false, { message: "User not registered" });
        }

        // 🔥 DB USER FOUND → build full user object for controller
        const dbUser = {
          _id: existing.userId,
          email: existing.email,
          accountType: existing.accountType,
        };

        // ✔ pass full DB user to controller
        return done(null, dbUser);

      } catch (err) {
        console.error("Google Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
