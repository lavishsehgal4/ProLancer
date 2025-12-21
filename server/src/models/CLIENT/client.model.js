const Client = require("./client.mongo");
const mongoose=require('mongoose');
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

async function getPublicClientByUserId(userId) {
  if (!userId) {
    return {
      success: false,
      message: "userId is required",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      success: false,
      message: "Invalid userId",
    };
  }

  try {
    const client = await Client.findOne(
      { userId },
      {
        _id: 0,              // hide internal mongo id
        userId: 0,           // hide user reference
        totalSpent: 0,       // ❌ sensitive, not public
        createdAt: 0,
        updatedAt: 0,
      }
    ).lean();

    if (!client) {
      return {
        success: false,
        message: "Client not found",
      };
    }

    return {
      success: true,
      data: client,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch client data",
      error: err.message,
    };
  }
}


module.exports = { getClientData ,upsertClientData,getPublicClientByUserId};
