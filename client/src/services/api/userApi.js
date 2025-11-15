/**
 * User API Service
 *
 * This file contains all user profile-related API calls.
 * Functions here communicate with the backend user endpoints.
 */

import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Get user profile data
 * Fetches basic user information: email, firstName, lastName, accountType, phoneNumber, profilePicture, country
 *
 * @returns {Promise<Object>} - User profile data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Profile fetched successfully",
 *   data: {
 *     email: "user@example.com",
 *     firstName: "John",
 *     lastName: "Doe",
 *     accountType: "client" | "freelancer",
 *     phoneNumber: "+1234567890",
 *     profilePicture: "url_to_image",
 *     country: "United States"
 *   }
 * }
 */
export const getUserProfile = async () => {
  try {
    // Make GET request to fetch user profile
    const response = await apiClient.get(API_ENDPOINTS.GET_PROFILE);

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Profile fetched successfully",
        data: responseData.data, // Contains user profile data
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to fetch profile");
    }
  } catch (error) {
    // Handle API errors
    console.error("Get profile API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to fetch profile. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Update user profile data
 * Updates user information (except email which cannot be changed)
 *
 * @param {Object} profileData - Updated profile data
 * @param {string} profileData.firstName - User's first name
 * @param {string} profileData.lastName - User's last name
 * @param {string} profileData.phoneNumber - User's phone number
 * @param {string} profileData.profilePicture - User's profile picture URL
 * @param {string} profileData.country - User's country
 *
 * @returns {Promise<Object>} - Updated profile data
 * @throws {Error} - If API call fails
 */
export const updateUserProfile = async (profileData) => {
  try {
    // Make PUT/PATCH request to update user profile
    const response = await apiClient.put(
      API_ENDPOINTS.UPDATE_PROFILE,
      profileData
    );

    // Extract response data
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Profile updated successfully",
        data: responseData.data, // Contains updated user profile data
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Failed to update profile");
    }
  } catch (error) {
    // Handle API errors
    console.error("Update profile API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to update profile. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all user API functions
export default {
  getUserProfile,
  updateUserProfile,
};
