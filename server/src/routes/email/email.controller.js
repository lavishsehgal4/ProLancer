const {
  validateToken,
  markTokenUsed,
  createVerificationToken,
} = require("../../models/TOKEN/token.model");

const {
  doesUserExist,
  getUserDataById,
  updateUserById,
  updatePasswordHashById,
} = require("../../models/USER/user.model");

const { sendVerificationEmail, sendPasswordResetEmail } = require("../../emails/email.service");

const { createResetPasswordToken ,validateResetToken,
  markResetTokenUsed} = require("../../models/TOKEN/resetPasswordToken.model");


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
    console.log(email);
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

async function httpForgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await doesUserExist(email);
    if (!user.success) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = await createResetPasswordToken(user.userId);

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    await sendPasswordResetEmail(email, resetUrl);

    return res.json({
      success: true,
      message: "Password reset email sent."
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function httpResetPassword(req, res) {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    // 1) Validate token
    const tokenData = await validateResetToken(token);
    
    if (!tokenData.success) {
      return res.status(400).json(tokenData);
    }

    // 2) Get userId from token document
    const userId = tokenData.tokenDoc.userId;
      console.log(userId);
    // 3) Confirm user exists
    const userRes = await getUserDataById(userId);
    
    if (!userRes.success || !userRes.data) {
      
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }
    
    // 4) Update password directly using userId (your new helper)
    const updateRes = await updatePasswordHashById(userId, newPassword);
    
    if (!updateRes.success) {
      return res.status(400).json(updateRes);
    }

    // 5) Mark token as used (one-time use)
    await markResetTokenUsed(token);

    return res.json({
      success: true,
      message: "Password updated successfully."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
}


module.exports = {
  httpVerifyEmail,
  httpResendVerification,
  httpForgotPassword,
  httpResetPassword,
};
