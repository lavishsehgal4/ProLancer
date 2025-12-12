/**
 * Workspace API Functions
 * 
 * This file contains all workspace-related API calls for project management.
 */

import apiClient from "./apiClient";

/**
 * Get GitHub repository status for a project
 * 
 * @param {string} jobId - Job/Project ID
 * @returns {Promise<Object>} - Response with repository status
 */
export const getGithubRepoStatus = async (jobId) => {
  try {
    const response = await apiClient.get(`/workspace/repo/status/${jobId}`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Repository status fetched successfully",
        data: {
          exists: responseData.exists,
          status: responseData.status,
          repoName: responseData.repoName,
          repoUrl: responseData.repoUrl
        }
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch repository status");
    }
  } catch (error) {
    console.error("Get GitHub repository status API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch repository status",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Create GitHub repository for a project
 * 
 * @param {string} jobId - Job/Project ID
 * @param {string} repoName - Repository name
 * @param {string} repoDescription - Repository description
 * @returns {Promise<Object>} - Response with repository information
 */
export const createGithubRepository = async (jobId, repoName, repoDescription) => {
  try {
    const response = await apiClient.post(`/workspace/repo/create/${jobId}`, {
      repoName,
      repoDescription
    });
    
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Repository created successfully",
        data: {
          repoUrl: responseData.repoUrl,
          repoName: responseData.repoName
        }
      };
    } else {
      throw new Error(responseData.message || "Failed to create repository");
    }
  } catch (error) {
    console.error("Create GitHub repository API error:", error);
    
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || error.message || "Failed to create repository";
    
    return {
      success: false,
      message: errorMessage,
      error: error.response?.data?.error || error.message,
    };
  }
};

// Export all workspace API functions
export default {
  getGithubRepoStatus,
  createGithubRepository,
};