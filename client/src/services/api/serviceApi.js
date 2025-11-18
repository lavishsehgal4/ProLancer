/**
 * Service API Functions
 *
 * This file contains all service-related API calls.
 * Functions here communicate with the backend service endpoints.
 */

import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Get service by ID
 * Fetches detailed service information by service ID and freelancer ID using query parameters
 *
 * @param {string} serviceId - Service ID
 * @param {string} freelancerId - Freelancer ID
 * @returns {Promise<Object>} - Service data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Service fetched successfully",
 *   data: {
 *     _id: "serviceId",
 *     title: "Service Title",
 *     name: "Service Name",
 *     bio: "Service Bio",
 *     description: "Detailed description",
 *     category: "Category",
 *     skills: ["skill1", "skill2"],
 *     hourlyRate: 75,
 *     profilePicture: "image_url",
 *     freelancerId: "freelancer_id",
 *     averageRating: 4.5,
 *     totalReviews: 10,
 *     createdAt: "date",
 *     updatedAt: "date"
 *   }
 * }
 */
export const getServiceById = async (serviceId, freelancerId) => {
  try {
    const params = new URLSearchParams({
      serviceId: serviceId,
      freelancerId: freelancerId
    });
    
    console.log("API Call URL:", `${API_ENDPOINTS.GET_SERVICE_BY_ID}?${params}`);
    
    const response = await apiClient.get(`${API_ENDPOINTS.GET_SERVICE_BY_ID}?${params}`);
    const responseData = response.data;
    
    console.log("Raw API Response:", responseData);

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Service fetched successfully",
        data: responseData.data,
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch service");
    }
  } catch (error) {
    console.error("Get service API error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch service. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Get service reviews
 * Fetches all reviews for a specific service
 *
 * @param {string} serviceId - Service ID
 * @returns {Promise<Object>} - Reviews data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Reviews fetched successfully",
 *   data: {
 *     reviews: [
 *       {
 *         _id: "reviewId",
 *         userId: "userId",
 *         userName: "User Name",
 *         userAvatar: "avatar_url",
 *         rating: 5,
 *         comment: "Great service!",
 *         createdAt: "date"
 *       }
 *     ],
 *     averageRating: 4.5,
 *     totalReviews: 10
 *   }
 * }
 */
export const getServiceReviews = async (serviceId) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.GET_SERVICE_REVIEWS(serviceId));
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Reviews fetched successfully",
        data: responseData.data,
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch reviews");
    }
  } catch (error) {
    console.error("Get reviews API error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch reviews. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Create a review for a service
 * Submits a new review for a specific service
 *
 * @param {string} serviceId - Service ID
 * @param {Object} reviewData - Review data
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.comment - Review comment
 * @returns {Promise<Object>} - Created review data
 * @throws {Error} - If API call fails
 *
 * Expected request body:
 * {
 *   rating: 5,
 *   comment: "Excellent service!"
 * }
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Review created successfully",
 *   data: {
 *     _id: "reviewId",
 *     userId: "userId",
 *     serviceId: "serviceId",
 *     rating: 5,
 *     comment: "Excellent service!",
 *     createdAt: "date"
 *   }
 * }
 */
export const createReview = async (serviceId, reviewData) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.CREATE_REVIEW(serviceId),
      reviewData
    );
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Review created successfully",
        data: responseData.data,
      };
    } else {
      throw new Error(responseData.message || "Failed to create review");
    }
  } catch (error) {
    console.error("Create review API error:", error);
    return {
      success: false,
      message: error.message || "Failed to create review. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all service API functions
export default {
  getServiceById,
  getServiceReviews,
  createReview,
};