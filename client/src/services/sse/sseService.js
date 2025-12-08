/**
 * SSE Service for Real-time Notifications
 * Manages Server-Sent Events connection globally
 */

import { getToken } from "../../utils/auth/token";

class SSEService {
  constructor() {
    this.eventSource = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  /**
   * Connect to SSE endpoint
   */
  connect() {
    const token = getToken();
    if (!token) {
      console.log("No token found, cannot connect to SSE");
      return;
    }

    if (this.eventSource) {
      this.disconnect();
    }

    try {
      // Create EventSource with token as query parameter since EventSource doesn't support custom headers
      const baseUrl = 'http://localhost:8000';
      const url = `${baseUrl}/events?token=${encodeURIComponent(token)}`;
      
      this.eventSource = new EventSource(url);
      
      this.eventSource.onopen = () => {
        console.log("SSE connection established");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.eventSource.onmessage = (event) => {
        try {
          if (event.data === "connected") {
            console.log("SSE connection confirmed");
            return;
          }

          const data = JSON.parse(event.data);
          console.log("SSE message received:", data);
          
          // Notify all listeners
          this.listeners.forEach((callback) => {
            try {
              callback(data);
            } catch (error) {
              console.error("Error in SSE listener:", error);
            }
          });
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        this.isConnected = false;
        
        // Attempt to reconnect
        this.handleReconnect();
      };

    } catch (error) {
      console.error("Failed to create SSE connection:", error);
    }
  }

  /**
   * Handle reconnection logic
   */
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
  }

  /**
   * Disconnect from SSE
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
      console.log("SSE connection closed");
    }
  }

  /**
   * Add event listener
   * @param {string} id - Unique identifier for the listener
   * @param {function} callback - Callback function to handle messages
   */
  addListener(id, callback) {
    this.listeners.set(id, callback);
  }

  /**
   * Remove event listener
   * @param {string} id - Unique identifier for the listener
   */
  removeListener(id) {
    this.listeners.delete(id);
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: this.eventSource?.readyState,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
const sseService = new SSEService();

export default sseService;