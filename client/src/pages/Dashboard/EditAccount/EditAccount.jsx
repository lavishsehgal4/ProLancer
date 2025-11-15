/**
 * Edit Account Page
 *
 * Allows users to update their profile information.
 * Can edit: firstName, lastName, phoneNumber, profilePicture, country
 * Cannot edit: email (read-only)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../services/api/userApi";
import { isAuthenticated } from "../../../utils/auth/token";
import "./EditAccount.css";

const EditAccount = () => {
  const navigate = useNavigate();

  // Form state - stores editable fields (email is excluded)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profilePicture: "",
    country: "",
  });

  // Original email (read-only, for display only)
  const [email, setEmail] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Check authentication and fetch profile data
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    fetchUserProfile();
  }, [navigate]);

  /**
   * Fetch user profile data to populate form
   */
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUserProfile();

      if (response.success) {
        const profile = response.data;

        // Set email (read-only)
        setEmail(profile.email || "");

        // Set form data (editable fields only)
        setFormData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          phoneNumber: profile.phoneNumber || "",
          profilePicture: profile.profilePicture || "",
          country: profile.country || "",
        });
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
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any previous errors when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateUserProfile(formData);

      if (response.success) {
        setSuccess(true);
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="edit-account">
        <div className="edit-account__loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="edit-account">
      <div className="edit-account__container">
        {/* Header */}
        <div className="edit-account__header">
          <h1 className="edit-account__title">Edit Account</h1>
          <p className="edit-account__subtitle">
            Update your profile information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="edit-account__message edit-account__message--success">
            Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="edit-account__message edit-account__message--error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="edit-account__form">
          {/* Email - Read Only */}
          <div className="edit-account__field">
            <label htmlFor="email" className="edit-account__label">
              Email <span className="edit-account__required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              disabled
              className="edit-account__input edit-account__input--disabled"
            />
            <span className="edit-account__note">Email cannot be changed</span>
          </div>

          {/* First Name */}
          <div className="edit-account__field">
            <label htmlFor="firstName" className="edit-account__label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="edit-account__input"
              placeholder="Enter your first name"
            />
          </div>

          {/* Last Name */}
          <div className="edit-account__field">
            <label htmlFor="lastName" className="edit-account__label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="edit-account__input"
              placeholder="Enter your last name"
            />
          </div>

          {/* Phone Number */}
          <div className="edit-account__field">
            <label htmlFor="phoneNumber" className="edit-account__label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="edit-account__input"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Profile Picture URL */}
          <div className="edit-account__field">
            <label htmlFor="profilePicture" className="edit-account__label">
              Profile Picture URL
            </label>
            <input
              type="url"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className="edit-account__input"
              placeholder="Enter image URL"
            />
            {formData.profilePicture && (
              <img
                src={formData.profilePicture}
                alt="Preview"
                className="edit-account__image-preview"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>

          {/* Country */}
          <div className="edit-account__field">
            <label htmlFor="country" className="edit-account__label">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="edit-account__input"
              placeholder="Enter your country"
            />
          </div>

          {/* Form Actions */}
          <div className="edit-account__actions">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="edit-account__button edit-account__button--cancel"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="edit-account__button edit-account__button--save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccount;
