/**
 * Freelancer API Service
 *
 * This file contains all freelancer profile-related API calls.
 * Functions here communicate with the backend freelancer endpoints.
 */

import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Get freelancer profile data
 * Fetches freelancer information: aboutMe, education, yearsOfExperience, averageRating, services
 *
 * @returns {Promise<Object>} - Freelancer profile data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Profile fetched successfully",
 *   data: {
 *     aboutMe: "string",
 *     education: "string", 
 *     yearsOfExperience: number,
 *     averageRating: number,
 *     services: [...],
 *     completedJobs: number,
 *     activeJobs: number,
 *     successRate: number,
 *     profileCompleted: boolean,
 *     profileCompletionPercentage: number,
 *     isVerified: boolean,
 *     verificationBadges: []
 *   }
 * }
 */
export const getFreelancerProfile = async () => {
  try {
    // Make GET request to fetch freelancer profile
    const response = await apiClient.get(API_ENDPOINTS.GET_FREELANCER_PROFILE);

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Profile fetched successfully",
        data: responseData.data, // Contains freelancer profile data
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to fetch profile");
    }
  } catch (error) {
    // Handle API errors
    console.error("Get freelancer profile API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to fetch profile. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Update freelancer profile data
 * Updates freelancer information according to backend API
 *
 * @param {Object} profileData - Updated profile data
 * @param {string} profileData.aboutMe - About me text
 * @param {string} profileData.education - Education details
 * @param {number} profileData.yearsOfExperience - Years of experience
 * @param {number} profileData.successRate - Success rate percentage
 * @param {boolean} profileData.profileCompleted - Profile completion status
 * @param {number} profileData.profileCompletionPercentage - Profile completion percentage
 *
 * @returns {Promise<Object>} - Updated profile data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Profile updated successfully",
 *   data: {
 *     aboutMe: "string",
 *     education: "string",
 *     yearsOfExperience: number,
 *     averageRating: number,
 *     isComplete: boolean,
 *     completedJobs: number,
 *     activeJobs: number,
 *     successRate: number,
 *     isVerified: boolean,
 *     verificationBadges: [],
 *     profileCompleted: boolean,
 *     profileCompletionPercentage: number,
 *     services: []
 *   }
 * }
 */
export const updateFreelancerProfile = async (profileData) => {
  try {
    // Make PUT request to update freelancer profile
    const response = await apiClient.put(
      API_ENDPOINTS.UPDATE_FREELANCER_PROFILE,
      profileData
    );

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Profile updated successfully",
        data: responseData.data, // Contains updated freelancer profile data
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to update profile");
    }
  } catch (error) {
    // Handle API errors
    console.error("Update freelancer profile API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to update profile. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Create a new service
 * Creates a new service for the freelancer according to backend API
 *
 * @param {Object} serviceData - Service data matching backend schema
 * @param {string} serviceData.title - Service title (required)
 * @param {string} serviceData.bio - Service bio (required, 10-200 chars)
 * @param {string} serviceData.description - Service description (required, min 300 chars)
 * @param {string} serviceData.category - Service category (required)
 * @param {string[]} serviceData.skills - Array of skills (required)
 * @param {number} serviceData.hourlyRate - Hourly rate (required, min 1)
 * @param {string} serviceData.profilePicture - Service profile picture URL (optional)
 *
 * @returns {Promise<Object>} - Created service data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Service created successfully",
 *   data: {
 *     title: "string",
 *     bio: "string",
 *     description: "string",
 *     averageRating: 0,
 *     totalReviews: 0,
 *     category: "string",
 *     skills: ["skill1", "skill2"],
 *     hourlyRate: number,
 *     profilePicture: "string",
 *     isActive: true
 *   }
 * }
 */
export const createService = async (serviceData) => {
  try {
    // Make POST request to create service
    const response = await apiClient.post(
      API_ENDPOINTS.CREATE_SERVICE,
      serviceData
    );

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Service created successfully",
        data: responseData.data, // Contains created service data
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to create service");
    }
  } catch (error) {
    // Handle API errors
    console.error("Create service API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to create service. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Update an existing service
 * Updates a service for the freelancer according to backend API
 *
 * @param {Object} serviceData - Updated service data
 * @param {string} serviceData.title - Service title (required)
 * @param {string} serviceData.bio - Service bio (required, 10-200 chars)
 * @param {string} serviceData.description - Service description (required, min 300 chars)
 * @param {string} serviceData.category - Service category (required)
 * @param {string[]} serviceData.skills - Array of skills (required)
 * @param {number} serviceData.hourlyRate - Hourly rate (required, min 1)
 * @param {string} serviceData.profilePicture - Service profile picture URL (optional)
 *
 * @returns {Promise<Object>} - Updated service data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Service updated successfully",
 *   data: {
 *     title: "string",
 *     bio: "string", 
 *     description: "string",
 *     averageRating: 0,
 *     totalReviews: 0,
 *     category: "string",
 *     skills: ["skill1", "skill2"],
 *     hourlyRate: number,
 *     profilePicture: "string",
 *     isActive: true
 *   }
 * }
 */
export const updateService = async (serviceData) => {
  try {
    // Make PUT request to update service
    const response = await apiClient.put(
      API_ENDPOINTS.UPDATE_SERVICE,
      serviceData
    );

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Service updated successfully",
        data: responseData.data, // Contains updated service data
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to update service");
    }
  } catch (error) {
    // Handle API errors
    console.error("Update service API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to update service. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Delete a service
 * Deletes a service for the freelancer according to backend API
 *
 * @param {string} serviceId - Service ID to delete
 *
 * @returns {Promise<Object>} - Success response
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Service deleted successfully"
 * }
 */
export const deleteService = async (serviceId) => {
  try {
    // Validate serviceId
    if (!serviceId) {
      throw new Error("Service ID is required for deletion");
    }

    console.log("Deleting service with ID:", serviceId);

    // Make DELETE request to delete service
    // Backend expects: freelancer/services/:serviceId
    const response = await apiClient.delete(`freelancer/services/${serviceId}`);

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Service deleted successfully",
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to delete service");
    }
  } catch (error) {
    // Handle API errors
    console.error("Delete service API error:", error);
    console.error("Service ID that failed:", serviceId);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to delete service. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all freelancer API functions
export default {
  getFreelancerProfile,
  updateFreelancerProfile,
  createService,
  updateService,
  deleteService,
};
