const Order = require("./order.mongo");
const mongoose = require("mongoose");

/**
 * Create a new order
 */
async function createOrder(clientId, { serviceId, freelancerId, freelancerEmail, message, budget, deadline }) {
  try {
    // Validate that client is not ordering their own service
    if (clientId === freelancerId) {
      return {
        success: false,
        message: "You cannot order your own service",
      };
    }

    // Create new order
    const newOrder = await Order.create({
      clientId,
      freelancerId,
      serviceId,
      freelancerEmail,
      message,
      budget,
      deadline: new Date(deadline),
    });

    return {
      success: true,
      message: "Order created successfully",
      data: newOrder,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

/**
 * Get user's orders (both as client and freelancer)
 */
async function getUserOrders(userId, status = null, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const matchCondition = { isActive: true };
    
    if (status) {
      matchCondition.status = status;
    }

    // Get orders where user is client
    const clientOrders = await Order.aggregate([
      { $match: { ...matchCondition, clientId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "freelancerId",
          foreignField: "_id",
          as: "freelancer",
        },
      },
      { $unwind: "$freelancer" },
      {
        $project: {
          _id: 1,
          serviceId: 1,
          freelancerId: 1,
          freelancerName: { $concat: ["$freelancer.firstName", " ", "$freelancer.lastName"] },
          freelancerEmail: "$freelancer.email",
          message: 1,
          budget: 1,
          deadline: 1,
          status: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Get orders where user is freelancer
    const freelancerOrders = await Order.aggregate([
      { $match: { ...matchCondition, freelancerId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          _id: 1,
          serviceId: 1,
          clientId: 1,
          clientName: { $concat: ["$client.firstName", " ", "$client.lastName"] },
          clientEmail: "$client.email",
          message: 1,
          budget: 1,
          deadline: 1,
          status: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return {
      success: true,
      message: "Orders fetched successfully",
      data: {
        asClient: clientOrders,
        asFreelancer: freelancerOrders,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, freelancerId, status) {
  try {
    const validStatuses = ["accepted", "rejected", "in_progress", "completed"];
    
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: "Invalid status",
      };
    }

    const updateData = { status };
    
    // Add timestamp based on status
    if (status === "accepted") {
      updateData.acceptedAt = new Date();
    } else if (status === "completed") {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, freelancerId },
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return {
        success: false,
        message: "Order not found or you don't have permission to update it",
      };
    }

    return {
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    };
  } catch (err) {
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  updateOrderStatus,
};