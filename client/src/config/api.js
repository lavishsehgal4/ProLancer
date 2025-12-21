/**
 * API Configuration
 *
 * This file contains all API-related configuration:
 * - Base URL for backend API (from environment variables)
 * - API endpoint paths
 */

// Base URL for the backend API from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Socket URL for real-time communication
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

// SSE URL for server-sent events
export const SSE_URL = import.meta.env.VITE_SSE_URL || "http://localhost:8000";

// App configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || "ProLancer",
  VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  NODE_ENV: import.meta.env.VITE_NODE_ENV || "development",
};

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
  GET_SERVICE_BY_ID: "freelancer/services/getProfile", // GET request to fetch service by ID using query params
  
  // Review endpoints
  GET_SERVICE_REVIEWS: (serviceId) => `services/${serviceId}/reviews`, // GET request to fetch service reviews
  CREATE_REVIEW: (serviceId) => `services/${serviceId}/reviews`, // POST request to create a review
  
  // Order endpoints
  CREATE_ORDER: "orders", // POST request to create an order
  GET_USER_ORDERS: "orders/user", // GET request to fetch user's orders

  // Add more endpoints here as needed
  // LOGOUT: '/api/users/logout',
};
