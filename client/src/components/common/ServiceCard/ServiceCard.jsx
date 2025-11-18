import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import "./ServiceCard.css";

/**
 * ServiceCard Component
 * Displays a single service with service info - links to service detail page
 *
 * Props:
 * @param {Object} service - Service object containing:
 *   - _id or id: Unique identifier
 *   - profilePicture: Image URL
 *   - name: Service name
 *   - title: Service title/tagline
 *   - rating: Rating number (e.g., 4.9)
 *   - reviewsCount: Number of reviews
 *   - hourlyRate: Hourly rate in dollars
 *   - skills: Array of skill strings
 *   - bio: Short biography (1-2 lines)
 * @param {boolean} showActions - Whether to show edit/delete buttons (for freelancer profile)
 * @param {function} onEdit - Callback function for edit action
 * @param {function} onDelete - Callback function for delete action
 */

const ServiceCard = ({ service, showActions = false, onEdit, onDelete }) => {
  const {
    _id,
    id,
    profilePicture,
    name,
    title,
    rating,
    reviewsCount,
    hourlyRate,
    skills,
    bio,
    freelancerId,
  } = service;

  const serviceId = _id || id;
  
  // Debug: Log what ServiceCard is receiving
  console.log("ServiceCard received service:", service);
  console.log("ServiceCard serviceId:", serviceId);
  
  // Display only top 3 skills
  const displaySkills = skills?.slice(0, 3) || [];

  return (
    <Link to={`/service/${serviceId}`} className="service-card">
      {/* Profile Picture */}
      <div className="service-card__image-wrapper">
        <img
          src={profilePicture || "/default-service.jpg"}
          alt={title || name}
          className="service-card__image"
        />
      </div>

      {/* Service Name */}
      <h3 className="service-card__name">{name || "Service"}</h3>

      {/* Service Title */}
      <p className="service-card__title">{title || "Professional Service"}</p>

      {/* Rating Section */}
      <div className="service-card__rating">
        {/* Star icons */}
        <div className="service-card__stars">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className={`star ${
                index < Math.floor(rating || 0) ? "star--filled" : "star--empty"
              }`}
              fill={index < Math.floor(rating || 0) ? "#FFB800" : "none"}
              stroke={index < Math.floor(rating || 0) ? "#FFB800" : "#D1D5DB"}
            />
          ))}
        </div>
        <span className="service-card__rating-number">{rating || 0}</span>
        <span className="service-card__reviews">
          ({reviewsCount || 0} reviews)
        </span>
      </div>

      {/* Hourly Rate */}
      <div className="service-card__rate">
        <span className="service-card__rate-amount">${hourlyRate || 0}/hr</span>
      </div>

      {/* Skills Tags */}
      {displaySkills.length > 0 && (
        <div className="service-card__skills">
          {displaySkills.map((skill, index) => (
            <span key={index} className="service-card__skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Short Bio */}
      <p className="service-card__bio">{bio || "No description available"}</p>

      {/* View Service Button */}
      <button className="service-card__button">View Service</button>

      {/* Edit and Delete Actions - Only show when in freelancer profile */}
      {showActions && (
        <div className="service-card__actions" onClick={(e) => e.preventDefault()}>
          <button
            className="service-card__action-btn service-card__edit-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit && onEdit(service);
            }}
          >
            Edit
          </button>
          <button
            className="service-card__action-btn service-card__delete-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete && onDelete(serviceId);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </Link>
  );
};

export default ServiceCard;