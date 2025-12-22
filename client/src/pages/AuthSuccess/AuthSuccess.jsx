import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { saveToken, saveUser } from "../../utils/auth/token";
import "./AuthSuccess.css";

/**
 * AuthSuccess Component
 * Handles successful Google OAuth login redirects
 */

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL and handle redirect
    const handleOAuthSuccess = () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      
      if (token) {
        // Store the JWT token using the proper utility function
        saveToken(token);
        
        // Decode JWT token to get user data
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const userData = {
            userId: tokenPayload.userId,
            email: tokenPayload.email,
            accountType: tokenPayload.accountType
          };
          saveUser(userData);
          console.log("✅ [OAuth] User logged in and data stored:", userData);
        } catch (error) {
          console.error("❌ [OAuth] Failed to decode JWT token:", error);
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        // No token found, redirect to login with error
        navigate("/login?error=oauth_failed");
      }
    };

    handleOAuthSuccess();
  }, [navigate]);

  return (
    <div className="auth-success">
      <div className="auth-success__container">
        <div className="auth-success__content">
          <div className="auth-success__icon">
            <CheckCircle size={64} />
          </div>
          
          <h1 className="auth-success__title">Login Successful!</h1>
          
          <p className="auth-success__message">
            You have been successfully logged in with Google.
          </p>
          
          <div className="auth-success__loading">
            <Loader2 className="auth-success__spinner" size={24} />
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;