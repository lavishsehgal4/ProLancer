/**
 * Categories API Service
 *
 * This file contains all category-related API calls.
 * Functions here communicate with the backend categories endpoints.
 */

import apiClient from "./apiClient";

/**
 * Get services by category title with pagination and filters
 * Fetches services based on category title with support for filters and pagination
 *
 * @param {string} title - Category title (e.g., "web-development")
 * @param {Object} options - Query parameters for filtering and pagination
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 6)
 * @param {number} options.minRate - Minimum hourly rate
 * @param {number} options.maxRate - Maximum hourly rate
 * @param {number} options.rating - Minimum rating
 * @param {string} options.experience - Experience level ("entry", "intermediate", "expert")
 *
 * @returns {Promise<Object>} - Services data with pagination info
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   title: "web development",
 *   currentPage: 1,
 *   totalPages: 3,
 *   limit: 6,
 *   totalItems: 18,
 *   services: [
 *     {
 *       serviceId: "675ac98b21e52c1bd48248cd",
 *       title: "Web Development",
 *       bio: "Building modern responsive web apps.",
 *       hourlyRate: 40,
 *       profilePicture: "https://example.com/pic.jpg",
 *       averageRating: 4.7,
 *       totalReviews: 22,
 *       skills: ["React", "Node.js", "MongoDB"],
 *       name: "John Doe"
 *     }
 *   ]
 * }
 */
export const getServicesByCategory = async (title, options = {}) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add pagination parameters
    if (options.page) queryParams.append('page', options.page);
    if (options.limit) queryParams.append('limit', options.limit);
    
    // Add filter parameters
    if (options.minRate) queryParams.append('minRate', options.minRate);
    if (options.maxRate) queryParams.append('maxRate', options.maxRate);
    if (options.rating) queryParams.append('rating', options.rating);
    if (options.experience) queryParams.append('experience', options.experience);

    // Build the full URL
    const url = `categories/${title}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    console.log("Fetching services for category:", title, "with options:", options);
    console.log("API URL:", url);

    // Make GET request to fetch services by category
    const response = await apiClient.get(url);

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        data: {
          title: responseData.title,
          currentPage: responseData.currentPage,
          totalPages: responseData.totalPages,
          limit: responseData.limit,
          totalItems: responseData.totalItems,
          services: responseData.services || []
        }
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to fetch services");
    }
  } catch (error) {
    // Handle API errors
    console.error("Get services by category API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to fetch services. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Get freelancer and service details by service ID
 * Fetches detailed information about a freelancer and their specific service
 *
 * @param {string} serviceId - Service ID (MongoDB ObjectId)
 *
 * @returns {Promise<Object>} - Freelancer and service data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Freelancer and service fetched successfully",
 *   data: {
 *     freelancerInfo: {
 *       aboutMe: "Full-stack developer with 3 years experience.",
 *       education: "B.Tech CSE 2022",
 *       yearsOfExperience: 3,
 *       averageRating: 4.8,
 *       completedJobs: 42,
 *       activeJobs: 3,
 *       successRate: 97
 *     },
 *     service: {
 *       _id: "675ac98b21e52c1bd48248cd",
 *       title: "Web Development",
 *       bio: "I build modern full-stack applications using MERN.",
 *       description: "Detailed service description goes here...",
 *       category: "web development",
 *       skills: ["React", "Node.js", "MongoDB"],
 *       hourlyRate: 40,
 *       profilePicture: "https://example.com/service.jpg",
 *       averageRating: 4.7,
 *       totalReviews: 22,
 *       isActive: true
 *     }
 *   }
 * }
 */
export const getServiceDetails = async (serviceId) => {
  try {
    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    console.log("Fetching service details for serviceId:", serviceId);

    // Make GET request to fetch service details
    const response = await apiClient.get(`categories/service/${serviceId}`);

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        data: {
          freelancerInfo: responseData.data.freelancerInfo,
          service: responseData.data.service
        }
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to fetch service details");
    }
  } catch (error) {
    // Handle API errors
    console.error("Get service details API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to fetch service details. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all categories API functions
export default {
  getServicesByCategory,
  getServiceDetails,
};