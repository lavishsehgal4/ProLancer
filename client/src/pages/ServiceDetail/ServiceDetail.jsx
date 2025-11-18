import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Edit, MessageCircle, User, Award, Briefcase, TrendingUp } from "lucide-react";
import { getToken } from "../../utils/auth/token";
import { getServiceDetails } from "../../services/api/categoriesApi";
import { createOrder } from "../../services/api/orderApi";
import "./ServiceDetail.css";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [freelancerInfo, setFreelancerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
    checkOwnership();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("ServiceDetail - serviceId:", serviceId);
      
      // Get service and freelancer data using the new API
      const response = await getServiceDetails(serviceId);
      console.log("API Response:", response);

      if (response.success) {
        setService(response.data.service);
        setFreelancerInfo(response.data.freelancerInfo);

        // Check ownership after service data is loaded
        const token = getToken();
        if (token && currentUser) {
          // Note: We'll need to add freelancer ID to the response or get it from token
          // For now, we'll assume ownership check based on token
          setIsOwner(false); // Will be updated when we have proper freelancer ID
        }
      } else {
        setError(response.message || "Failed to load service details");
      }
    } catch (err) {
      console.error("Error fetching service details:", err);
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  const checkOwnership = () => {
    const token = getToken();
    if (token) {
      try {
        // Decode token to get current user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);

        // Check if current user is the owner of this service
        // This will be properly checked once service data is loaded
        setIsOwner(false); // Will be updated in fetchServiceDetails
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  };

  const handleRequestOrder = async () => {
    if (!currentUser) {
      alert("Please login to request an order");
      navigate("/login");
      return;
    }

    const orderData = {
      serviceId: service._id,
      freelancerId: service.freelancerId || "freelancer-id-placeholder", // Will need to get this from API
      message: "I'm interested in your service. Please contact me to discuss the details.",
      budget: service.hourlyRate * 10, // Default budget estimate
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    };

    try {
      const response = await createOrder(orderData);
      if (response.success) {
        alert("Order request sent successfully! The freelancer will contact you soon.");
      } else {
        alert(response.message || "Failed to send order request");
      }
    } catch (err) {
      alert("Failed to send order request. Please try again.");
    }
  };

  const handleEditService = () => {
    // Navigate to edit service page or open edit modal
    navigate(`/dashboard`); // For now, redirect to dashboard
    alert("Edit service functionality will be implemented in the dashboard");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login to submit a review");
      return;
    }

    // For now, we'll show a placeholder message since review API will be implemented later
    alert("Review functionality will be implemented soon!");
    
    // TODO: Implement review submission when review API is ready
    // const formData = new FormData(e.target);
    // const reviewData = {
    //   rating: parseInt(formData.get('rating')),
    //   comment: formData.get('comment')
    // };
  };

  if (loading) {
    return (
      <div className="service-detail">
        <div className="service-detail__loading">Loading service details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="service-detail">
        <div className="service-detail__error">{error}</div>
      </div>
    );
  }

  if (!service || !freelancerInfo) {
    return (
      <div className="service-detail">
        <div className="service-detail__not-found">Service not found</div>
      </div>
    );
  }

  const serviceRating = service?.averageRating || 0;
  const totalReviews = service?.totalReviews || 0;
  const freelancerRating = freelancerInfo?.averageRating || 0;

  return (
    <div className="service-detail">
      <div className="service-detail__container">
        {/* Main Content */}
        <div className="service-detail__main">
          {/* Service Header */}
          <div className="service-detail__header">
            <div className="service-detail__image-wrapper">
              <img
                src={service.profilePicture || "/default-service.jpg"}
                alt={service.title}
                className="service-detail__image"
              />
            </div>
            <div className="service-detail__header-info">
              <span className="service-detail__category">{service.category}</span>
              <h1 className="service-detail__title">{service.title}</h1>
              <p className="service-detail__bio">{service.bio}</p>

              {/* Service Rating */}
              <div className="service-detail__rating">
                <div className="service-detail__stars">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={`star ${index < Math.floor(serviceRating) ? "star--filled" : "star--empty"
                        }`}
                      fill={index < Math.floor(serviceRating) ? "#FFB800" : "none"}
                      stroke={index < Math.floor(serviceRating) ? "#FFB800" : "#D1D5DB"}
                    />
                  ))}
                </div>
                <span className="service-detail__rating-number">{serviceRating.toFixed(1)}</span>
                <span className="service-detail__reviews-count">
                  ({totalReviews} reviews)
                </span>
              </div>

              {/* Skills */}
              <div className="service-detail__skills">
                {service.skills?.map((skill, index) => (
                  <span key={index} className="service-detail__skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Freelancer Information Section */}
          <div className="service-detail__freelancer">
            <h3 className="service-detail__section-title">About the Freelancer</h3>
            <div className="service-detail__freelancer-info">
              <div className="service-detail__freelancer-stats">
                <div className="service-detail__stat">
                  <User className="service-detail__stat-icon" size={20} />
                  <div className="service-detail__stat-content">
                    <span className="service-detail__stat-label">Experience</span>
                    <span className="service-detail__stat-value">{freelancerInfo.yearsOfExperience} years</span>
                  </div>
                </div>
                
                <div className="service-detail__stat">
                  <Award className="service-detail__stat-icon" size={20} />
                  <div className="service-detail__stat-content">
                    <span className="service-detail__stat-label">Rating</span>
                    <span className="service-detail__stat-value">{freelancerRating.toFixed(1)} ⭐</span>
                  </div>
                </div>
                
                <div className="service-detail__stat">
                  <Briefcase className="service-detail__stat-icon" size={20} />
                  <div className="service-detail__stat-content">
                    <span className="service-detail__stat-label">Completed Jobs</span>
                    <span className="service-detail__stat-value">{freelancerInfo.completedJobs}</span>
                  </div>
                </div>
                
                <div className="service-detail__stat">
                  <TrendingUp className="service-detail__stat-icon" size={20} />
                  <div className="service-detail__stat-content">
                    <span className="service-detail__stat-label">Success Rate</span>
                    <span className="service-detail__stat-value">{freelancerInfo.successRate}%</span>
                  </div>
                </div>
              </div>

              {/* About Me */}
              {freelancerInfo.aboutMe && (
                <div className="service-detail__freelancer-about">
                  <h4 className="service-detail__freelancer-about-title">About Me</h4>
                  <p className="service-detail__freelancer-about-text">{freelancerInfo.aboutMe}</p>
                </div>
              )}

              {/* Education */}
              {freelancerInfo.education && (
                <div className="service-detail__freelancer-education">
                  <h4 className="service-detail__freelancer-education-title">Education</h4>
                  <p className="service-detail__freelancer-education-text">{freelancerInfo.education}</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Description */}
          <div className="service-detail__description">
            <h3 className="service-detail__section-title">About This Service</h3>
            <p className="service-detail__description-text">{service.description}</p>
          </div>

          {/* Reviews Section - Placeholder for future implementation */}
          <div className="service-detail__reviews">
            <h3 className="service-detail__section-title">
              Reviews ({totalReviews})
            </h3>

            {totalReviews > 0 ? (
              <div className="service-detail__reviews-placeholder">
                <p className="service-detail__reviews-placeholder-text">
                  This service has {totalReviews} reviews. Review details will be implemented soon.
                </p>
              </div>
            ) : (
              <p className="service-detail__no-reviews">No reviews yet</p>
            )}

            {/* Add Review Form - Placeholder for future implementation */}
            {!isOwner && currentUser && (
              <div className="service-detail__add-review">
                <h4 className="service-detail__add-review-title">Leave a Review</h4>
                <div className="service-detail__review-placeholder">
                  <p>Review submission will be available soon!</p>
                  <button 
                    type="button" 
                    className="service-detail__submit-review-btn service-detail__submit-review-btn--disabled"
                    disabled
                  >
                    <MessageCircle size={16} />
                    Submit Review (Coming Soon)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="service-detail__sidebar">
          <div className="service-detail__order-card">
            <div className="service-detail__price">
              <span className="service-detail__price-amount">${service.hourlyRate}</span>
              <span className="service-detail__price-unit">/hour</span>
            </div>

            {isOwner ? (
              <button
                onClick={handleEditService}
                className="service-detail__edit-btn"
              >
                <Edit size={16} />
                Edit Service
              </button>
            ) : (
              <button
                onClick={handleRequestOrder}
                className="service-detail__order-btn"
              >
                Request Order
              </button>
            )}

            <div className="service-detail__service-info">
              <div className="service-detail__info-item">
                <span className="service-detail__info-label">Category:</span>
                <span className="service-detail__info-value">{service.category}</span>
              </div>
              <div className="service-detail__info-item">
                <span className="service-detail__info-label">Skills:</span>
                <span className="service-detail__info-value">
                  {service.skills?.slice(0, 3).join(", ")}
                  {service.skills?.length > 3 && ` +${service.skills.length - 3} more`}
                </span>
              </div>
              <div className="service-detail__info-item">
                <span className="service-detail__info-label">Experience:</span>
                <span className="service-detail__info-value">{freelancerInfo.yearsOfExperience} years</span>
              </div>
              <div className="service-detail__info-item">
                <span className="service-detail__info-label">Success Rate:</span>
                <span className="service-detail__info-value">{freelancerInfo.successRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;