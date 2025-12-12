const User = require("./user.mongo");
const {hashPassword}=require('../../auth/auth.utils')
//create new user in mongoDB
async function addUser(userData) {
  try {
    const newUser = await User.create(userData);
    // hide sensitive fields
const userObj = newUser.toObject();
delete userObj.passwordHash;
delete userObj.isActive;
delete userObj.isEmailVerified;
delete userObj.createdAt;
delete userObj.updatedAt;
delete userObj.__v;
    return {
      success: true,
      message: "User created successfully",
      userObj,
    };
  } catch (err) {
    // 🟦 1. Handle Duplicate Key Errors (11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]; // e.g. email, username

      return {
        success: false,
        type: "duplicate",
        message: `${field} already exists`,
        field: field,
        value: err.keyValue[field],
      };
    }

    // 🟧 2. Handle Mongoose Validation Errors (required, enum, min, etc.)
    if (err.name === "ValidationError") {
      const errors = {};

      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }

      return {
        success: false,
        type: "validation",
        message: "Validation failed",
        errors: errors,
      };
    }

    // 🔴 3. Any other server/database error
    return {
      success: false,
      type: "server",
      message: "Internal server error",
      error: err.message,
    };
  }
}

//check if user exist in db
async function doesUserExist(email) {
  try {
    // Fetch only required fields (projection)
    const user = await User.findOne(
      { email },
      {
        passwordHash: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        accountType: 1,
        isEmailVerified:1,
      }
    );

    if (!user) {
      return {
        success: false,
        message: "User does not exist",
      };
    }

    return {
      success: true,
      message: "User found",
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountType: user.accountType,
      passwordHash: user.passwordHash, // used for password comparison
      country:user.country,
      isEmailVerified:user.isEmailVerified,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function getUserDataById(id) {
  try {
    const user = await User.findById(id, {
      email: 1,
      githubUsername: 1,
      firstName: 1,
      lastName: 1,
      accountType: 1,
      phoneNumber: 1,
      profilePicture: 1,
      isEmailVerified:1,
      country: 1,
    });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      message: "User found",
      data: {
        email: user.email,
        githubUsername: user.githubUsername || "", // ADDED GitHub username
        firstName: user.firstName,
        lastName: user.lastName || "",
        accountType: user.accountType,
        phoneNumber: user.phoneNumber || "",
        profilePicture: user.profilePicture || "",
        country: user.country || "",
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
    };
  }
}

async function updateUserById(userId, updates) {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "profilePicture",
      "country",
      "isEmailVerified",
      "isActive",
    ];

    const filteredUpdates = {};
    for (let key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return {
        success: false,
        message: "No valid fields to update",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true }
    );

    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }

    // Convert to plain object so we can delete fields
    const userSafe = updatedUser.toObject();

    // Remove unwanted fields
    delete userSafe.passwordHash;
    delete userSafe._id;
    delete userSafe.isEmailVerified;
    delete userSafe.isActive;
    delete userSafe.createdAt;
    delete userSafe.updatedAt;
    delete userSafe.__v;

    return {
      success: true,
      message: "Profile updated successfully",
      data: userSafe,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function updatePasswordHashById(userId, newPassword) {
  try {
    // Validate input
    if (!userId || !newPassword) {
      return {
        success: false,
        message: "User ID and password are required",
      };
    }

    // Hash the new password
    const hashed = await hashPassword(newPassword);

    // Update user password using _id
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { passwordHash: hashed } },
      { new: true }
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
    };

  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

// NEW FUNCTION: Edit GitHub username for a user
async function editGithubUsername(userId, githubUsername) {
  try {
    // Validate input
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
      };
    }

    // Validate GitHub username format (basic validation)
    if (githubUsername && !/^[a-zA-Z0-9]([a-zA-Z0-9]|-(?!-))*[a-zA-Z0-9]$/.test(githubUsername)) {
      return {
        success: false,
        message: "Invalid GitHub username format",
      };
    }

    // Update user GitHub username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { githubUsername: githubUsername || null } },
      { new: true }
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "GitHub username updated successfully",
      data: {
        githubUsername: updatedUser.githubUsername,
      },
    };

  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function getGithubUsernameById(userId) {
  try {
    const user = await User.findById(userId, { githubUsername: 1 });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      githubUsername: user.githubUsername || null,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

module.exports = {
  addUser,
  doesUserExist,
  getUserDataById,
  updateUserById,
  updatePasswordHashById,
  editGithubUsername, // NEW EXPORT
  getGithubUsernameById
};
