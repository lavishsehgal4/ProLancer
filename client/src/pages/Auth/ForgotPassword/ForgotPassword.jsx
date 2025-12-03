import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../../../services/api/authApi";
import NotificationPopup from "../../../components/common/NotificationPopup/NotificationPopup";
import "./ForgotPassword.css";

/**
 * ForgotPassword Component
 * 
 * Allows users to request a password reset email
 * Features:
 * - Email validation
 * - API integration for password reset request
 * - Success/error notifications
 * - Clean, user-friendly interface
 */

const ForgotPassword = () => {
  // Form state
  const [email, setEmail] = useState("");
  
  // Validation errors
  const [error, setError] = useState("");
  
  // Loading state for API call
  const [isLoading, setIsLoading] = useState(false);

  // Notification popup state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Call forgot password API
      const response = await forgotPassword(email);

      if (response.success) {
        // Show success notification
        setNotification({
          isVisible: true,
          type: "success",
          title: "Email Sent!",
          message: response.message || "Password reset instructions have been sent to your email address.",
        });

        // Clear form
        setEmail("");
      } else {
        // Show error notification
        setNotification({
          isVisible: true,
          type: "warning",
          title: "Failed to Send Email",
          message: response.message || "Failed to send password reset email. Please try again.",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: error.message || "An error occurred. Please try again.",
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

      <div className="forgot-password">
        <div className="forgot-password__container">
          {/* Back to Login Link */}
          <Link to="/login" className="forgot-password__back-link">
            <ArrowLeft size={20} />
            Back to Login
          </Link>

          {/* Icon */}
          <div className="forgot-password__icon">
            <Mail size={48} />
          </div>

          {/* Heading */}
          <h1 className="forgot-password__heading">Forgot Password?</h1>
          <p className="forgot-password__subheading">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="forgot-password__form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-group__label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className={`form-group__input ${error ? "form-group__input--error" : ""}`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {error && (
                <span className="form-group__error">{error}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="forgot-password__button"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Additional Links */}
          <div className="forgot-password__links">
            <p>
              Remember your password?{" "}
              <Link to="/login" className="forgot-password__link">
                Sign in
              </Link>
            </p>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="forgot-password__link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;