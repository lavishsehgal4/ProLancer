const { saveComment ,getCommentsByServiceId} = require("../../models/comments/comments.model");
const { getFreelancerIdFromServiceId } = require("../../models/FreelancerServiceMap/FreelancerServiceMap.model");

const { updateServiceRating } = require("../../models/FREELANCER/freelancer.model");


async function httpAddComment(req, res) {
  try {
    // 1️⃣ Auth data from JWT
    const clientId = req.user?.userId;
    const accountType = req.user?.accountType;

    if (!clientId || !accountType) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🚫 Freelancers cannot comment
    if (accountType === "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Freelancers are not allowed to comment",
      });
    }

    // 2️⃣ serviceId from query
    const { serviceId } = req.query;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "serviceId is required",
      });
    }

    // 3️⃣ Resolve freelancerId from serviceId
    const freelancerRes = await getFreelancerIdFromServiceId(serviceId);

    if (!freelancerRes.success) {
      return res.status(404).json(freelancerRes);
    }

    const freelancerId = freelancerRes.userId;

    // 4️⃣ Comment data
    const { message, stars } = req.body;

    // 5️⃣ Save comment first
    const commentRes = await saveComment({
      message,
      stars,
      clientId,
      freelancerId,
      serviceId,
    });

    if (!commentRes.success) {
      return res.status(400).json(commentRes);
    }

    // 6️⃣ Update service rating AFTER comment is saved
    const ratingRes = await updateServiceRating(serviceId, stars);

    // ⚠️ If rating update fails, log it — comment is already saved
    if (!ratingRes.success) {
      console.error(
        "[Rating Update Failed]",
        ratingRes.error || ratingRes.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: commentRes.data,
      ratingUpdate: ratingRes.success ? ratingRes.data : null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

/**
 * Get comments for a service
 * GET /services/comments?serviceId=xxx&page=1&limit=10
 */
async function httpGetCommentsByServiceId(req, res) {
  try {
    const { serviceId, page = 1, limit = 10 } = req.query;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "serviceId is required",
      });
    }

    const result = await getCommentsByServiceId(
      serviceId,
      Number(page),
      Number(limit)
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}
module.exports = {
  httpAddComment,
  httpGetCommentsByServiceId
};
