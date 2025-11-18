const { getServicesByCategory,getFreelancerInfoFromServiceId } = require("../../models/categories/categories.model");

async function httpGetCategoriesWithPagingAndFilter(req, res) {
  try {
    // Title comes from URL now
    let title = req.params.title;
    title = title.split("-").join(" ");
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Service title is required in URL"
      });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 6;

    const filters = {
      minRate: req.query.minRate,
      maxRate: req.query.maxRate,
      rating: req.query.rating,
      experience: req.query.experience
    };

    // Call model with title instead of category
    const result = await getServicesByCategory(title, page, limit, filters);

    return res.status(200).json(result);

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error in fetching services",
      error: err.message
    });
  }
}

async function httpGetFreelancerFromServiceId(req,res) {
    try {
        const serviceId=req.params.serviceId;
        console.log(serviceId);
        const response=await getFreelancerInfoFromServiceId(serviceId);
        if(response.success===false){
            throw new Error(response.message);
        }
        return res.status(200).json(response);

    } catch (err) {
        console.log(err.message);
        if(err.message==="Server error"){
            return res.status(500).json({
                success:false,
                message:err.message
            })
        }
        return res.status(400).json({
                success:false,
                message:err.message
            });
        
    }
    
}
module.exports = { httpGetCategoriesWithPagingAndFilter ,httpGetFreelancerFromServiceId};
