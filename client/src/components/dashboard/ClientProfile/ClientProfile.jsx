/**
 * Client Profile Component
 *
 * Displays client-specific profile information:
 * - Client Statistics (Rating, Reviews, Spent, Jobs, Level)
 * - Verification Status
 * - Company Information (if applicable)
 *
 * Features:
 * - Fetches and displays client data from backend
 * - Edit functionality for client details
 * - Company information section with conditional display
 */

import { useState, useEffect } from "react";
import { getClientData } from "../../../services/api/clientApi";
import EditClientProfileForm from "./EditClientProfileForm/EditClientProfileForm";
import NotificationPopup from "../../common/NotificationPopup/NotificationPopup";
import { 
  Star, 
  MessageSquare, 
  DollarSign, 
  CheckCircle, 
  Award, 
  Shield, 
  User,
  Mail,
  CreditCard,
  Edit3
} from "lucide-react";
import "./ClientProfile.css";

const ClientProfile = ({ userProfile }) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Notification popup state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const response = await getClientData();
      if (response.success) {
        setClientData(response.data);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  const handleEditSave = (updatedData) => {
    setClientData(updatedData);
    setShowEditForm(false);
  };

  const handleEditSuccess = (message) => {
    setNotification({
      isVisible: true,
      type: "success",
      title: "Success!",
      message: message,
    });
  };

  if (loading) {
    return (
      <div className="client-profile">
        <div className="client-profile__loading">Loading client profile...</div>
      </div>
    );
  }

  return (
    <>
      {/* Notification Popup */}
      <NotificationPopup
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={3000}
      />

      <div className="client-profile">
      {/* Header */}
      <div className="client-profile__header">
        <h2 className="client-profile__title">Client Profile</h2>
        <p className="client-profile__subtitle">
          Your client statistics and business information
        </p>
      </div>

      {/* Client Statistics */}
      <div className="client-profile__section">
        <div className="client-profile__section-header">
          <h3 className="client-profile__section-title">Client Statistics</h3>
        </div>
        
        <div className="client-profile__stats">
          <div className="client-profile__stat">
            <div className="client-profile__stat-icon">
              <Star size={20} />
            </div>
            <div className="client-profile__stat-info">
              <span className="client-profile__stat-label">Client Rating</span>
              <span className="client-profile__stat-value">
                {clientData?.clientRating || 0}/5
              </span>
            </div>
          </div>

          <div className="client-profile__stat">
            <div className="client-profile__stat-icon">
              <MessageSquare size={20} />
            </div>
            <div className="client-profile__stat-info">
              <span className="client-profile__stat-label">Total Reviews</span>
              <span className="client-profile__stat-value">
                {clientData?.totalReviews || 0}
              </span>
            </div>
          </div>

          <div className="client-profile__stat">
            <div className="client-profile__stat-icon">
              <DollarSign size={20} />
            </div>
            <div className="client-profile__stat-info">
              <span className="client-profile__stat-label">Total Spent</span>
              <span className="client-profile__stat-value">
                ₹{clientData?.totalSpent?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          <div className="client-profile__stat">
            <div className="client-profile__stat-icon">
              <CheckCircle size={20} />
            </div>
            <div className="client-profile__stat-info">
              <span className="client-profile__stat-label">Completed Jobs</span>
              <span className="client-profile__stat-value">
                {clientData?.completedJobs || 0}
              </span>
            </div>
          </div>

          <div className="client-profile__stat">
            <div className="client-profile__stat-icon">
              <Award size={20} />
            </div>
            <div className="client-profile__stat-info">
              <span className="client-profile__stat-label">Client Level</span>
              <span className={`client-profile__level client-profile__level--${clientData?.clientLevel || 'new'}`}>
                {clientData?.clientLevel || 'new'}
              </span>
            </div>
          </div>

          <div className="client-profile__stat">
            <div className="client-profile__stat-icon">
              <Shield size={20} />
            </div>
            <div className="client-profile__stat-info">
              <span className="client-profile__stat-label">Verification Status</span>
              <div className="client-profile__verification">
                <div className="client-profile__verification-item">
                  <Mail size={16} />
                  <span className={`client-profile__verification-status ${userProfile?.isVerified ? 'verified' : 'unverified'}`}>
                    Email {userProfile?.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="client-profile__verification-item">
                  <CreditCard size={16} />
                  <span className={`client-profile__verification-status ${clientData?.isVerified ? 'verified' : 'unverified'}`}>
                    Payment Method {clientData?.isVerified ? 'Added' : 'Not Added'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="client-profile__section">
        <div className="client-profile__section-header">
          <h3 className="client-profile__section-title">Company Information</h3>
          <button 
            className="client-profile__edit-btn"
            onClick={handleEditClick}
          >
            <Edit3 size={16} />
            Edit
          </button>
        </div>

        {clientData?.isCompany ? (
          <div className="client-profile__company-content">
            <div className="client-profile__field">
              <label className="client-profile__label">Company Name</label>
              <div className="client-profile__value">
                {clientData.companyName || "Not provided"}
              </div>
            </div>

            <div className="client-profile__field">
              <label className="client-profile__label">Company Description</label>
              <div className="client-profile__value">
                {clientData.companyDescription || "Not provided"}
              </div>
            </div>

            <div className="client-profile__field">
              <label className="client-profile__label">Industry</label>
              <div className="client-profile__value">
                {clientData.industry || "Not provided"}
              </div>
            </div>
          </div>
        ) : (
          <div className="client-profile__individual-note">
            <User size={20} />
            <p>You are using an individual account. Company details are optional.</p>
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <EditClientProfileForm
          clientData={clientData}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
    </>
  );
};

export default ClientProfile;