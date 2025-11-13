const { addUser } = require("../../models/USER/user.model");

async function httpSignUpUser(req, res) {
  try {
    const userData = req.body;
    const response = await addUser(userData);

    if (!response.success) {
      return res.status(400).json(response); // error case
    }

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
