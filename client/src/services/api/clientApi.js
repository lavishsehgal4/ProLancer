/**
 * Client API Functions
 * 
 * This file contains all client-related API calls.
 */

import apiClient from "./apiClient";

/**
 * Get client data for the current user
 * 
 * @returns {Promise<Object>} - Response with client data
 */
export const getClientData = async () => {
  try {
    const response = await apiClient.get("/client/data");
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        data: responseData.data || {},
        message: responseData.message || "Client data fetched successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch client data");
    }
  } catch (error) {
    console.error("Get client data API error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch client data. Please try again.",
      error: error.error || error.message,
      data: {},
    };
  }
};

/**
 * Update client data for the current user
 * 
 * @param {Object} clientData - Client data to update
 * @returns {Promise<Object>} - Response object
 */
export const updateClientData = async (clientData) => {
  try {
    const response = await apiClient.put("/client/data", clientData);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        data: responseData.data || {},
        message: responseData.message || "Client data updated successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to update client data");
    }
  } catch (error) {
    console.error("Update client data API error:", error);
    return {
      success: false,
      message: error.message || "Failed to update client data. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Get public client profile (no authentication required)
 * 
 * @param {string} userId - User ID of the client
 * @returns {Promise<Object>} - Response with public client data
 */
export const getPublicClientProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/clients/public?userId=${userId}`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        data: responseData.data,
        message: "Client profile fetched successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch client profile");
    }
  } catch (error) {
    console.error("Get public client profile API error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch client profile. Please try again.",
      error: error.error || error.message,
      data: null,
    };
  }
};

// Export all client API functions
export default {
  getClientData,
  updateClientData,
  getPublicClientProfile,
};