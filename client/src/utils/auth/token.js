/**
 * Token Management Utilities
 *
 * Functions to handle JWT token storage and retrieval from browser's localStorage.
 * This allows the app to remember the user's login session.
 */

const TOKEN_KEY = "prolancer_auth_token"; // Key name for storing token in localStorage
const USER_KEY = "prolancer_user"; // Key name for storing user data in localStorage

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
 * Save user data to localStorage
 * @param {Object} userData - User data object
 */
export const saveUser = (userData) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    console.log("User data saved successfully");
  } catch (error) {
    console.error("Error saving user data:", error);
    throw new Error("Failed to save user data");
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} - User data object or null if not found
 */
export const getUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
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
 * Remove user data from localStorage
 */
export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
    console.log("User data removed successfully");
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

/**
 * Complete logout - remove both token and user data
 */
export const logout = () => {
  removeToken();
  removeUser();
  console.log("Logout completed - token and user data cleared");
};

/**
 * Check if user is authenticated (has a valid token)
 * @returns {boolean} - true if token exists, false otherwise
 */
export const isAuthenticated = () => {
  const token = getToken();
  return token !== null && token !== undefined && token !== "";
};
