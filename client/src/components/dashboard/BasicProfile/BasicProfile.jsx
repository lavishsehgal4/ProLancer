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

import { Link } from "react-router-dom";
import "./BasicProfile.css";

const BasicProfile = ({ userProfile, onProfileUpdate }) => {
  // If no profile data, show loading or empty state
  if (!userProfile) {
    return (
      <div className="basic-profile">
        <div className="basic-profile__loading">Loading profile...</div>
      </div>
    );
  }

  return (
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
      </div>

      {/* Edit Account Button - Bottom of component */}
      <div className="basic-profile__footer">
        <Link to="/dashboard/edit-account">
          <button className="basic-profile__edit-button">Edit Account</button>
        </Link>
      </div>
    </div>
  );
};

export default BasicProfile;
