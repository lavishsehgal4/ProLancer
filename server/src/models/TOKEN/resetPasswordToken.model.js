const crypto = require("crypto");
const ResetToken = require("./resetToken.mongo");

async function createResetPasswordToken(userId) {
  const token = crypto.randomBytes(40).toString("hex");

  await ResetToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
    used: false
  });

  return token;
}

async function validateResetToken(token) {
  const tokenDoc = await ResetToken.findOne({ token });

  if (!tokenDoc) return { success: false, message: "Invalid token." };
  if (tokenDoc.used) return { success: false, message: "Token already used." };
  if (tokenDoc.expiresAt < new Date()) return { success: false, message: "Token expired." };

  return { success: true, tokenDoc };
}

async function markResetTokenUsed(token) {
  await ResetToken.updateOne({ token }, { used: true });
}

module.exports = {
  createResetPasswordToken,
  validateResetToken,
  markResetTokenUsed
};
