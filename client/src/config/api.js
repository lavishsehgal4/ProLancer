/**
 * API Configuration
 *
 * This file contains all API-related configuration:
 * - Base URL for backend API
 * - API endpoint paths
 */

// Base URL for the backend API
// Change this to your backend server URL (e.g., 'http://localhost:8000' for local development)
export const API_BASE_URL = "http://localhost:8000";

// API endpoint paths
export const API_ENDPOINTS = {
  // User authentication endpoints
  SIGNUP: (role) => `/signup/${role}`, // role can be 'client' or 'freelancer'
  LOGIN: "/api/users/login",

  // User profile endpoints
  GET_PROFILE: "/api/users/profile", // GET request to fetch user profile data
  UPDATE_PROFILE: "/api/users/profile", // PUT/PATCH request to update user profile

  // Add more endpoints here as needed
  // LOGOUT: '/api/users/logout',
};
