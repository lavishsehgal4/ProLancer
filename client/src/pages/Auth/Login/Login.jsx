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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../../services/api/authApi";
import { saveToken } from "../../../utils/auth/token";
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

        // Show success alert
        alert(response.message || "Login successful!");

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        // Login failed - show error message
        alert(response.message || "Failed to login. Please check your credentials.");
      }
    } catch (error) {
      // Handle unexpected errors (network issues, etc.)
      console.error("Login error:", error);
      alert(
        error.message ||
          "An error occurred while logging in. Please try again."
      );
    } finally {
      // Always reset loading state, whether success or failure
      setIsLoading(false);
    }
  };

  return (
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

          {/* Submit Button */}
          <button
            type="submit"
            className="login__button"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="login__signup-link">
          Don't have an account?{" "}
          <Link to="/signup" className="login__link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

