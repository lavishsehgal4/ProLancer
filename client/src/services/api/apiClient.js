/**
 * API Client Configuration
 *
 * This file creates a configured Axios instance for making HTTP requests.
 * It includes:
 * - Base URL configuration
 * - Request interceptors (to add auth token to headers)
 * - Response interceptors (to handle errors globally)
 */

import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../utils/auth/token";

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Base URL for all API requests
  timeout: 10000, // Request timeout (10 seconds)
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

/**
 * Request Interceptor
 *
 * This runs before every API request.
 * It automatically adds the authentication token to the request headers
 * if a token exists in localStorage.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = getToken();

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * This runs after every API response.
 * It handles common error cases and can transform response data.
 */
apiClient.interceptors.response.use(
  (response) => {
    // If response is successful, just return the data
    return response;
  },
  (error) => {
    // Handle different types of errors

    // Network error (server not reachable)
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({
        success: false,
        message: "Network error. Please check your internet connection.",
        error: error.message,
      });
    }

    // Server responded with error status
    const { status, data } = error.response;

    // Handle specific error status codes
    if (status === 401) {
      // Unauthorized - token might be invalid
      console.error("Unauthorized access");
      // Optionally: remove invalid token and redirect to login
      // removeToken();
      // window.location.href = '/login';
    }

    // Return error in consistent format
    return Promise.reject({
      success: false,
      message: data?.message || "An error occurred",
      error: data?.error || error.message,
      status: status,
    });
  }
);

// Export the configured API client
export default apiClient;
