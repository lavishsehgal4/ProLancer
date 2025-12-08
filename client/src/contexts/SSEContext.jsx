import { createContext, useContext, useEffect, useState } from "react";
import sseService from "../services/sse/sseService";
import { isAuthenticated } from "../utils/auth/token";
import NotificationPopup from "../components/common/NotificationPopup/NotificationPopup";

const SSEContext = createContext();

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (!context) {
    // Return default values instead of throwing error
    return {
      connectionStatus: { isConnected: false, reconnectAttempts: 0 },
      unreadCount: 0,
      clearUnreadCount: () => {},
      connect: () => {},
      disconnect: () => {},
    };
  }
  return context;
};

export const SSEProvider = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    reconnectAttempts: 0
  });

  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to SSE when user is authenticated
    if (isAuthenticated()) {
      try {
        sseService.connect();
        
        // Add listener for notifications
        sseService.addListener("global", handleSSEMessage);

        // Update connection status periodically
        const statusInterval = setInterval(() => {
          setConnectionStatus(sseService.getConnectionStatus());
        }, 5000);

        return () => {
          clearInterval(statusInterval);
          sseService.removeListener("global");
        };
      } catch (error) {
        console.error("Failed to initialize SSE connection:", error);
      }
    }
  }, []);

  const handleSSEMessage = (data) => {
    console.log("Received SSE message:", data);
    
    // Handle different message types
    switch (data.type) {
      case "NEW_JOB":
        setNotification({
          isVisible: true,
          type: "info",
          title: "New Job Request!",
          message: `${data.message}: "${data.projectTitle}"`,
        });
        setUnreadCount(prev => prev + 1);
        break;
        
      case "JOB_ACCEPTED":
        setNotification({
          isVisible: true,
          type: "success",
          title: "Job Accepted!",
          message: data.message,
        });
        setUnreadCount(prev => prev + 1);
        break;
        
      case "JOB_REJECTED":
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Job Rejected",
          message: data.message,
        });
        setUnreadCount(prev => prev + 1);
        break;
        
      default:
        console.log("Unknown message type:", data.type);
    }
  };

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  const value = {
    connectionStatus,
    unreadCount,
    clearUnreadCount,
    connect: () => sseService.connect(),
    disconnect: () => sseService.disconnect(),
  };

  return (
    <SSEContext.Provider value={value}>
      {children}
      
      {/* Global notification popup */}
      <NotificationPopup
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={5000}
      />
    </SSEContext.Provider>
  );
};