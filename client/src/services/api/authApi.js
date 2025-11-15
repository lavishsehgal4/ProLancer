/**
 * Authentication API Service
 *
 * This file contains all authentication-related API calls.
 * Functions here communicate with the backend authentication endpoints.
 */

import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Sign up a new user (Client or Freelancer)
 *
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name (optional)
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} role - Account type: 'client' or 'freelancer'
 *
 * @returns {Promise<Object>} - Response object with success status, message, and data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "User created successfully",
 *   token: "jwt_token_string"
 * }
 * Note: Backend does NOT send newUser object in response
 */
export const signup = async (userData, role) => {
  try {
    // Validate role
    if (role !== "client" && role !== "freelancer") {
      throw new Error('Invalid role. Must be "client" or "freelancer"');
    }

    // Prepare the request payload
    // Note: Backend expects 'passwordHash' field (backend will hash it)
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName || "",
      email: userData.email,
      passwordHash: userData.password, // Backend expects 'passwordHash' field
    };

    // Make POST request to signup endpoint
    // Endpoint format: /signup/:role
    const response = await apiClient.post(API_ENDPOINTS.SIGNUP(role), payload);

    // Extract response data
    // Backend sends: { success, message, token } (no data wrapper, no newUser)
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Account created successfully",
        token: responseData.token, // Token is at root level, not in data object
        // Note: Backend does NOT send newUser in response
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Signup failed");
    }
  } catch (error) {
    // Handle API errors
    console.error("Signup API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message: error.message || "Failed to create account. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Login user
 *
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response object with success status, message, and token
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Login successful",
 *   token: "jwt_token_string"
 * }
 */
export const login = async (email, password) => {
  try {
    // Prepare the request payload
    const payload = {
      email,
      password,
    };

    // Make POST request to login endpoint
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, payload);

    // Extract response data
    // Backend sends: { success, message, token } (no data wrapper)
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Login successful",
        token: responseData.token, // Token is at root level, not in data object
      };
    } else {
      // Backend returned error
      throw new Error(responseData.message || "Login failed");
    }
  } catch (error) {
    // Handle API errors
    console.error("Login API error:", error);

    // Return error in consistent format
    return {
      success: false,
      message:
        error.message || "Failed to login. Please check your credentials.",
      error: error.error || error.message,
    };
  }
};

// Export all auth API functions
export default {
  signup,
  login,
};
