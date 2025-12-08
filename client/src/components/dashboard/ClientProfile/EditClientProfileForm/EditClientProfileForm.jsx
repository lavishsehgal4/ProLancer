/**
 * Edit Client Profile Form Component
 *
 * Form for editing client profile information:
 * - Company/Individual toggle
 * - Company Name
 * - Company Description
 * - Industry
 *
 * Features:
 * - Form validation
 * - Save/Cancel functionality
 * - Loading states
 * - Success/Error notifications
 */

import { useState, useEffect } from "react";
import { updateClientData } from "../../../../services/api/clientApi";
import { X, Save, Loader2 } from "lucide-react";
import "./EditClientProfileForm.css";

const EditClientProfileForm = ({ clientData, onSave, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    isCompany: false,
    companyName: "",
    companyDescription: "",
    industry: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with existing data
  useEffect(() => {
    if (clientData) {
      setFormData({
        isCompany: clientData.isCompany || false,
        companyName: clientData.companyName || "",
        companyDescription: clientData.companyDescription || "",
        industry: clientData.industry || "",
      });
    }
  }, [clientData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.isCompany) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required for company accounts";
      }
      if (!formData.industry.trim()) {
        newErrors.industry = "Industry is required for company accounts";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateClientData(formData);
      
      if (response.success) {
        onSuccess("Client profile updated successfully!");
        onSave(response.data);
      } else {
        setErrors({ submit: response.message || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Error updating client profile:", error);
      setErrors({ submit: "An error occurred while updating your profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-client-form-overlay">
      <div className="edit-client-form">
        <div className="edit-client-form__header">
          <h3 className="edit-client-form__title">Edit Client Profile</h3>
          <button 
            className="edit-client-form__close"
            onClick={onCancel}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-client-form__form">
          {/* Account Type Toggle */}
          <div className="edit-client-form__field">
            <label className="edit-client-form__checkbox-label">
              <input
                type="checkbox"
                name="isCompany"
                checked={formData.isCompany}
                onChange={handleInputChange}
                disabled={loading}
                className="edit-client-form__checkbox"
              />
              <span className="edit-client-form__checkbox-text">
                This is a company account
              </span>
            </label>
          </div>

          {/* Company Fields - Only show if isCompany is true */}
          {formData.isCompany && (
            <>
              {/* Company Name */}
              <div className="edit-client-form__field">
                <label className="edit-client-form__label">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`edit-client-form__input ${errors.companyName ? 'edit-client-form__input--error' : ''}`}
                  placeholder="Enter your company name"
                />
                {errors.companyName && (
                  <span className="edit-client-form__error">{errors.companyName}</span>
                )}
              </div>

              {/* Company Description */}
              <div className="edit-client-form__field">
                <label className="edit-client-form__label">
                  Company Description
                </label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="edit-client-form__textarea"
                  placeholder="Describe your company and what you do..."
                  rows={4}
                />
              </div>

              {/* Industry */}
              <div className="edit-client-form__field">
                <label className="edit-client-form__label">
                  Industry *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`edit-client-form__select ${errors.industry ? 'edit-client-form__input--error' : ''}`}
                >
                  <option value="">Select an industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </select>
                {errors.industry && (
                  <span className="edit-client-form__error">{errors.industry}</span>
                )}
              </div>
            </>
          )}

          {/* Individual Account Note */}
          {!formData.isCompany && (
            <div className="edit-client-form__note">
              <p>You are setting up an individual account. Company details will not be displayed.</p>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="edit-client-form__submit-error">
              {errors.submit}
            </div>
          )}

          {/* Form Actions */}
          <div className="edit-client-form__actions">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="edit-client-form__button edit-client-form__button--cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="edit-client-form__button edit-client-form__button--save"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="edit-client-form__spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientProfileForm;