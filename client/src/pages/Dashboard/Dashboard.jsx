/**
 * Dashboard Component
 *
 * Main dashboard page that appears after login/signup.
 * Contains:
 * - Top section: User profile picture
 * - Left sidebar: Navigation menu (varies by user type)
 *   - Client: Basic Profile, Projects Section, Logout
 *   - Freelancer: Basic Profile, Freelancer Profile, Projects Section, Logout
 * - Main content area: Displays selected section content
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/api/userApi";
import { removeToken, isAuthenticated } from "../../utils/auth/token";
import BasicProfile from "../../components/dashboard/BasicProfile/BasicProfile";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // State to track which section is currently active
  const [activeSection, setActiveSection] = useState("basic-profile");

  // State to store user profile data
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    // Fetch user profile data on component mount
    fetchUserProfile();
  }, [navigate]);

  /**
   * Fetch user profile data from backend
   */
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserProfile();

      if (response.success) {
        setUserProfile(response.data);
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("An error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout - remove token and redirect to home
   */
  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  // Determine user type (client or freelancer)
  const isClient = userProfile?.accountType === "client";
  const isFreelancer = userProfile?.accountType === "freelancer";

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Top Section - User Profile Picture */}
      <div className="dashboard__header">
        <div className="dashboard__user-image-container">
          {userProfile?.profilePicture ? (
            <img
              src={userProfile.profilePicture}
              alt="Profile"
              className="dashboard__user-image"
            />
          ) : (
            <div className="dashboard__user-image-placeholder">
              {userProfile?.firstName?.[0]?.toUpperCase() ||
                userProfile?.email?.[0]?.toUpperCase() ||
                "U"}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard__container">
        {/* Left Sidebar - Navigation Menu */}
        <aside className="dashboard__sidebar">
          <nav className="dashboard__nav">
            {/* Basic Profile - Always visible */}
            <button
              className={`dashboard__nav-item ${
                activeSection === "basic-profile"
                  ? "dashboard__nav-item--active"
                  : ""
              }`}
              onClick={() => setActiveSection("basic-profile")}
            >
              Basic Profile
            </button>

            {/* Freelancer Profile - Only for freelancers */}
            {isFreelancer && (
              <button
                className={`dashboard__nav-item ${
                  activeSection === "freelancer-profile"
                    ? "dashboard__nav-item--active"
                    : ""
                }`}
                onClick={() => setActiveSection("freelancer-profile")}
              >
                Freelancer Profile
              </button>
            )}

            {/* Projects Section - Always visible */}
            <button
              className={`dashboard__nav-item ${
                activeSection === "projects"
                  ? "dashboard__nav-item--active"
                  : ""
              }`}
              onClick={() => setActiveSection("projects")}
            >
              Projects
            </button>

            {/* Logout Button */}
            <button
              className="dashboard__nav-item dashboard__nav-item--logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard__main">
          {/* Render content based on active section */}
          {activeSection === "basic-profile" && (
            <BasicProfile
              userProfile={userProfile}
              onProfileUpdate={fetchUserProfile}
            />
          )}

          {activeSection === "freelancer-profile" && isFreelancer && (
            <div className="dashboard__section-placeholder">
              <h2>Freelancer Profile</h2>
              <p>This section will be implemented later.</p>
            </div>
          )}

          {activeSection === "projects" && (
            <div className="dashboard__section-placeholder">
              <h2>Projects Section</h2>
              <p>This section will be implemented later.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
