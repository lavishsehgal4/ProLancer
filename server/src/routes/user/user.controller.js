const { addNameAndUser } = require("../../models/FREELANCER/freelancer.model");
const {
  addUser,
  doesUserExist,
  getUserDataById,
  updateUserById,
  editGithubUsername, // NEW IMPORT
} = require("../../models/USER/user.model");
const {
  hashPassword,
  generateToken,
  comparePassword,
} = require("../../auth/auth.utils");

const {
  createVerificationToken,
} = require('../../models/TOKEN/token.model');

const { sendVerificationEmail } = require('../../emails/email.service');

async function httpSignUpUser(req, res) {
  try {
    const userData = req.body;
    const role = req.params.role;

    const newUser = Object.assign(userData, {
      accountType: role,
      isEmailVerified: false,
      isActive: false,
    });

    // Hash password
    newUser.passwordHash = await hashPassword(newUser.passwordHash);

    // Save user to DB
    const response = await addUser(newUser);

    if (!response.success) {
      return res.status(400).json(response);
    }
    console.log(response);
    // Extract userId & email immediately
    const userId = response.userObj._id.toString();
    const email = response.userObj.email;

    // ------------------------------------------------------
    // ⭐ 1️⃣ FREELANCER SETUP (BEFORE SENDING EMAIL)
    // ------------------------------------------------------
    if (response.userObj.accountType === "freelancer") {
      await addNameAndUser(userId);
    }

    // ------------------------------------------------------
    // ⭐ 2️⃣ CREATE TOKEN
    // ------------------------------------------------------
    const token = await createVerificationToken(userId);

    // ------------------------------------------------------
    // ⭐ 3️⃣ BUILD VERIFICATION URL
    // ------------------------------------------------------
    const verificationUrl = `http://localhost:8000/api/user/verify-email?token=${token}`;

    // ------------------------------------------------------
    // ⭐ 4️⃣ SEND VERIFICATION EMAIL
    // ------------------------------------------------------
    await sendVerificationEmail(email, verificationUrl);

    // ------------------------------------------------------
    // CLEAN RESPONSE
    // ------------------------------------------------------
    delete response.userObj._id;

    return res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
    });

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

    // Step 2: Check if email is verified
    if (!response.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // Step 3: Compare password
    const isMatch = await comparePassword(password, response.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Step 4: Prepare user object
    const data = {
      success: true,
      message: "Login successful",
      userObj: {
        firstName: response.firstName,
        lastName: response.lastName || "",
        accountType: response.accountType,
        email: response.email,
        country: response.country,
      },
    };

    // Step 5: Generate JWT token
    const payload = {
      userId: response.userId,
      email: response.email,
      accountType: response.accountType,
    };

    data.token = generateToken(payload);

    // Step 6: Return response
    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


async function httpGetUserData(req, res) {
  try {
    const { userId } = req.user;

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

// NEW CONTROLLER: Edit GitHub username
async function httpEditGithubUsername(req, res) {
  try {
    const { userId } = req.user; // From auth middleware
    const { githubUsername } = req.body;

    // Validate input
    if (githubUsername !== null && githubUsername !== undefined && githubUsername.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "GitHub username cannot be empty. Use null to remove it.",
      });
    }

    const response = await editGithubUsername(userId, githubUsername);

    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(200).json(response);

  } catch (err) {
    console.error("Error updating GitHub username:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = {
  httpSignUpUser,
  httpLoginUser,
  httpGetUserData,
  httpUpdateUserData,
  httpEditGithubUsername, // NEW EXPORT
};
