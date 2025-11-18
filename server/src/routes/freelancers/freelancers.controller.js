const {
  getFreelancerProfile,
  updateUserProfile,
  createFreelancerService,
  updateFreelancerService,
  deleteFreelancerService
} = require("./../../models/FREELANCER/freelancer.model");

const { createReview, getServiceReviews } = require("./../../models/REVIEW/review.model");
const { createOrder, getUserOrders } = require("./../../models/ORDER/order.model");

const {getFreelancerIdFromServiceId}=require('../../models/FreelancerServiceMap/FreelancerServiceMap.model');
const { response } = require("express");

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

/**
 * Create a review for a service
 */
async function httpCreateReview(req, res) {
  try {
    const { serviceId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Get freelancerId from query or extract from service
    const { freelancerId } = req.query;

    if (!freelancerId) {
      return res.status(400).json({
        success: false,
        message: "freelancerId is required",
      });
    }

    const response = await createReview(userId, serviceId, freelancerId, { rating, comment });
    
    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(201).json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

/**
 * Get reviews for a service
 */
async function httpGetServiceReviews(req, res) {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const response = await getServiceReviews(serviceId, parseInt(page), parseInt(limit));
    
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

/**
 * Create an order
 */
async function httpCreateOrder(req, res) {
  try {
    const clientId = req.user.userId;
    const orderData = req.body;

    const response = await createOrder(clientId, orderData);
    
    if (!response.success) {
      return res.status(400).json(response);
    }

    return res.status(201).json(response);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

/**
 * Get user's orders
 */
async function httpGetUserOrders(req, res) {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const response = await getUserOrders(userId, status, parseInt(page), parseInt(limit));
    
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
  httpCreateReview,
  httpGetServiceReviews,
  httpCreateOrder,
  httpGetUserOrders,
};
