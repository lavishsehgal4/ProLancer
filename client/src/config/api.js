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
  LOGIN: "users/login",

  // User profile endpoints
  GET_PROFILE: "users/basicprofile", // GET request to fetch user profile data
  UPDATE_PROFILE: "users/basicprofile", // PUT/PATCH request to update user profile

  // Freelancer profile endpoints
  GET_FREELANCER_PROFILE: "freelancer/profile", // GET request to fetch freelancer profile
  UPDATE_FREELANCER_PROFILE: "freelancer/profile", // PUT request to update freelancer profile

  // Service endpoints
  CREATE_SERVICE: "freelancer/services", // POST request to create a service
  UPDATE_SERVICE: "freelancer/services", // PUT request to update a service
  DELETE_SERVICE: "freelancer/services", // DELETE request to delete a service

  // Add more endpoints here as needed
  // LOGOUT: '/api/users/logout',
};
