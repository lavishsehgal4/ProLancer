/**
 * Projects Component
 *
 * Displays projects/jobs with status-based filtering:
 * - Status tabs: Pending, Accepted, Rejected, Completed
 * - Default view: Accepted projects
 * - Works for both freelancers and clients
 * - Uses notification-style display
 *
 * Features:
 * - Status filtering with tabs
 * - Expandable project details
 * - Action buttons based on user type and status
 * - Real-time status updates
 */

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
import { getAllJobRequests, acceptJobRequest, rejectJobRequest, completeJobRequest } from "../../../services/api/notificationsApi";
import { getUserProfile } from "../../../services/api/userApi";
import { getGithubRepoStatus } from "../../../services/api/workspaceApi";
import NotificationPopup from "../../common/NotificationPopup/NotificationPopup";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("accepted"); // Default to accepted
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(new Set());
  const [userProfile, setUserProfile] = useState(null);

  // Notification popup state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  const statusTabs = [
    { key: "pending", label: "Pending", color: "#f59e0b" },
    { key: "accepted", label: "Accepted", color: "#10b981" },
    { key: "rejected", label: "Rejected", color: "#ef4444" },
    { key: "completed", label: "Completed", color: "#6366f1" },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [activeStatus]);

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

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await getAllJobRequests(activeStatus);
      if (response.success) {
        setProjects(response.data);
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to load projects",
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to load projects. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleAccept = async (jobId) => {
    setActionLoading(prev => new Set(prev).add(jobId));
    try {
      const response = await acceptJobRequest(jobId);
      if (response.success) {
        setNotification({
          isVisible: true,
          type: "success",
          title: "Project Accepted!",
          message: response.message || "Project accepted successfully",
        });
        fetchProjects();
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to accept project",
        });
      }
    } catch (error) {
      console.error("Error accepting project:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to accept project. Please try again.",
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
          title: "Project Rejected",
          message: response.message || "Project rejected successfully",
        });
        fetchProjects();
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to reject project",
        });
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to reject project. Please try again.",
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
          title: "Project Completed",
          message: response.message || "Project completed successfully",
        });
        fetchProjects();
      } else {
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Error",
          message: response.message || "Failed to complete project",
        });
      }
    } catch (error) {
      console.error("Error completing project:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: "Failed to complete project. Please try again.",
      });
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleOpenProject = async (projectId) => {
    setActionLoading(prev => new Set(prev).add(projectId));
    try {
      // Check if repository exists
      const repoResponse = await getGithubRepoStatus(projectId);
      
      if (repoResponse.success && repoResponse.data?.exists) {
        // Repository exists, go to workspace
        window.open(`/project/${projectId}`, '_blank');
      } else {
        // No repository, go to setup page
        window.open(`/project/${projectId}`, '_blank');
      }
    } catch (error) {
      console.error("Error checking repository status:", error);
      // If error checking repo status, still go to project page
      window.open(`/project/${projectId}`, '_blank');
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status) => {
    return <div className={`project-status-icon project-status-icon--${status}`}></div>;
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
      <div className="projects-loading">
        <Loader2 className="projects-loading-spinner" size={32} />
        <p>Loading projects...</p>
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

      <div className="projects-page">
        <div className="projects-container">
          {/* Header */}
          <div className="projects-header">
            <div className="projects-title-section">
              <Bell size={28} />
              <h1 className="projects-title">Projects</h1>
            </div>
            <p className="projects-subtitle">
              Manage your {userProfile?.accountType === "freelancer" ? "freelance" : "client"} projects
            </p>
          </div>

          {/* Status Tabs */}
          <div className="projects-tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                className={`projects-tab ${activeStatus === tab.key ? 'projects-tab--active' : ''}`}
                onClick={() => setActiveStatus(tab.key)}
                style={{
                  '--tab-color': tab.color,
                  backgroundColor: activeStatus === tab.key ? tab.color : 'transparent',
                  color: activeStatus === tab.key ? 'white' : tab.color,
                  borderColor: tab.color
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projects List */}
          <div className="projects-list">
            {projects.length === 0 ? (
              <div className="projects-empty">
                <Bell size={48} />
                <h3>No {activeStatus} projects</h3>
                <p>You don't have any {activeStatus} projects at the moment.</p>
              </div>
            ) : (
              projects.map((project) => {
                const projectId = project._id || project.jobId;
                const isExpanded = expandedProjects.has(projectId);
                const isLoading = actionLoading.has(projectId);
                
                return (
                  <div key={projectId} className={`project-card project-card--${project.status}`}>
                    {/* Project Header */}
                    <div className="project-header">
                      <div className="project-avatar">
                        <User size={24} />
                      </div>
                      
                      <div className="project-info">
                        <h3 className="project-title">{project.projectTitle}</h3>
                        <p className="project-client">
                          {userProfile?.accountType === "freelancer" 
                            ? `Client: ${project.clientName || "Apex Tech Solutions"}`
                            : `Freelancer: ${project.freelancerName || "Professional Freelancer"}`
                          }
                        </p>
                      </div>
                      
                      <div className="project-meta">
                        {getStatusIcon(project.status)}
                        <span className="project-time">{formatDate(project.createdAt)}</span>
                      </div>
                    </div>

                    {/* Expand Button - Only show when collapsed */}
                    {!isExpanded && (
                      <button 
                        className="project-expand-btn"
                        onClick={() => toggleExpanded(projectId)}
                      >
                        Expand <ChevronDown size={16} />
                      </button>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="project-details">
                        <div className="project-description">
                          <h4>Project Description</h4>
                          <p>{project.projectDescription}</p>
                        </div>

                        <div className="project-specs">
                          <div className="project-spec">
                            <DollarSign size={16} />
                            <span>Budget - ${project.budget?.toLocaleString()}</span>
                          </div>
                          <div className="project-spec">
                            <Calendar size={16} />
                            <span>Deadline - {formatDeadline(project.deadline)}</span>
                          </div>
                        </div>

                        {project.additionalRequirements && (
                          <div className="project-requirements">
                            <h4>Additional Requirements</h4>
                            <p>{project.additionalRequirements}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="project-actions">
                          {userProfile?.accountType === "freelancer" && (
                            <>
                              {project.status === "pending" && (
                                <>
                                  <button
                                    className="project-btn project-btn--reject"
                                    onClick={() => handleReject(projectId)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? <Loader2 size={16} className="btn-spinner" /> : "Reject"}
                                  </button>
                                  <button
                                    className="project-btn project-btn--accept"
                                    onClick={() => handleAccept(projectId)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? <Loader2 size={16} className="btn-spinner" /> : "Accept"}
                                  </button>
                                </>
                              )}
                              {project.status === "accepted" && (
                                <button
                                  className="project-btn project-btn--open"
                                  onClick={() => handleOpenProject(projectId)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? <Loader2 size={16} className="btn-spinner" /> : "Open Project"}
                                </button>
                              )}
                              <button className="project-btn project-btn--schedule">
                                Schedule Meeting
                              </button>
                              <button className="project-btn project-btn--profile">
                                View Client Profile
                              </button>
                            </>
                          )}
                          
                          {userProfile?.accountType === "client" && (
                            <>
                              <button className="project-btn project-btn--profile">
                                View Freelancer Profile
                              </button>
                              <button className="project-btn project-btn--schedule">
                                Schedule Meeting
                              </button>
                            </>
                          )}
                        </div>

                        {/* Show Less Button - At bottom of expanded content */}
                        <button 
                          className="project-collapse-btn"
                          onClick={() => toggleExpanded(projectId)}
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

export default Projects;