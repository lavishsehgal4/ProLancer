const User = require("./user.mongo");

//create new user in mongoDB
async function addUser(userData) {
  try {
    const newUser = await User.create(userData);

    return {
      success: true,
      message: "User created successfully",
      data: newUser,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to create user",
      error: err.message,
    };
  }
}

module.exports = {
  addUser,
};
