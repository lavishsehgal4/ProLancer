/**
 * Comments API Functions
 * 
 * This file contains all comment-related API calls for service reviews.
 */

import apiClient from "./apiClient";

/**
 * Submit a review/comment for a service
 * 
 * @param {string} serviceId - Service ID to comment on
 * @param {Object} reviewData - Review data containing rating and comment
 * @param {number} reviewData.rating - Rating from 1-5 stars
 * @param {string} reviewData.comment - Review comment text
 * @returns {Promise<Object>} - Response object
 */
export const submitReview = async (serviceId, reviewData) => {
  try {
    console.log("Submitting review:", { serviceId, reviewData });
    
    const response = await apiClient.post(`/services/comments?serviceId=${serviceId}`, {
      message: reviewData.comment,
      stars: reviewData.rating
    });
    
    const responseData = response.data;
    console.log("Submit review response:", responseData);

    if (responseData.success) {
      return {
        success: true,
        data: responseData.comment,
        message: responseData.message || "Review submitted successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to submit review");
    }
  } catch (error) {
    console.error("Submit review API error:", error);
    
    // Handle specific error cases
    if (error.response?.status === 403) {
      return {
        success: false,
        message: "Freelancers are not allowed to comment on services",
        error: error.message,
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        message: "Please login to submit a review",
        error: error.message,
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to submit review. Please try again.",
      error: error.message,
    };
  }
};

/**
 * Get reviews/comments for a service with pagination
 * 
 * @param {string} serviceId - Service ID to get comments for
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of comments per page (default: 10)
 * @returns {Promise<Object>} - Response with comments and pagination info
 */
export const getServiceReviews = async (serviceId, page = 1, limit = 10) => {
  try {
    console.log("Fetching service reviews:", { serviceId, page, limit });
    
    const response = await apiClient.get(`/services/comments?serviceId=${serviceId}&page=${page}&limit=${limit}`);
    const responseData = response.data;
    
    console.log("Get service reviews response:", responseData);

    if (responseData.success) {
      return {
        success: true,
        data: responseData.data || [],
        pagination: responseData.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        },
        message: "Reviews fetched successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch reviews");
    }
  } catch (error) {
    console.error("Get service reviews API error:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch reviews. Please try again.",
      error: error.message,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
    };
  }
};

// Export all comment API functions
export default {
  submitReview,
  getServiceReviews,
};