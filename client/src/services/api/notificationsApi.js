/**
 * Notifications API Functions
 * 
 * This file contains all notification-related API calls.
 */

import apiClient from "./apiClient";

/**
 * Get all job requests/notifications for the current user
 * 
 * @returns {Promise<Object>} - Response with job requests data
 */
export const getAllJobRequests = async () => {
  try {
    const response = await apiClient.get("/alljobs");
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        data: responseData.data || [],
        message: responseData.message || "Job requests fetched successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch job requests");
    }
  } catch (error) {
    console.error("Get job requests API error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch job requests. Please try again.",
      error: error.error || error.message,
      data: [],
    };
  }
};

/**
 * Accept a job request
 * 
 * @param {string} jobId - Job request ID
 * @returns {Promise<Object>} - Response object
 */
export const acceptJobRequest = async (jobId) => {
  try {
    const response = await apiClient.post(`/accept/${jobId}`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Job request accepted successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to accept job request");
    }
  } catch (error) {
    console.error("Accept job request API error:", error);
    return {
      success: false,
      message: error.message || "Failed to accept job request. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Reject a job request
 * 
 * @param {string} jobId - Job request ID
 * @returns {Promise<Object>} - Response object
 */
export const rejectJobRequest = async (jobId) => {
  try {
    const response = await apiClient.post(`/reject/${jobId}`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Job request rejected successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to reject job request");
    }
  } catch (error) {
    console.error("Reject job request API error:", error);
    return {
      success: false,
      message: error.message || "Failed to reject job request. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all notification API functions
export default {
  getAllJobRequests,
  acceptJobRequest,
  rejectJobRequest,
};