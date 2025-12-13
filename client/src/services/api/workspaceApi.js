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

/**
 * Add collaborator to GitHub repository
 * 
 * @param {string} jobId - Job/Project ID
 * @returns {Promise<Object>} - Response with collaborator information
 */
export const addCollaborator = async (jobId) => {
  try {
    const response = await apiClient.post(`/workspace/repo/${jobId}/collaborator`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Collaborator added successfully",
        data: {
          username: responseData.username,
          permission: responseData.permission
        }
      };
    } else {
      throw new Error(responseData.message || "Failed to add collaborator");
    }
  } catch (error) {
    console.error("Add collaborator API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to add collaborator",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get all tasks for a project
 * 
 * @param {string} jobId - Job/Project ID
 * @returns {Promise<Object>} - Response with tasks list
 */
export const getTasks = async (jobId) => {
  try {
    const response = await apiClient.get(`/workspace/${jobId}`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Tasks fetched successfully",
        data: responseData.data || []
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch tasks");
    }
  } catch (error) {
    console.error("Get tasks API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch tasks",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Create a new task for a project
 * 
 * @param {string} jobId - Job/Project ID
 * @param {string} title - Task title
 * @returns {Promise<Object>} - Response with created task
 */
export const createTask = async (jobId, title) => {
  try {
    const response = await apiClient.post(`/workspace/${jobId}`, {
      title
    });
    
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Task created successfully",
        data: responseData.data
      };
    } else {
      throw new Error(responseData.message || "Failed to create task");
    }
  } catch (error) {
    console.error("Create task API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create task",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Update task completion status
 * 
 * @param {string} taskId - Task ID
 * @param {boolean} isCompleted - Task completion status
 * @returns {Promise<Object>} - Response with updated task
 */
export const updateTaskStatus = async (taskId, isCompleted) => {
  try {
    const response = await apiClient.put(`/workspace/update/${taskId}`, {
      isCompleted
    });
    
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Task updated successfully",
        data: responseData.data
      };
    } else {
      throw new Error(responseData.message || "Failed to update task");
    }
  } catch (error) {
    console.error("Update task API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update task",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Delete a task
 * 
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} - Response with deletion status
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await apiClient.delete(`/workspace/${taskId}`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Task deleted successfully"
      };
    } else {
      throw new Error(responseData.message || "Failed to delete task");
    }
  } catch (error) {
    console.error("Delete task API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete task",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Upload file to project
 * 
 * @param {string} jobId - Job/Project ID
 * @param {File} file - File to upload
 * @returns {Promise<Object>} - Response with uploaded file information
 */
export const uploadFile = async (jobId, file) => {
  try {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        message: "File size exceeds 5MB limit",
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/files/upload/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "File uploaded successfully",
        data: responseData.file
      };
    } else {
      throw new Error(responseData.message || "Failed to upload file");
    }
  } catch (error) {
    console.error("Upload file API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to upload file",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get all files for a project
 * 
 * @param {string} jobId - Job/Project ID
 * @returns {Promise<Object>} - Response with files list
 */
export const getFiles = async (jobId) => {
  try {
    const response = await apiClient.get(`/files/list/${jobId}`);
    const responseData = response.data;

    if (responseData.success) {
      // Sort files by creation time (newest first)
      const sortedFiles = (responseData.files || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      return {
        success: true,
        message: responseData.message || "Files fetched successfully",
        data: sortedFiles
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch files");
    }
  } catch (error) {
    console.error("Get files API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch files",
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Delete a file
 * 
 * @param {string} publicId - File public ID
 * @returns {Promise<Object>} - Response with deletion status
 */
export const deleteFile = async (publicId) => {
  try {
    const response = await apiClient.delete(`/files/delete/${publicId}`);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "File deleted successfully"
      };
    } else {
      throw new Error(responseData.message || "Failed to delete file");
    }
  } catch (error) {
    console.error("Delete file API error:", error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete file",
      error: error.response?.data?.error || error.message,
    };
  }
};

// Export all workspace API functions
export default {
  getGithubRepoStatus,
  createGithubRepository,
  addCollaborator,
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  uploadFile,
  getFiles,
  deleteFile,
};