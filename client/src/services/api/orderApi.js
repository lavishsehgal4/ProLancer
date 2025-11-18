/**
 * Order API Functions
 *
 * This file contains all order-related API calls.
 * Functions here communicate with the backend order endpoints.
 */

import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../../config/api";

/**
 * Create a new order
 * Creates an order request for a specific service
 *
 * @param {Object} orderData - Order data
 * @param {string} orderData.serviceId - Service ID
 * @param {string} orderData.freelancerId - Freelancer ID
 * @param {string} orderData.message - Order message/requirements
 * @param {number} orderData.budget - Proposed budget
 * @param {string} orderData.deadline - Proposed deadline
 * @returns {Promise<Object>} - Created order data
 * @throws {Error} - If API call fails
 *
 * Expected request body:
 * {
 *   serviceId: "serviceId",
 *   freelancerId: "freelancerId",
 *   message: "I need a website for my business...",
 *   budget: 500,
 *   deadline: "2024-02-15"
 * }
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Order created successfully",
 *   data: {
 *     _id: "orderId",
 *     clientId: "clientId",
 *     freelancerId: "freelancerId",
 *     serviceId: "serviceId",
 *     message: "Order requirements",
 *     budget: 500,
 *     deadline: "2024-02-15",
 *     status: "pending",
 *     createdAt: "date"
 *   }
 * }
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_ORDER, orderData);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Order created successfully",
        data: responseData.data,
      };
    } else {
      throw new Error(responseData.message || "Failed to create order");
    }
  } catch (error) {
    console.error("Create order API error:", error);
    return {
      success: false,
      message: error.message || "Failed to create order. Please try again.",
      error: error.error || error.message,
    };
  }
};

/**
 * Get user's orders
 * Fetches all orders for the current user (both as client and freelancer)
 *
 * @returns {Promise<Object>} - User's orders data
 * @throws {Error} - If API call fails
 *
 * Expected backend response format:
 * {
 *   success: true,
 *   message: "Orders fetched successfully",
 *   data: {
 *     asClient: [
 *       {
 *         _id: "orderId",
 *         serviceId: "serviceId",
 *         serviceName: "Service Name",
 *         freelancerId: "freelancerId",
 *         freelancerName: "Freelancer Name",
 *         budget: 500,
 *         status: "pending",
 *         createdAt: "date"
 *       }
 *     ],
 *     asFreelancer: [
 *       {
 *         _id: "orderId",
 *         serviceId: "serviceId",
 *         serviceName: "Service Name",
 *         clientId: "clientId",
 *         clientName: "Client Name",
 *         budget: 500,
 *         status: "pending",
 *         createdAt: "date"
 *       }
 *     ]
 *   }
 * }
 */
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.GET_USER_ORDERS);
    const responseData = response.data;

    if (responseData.success) {
      return {
        success: true,
        message: responseData.message || "Orders fetched successfully",
        data: responseData.data,
      };
    } else {
      throw new Error(responseData.message || "Failed to fetch orders");
    }
  } catch (error) {
    console.error("Get orders API error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch orders. Please try again.",
      error: error.error || error.message,
    };
  }
};

// Export all order API functions
export default {
  createOrder,
  getUserOrders,
};