const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";

function verifyToken(req, res, next) {
  try {
    // 1. Read token from headers
    const authHeader = req.headers.authorization;
    console.log("hello");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Attach user details to req object
    req.user = decoded;

    // Continue to next middleware or controller
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
}

module.exports = verifyToken;
