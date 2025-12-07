const{addUserJob,getAllRequests,rejectRequest}=require('../../models/RequestJob/RequestJob.model');
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

async function httpGetAllRequests(req, res) {
  try {
    const freelancerId = req.user.userId;

    const response = await getAllRequests(freelancerId);

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
    console.error("Error fetching requests:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

async function httpRejectRequest(req, res) {
  try {
    const freelancerId = req.user.userId;
    const { jobId } = req.params;

    const response = await rejectRequest(jobId, freelancerId);

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
    });

  } catch (error) {
    console.error("Error rejecting request:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

module.exports={httpAddUserJob,httpGetAllRequests,httpRejectRequest};