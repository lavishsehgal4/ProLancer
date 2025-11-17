import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  getFreelancerProfile,
  updateFreelancerProfile,
  createService,
  deleteService,
} from "../../../services/api/freelancerApi";
import FreelancerCard from "../../common/FreelancerCard/FreelancerCard";
import EditProfileForm from "./EditProfileForm/EditProfileForm";
import CreateServiceForm from "./CreateServiceForm/CreateServiceForm";
import "./FreelancerProfile.css";

const FreelancerProfile = () => {
  // Freelancer profile data
  const [freelancerData, setFreelancerData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreateService, setShowCreateService] = useState(false);

  // Fetch freelancer profile data on component mount
  useEffect(() => {
    fetchFreelancerProfile();
  }, []);

  /**
   * Fetch freelancer profile data from backend
   */
  const fetchFreelancerProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFreelancerProfile();

      if (response.success) {
        setFreelancerData(response.data);
        setServices(response.data.services || []);
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching freelancer profile:", err);
      setError("An error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit profile save
   */
  const handleSaveProfile = async (profileData) => {
    try {
      const response = await updateFreelancerProfile(profileData);

      if (response.success) {
        setFreelancerData((prev) => ({ ...prev, ...response.data }));
        setShowEditProfile(false);
        alert("Profile updated successfully!");
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An error occurred while updating your profile");
    }
  };

  /**
   * Handle create service
   */
  const handleCreateService = async (serviceData) => {
    try {
      const response = await createService(serviceData);

      if (response.success) {
        // Add new service to services array
        setServices((prev) => [...prev, response.data]);
        setShowCreateService(false);
        alert("Service created successfully!");
      } else {
        alert(response.message || "Failed to create service");
      }
    } catch (err) {
      console.error("Error creating service:", err);
      alert("An error occurred while creating the service");
    }
  };

  /**
   * Handle delete service
   */
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await deleteService(serviceId);

      if (response.success) {
        setServices((prev) =>
          prev.filter(
            (service) => service._id !== serviceId && service.id !== serviceId
          )
        );
        alert("Service deleted successfully!");
      } else {
        alert(response.message || "Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("An error occurred while deleting the service");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="freelancer-profile">
        <div className="freelancer-profile__loading">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="freelancer-profile">
        <div className="freelancer-profile__error">{error}</div>
      </div>
    );
  }

  // Show edit profile form modal
  if (showEditProfile) {
    return (
      <div className="freelancer-profile">
        <EditProfileForm
          freelancerData={freelancerData}
          onSave={handleSaveProfile}
          onCancel={() => setShowEditProfile(false)}
        />
      </div>
    );
  }

  // Show create service form modal
  if (showCreateService) {
    return (
      <div className="freelancer-profile">
        <CreateServiceForm
          onSave={handleCreateService}
          onCancel={() => setShowCreateService(false)}
        />
      </div>
    );
  }

  return (
    <div className="freelancer-profile">
      {/* Header Section */}
      <div className="freelancer-profile__header">
        <div className="freelancer-profile__header-content">
          <h1 className="freelancer-profile__title">Freelancer Profile</h1>
          <p className="freelancer-profile__subtitle">
            Create and manage your service offerings
          </p>
        </div>

        <button
          className="freelancer-profile__create-btn"
          onClick={() => setShowCreateService(true)}
        >
          <Plus size={20} />
          <span>Create New Service</span>
        </button>
      </div>

      {/* Freelancer Info Section */}
      <div className="freelancer-profile__info">
        <div className="freelancer-profile__info-header">
          <h2 className="freelancer-profile__info-title">About Me</h2>
        </div>

        <div className="freelancer-profile__info-content">
          {/* About Me */}
          <div className="freelancer-profile__info-field">
            <label className="freelancer-profile__info-label">About Me</label>
            <p className="freelancer-profile__info-value">
              {freelancerData?.aboutMe || "No description provided"}
            </p>
          </div>

          {/* Education */}
          <div className="freelancer-profile__info-field">
            <label className="freelancer-profile__info-label">Education</label>
            <p className="freelancer-profile__info-value">
              {freelancerData?.education || "Not specified"}
            </p>
          </div>

          {/* Years of Experience */}
          <div className="freelancer-profile__info-field">
            <label className="freelancer-profile__info-label">
              Years of Experience
            </label>
            <p className="freelancer-profile__info-value">
              {freelancerData?.yearsOfExperience || 0} years
            </p>
          </div>

          {/* Average Rating */}
          <div className="freelancer-profile__info-field">
            <label className="freelancer-profile__info-label">
              Average Rating
            </label>
            <div className="freelancer-profile__rating">
              <span className="freelancer-profile__rating-stars">
                ⭐ {freelancerData?.averageRating || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="freelancer-profile__info-footer">
          <button
            className="freelancer-profile__edit-btn"
            onClick={() => setShowEditProfile(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="freelancer-profile__services">
        <div className="freelancer-profile__services-header">
          <h2 className="freelancer-profile__services-title">
            My Services ({services.length})
          </h2>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="freelancer-profile__services-grid">
            {services.map((service) => (
              <FreelancerCard
                key={service._id || service.id}
                freelancer={{
                  id: service._id || service.id,
                  profilePicture: service.profilePicture || "/default-service.jpg",
                  name: service.name || "Service",
                  title: service.title || service.category,
                  rating: 0, // Default since we removed rating from form
                  reviewsCount: 0, // Default since we removed reviewsCount from form
                  hourlyRate: service.hourlyRate || 0,
                  skills: service.skills || [],
                  bio: service.bio || service.description || "No description available"
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="freelancer-profile__empty">
            <div className="freelancer-profile__empty-icon">📦</div>
            <h3 className="freelancer-profile__empty-title">
              No services created yet
            </h3>
            <p className="freelancer-profile__empty-text">
              Start by creating your first service offering
            </p>
            <button
              className="freelancer-profile__empty-btn"
              onClick={() => setShowCreateService(true)}
            >
              <Plus size={20} />
              Create Your First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;
