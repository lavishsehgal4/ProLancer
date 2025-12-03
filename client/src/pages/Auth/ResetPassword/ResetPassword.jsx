import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { resetPassword } from "../../../services/api/authApi";
import NotificationPopup from "../../../components/common/NotificationPopup/NotificationPopup";
import "./ResetPassword.css";

/**
 * ResetPassword Component
 * 
 * Allows users to reset their password using a token from email
 * Features:
 * - Token validation from URL
 * - Password strength validation
 * - Password visibility toggle
 * - API integration for password reset
 * - Success/error notifications
 */

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Form state
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState("");

  // Loading state for API call
  const [isLoading, setIsLoading] = useState(false);

  // Notification popup state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  // Check if token exists on component mount
  useEffect(() => {
    if (!token) {
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Invalid Reset Link",
        message: "This password reset link is invalid or has expired. Please request a new one.",
      });
    }
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Check password strength
    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = [
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (strength <= 2) setPasswordStrength("Weak");
    else if (strength === 3 || strength === 4) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    } else if (!/[@$!%*?&]/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one special character (@$!%*?&)";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if token exists
    if (!token) {
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Invalid Token",
        message: "No reset token found. Please request a new password reset link.",
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Call reset password API
      const response = await resetPassword(token, formData.newPassword);

      if (response.success) {
        // Show success notification
        setNotification({
          isVisible: true,
          type: "success",
          title: "Password Reset Successful!",
          message: response.message || "Your password has been reset successfully. You can now log in with your new password.",
        });

        // Redirect to login after success
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        // Show error notification
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Reset Failed",
          message: response.message || "Failed to reset password. The link may have expired.",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: error.message || "An error occurred while resetting your password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Notification Popup */}
      <NotificationPopup
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={notification.type === "success" ? 5000 : null}
      />

      <div className="reset-password">
        <div className="reset-password__container">
          {/* Icon */}
          <div className="reset-password__icon">
            <Lock size={48} />
          </div>

          {/* Heading */}
          <h1 className="reset-password__heading">Reset Your Password</h1>
          <p className="reset-password__subheading">
            Enter your new password below. Make sure it's strong and secure.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="reset-password__form">
            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword" className="form-group__label">
                New Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`form-group__input ${errors.newPassword ? "form-group__input--error" : ""}`}
                  placeholder="Enter your new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className={`password-strength password-strength--${passwordStrength.toLowerCase()}`}>
                  Strength: {passwordStrength}
                </div>
              )}

              {errors.newPassword && (
                <span className="form-group__error">{errors.newPassword}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-group__label">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-group__input ${errors.confirmPassword ? "form-group__input--error" : ""}`}
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <span className="form-group__error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="reset-password__button"
              disabled={isLoading || !token}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;