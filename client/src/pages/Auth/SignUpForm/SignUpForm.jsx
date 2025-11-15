import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./SignUpForm.css";
// Import API functions and token utilities
import { signup } from "../../../services/api/authApi";
import { saveToken } from "../../../utils/auth/token";

/**
 * SignUpForm Component
 * Reusable form for both client and freelancer signup
 * Detects role from URL path
 *
 * Features:
 * - Form validation
 * - Password strength indicator
 * - API integration for account creation
 * - Token storage after successful signup
 * - Success/error alerts
 * - Redirects to home page on success
 */

const SignUpForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine role from URL path
  const isClient = location.pathname.includes("client");
  const role = isClient ? "Client" : "Freelancer";
  const roleForApi = isClient ? "client" : "freelancer"; // Lowercase for API

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState("");

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

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[@$!%*?&]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character (@$!%*?&)";
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
      // Call signup API function
      // This sends a POST request to: /api/users/signup/:role
      const response = await signup(formData, roleForApi);

      // Check if signup was successful
      if (response.success) {
        // Save the authentication token to localStorage
        // This allows the user to stay logged in
        // Note: Backend sends token at root level, not in data object
        if (response.token) {
          saveToken(response.token);
        }

        // Show success alert
        alert(response.message || "Account created successfully!");

        // Redirect to home page
        navigate("/");
      } else {
        // Signup failed - show error message
        alert(
          response.message || "Failed to create account. Please try again."
        );
      }
    } catch (error) {
      // Handle unexpected errors (network issues, etc.)
      console.error("Signup error:", error);
      alert(
        error.message ||
          "An error occurred while creating your account. Please try again."
      );
    } finally {
      // Always reset loading state, whether success or failure
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <div className="signup-form__container">
        {/* Heading */}
        <h1 className="signup-form__heading">Sign Up as {role}</h1>
        <p className="signup-form__subheading">
          Create your account to get started
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="signup-form__form">
          {/* First Name */}
          <div className="form-group">
            <label htmlFor="firstName" className="form-group__label">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`form-group__input ${
                errors.firstName ? "form-group__input--error" : ""
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <span className="form-group__error">{errors.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="lastName" className="form-group__label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-group__input"
              placeholder="Enter your last name (optional)"
            />
          </div>

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
                placeholder="Create a strong password"
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
              <div
                className={`password-strength password-strength--${passwordStrength.toLowerCase()}`}
              >
                Strength: {passwordStrength}
              </div>
            )}

            {errors.password && (
              <span className="form-group__error">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-form__button"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="signup-form__login-link">
          Already have an account?{" "}
          <Link to="/login" className="signup-form__link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
