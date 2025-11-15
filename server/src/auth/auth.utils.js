const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // change as needed

// Hash a plain password
async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

// Compare plain password with hash
async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// Generate JWT for a user object (keep payload minimal)
function generateToken({ _id, email, accountType }) {
  const payload = {
    userId: _id,
    email,
    role: accountType,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
};
