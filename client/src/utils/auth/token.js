/**
 * Token Management Utilities
 *
 * Functions to handle JWT token storage and retrieval from browser's localStorage.
 * This allows the app to remember the user's login session.
 */

const TOKEN_KEY = "prolancer_auth_token"; // Key name for storing token in localStorage

/**
 * Save authentication token to localStorage
 * @param {string} token - JWT token received from backend
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Token saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
    throw new Error("Failed to save token");
  }
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Remove authentication token from localStorage (logout)
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log("Token removed successfully");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

/**
 * Check if user is authenticated (has a valid token)
 * @returns {boolean} - true if token exists, false otherwise
 */
export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token !== undefined && token !== "";
};
