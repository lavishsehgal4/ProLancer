import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Mail, X } from "lucide-react";
import "./NotificationPopup.css";

/**
 * NotificationPopup Component
 * Beautiful animated popup that slides down from top
 * 
 * Props:
 * - isVisible: boolean - controls visibility
 * - type: 'success' | 'warning' | 'info' - determines styling
 * - title: string - main heading
 * - message: string - description text
 * - onClose: function - callback when popup is closed
 * - showResendButton: boolean - shows resend email button
 * - onResend: function - callback for resend action
 * - showStatusButton: boolean - shows check status button
 * - onStatusCheck: function - callback for status check action
 * - autoClose: number - auto close after milliseconds (optional)
 */

const NotificationPopup = ({
  isVisible,
  type = "info",
  title,
  message,
  onClose,
  showResendButton = false,
  onResend,
  showStatusButton = false,
  onStatusCheck,
  autoClose = null,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto close if specified
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoClose);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={24} />;
      case "warning":
        return <AlertCircle size={24} />;
      case "info":
      default:
        return <Mail size={24} />;
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`notification-backdrop ${isAnimating ? 'notification-backdrop--visible' : ''}`}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className={`notification-popup notification-popup--${type} ${isAnimating ? 'notification-popup--visible' : ''}`}>
        <div className="notification-popup__content">
          {/* Icon */}
          <div className="notification-popup__icon">
            {getIcon()}
          </div>
          
          {/* Text Content */}
          <div className="notification-popup__text">
            <h3 className="notification-popup__title">{title}</h3>
            <p className="notification-popup__message">{message}</p>
          </div>
          
          {/* Close Button */}
          <button 
            className="notification-popup__close"
            onClick={handleClose}
            aria-label="Close notification"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Action Buttons */}
        {(showResendButton || showStatusButton) && (
          <div className="notification-popup__actions">
            {showResendButton && (
              <button 
                className="notification-popup__resend-btn"
                onClick={onResend}
              >
                Resend Verification Email
              </button>
            )}
            {showStatusButton && (
              <button 
                className="notification-popup__status-btn"
                onClick={onStatusCheck}
              >
                Check Request Status
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPopup;