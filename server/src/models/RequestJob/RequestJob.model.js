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




async function getJobRequests(filter = {}) {
  try {
    const jobs = await ProjectRequest.find(filter).sort({ createdAt: -1 });

    // Map results to only required fields
    const cleanJobs = jobs.map((req) => ({
      _id: req._id,
      jobId: req._id, // alias
      serviceId: req.serviceId,
      projectTitle: req.projectTitle,
      projectDescription: req.projectDescription,
      budget: req.budget,
      deadline: req.deadline,
      additionalRequirements: req.additionalRequirements,
      status: req.status,
      createdAt: req.createdAt,
    }));

    return {
      success: true,
      jobs: cleanJobs,
    };
  } catch (err) {
    console.error("Error fetching job requests:", err);
    return {
      success: false,
      message: "Server error",
    };
  }
}

async function updateJobStatus(jobId, freelancerId, newStatus) {
  try {
    const updated = await ProjectRequest.findOneAndUpdate(
      { _id: jobId, freelancerId },
      { status: newStatus },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Job not found or unauthorized" };
    }

    return { success: true, job: updated };
  } catch (err) {
    console.error("Error updating job status:", err);
    return { success: false, message: "Server error" };
  }
}

async function getJobById(jobId) {
  try {
    const job = await ProjectRequest.findById(jobId);

    if (!job) {
      return {
        success: false,
        message: "Job not found",
      };
    }

    return {
      success: true,
      data: job,
    };

  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

async function isUserPartOfJob(jobId, userId) {
  try {
    const job = await ProjectRequest.findById(jobId).select(
      "clientId freelancerId"
    );

    if (!job) return { success: false, reason: "NOT_FOUND" };

    const uid = userId.toString();

    if (
      job.clientId.toString() === uid ||
      job.freelancerId.toString() === uid
    ) {
      return { success: true };
    }

    return { success: false, reason: "NOT_ALLOWED" };
  } catch (err) {
    return { success: false, reason: "ERROR" };
  }
}


module.exports = { addUserJob, updateJobStatus ,getJobRequests,getJobById,isUserPartOfJob};
