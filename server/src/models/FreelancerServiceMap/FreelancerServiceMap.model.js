const mongoose = require('mongoose');
const FreelancerServiceMap = require('./FreelancerServiceMap.mongo');

async function getFreelancerIdFromServiceId(serviceId) {
  try {
    // Validate & convert serviceId
    const objectId = new mongoose.Types.ObjectId(serviceId);

    // Find mapping
    const record = await FreelancerServiceMap.findOne(
      { serviceId: objectId },
      { userId: 1 }  // return only userId
    );

    if (!record) {
      return {
        success: false,
        message: "No freelancer found for this serviceId"
      };
    }

    return {
      success: true,
      message: "Freelancer found",
      userId: record.userId
    };

  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message
    };
  }
}

module.exports = {getFreelancerIdFromServiceId};
