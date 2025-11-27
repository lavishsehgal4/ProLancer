const mongoose = require("mongoose");
const FreelancerServiceMap = require("./FreelancerServiceMap.mongo");

async function getFreelancerIdFromServiceId(serviceId) {
  try {
    // Convert to ObjectId
    const objectId = new mongoose.Types.ObjectId(serviceId);

    // Find mapping
    const record = await FreelancerServiceMap.findOne(
      { serviceId: objectId },
      { userId: 1 } // only return userId field
    );

    if (!record) {
      return {
        success: false,
        message: "No freelancer found for this serviceId",
      };
    }

    return {
      success: true,
      userId: record.userId,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

// ✔ Correct export
module.exports = { getFreelancerIdFromServiceId };
