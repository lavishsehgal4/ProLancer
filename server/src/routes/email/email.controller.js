const {
  validateToken,
  markTokenUsed,
  createVerificationToken,
} = require("../../models/TOKEN/token.model");

const {
  doesUserExist,
  getUserDataById,
  updateUserById,
} = require("../../models/USER/user.model");

const { sendVerificationEmail } = require("../../emails/email.service");


// ------------------------------------------------------
// 1️⃣ VERIFY EMAIL (User clicks verification link)
// ------------------------------------------------------
async function httpVerifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid verification link.");
    }

    // Validate token
    const tokenDoc = await validateToken(token);

    if (!tokenDoc) {
      return res.status(400).send("Invalid or expired verification link.");
    }

    if (tokenDoc === "expired") {
      return res.status(400).send("Verification link has expired.");
    }

    const userId = tokenDoc.userId;

    // Fetch user
    const user = await getUserDataById(tokenDoc.userId);

    if (!user.success) {
      return res.status(404).send("User not found.");
    }

    // Already verified?
    if (user.isEmailVerified) {
      return res.status(200).send("Email is already verified.");
    }

    // Mark user as verified
    await updateUserById(userId, {
      isEmailVerified: true,
      isActive: true,
    });

    // Mark token as used so it can’t be reused
    await markTokenUsed(tokenDoc._id);

    return res.status(200).send("Email verification successful!");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error during verification.");
  }
}



// ------------------------------------------------------
// 2️⃣ RESEND VERIFICATION EMAIL
// ------------------------------------------------------
async function httpResendVerification(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check if user exists
    const user = await doesUserExist(email);

    if (!user.success) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    // Already verified?
    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified.",
      });
    }

    // Create new token
    const token = await createVerificationToken(user.userId);

    // Build URL (localhost for now)
    const verificationUrl = `http://localhost:8000/api/user/verify-email?token=${token}`;

    // Send email again
    await sendVerificationEmail(email, verificationUrl);

    return res.status(200).json({
      success: true,
      message: "Verification email resent.",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error while resending verification email.",
    });
  }
}



module.exports = {
  httpVerifyEmail,
  httpResendVerification,
};
