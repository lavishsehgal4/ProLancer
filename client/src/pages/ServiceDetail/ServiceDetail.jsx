import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Star, Edit, MessageCircle } from "lucide-react";
import { getToken } from "../../utils/auth/token";
import { getServiceById, getServiceReviews, createReview } from "../../services/api/serviceApi";
import { createOrder } from "../../services/api/orderApi";
import "./ServiceDetail.css";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const freelancerId = searchParams.get('freelancerId');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchServiceDetails();
    checkOwnership();
  }, [serviceId, freelancerId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      
      console.log("ServiceDetail - serviceId:", serviceId);
      console.log("ServiceDetail - freelancerId:", freelancerId);
      
      if (!freelancerId) {
        setError("Freelancer ID is required");
        setLoading(false);
        return;
      }
      
      // Get service data using serviceId and freelancerId
      console.log("Making API call with:", { serviceId, freelancerId });
      const response = await getServiceById(serviceId, freelancerId);
      console.log("API Response:", response);

      if (response.success) {
        setService(response.data);

        // Check ownership after service data is loaded
        const token = getToken();
        if (token && currentUser) {
          setIsOwner(currentUser.userId === response.data.freelancerId);
        }

        // Also fetch reviews for this service
        await fetchServiceReviews();
      } else {
        setError(response.message || "Failed to load service details");
      }
    } catch (err) {
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceReviews = async () => {
    try {
      const response = await getServiceReviews(serviceId);

      if (response.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
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
      freelancerId: service.freelancerId,
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

    const formData = new FormData(e.target);
    const reviewData = {
      rating: parseInt(formData.get('rating')),
      comment: formData.get('comment')
    };

    try {
      const response = await createReview(serviceId, reviewData);
      if (response.success) {
        alert("Review submitted successfully!");
        // Refresh reviews
        await fetchServiceReviews();
        // Reset form
        e.target.reset();
      } else {
        alert(response.message || "Failed to submit review");
      }
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    }
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

  if (!service) {
    return (
      <div className="service-detail">
        <div className="service-detail__not-found">Service not found</div>
      </div>
    );
  }

  const averageRating = service?.averageRating || 
    (reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0);
  
  const totalReviews = service?.totalReviews || reviews.length;

  return (
    <div className="service-detail">
      <div className="service-detail__container">
        {/* Main Content */}
        <div className="service-detail__main">
          {/* Service Header */}
          <div className="service-detail__header">
            <div className="service-detail__image-wrapper">
              <img
                src={service.profilePicture}
                alt={service.title}
                className="service-detail__image"
              />
            </div>
            <div className="service-detail__header-info">
              <span className="service-detail__category">{service.category}</span>
              <h1 className="service-detail__title">{service.title}</h1>
              <h2 className="service-detail__name">{service.name}</h2>
              <p className="service-detail__bio">{service.bio}</p>

              {/* Rating */}
              <div className="service-detail__rating">
                <div className="service-detail__stars">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={`star ${index < Math.floor(averageRating) ? "star--filled" : "star--empty"
                        }`}
                      fill={index < Math.floor(averageRating) ? "#FFB800" : "none"}
                      stroke={index < Math.floor(averageRating) ? "#FFB800" : "#D1D5DB"}
                    />
                  ))}
                </div>
                <span className="service-detail__rating-number">{averageRating.toFixed(1)}</span>
                <span className="service-detail__reviews-count">
                  ({totalReviews} reviews)
                </span>
              </div>

              {/* Skills */}
              <div className="service-detail__skills">
                {service.skills.map((skill, index) => (
                  <span key={index} className="service-detail__skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="service-detail__description">
            <h3 className="service-detail__section-title">About This Service</h3>
            <p className="service-detail__description-text">{service.description}</p>
          </div>

          {/* Reviews Section */}
          <div className="service-detail__reviews">
            <h3 className="service-detail__section-title">
              Reviews ({totalReviews})
            </h3>

            {reviews.length > 0 ? (
              <div className="service-detail__reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="service-detail__review">
                    <div className="service-detail__review-header">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="service-detail__review-avatar"
                      />
                      <div className="service-detail__review-info">
                        <h4 className="service-detail__review-name">{review.userName}</h4>
                        <div className="service-detail__review-rating">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={16}
                              className={`star ${index < review.rating ? "star--filled" : "star--empty"
                                }`}
                              fill={index < review.rating ? "#FFB800" : "none"}
                              stroke={index < review.rating ? "#FFB800" : "#D1D5DB"}
                            />
                          ))}
                        </div>
                        <span className="service-detail__review-date">{review.date}</span>
                      </div>
                    </div>
                    <p className="service-detail__review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="service-detail__no-reviews">No reviews yet</p>
            )}

            {/* Add Review Form - Only show if not owner */}
            {!isOwner && currentUser && (
              <div className="service-detail__add-review">
                <h4 className="service-detail__add-review-title">Leave a Review</h4>
                <form onSubmit={handleSubmitReview} className="service-detail__review-form">
                  <div className="service-detail__review-rating-input">
                    <label>Rating:</label>
                    <select name="rating" required>
                      <option value="">Select rating</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div className="service-detail__review-comment-input">
                    <label>Comment:</label>
                    <textarea
                      name="comment"
                      rows="4"
                      placeholder="Share your experience with this service..."
                      required
                    />
                  </div>
                  <button type="submit" className="service-detail__submit-review-btn">
                    <MessageCircle size={16} />
                    Submit Review
                  </button>
                </form>
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
                  {service.skills.slice(0, 3).join(", ")}
                  {service.skills.length > 3 && ` +${service.skills.length - 3} more`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;