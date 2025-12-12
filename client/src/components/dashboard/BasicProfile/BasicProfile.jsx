/**
 * Basic Profile Component
 *
 * Displays user's basic profile information:
 * - Email (read-only, cannot be edited)
 * - First Name
 * - Last Name
 * - Account Type (Client or Freelancer)
 * - Phone Number
 * - Profile Picture
 * - Country
 *
 * Features:
 * - Fetches and displays user data
 * - "Edit Account" button at bottom that navigates to edit page
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { updateGithubUsername } from "../../../services/api/userApi";
import { Github, Edit3, Save, X, ExternalLink } from "lucide-react";
import NotificationPopup from "../../common/NotificationPopup/NotificationPopup";
import "./BasicProfile.css";

const BasicProfile = ({ userProfile, onProfileUpdate }) => {
  const [isEditingGithub, setIsEditingGithub] = useState(false);
  const [githubUsername, setGithubUsername] = useState(userProfile?.githubUsername || "");
  const [githubLoading, setGithubLoading] = useState(false);
  
  // Notification popup state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  const handleGithubEdit = () => {
    setIsEditingGithub(true);
    setGithubUsername(userProfile?.githubUsername || "");
  };

  const handleGithubCancel = () => {
    setIsEditingGithub(false);
    setGithubUsername(userProfile?.githubUsername || "");
  };

  const handleGithubSave = async () => {
    setGithubLoading(true);
    try {
      const response = await updateGithubUsername(githubUsername.trim() || null);
      
      if (response.success) {
        setNotification({
          isVisible: true,
          type: "success",
          title: "Success!",
          message: response.message,
        });
        setIsEditingGithub(false);
        // Update the parent component's user profile
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      } else {
        setNotification({
          isVisible: true,
          type: "error",
          title: "Error",
          message: response.message,
        });
      }
    } catch (error) {
      console.error("Error updating GitHub username:", error);
      setNotification({
        isVisible: true,
        type: "error",
        title: "Error",
        message: "Failed to update GitHub username",
      });
    } finally {
      setGithubLoading(false);
    }
  };

  const handleCreateGithubAccount = () => {
    window.open("https://github.com/join", "_blank");
  };

  // If no profile data, show loading or empty state
  if (!userProfile) {
    return (
      <div className="basic-profile">
        <div className="basic-profile__loading">Loading profile...</div>
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

      <div className="basic-profile">
      <div className="basic-profile__header">
        <h2 className="basic-profile__title">Basic Profile</h2>
        <p className="basic-profile__subtitle">
          Your basic account information
        </p>
      </div>

      <div className="basic-profile__content">
        {/* Email - Read Only */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">Email</label>
          <div className="basic-profile__value basic-profile__value--readonly">
            {userProfile.email || "Not provided"}
          </div>
          <span className="basic-profile__note">Email cannot be changed</span>
        </div>

        {/* First Name */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">First Name</label>
          <div className="basic-profile__value">
            {userProfile.firstName || "Not provided"}
          </div>
        </div>

        {/* Last Name */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">Last Name</label>
          <div className="basic-profile__value">
            {userProfile.lastName || "Not provided"}
          </div>
        </div>

        {/* Account Type */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">Account Type</label>
          <div className="basic-profile__value">
            <span
              className={`basic-profile__badge ${
                userProfile.accountType === "client"
                  ? "basic-profile__badge--client"
                  : "basic-profile__badge--freelancer"
              }`}
            >
              {userProfile.accountType === "client" ? "Client" : "Freelancer"}
            </span>
          </div>
        </div>

        {/* Phone Number */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">Phone Number</label>
          <div className="basic-profile__value">
            {userProfile.phoneNumber || "Not provided"}
          </div>
        </div>

        {/* Profile Picture */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">Profile Picture</label>
          <div className="basic-profile__value">
            {userProfile.profilePicture ? (
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="basic-profile__image"
              />
            ) : (
              <div className="basic-profile__image-placeholder">
                No image uploaded
              </div>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">Country</label>
          <div className="basic-profile__value">
            {userProfile.country || "Not provided"}
          </div>
        </div>

        {/* GitHub Username Section */}
        <div className="basic-profile__field">
          <label className="basic-profile__label">
            <Github size={16} />
            GitHub Username
          </label>
          
          {!isEditingGithub ? (
            <div className="basic-profile__github-display">
              <div className="basic-profile__value">
                {userProfile.githubUsername ? (
                  <div className="github-username-display">
                    <span>@{userProfile.githubUsername}</span>
                    <a 
                      href={`https://github.com/${userProfile.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-profile-link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ) : (
                  "Not provided"
                )}
              </div>
              <div className="basic-profile__github-actions">
                <button 
                  className="github-edit-btn"
                  onClick={handleGithubEdit}
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                {!userProfile.githubUsername && (
                  <button 
                    className="github-create-btn"
                    onClick={handleCreateGithubAccount}
                  >
                    <Github size={14} />
                    Create GitHub Account
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="basic-profile__github-edit">
              <div className="github-input-container">
                <span className="github-prefix">@</span>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="github-input"
                  disabled={githubLoading}
                />
              </div>
              <div className="github-edit-actions">
                <button 
                  className="github-save-btn"
                  onClick={handleGithubSave}
                  disabled={githubLoading}
                >
                  {githubLoading ? (
                    <div className="loading-spinner-small"></div>
                  ) : (
                    <Save size={14} />
                  )}
                  Save
                </button>
                <button 
                  className="github-cancel-btn"
                  onClick={handleGithubCancel}
                  disabled={githubLoading}
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <span className="basic-profile__note">
            Connect your GitHub account for project collaboration
          </span>
        </div>
      </div>

      {/* Edit Account Button - Bottom of component */}
      <div className="basic-profile__footer">
        <Link to="/dashboard/edit-account">
          <button className="basic-profile__edit-button">Edit Account</button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default BasicProfile;
