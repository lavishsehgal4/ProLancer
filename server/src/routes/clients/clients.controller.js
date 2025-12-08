const { getClientData, upsertClientData } = require("../../models/CLIENT/client.model");

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

module.exports = { httpGetClientData, httpUpsertClientData };
