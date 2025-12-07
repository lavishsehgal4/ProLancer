const ProjectRequest = require("./RequestJob.mongo");

async function addUserJob(clientId, freelancerId, serviceId, data) {
  try {
    // Create the project request object
    const newRequest = await ProjectRequest.create({
      clientId,
      freelancerId,
      serviceId,
      projectTitle: data.projectTitle,
      projectDescription: data.projectDescription,
      budget: data.budget,
      deadline: data.deadline,
      additionalRequirements: data.additionalRequirements || "",
      status: "pending",
    });

    return {
      success: true,
      message: "job added succesfully",
      job: newRequest,
    };
  } catch (error) {
    console.error("Error creating project request:", error);
    return {
      success: false,
      message: "Server error",
    };

  }
}


async function getAllRequests(freelancerId) {
  try {
    const requests = await ProjectRequest.find(
      { freelancerId },
      {
        _id: 1,
        serviceId: 1,
        projectTitle: 1,
        projectDescription: 1,
        budget: 1,
        deadline: 1,
        additionalRequirements: 1,
        status: 1,
      }
    ).lean(); // lean() returns plain JS objects, easier to modify

    // rename _id → jobId
    const formatted = requests.map(req => ({
      jobId: req._id,
      serviceId: req.serviceId,
      projectTitle: req.projectTitle,
      projectDescription: req.projectDescription,
      budget: req.budget,
      deadline: req.deadline,
      additionalRequirements: req.additionalRequirements,
      status: req.status,
    }));

    return {
      success: true,
      data: formatted,
    };

  } catch (error) {
    console.error("Error fetching freelancer requests:", error);
    return {
      success: false,
      message: "Failed to fetch freelancer requests",
    };
  }
}

async function rejectRequest(jobId, freelancerId) {
  try {
    const updated = await ProjectRequest.updateOne(
      { _id: jobId, freelancerId },   // ensure freelancer owns this request
      { status: "rejected" }
    );

    // If no document was updated → job does not belong to this freelancer
    if (updated.matchedCount === 0) {
      return {
        success: false,
        message: "Request not found or unauthorized",
      };
    }

    return {
      success: true,
      message: "Request rejected successfully",
    };

  } catch (error) {
    console.error("Error rejecting request:", error);
    return {
      success: false,
      message: "Server Error",
    };
  }
}


module.exports = { addUserJob, getAllRequests, rejectRequest };
