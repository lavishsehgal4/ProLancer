/**
 * CreateServiceForm Component
 *
 * Form to create a new service
 * Fields match service schema: title, name, bio, description, rating, reviewsCount, category, skills, hourlyRate, profilePicture
 */

import { useState } from "react";
import "./CreateServiceForm.css";

const CreateServiceForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    bio: "",
    description: "",
    rating: 0,
    reviewsCount: 0,
    category: "",
    skills: [],
    hourlyRate: 50,
    profilePicture: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating" || name === "reviewsCount" || name === "hourlyRate"
          ? parseFloat(value) || 0
          : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    if (formData.reviewsCount < 0) {
      newErrors.reviewsCount = "Reviews count cannot be negative";
    }
    if (formData.hourlyRate < 0) {
      newErrors.hourlyRate = "Hourly rate cannot be negative";
    }
    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
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
      // Reset form on success
      setFormData({
        title: "",
        name: "",
        bio: "",
        description: "",
        rating: 0,
        reviewsCount: 0,
        category: "",
        skills: [],
        hourlyRate: 50,
        profilePicture: "",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-service-form">
      <div className="create-service-form__header">
        <h2 className="create-service-form__title">Create New Service</h2>
      </div>

      <form onSubmit={handleSubmit} className="create-service-form__form">
        {/* Title */}
        <div className="create-service-form__field">
          <label htmlFor="title" className="create-service-form__label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="create-service-form__input"
            placeholder="e.g., Full Stack Web Development"
          />
          {errors.title && (
            <span className="create-service-form__error">{errors.title}</span>
          )}
        </div>

        {/* Name */}
        <div className="create-service-form__field">
          <label htmlFor="name" className="create-service-form__label">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="create-service-form__input"
            placeholder="Service name"
          />
          {errors.name && (
            <span className="create-service-form__error">{errors.name}</span>
          )}
        </div>

        {/* Bio */}
        <div className="create-service-form__field">
          <label htmlFor="bio" className="create-service-form__label">
            Bio <span className="required">*</span>
          </label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="create-service-form__input"
            placeholder="Short bio about the service"
          />
          {errors.bio && (
            <span className="create-service-form__error">{errors.bio}</span>
          )}
        </div>

        {/* Description */}
        <div className="create-service-form__field">
          <label htmlFor="description" className="create-service-form__label">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="create-service-form__textarea"
            rows="5"
            placeholder="Detailed description of the service..."
          />
          {errors.description && (
            <span className="create-service-form__error">
              {errors.description}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="create-service-form__field">
          <label htmlFor="category" className="create-service-form__label">
            Category <span className="required">*</span>
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="create-service-form__input"
            placeholder="e.g., Web Development"
          />
          {errors.category && (
            <span className="create-service-form__error">
              {errors.category}
            </span>
          )}
        </div>

        {/* Skills */}
        <div className="create-service-form__field">
          <label className="create-service-form__label">
            Skills <span className="required">*</span>
          </label>
          <div className="create-service-form__skills-input">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="create-service-form__input"
              placeholder="Type a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="create-service-form__add-skill-btn"
            >
              Add
            </button>
          </div>
          {formData.skills.length > 0 && (
            <div className="create-service-form__skills-list">
              {formData.skills.map((skill, index) => (
                <span key={index} className="create-service-form__skill-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="create-service-form__remove-skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.skills && (
            <span className="create-service-form__error">{errors.skills}</span>
          )}
        </div>

        {/* Rating */}
        <div className="create-service-form__field">
          <label htmlFor="rating" className="create-service-form__label">
            Rating (0-5)
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="create-service-form__input"
            min="0"
            max="5"
            step="0.1"
            placeholder="0"
          />
          {errors.rating && (
            <span className="create-service-form__error">{errors.rating}</span>
          )}
        </div>

        {/* Reviews Count */}
        <div className="create-service-form__field">
          <label htmlFor="reviewsCount" className="create-service-form__label">
            Reviews Count
          </label>
          <input
            type="number"
            id="reviewsCount"
            name="reviewsCount"
            value={formData.reviewsCount}
            onChange={handleChange}
            className="create-service-form__input"
            min="0"
            placeholder="0"
          />
          {errors.reviewsCount && (
            <span className="create-service-form__error">
              {errors.reviewsCount}
            </span>
          )}
        </div>

        {/* Hourly Rate */}
        <div className="create-service-form__field">
          <label htmlFor="hourlyRate" className="create-service-form__label">
            Hourly Rate ($) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            className="create-service-form__input"
            min="0"
            step="0.01"
            placeholder="50"
          />
          {errors.hourlyRate && (
            <span className="create-service-form__error">
              {errors.hourlyRate}
            </span>
          )}
        </div>

        {/* Profile Picture */}
        <div className="create-service-form__field">
          <label
            htmlFor="profilePicture"
            className="create-service-form__label"
          >
            Profile Picture URL
          </label>
          <input
            type="url"
            id="profilePicture"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            className="create-service-form__input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Form Actions */}
        <div className="create-service-form__actions">
          <button
            type="button"
            onClick={onCancel}
            className="create-service-form__button create-service-form__button--cancel"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-service-form__button create-service-form__button--save"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateServiceForm;
