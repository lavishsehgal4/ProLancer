const Comment = require("./comments.mongo");
const mongoose = require("mongoose");

/**
 * Save a new comment/review
 */
async function saveComment({
  message,
  stars,
  clientId,
  freelancerId,
  serviceId,
}) {
  // Basic sanity checks (model-level, not controller BS)
  if (!message || !clientId || !freelancerId || !serviceId) {
    return {
      success: false,
      message: "Missing required fields",
    };
  }

  if (stars < 1 || stars > 5) {
    return {
      success: false,
      message: "Stars must be between 1 and 5",
    };
  }

  try {
    const comment = await Comment.create({
      message,
      stars,
      clientId,
      freelancerId,
      serviceId,
    });

    return {
      success: true,
      data: comment,
    };
  } catch (err) {
    // Duplicate review (unique index violation)
    if (err.code === 11000) {
      return {
        success: false,
        message: "You have already reviewed this service",
      };
    }

    return {
      success: false,
      message: "Failed to save comment",
      error: err.message,
    };
  }
}

/**
 * Get comments for a service
 * @param {String} serviceId
 * @param {Number} page (default 1)
 * @param {Number} limit (default 10)
 */
async function getCommentsByServiceId(serviceId, page = 1, limit = 10) {
  if (!serviceId) {
    return {
      success: false,
      message: "serviceId is required",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    return {
      success: false,
      message: "Invalid serviceId",
    };
  }

  const skip = (page - 1) * limit;

  try {
    const [comments, total] = await Promise.all([
      Comment.find({ serviceId })
        .populate({
          path: "clientId",
          select: "firstName lastName profilePicture", // ✅ REAL fields
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Comment.countDocuments({ serviceId }),
    ]);

    // Optional: build full name cleanly
    const formattedComments = comments.map((c) => ({
      ...c,
      client: c.clientId
        ? {
            id: c.clientId._id,
            name: `${c.clientId.firstName} ${c.clientId.lastName || ""}`.trim(),
            profilePicture: c.clientId.profilePicture || "",
          }
        : null,
      clientId: undefined, // hide raw populated object
    }));

    return {
      success: true,
      data: formattedComments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch comments",
      error: err.message,
    };
  }
}


module.exports = {
  saveComment,
  getCommentsByServiceId
};
