const {
  getFreelancerProfile,
  updateUserProfile,
  createFreelancerService,
  updateFreelancerService,
  deleteFreelancerService
} = require("./../../models/FREELANCER/freelancer.model");



const {getFreelancerIdFromServiceId}=require('../../models/FreelancerServiceMap/FreelancerServiceMap.model');


async function httpGetFreelancerData(req, res) {
  try {
    const id = req.user.userId;
    const response = await getFreelancerProfile(id);
    if (response.success === false) {
      throw new Error(response.message);
    }
    return res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function httpUpdateFreelancerProfile(req,res) {
  try
  {
    const freelancer=req.body;
  const userId=req.user.userId;
    const response=await updateUserProfile(userId,freelancer);
    if(response.success===false){
      throw new Error(response.message);
    }
    return res.status(200).json(response);

  }catch(err){
    if(err.message=="Server error"){
      return res.status(500).json({
        success:false,
        message:"Server error"
      })
    }
     return res.status(400).json({
        success:false,
        message:"Server error"
      })
  }
  
}

async function httpCreateFreelancerService(req,res) {
  try {
    const freelancer=req.body;
  const userId=req.user.userId;
  const response=await createFreelancerService(userId,freelancer);

  if(response.success===false){
      throw new Error(response.message);
    }
    return res.status(200).json(response);

  } catch (err) {
    
    if(err.message=="Server error"){
      return res.status(500).json({
        success:false,
        message:"Server error"
      })
    }
     return res.status(400).json({success:false,
      message:err.message
     })
  }
  
}

async function httpUpdateFreelancerService(req,res) {
  try{
  const updates=req.body;
  const userId=req.user.userId;
  const title=updates.title;
  if(title===""){
    return res.status(400).json({
      success:false,
      message:"title can't be empty"
    });
  }
  const response=await updateFreelancerService(userId,title,updates);
   if(response.success===false){
      throw new Error(response.message);
    }
    return res.status(200).json(response);

}
catch(err){
  if(err.message=="Server error"){
      return res.status(500).json({
        success:false,
        message:"Server error"
      })
    }
     return res.status(400).json({
        success:false,
        message:err.message
      })
}
  
}



/**
 * Delete a service
 */
async function httpDeleteService(req, res) {
  try {
    const { serviceId } = req.params;
    const userId = req.user.userId;

    const response = await deleteFreelancerService(userId, serviceId);
    
    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}




module.exports = {
  httpGetFreelancerData,
  httpUpdateFreelancerProfile,
  httpCreateFreelancerService,
  httpUpdateFreelancerService,
  httpDeleteService,
  
};
