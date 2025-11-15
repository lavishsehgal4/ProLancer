const { addUser } = require("../../models/USER/user.model");
const { hashPassword, generateToken } = require("../../auth/auth.utils");

async function httpSignUpUser(req, res) {
  try {
    const userData = req.body;
    const role = req.params.role;
    const newUser = Object.assign(userData, {
      accountType: role,
      isEmailVerified: true,
      isActive: true,
    });
    console.log(newUser);
    // 2. Hash password
    newUser.passwordHash = await hashPassword(newUser.passwordHash);
    console.log(newUser);
    const response = await addUser(newUser);

    if (!response.success) {
      return res.status(400).json(response); // error case
    }

    // 4. Create JWT token
    const payload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.accountType,
    };
    const token = generateToken(payload);
    response.token = token;
    return res.status(201).json(response); // success case
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = {
  httpSignUpUser,
};
