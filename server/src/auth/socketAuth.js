const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";

/**
 * Verify JWT for Socket.IO
 * @param {string} token
 * @returns decoded payload
 */
function verifySocketToken(token) {
  if (!token) {
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded; // { userId, email, accountType }
}

module.exports = { verifySocketToken };
