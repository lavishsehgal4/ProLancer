const{addUserJob,updateJobStatus,getJobRequests}=require('../../models/RequestJob/RequestJob.model');
const{getFreelancerIdFromServiceId}=require('../../models/FreelancerServiceMap/FreelancerServiceMap.model');
const{sendNotification}=require('../sse/events.controller');
async function httpAddUserJob(req,res) {
    try {
        const { userId:clientId } = req.user;
        const serviceId=req.params.serviceId;
        const data=req.body;
        const response=await getFreelancerIdFromServiceId(serviceId);
        
        if(!response.success){
            throw new Error(response.message);
        }
        const freelancerId=response.userId;
        const reply=await addUserJob(clientId,freelancerId,serviceId,data);
        if(!reply.success){
            throw new Error(reply.message);
        }
        // 🔥 SEND NOTIFICATION HERE
            sendNotification(freelancerId, {
            type: "NEW_JOB",
            message: "You received a new job request",
            projectTitle: data.projectTitle,
});
        delete reply.job;
        return res.status(200).json(reply);

    } catch (err) {
        console.error(err);
        if (err.message === "Server error") {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.status(400).json({
      success: false,
      message: err.message,
    });
    }
    
}



async function httpUpdateJobStatus(req, res) {
  try {
    const jobId = req.params.jobId;
    const freelancerId = req.user.userId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowed = ["accepted", "rejected", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const result = await updateJobStatus(jobId, freelancerId, status);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Job ${status} successfully`,
      status,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


async function httpGetJobs(req, res) {
  try {
    const { userId, accountType } = req.user;
    const { status } = req.query;

    const filter = {};

    // Attach correct filter based on user type
    if (accountType === "freelancer") {
      filter.freelancerId = userId;
    } 
    else if (accountType === "client") {
      filter.clientId = userId;
    } 
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    // Optional status filter
    if (status) filter.status = status;

    const result = await getJobRequests(filter);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      success: true,
      jobs: result.jobs,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


module.exports={httpAddUserJob,httpUpdateJobStatus,httpGetJobs};