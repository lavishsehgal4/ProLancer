import { useState, useEffect } from "react";
import { 
  Bell, 
  Clock, 
  DollarSign, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { getAllJobRequests, acceptJobRequest, rejectJobRequest, completeJobRequest } from "../../services/api/notificationsApi";
import { getUserProfile } from "../../services/api/userApi";
import NotificationPopup from "../../components/common/NotificationPopup/NotificationPopup";
import "./Notifications.css";

/**
 * Notifications Page
 * Displays all job requests/notifications for the current user
 */

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(new Set());
  const [userProfile, setUserProfile] = useState(null);

  // Notification popup state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchUserProfile();
    fetchNotifications();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getAllJobRequests();
      if (response.success) {
        setNotifications(response.data);
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to load notifications",
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to load notifications. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (notificationId) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
    }
    setExpandedNotifications(newExpanded);
  };

  const handleAccept = async (jobId) => {
    setActionLoading(prev => new Set(prev).add(jobId));
    try {
      const response = await acceptJobRequest(jobId);
      if (response.success) {
        setNotification({
          isVisible: true,
          type: "success",
          title: "Job Accepted!",
          message: response.message || "Job request accepted successfully",
        });
        // Refresh notifications
        fetchNotifications();
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to accept job request",
        });
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to accept job request. Please try again.",
      });
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleReject = async (jobId) => {
    setActionLoading(prev => new Set(prev).add(jobId));
    try {
      const response = await rejectJobRequest(jobId);
      if (response.success) {
        setNotification({
          isVisible: true,
          type: "success",
          title: "Job Rejected",
          message: response.message || "Job request rejected successfully",
        });
        // Refresh notifications
        fetchNotifications();
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to reject job request",
        });
      }
    } catch (error) {
      console.error("Error rejecting job:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to reject job request. Please try again.",
      });
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleComplete = async (jobId) => {
    setActionLoading(prev => new Set(prev).add(jobId));
    try {
      const response = await completeJobRequest(jobId);
      if (response.success) {
        setNotification({
          isVisible: true,
          type: "success",
          title: "Job Completed",
          message: response.message || "Job completed successfully",
        });
        // Refresh notifications
        fetchNotifications();
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to complete job",
        });
      }
    } catch (error) {
      console.error("Error completing job:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to complete job. Please try again.",
      });
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status) => {
    return <div className={`notification-status-icon notification-status-icon--${status}`}></div>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const formatDeadline = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="notifications-loading">
        <Loader2 className="notifications-loading-spinner" size={32} />
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <>
      {/* Notification Popup */}
      <NotificationPopup
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={3000}
      />

      <div className="notifications-page">
        <div className="notifications-container">
          {/* Header */}
          <div className="notifications-header">
            <div className="notifications-title-section">
              <Bell size={28} />
              <h1 className="notifications-title">Notifications</h1>
            </div>
            <p className="notifications-subtitle">
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
            </p>
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="notifications-empty">
                <Bell size={48} />
                <h3>No notifications yet</h3>
                <p>You'll see job requests and updates here when they arrive.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const notifId = notif._id || notif.jobId;
                const isExpanded = expandedNotifications.has(notifId);
                const isLoading = actionLoading.has(notifId);
                
                return (
                  <div key={notifId} className={`notification-card notification-card--${notif.status}`}>
                    {/* Notification Header */}
                    <div className="notification-header">
                      <div className="notification-avatar">
                        <User size={24} />
                      </div>
                      
                      <div className="notification-info">
                        <h3 className="notification-project-title">{notif.projectTitle}</h3>
                        <p className="notification-client">
                          {userProfile?.accountType === "freelancer" 
                            ? `Client: ${notif.clientName || "Apex Tech Solutions"}`
                            : `Freelancer: ${notif.freelancerName || "Professional Freelancer"}`
                          }
                        </p>
                      </div>
                      
                      <div className="notification-meta">
                        {getStatusIcon(notif.status)}
                        <span className="notification-time">{formatDate(notif.createdAt)}</span>
                      </div>
                    </div>

                    {/* Expand Button - Only show when collapsed */}
                    {!isExpanded && (
                      <button 
                        className="notification-expand-btn"
                        onClick={() => toggleExpanded(notifId)}
                      >
                        Expand <ChevronDown size={16} />
                      </button>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="notification-details">
                        <div className="notification-description">
                          <h4>Project Description</h4>
                          <p>{notif.projectDescription}</p>
                        </div>

                        <div className="notification-specs">
                          <div className="notification-spec">
                            <DollarSign size={16} />
                            <span>Budget - ${notif.budget?.toLocaleString()} - $7,000</span>
                          </div>
                          <div className="notification-spec">
                            <Calendar size={16} />
                            <span>Deadline - {formatDeadline(notif.deadline)}</span>
                          </div>
                        </div>

                        <div className="notification-requirements">
                          <h4>Additional Requirements</h4>
                          <ul>
                            <li>Must have experience with React Native</li>
                            <li>API integration required</li>
                            <li>Weekly progress updates</li>
                            {notif.additionalRequirements && 
                              notif.additionalRequirements.split('\n').map((req, index) => (
                                <li key={index + 3}>{req}</li>
                              ))
                            }
                          </ul>
                        </div>

                        {/* Action Buttons - Different for freelancers vs clients */}
                        <div className="notification-actions">
                          {userProfile?.accountType === "freelancer" && (
                            <>
                              {notif.status === "pending" && (
                                <>
                                  <button
                                    className="notification-btn notification-btn--reject"
                                    onClick={() => handleReject(notifId)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? <Loader2 size={16} className="btn-spinner" /> : "Reject"}
                                  </button>
                                  <button
                                    className="notification-btn notification-btn--accept"
                                    onClick={() => handleAccept(notifId)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? <Loader2 size={16} className="btn-spinner" /> : "Accept"}
                                  </button>
                                </>
                              )}
                              {notif.status === "accepted" && (
                                <button
                                  className="notification-btn notification-btn--open"
                                  onClick={() => window.open(`/project/${notifId}?serviceId=${notif.serviceId}`, '_blank')}
                                  disabled={isLoading}
                                >
                                  Open Project
                                </button>
                              )}

                              <button 
                                className="notification-btn notification-btn--profile"
                                onClick={() => window.open(`/client-profile/${notif.clientId}`, '_blank')}
                              >
                                View Client Profile
                              </button>
                            </>
                          )}
                          
                          {userProfile?.accountType === "client" && (
                            <>
                              <button 
                                className="notification-btn notification-btn--profile"
                                onClick={() => window.open(`/service/${notif.serviceId}`, '_blank')}
                              >
                                View Freelancer Profile
                              </button>
                              <button 
                                className="notification-btn notification-btn--delete"
                                disabled={true}
                              >
                                Delete (Coming Soon)
                              </button>
                            </>
                          )}
                        </div>

                        {/* Show Less Button - At bottom of expanded content */}
                        <button 
                          className="notification-collapse-btn"
                          onClick={() => toggleExpanded(notifId)}
                        >
                          Show Less <ChevronUp size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;