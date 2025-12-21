/**
 * Login Component
 *
 * Login form for users to authenticate.
 * Features:
 * - Email and password validation
 * - Password visibility toggle
 * - API integration for authentication
 * - Token storage after successful login
 * - Success/error alerts
 * - Redirects to dashboard on success
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login, resendVerificationEmail } from "../../../services/api/authApi";
import { saveToken, saveUser } from "../../../utils/auth/token";
import NotificationPopup from "../../../components/common/NotificationPopup/NotificationPopup";
import { API_BASE_URL } from "../../../config/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Loading state for API call
  const [isLoading, setIsLoading] = useState(false);

  // Notification popup state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
    showResendButton: false,
    userEmail: "",
  });

  // Check for OAuth errors on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "not_registered") {
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Account Not Found",
        message: "Google account not registered. Please sign up first.",
        showResendButton: false,
      });
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    // Set loading state to disable button and show loading indicator
    setIsLoading(true);

    try {
      // Call login API function
      // This sends a POST request to: /api/users/login
      const response = await login(formData.email, formData.password);

      // Check if login was successful
      if (response.success) {
        // Save the authentication token to localStorage
        // This allows the user to stay logged in
        // Note: Backend sends token at root level, not in data object
        if (response.token) {
          saveToken(response.token);
        }

        // Save user data to localStorage for chat and other features
        if (response.userObj && response.token) {
          // Decode JWT token to get userId (JWT payload contains userId)
          let userId = null;
          try {
            // JWT tokens have 3 parts separated by dots: header.payload.signature
            // We only need the payload (middle part)
            const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
            userId = tokenPayload.userId;
            console.log("🔓 [Login] Decoded userId from JWT:", userId);
          } catch (error) {
            console.error("❌ [Login] Failed to decode JWT token:", error);
          }

          const userData = {
            userId: userId,
            firstName: response.userObj.firstName,
            lastName: response.userObj.lastName,
            email: response.userObj.email,
            accountType: response.userObj.accountType,
            country: response.userObj.country
          };

          saveUser(userData);
          console.log("✅ [Login] User logged in and data stored:", userData);
        }

        // Show success notification
        setNotification({
          isVisible: true,
          type: "success",
          title: "Login Successful!",
          message: response.message || "Welcome back! Redirecting to dashboard...",
          showResendButton: false,
        });

        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // Check if it's an email verification error
        if (response.message && response.message.includes("verify your email")) {
          setNotification({
            isVisible: true,
            type: "warning",
            title: "Email Not Verified",
            message: response.message,
            showResendButton: true,
            userEmail: formData.email,
          });
        } else {
          // Other login errors
          setNotification({
            isVisible: true,
            type: "warning",
            title: "Login Failed",
            message: response.message || "Failed to login. Please check your credentials.",
            showResendButton: false,
          });
        }
      }
    } catch (error) {
      // Handle unexpected errors (network issues, etc.)
      console.error("Login error:", error);
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Error",
        message: error.message || "An error occurred while logging in. Please try again.",
        showResendButton: false,
      });
    } finally {
      // Always reset loading state, whether success or failure
      setIsLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendEmail = async () => {
    try {
      const response = await resendVerificationEmail(notification.userEmail);
      
      if (response.success) {
        setNotification({
          ...notification,
          type: "success",
          title: "Email Sent!",
          message: response.message || "Verification email has been resent. Please check your inbox.",
          showResendButton: false,
        });
      } else {
        setNotification({
          ...notification,
          type: "warning",
          title: "Failed to Send Email",
          message: response.message || "Failed to resend verification email. Please try again.",
        });
      }
    } catch (error) {
      console.error("Resend email error:", error);
      setNotification({
        ...notification,
        type: "warning",
        title: "Error",
        message: "An error occurred while sending the email. Please try again.",
      });
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
        showResendButton={notification.showResendButton}
        onResend={handleResendEmail}
        autoClose={notification.type === "success" && !notification.showResendButton ? 3000 : null}
      />

      <div className="login">
        <div className="login__container">
        {/* Heading */}
        <h1 className="login__heading">Log In</h1>
        <p className="login__subheading">
          Welcome back! Please login to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login__form">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-group__label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-group__input ${
                errors.email ? "form-group__input--error" : ""
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="form-group__error">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-group__label">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-group__input ${
                  errors.password ? "form-group__input--error" : ""
                }`}
                placeholder="Enter your password"
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

            {errors.password && (
              <span className="form-group__error">{errors.password}</span>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="login__forgot-password">
            <Link to="/forgot-password" className="login__forgot-link">
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login__button"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Google Login Button */}
        <div className="login__divider">
          <span>or</span>
        </div>
        
        <button
          type="button"
          className="login__google-btn"
          onClick={() => window.location.href = `${API_BASE_URL}/auth/google/login`}
        >
          <svg className="login__google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Login with Google
        </button>

        {/* Sign Up Link */}
        <p className="login__signup-link">
          Don't have an account?{" "}
          <Link to="/signup" className="login__link">
            Sign up
          </Link>
        </p>
        </div>
      </div>
    </>
  );
};

export default Login;

