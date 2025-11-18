const Review = require("./review.mongo");
const Freelancer = require("../FREELANCER/freelancer.mongo");
const mongoose = require("mongoose");

/**
 * Create a new review for a service
 */
async function createReview(userId, serviceId, freelancerId, { rating, comment }) {
  try {
    // Check if user already reviewed this service
    const existingReview = await Review.findOne({ userId, serviceId });
    if (existingReview) {
      return {
        success: false,
        message: "You have already reviewed this service",
      };
    }

    // Create new review
    const newReview = await Review.create({
      userId,
      serviceId,
      freelancerId,
      rating,
      comment,
    });

    // Update service averageRating and totalReviews
    await updateServiceRatings(freelancerId, serviceId);

    return {
      success: true,
      message: "Review created successfully",
      data: newReview,
    };
  } catch (err) {
    if (err.code === 11000) {
      return {
        success: false,
        message: "You have already reviewed this service",
      };
    }
    return {
      success: false,
      message: "Server error",
      error: err.message,
    };
  }
}

/**
 * Get reviews for a specific service
 */
async function getServiceReviews(serviceId, page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;

    // Get reviews with user information
    const reviews = await Review.aggregate([
      { $match: { serviceId: new mongoose.Types.ObjectId(serviceId), isActive: true } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          userAvatar: "$user.profilePicture",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Get total count
    const totalReviews = await Review.countDocuments({ serviceId, isActive: true });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { serviceId: new mongoose.Types.ObjectId(serviceId), isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;

    return {
      success: true,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          hasNext: page * limit < totalReviews,
          hasPrev: page > 1,
        },
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
 * Update service ratings after a new review
 */
async function updateServiceRatings(freelancerId, serviceId) {
  try {
    // Calculate new ratings for this service
    const ratingStats = await Review.aggregate([
      { $match: { serviceId: new mongoose.Types.ObjectId(serviceId), isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (ratingStats.length > 0) {
      const { averageRating, totalReviews } = ratingStats[0];

      // Update the service in freelancer document
      await Freelancer.updateOne(
        { userId: freelancerId, "services._id": serviceId },
        {
          $set: {
            "services.$.averageRating": Math.round(averageRating * 10) / 10,
            "services.$.totalReviews": totalReviews,
          },
        }
      );
    }
  } catch (err) {
    console.error("Error updating service ratings:", err);
  }
}

module.exports = {
  createReview,
  getServiceReviews,
  updateServiceRatings,
};