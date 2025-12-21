const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";


function verifyTokenByQueryPara(req, res, next) {
    try {
        // 1. Read token from query parameters
        const token = req.query.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        // 2. Verify token (token is already without "Bearer " prefix in query params)
        const decoded = jwt.verify(token, JWT_SECRET);
    // Debug logging (remove in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log(decoded);
    }

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

module.exports = { verifyTokenByQueryPara };