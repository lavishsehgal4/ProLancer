const { generateToken } = require("../../auth/auth.utils");

async function googleLoginController(req, res) {
  try {
    // Passport sets req.user if login successful
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_ORIGIN}/login?error=not_registered`
      );
    }

    const user = req.user;
    console.log(user);
    const token = generateToken({
      userId: user._id,
      email: user.email,
      accountType: user.accountType,
    });

    return res.redirect(
      `${process.env.FRONTEND_ORIGIN}/auth/success?token=${token}`
    );
  } catch (err) {
    console.error("Google Login Controller Error:", err);
    return res.redirect(
      `${process.env.FRONTEND_ORIGIN}/login?error=server_error`
    );
  }
}

module.exports = { googleLoginController };
