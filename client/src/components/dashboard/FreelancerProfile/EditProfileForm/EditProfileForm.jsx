/**
 * EditProfileForm Component
 *
 * Form to edit freelancer profile information
 * Fields: aboutMe, education, yearsOfExperience
 */

import { useState, useEffect } from "react";
import "./EditProfileForm.css";

const EditProfileForm = ({ freelancerData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    aboutMe: "",
    education: "",
    yearsOfExperience: 0,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Populate form when freelancerData changes
  useEffect(() => {
    if (freelancerData) {
      setFormData({
        aboutMe: freelancerData.aboutMe || "",
        education: freelancerData.education || "",
        yearsOfExperience: freelancerData.yearsOfExperience || 0,
      });
    }
  }, [freelancerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? parseInt(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = "Years of experience cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-profile-form">
      <div className="edit-profile-form__header">
        <h2 className="edit-profile-form__title">Edit Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form__form">
        {/* About Me */}
        <div className="edit-profile-form__field">
          <label htmlFor="aboutMe" className="edit-profile-form__label">
            About Me
          </label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            className="edit-profile-form__textarea"
            rows="5"
            placeholder="Tell us about yourself..."
          />
          {errors.aboutMe && (
            <span className="edit-profile-form__error">{errors.aboutMe}</span>
          )}
        </div>

        {/* Education */}
        <div className="edit-profile-form__field">
          <label htmlFor="education" className="edit-profile-form__label">
            Education
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="edit-profile-form__input"
            placeholder="e.g., Bachelor's in Computer Science, MIT (2018)"
          />
          {errors.education && (
            <span className="edit-profile-form__error">{errors.education}</span>
          )}
        </div>

        {/* Years of Experience */}
        <div className="edit-profile-form__field">
          <label
            htmlFor="yearsOfExperience"
            className="edit-profile-form__label"
          >
            Years of Experience
          </label>
          <input
            type="number"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            className="edit-profile-form__input"
            min="0"
            placeholder="0"
          />
          {errors.yearsOfExperience && (
            <span className="edit-profile-form__error">
              {errors.yearsOfExperience}
            </span>
          )}
        </div>

        {/* Form Actions */}
        <div className="edit-profile-form__actions">
          <button
            type="button"
            onClick={onCancel}
            className="edit-profile-form__button edit-profile-form__button--cancel"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="edit-profile-form__button edit-profile-form__button--save"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
