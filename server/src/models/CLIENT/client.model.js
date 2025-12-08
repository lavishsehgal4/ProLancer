const Client = require("./client.mongo");

async function getClientData(userId) {
  try {
    const client = await Client.findOne({ userId }).select(
      "isCompany companyName companyDescription industry clientRating totalReviews totalSpent completedJobs clientLevel isVerified"
    );

    if (!client) {
      return {
        success: false,
        message: "Client profile not found",
      };
    }

    return {
      success: true,
      data: client,
    };

  } catch (error) {
    console.error("Error fetching client data:", error);
    return {
      success: false,
      message: "Server Error",
    };
  }
}

async function upsertClientData(userId, data) {
  try {
    const allowedFields = [
      "isCompany",
      "companyName",
      "companyDescription",
      "industry",
    ];

    const updateData = {};

    // Filter only allowed fields
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    const client = await Client.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true } // upsert = create if not exists
    );

    return {
      success: true,
      data: client,
    };

  } catch (error) {
    console.error("Error saving client data:", error);
    return {
      success: false,
      message: "Server Error",
    };
  }
}


module.exports = { getClientData ,upsertClientData};
