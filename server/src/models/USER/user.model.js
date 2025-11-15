const User = require("./user.mongo");

//create new user in mongoDB
async function addUser(userData) {
  try {
    const newUser = await User.create(userData);

    return {
      success: true,
      message: "User created successfully",
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
};
