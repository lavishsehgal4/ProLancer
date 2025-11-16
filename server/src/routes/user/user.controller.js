const {
  addUser,
  doesUserExist,
  getUserDataById,
  updateUserById,
} = require("../../models/USER/user.model");
const {
  hashPassword,
  generateToken,
  comparePassword,
} = require("../../auth/auth.utils");

async function httpSignUpUser(req, res) {
  try {
    const userData = req.body;
    const role = req.params.role;
    const newUser = Object.assign(userData, {
      accountType: role,
      isEmailVerified: true,
      isActive: true,
    });

    // 2. Hash password
    newUser.passwordHash = await hashPassword(newUser.passwordHash);

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

async function httpLoginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Step 1: Check if user exists
    const response = await doesUserExist(email);

    if (!response.success) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Step 2: Compare password correctly (bcrypt.compare)
    const isMatch = await comparePassword(password, response.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Step 3: Prepare user object
    const userObj = {
      success: true,
      message: "Login successful",
      userId: response.userId,
      name: response.firstName + " " + (response.lastName || ""),
      accountType: response.accountType,
      email: response.email,
    };

    // Step 4: Generate Token
    const payload = {
      _id: response.userId,
      email: response.email,
      accountType: response.accountType,
    };

    userObj.token = generateToken(payload);

    // Step 5: Return response
    return res.status(200).json(userObj);
  } catch (error) {
    console.error(error);
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

async function httpGetUserData(req, res) {
  try {
    const { userId, email, role } = req.user;

    const response = await getUserDataById(userId);
    if (response.success) {
      return res.status(200).json(response);
    } else {
      throw new Error(response.message);
    }
  } catch (err) {
    if (err.message === "Server error") {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function httpUpdateUserData(req, res) {
  try {
    const updates = req.body;

    if (updates.firstName.trim() == "") {
      return res.status(400).json({
        success: false,
        message: "firstName can't be empty",
      });
    }
    const response = await updateUserById(req.user.userId, updates);

    if (response.success === false) {
      throw new Error(response.message);
    }
    return res.status(200).json(response);
  } catch (err) {
    if (err.message === "Server error") {
      return res.status(500).json({ success: false, message: err.message });
    }
    return res
      .status(400)
      .json({ success: false, message: "Failed to update profile" });
  }
}

module.exports = {
  httpSignUpUser,
  httpLoginUser,
  httpGetUserData,
  httpUpdateUserData,
};
