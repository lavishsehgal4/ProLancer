const {
  getFreelancerProfile,
  updateUserProfile,
  createFreelancerService
} = require("./../../models/FREELANCER/freelancer.model");

async function httpGetFreelancerData(req, res) {
  try {
    const id = req.user.userId;
    console.log(id);
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
     return res.status(400).json({
        success:false,
        message:"Server error"
      })
  }
  
}


module.exports = {
  httpGetFreelancerData,
  httpUpdateFreelancerProfile,
  httpCreateFreelancerService
};
