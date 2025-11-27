const crypto = require("crypto");
const Token = require("./token.mongo");

// Create a new token
async function createVerificationToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // expires in 1 hour

  const newToken = await Token.create({
    userId,
    token,
    expiresAt,
  });

  return newToken.token;
}

// Validate token
async function validateToken(token) {
  const tokenDoc = await Token.findOne({ token, used: false });

  if (!tokenDoc) return null;

  if (tokenDoc.expiresAt < new Date()) return "expired";

  return tokenDoc;
}

// Mark token as used
async function markTokenUsed(tokenId) {
  await Token.findByIdAndUpdate(tokenId, { used: true });
}

module.exports = {
  createVerificationToken,
  validateToken,
  markTokenUsed,
};
