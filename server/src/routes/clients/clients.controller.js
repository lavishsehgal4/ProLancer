const { getClientData, upsertClientData } = require("../../models/CLIENT/client.model");
const {getPublicClientByUserId}=require('../../models/CLIENT/client.model');
const {getUserDataById}=require('../../models/USER/user.model')

async function httpGetClientData(req, res) {
  try {
    const userId = req.user.userId; // extracted from verifyToken

    const response = await getClientData(userId);

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.error("Error fetching client data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


async function httpUpsertClientData(req, res) {
  try {
    const userId = req.user.userId; // from verifyToken middleware
    const body = req.body;

    const response = await upsertClientData(userId, body);

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client data saved successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("Error updating client data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

async function httpGetPublicClientView(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // 1️⃣ Fetch public client/company data
    const clientRes = await getPublicClientByUserId(userId);
    if (!clientRes.success) {
      return res.status(404).json(clientRes);
    }

    // 2️⃣ Fetch user data (ONLY name + country)
    const userRes = await getUserDataById(userId);
    if (!userRes.success) {
      return res.status(404).json(userRes);
    }

    const user = userRes.data;

    return res.status(200).json({
      success: true,
      data: {
        name: `${user.firstName} ${user.lastName}`.trim(),
        country: user.country || "",
        company: clientRes.data,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = { httpGetClientData, httpUpsertClientData,httpGetPublicClientView };
