/**
 * Notifications API Functions
 * 
 * This file contains all notification-related API calls.
 */

import apiClient from "./apiClient";

/**
 * Get all job requests/notifications for the current user
 * Works for both freelancers and clients based on account type
 * 
 * @param {string} status - Optional status filter (pending, accepted, rejected, completed)
 * @returns {Promise<Object>} - Response with job requests data
 */
export const getAllJobRequests = async (status = null) => {
  try {
    const url = status ? `/jobs?status=${status}` : "/jobs";
    const response = await apiClient.get(url);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        data: responseData.jobs || [],
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
 * Get all client job requests/notifications for the current user
 * This is now handled by the same endpoint as getAllJobRequests
 * 
 * @param {string} status - Optional status filter
 * @returns {Promise<Object>} - Response with client job requests data
 */
export const getAllClientJobRequests = async (status = null) => {
  // Use the same endpoint as it handles both freelancers and clients
  return getAllJobRequests(status);
};

/**
 * Accept a job request
 * 
 * @param {string} jobId - Job request ID
 * @returns {Promise<Object>} - Response object
 */
export const acceptJobRequest = async (jobId) => {
  try {
    const response = await apiClient.patch(`/job/${jobId}/status`, {
      status: "accepted"
    });
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
    const response = await apiClient.patch(`/job/${jobId}/status`, {
      status: "rejected"
    });
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

/**
 * Complete a job request
 * 
 * @param {string} jobId - Job request ID
 * @returns {Promise<Object>} - Response object
 */
export const completeJobRequest = async (jobId) => {
  try {
    const response = await apiClient.patch(`/job/${jobId}/status`, {
      status: "completed"
    });
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Job completed successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to complete job");
    }
  } catch (error) {
    console.error("Complete job request API error:", error);
    return {
      success: false,
      message: error.message || "Failed to complete job. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all notification API functions
export default {
  getAllJobRequests,
  getAllClientJobRequests,
  acceptJobRequest,
  rejectJobRequest,
  completeJobRequest,
};