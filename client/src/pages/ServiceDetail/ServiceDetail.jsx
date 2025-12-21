import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Edit, MessageCircle, User, Award, Briefcase, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { getToken } from "../../utils/auth/token";
import { getServiceDetails } from "../../services/api/categoriesApi";
import { submitReview, getServiceReviews } from "../../services/api/commentsApi";
import OrderRequestModal from "../../components/order/OrderRequestModal/OrderRequestModal";
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
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewsPagination, setReviewsPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
    checkOwnership();
  }, [serviceId]);

  useEffect(() => {
    if (serviceId) {
      fetchReviews();
    }
  }, [serviceId, reviewsPagination.page]);

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

  const handleRequestOrder = () => {
    if (!currentUser) {
      alert("Please login to request an order");
      navigate("/login");
      return;
    }

    setShowOrderModal(true);
  };

  const handleEditService = () => {
    // Navigate to edit service page or open edit modal
    navigate(`/dashboard`); // For now, redirect to dashboard
    alert("Edit service functionality will be implemented in the dashboard");
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      
      console.log("Fetching reviews for service:", serviceId, "page:", reviewsPagination.page);
      
      const response = await getServiceReviews(serviceId, reviewsPagination.page, reviewsPagination.limit);
      console.log("Reviews response:", response);

      if (response.success) {
        setReviews(response.data);
        setReviewsPagination(prev => ({
          ...prev,
          ...response.pagination
        }));
      } else {
        setReviewsError(response.message || "Failed to load reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviewsError("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (selectedRating === 0) {
      alert("Please select a rating");
      return;
    }

    const formData = new FormData(e.target);
    const reviewData = {
      rating: selectedRating,
      comment: formData.get('comment')
    };

    if (!reviewData.comment.trim()) {
      alert("Please write a comment");
      return;
    }

    try {
      setSubmittingReview(true);
      console.log("Submitting review:", reviewData);
      
      const response = await submitReview(serviceId, reviewData);
      console.log("Submit review response:", response);

      if (response.success) {
        alert("Review submitted successfully!");
        
        // Reset form
        setSelectedRating(0);
        e.target.reset();
        
        // Refresh reviews and service details
        await fetchReviews();
        await fetchServiceDetails();
      } else {
        alert(response.message || "Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= reviewsPagination.totalPages) {
      setReviewsPagination(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

          {/* Reviews Section */}
          <div className="service-detail__reviews">
            <h3 className="service-detail__section-title">
              Reviews ({reviewsPagination.total})
            </h3>

            {reviewsLoading ? (
              <div className="service-detail__reviews-loading">
                <p>Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="service-detail__reviews-error">
                <p>Error loading reviews: {reviewsError}</p>
                <button 
                  onClick={fetchReviews}
                  className="service-detail__retry-btn"
                >
                  Try Again
                </button>
              </div>
            ) : reviews.length > 0 ? (
              <>
                <div className="service-detail__reviews-list">
                  {reviews.map((review) => (
                    <div key={review._id} className="service-detail__review">
                      <div className="service-detail__review-header">
                        <div className="service-detail__reviewer">
                          <div className="service-detail__reviewer-avatar">
                            {review.client?.profilePicture ? (
                              <img 
                                src={review.client.profilePicture} 
                                alt={review.client.name}
                                className="service-detail__reviewer-image"
                              />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                          <div className="service-detail__reviewer-info">
                            <span className="service-detail__reviewer-name">
                              {review.client?.name || "Anonymous"}
                            </span>
                            <span className="service-detail__review-date">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="service-detail__review-rating">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={16}
                              className={`star ${index < review.stars ? "star--filled" : "star--empty"}`}
                              fill={index < review.stars ? "#FFB800" : "none"}
                              stroke={index < review.stars ? "#FFB800" : "#D1D5DB"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="service-detail__review-message">{review.message}</p>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {reviewsPagination.totalPages > 1 && (
                  <div className="service-detail__reviews-pagination">
                    <button
                      onClick={() => handlePageChange(reviewsPagination.page - 1)}
                      disabled={reviewsPagination.page === 1}
                      className="service-detail__pagination-btn"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <span className="service-detail__pagination-info">
                      Page {reviewsPagination.page} of {reviewsPagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(reviewsPagination.page + 1)}
                      disabled={reviewsPagination.page === reviewsPagination.totalPages}
                      className="service-detail__pagination-btn"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="service-detail__no-reviews">No reviews yet. Be the first to review!</p>
            )}

            {/* Add Review Form */}
            {!isOwner && currentUser && (
              <div className="service-detail__add-review">
                <h4 className="service-detail__add-review-title">Leave a Review</h4>
                <form className="service-detail__review-form" onSubmit={handleSubmitReview}>
                  <div className="service-detail__rating-input">
                    <label className="service-detail__rating-label">Rating:</label>
                    <div className="service-detail__star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label 
                          key={star} 
                          className="service-detail__star-label"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={star}
                            className="service-detail__star-input"
                            checked={selectedRating === star}
                            onChange={() => setSelectedRating(star)}
                            required
                            disabled={submittingReview}
                          />
                          <Star
                            size={24}
                            className="service-detail__star-icon"
                            fill={star <= (hoverRating || selectedRating) ? "#fbbf24" : "none"}
                            stroke={star <= (hoverRating || selectedRating) ? "#fbbf24" : "#D1D5DB"}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="service-detail__comment-input">
                    <label htmlFor="comment" className="service-detail__comment-label">
                      Your Review:
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows="4"
                      className="service-detail__comment-textarea"
                      placeholder="Share your experience working with this freelancer..."
                      required
                      disabled={submittingReview}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="service-detail__submit-review-btn"
                    disabled={submittingReview}
                  >
                    <MessageCircle size={16} />
                    {submittingReview ? "Submitting..." : "Submit Review"}
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

      {/* Order Request Modal */}
      <OrderRequestModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        service={service}
        freelancerInfo={freelancerInfo}
      />
    </div>
  );
};

export default ServiceDetail;