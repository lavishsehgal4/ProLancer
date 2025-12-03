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
 * @returns {Promise<Object>} - Response object with success status, message, userObj, and token
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "User created successfully",
 *   userObj: {
 *     email: "user@example.com",
 *     firstName: "John",
 *     lastName: "Doe",
 *     accountType: "client",
 *     country: "india"
 *   },
 *   token: "jwt_token_string"
 * }
 */
export const signup = async (userData, role) => {
  try {
    // Validate role
    if (role !== "client" && role !== "freelancer") {
      throw new Error('Invalid role. Must be "client" or "freelancer"');
    }

    // Prepare the request payload - backend expects passwordHash field
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
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Account created successfully",
        userObj: responseData.userObj, // User object with profile data
        token: responseData.token, // JWT token
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
 * @returns {Promise<Object>} - Response object with success status, message, userObj, and token
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Login successful",
 *   userObj: {
 *     firstName: "John",
 *     lastName: "Doe",
 *     accountType: "client",
 *     email: "user@example.com"
 *   },
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
    const responseData = response.data;

    // Check if backend returned success
    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Login successful",
        userObj: responseData.userObj, // User object with profile data
        token: responseData.token, // JWT token
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



/**
 * Resend verification email
 *
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response object with success status and message
 */
export const resendVerificationEmail = async (email) => {
  try {
    const payload = { email };

    const response = await apiClient.post("/api/user/resend-verification", payload);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Verification email sent successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to resend verification email");
    }
  } catch (error) {
    console.error("Resend verification email error:", error);
    return {
      success: false,
      message: error.message || "Failed to resend verification email. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Send forgot password email
 *
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response object with success status and message
 */
export const forgotPassword = async (email) => {
  try {
    const payload = { email };

    const response = await apiClient.post("/api/user/forgot-password", payload);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Password reset email sent successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to send password reset email");
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error.message || "Failed to send password reset email. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Reset password with token
 *
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Response object with success status and message
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const payload = { newPassword };

    const response = await apiClient.post(`/api/user/reset-password?token=${token}`, payload);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Password reset successfully",
      };
    } else {
      throw new Error(responseData.message || "Failed to reset password");
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.message || "Failed to reset password. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all auth API functions
export default {
  signup,
  login,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};
