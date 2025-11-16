/**
 * ServiceCard Component
 *
 * Displays a single service card with service information
 * Matches the service schema fields
 *
 * Props:
 * @param {Object} service - Service object matching schema:
 *   - title: Service title
 *   - name: Service name
 *   - bio: Service bio
 *   - description: Service description
 *   - rating: Service rating (0-5)
 *   - reviewsCount: Number of reviews
 *   - category: Service category
 *   - skills: Array of skills
 *   - hourlyRate: Hourly rate
 *   - profilePicture: Service profile picture URL
 */

import "./ServiceCard.css";

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <div className="service-card">
      {/* Service Profile Picture */}
      {service.profilePicture && (
        <div className="service-card__image-wrapper">
          <img
            src={service.profilePicture}
            alt={service.title}
            className="service-card__image"
          />
        </div>
      )}

      {/* Service Content */}
      <div className="service-card__content">
        {/* Category */}
        <span className="service-card__category">{service.category}</span>

        {/* Title */}
        <h3 className="service-card__title">{service.title}</h3>

        {/* Name */}
        {service.name && <p className="service-card__name">{service.name}</p>}

        {/* Bio */}
        {service.bio && <p className="service-card__bio">{service.bio}</p>}

        {/* Description */}
        <p className="service-card__description">{service.description}</p>

        {/* Skills */}
        {service.skills && service.skills.length > 0 && (
          <div className="service-card__skills">
            {service.skills.map((skill, index) => (
              <span key={index} className="service-card__skill-tag">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Rating and Reviews */}
        <div className="service-card__stats">
          <span className="service-card__rating">⭐ {service.rating || 0}</span>
          <span className="service-card__reviews">
            ({service.reviewsCount || 0} reviews)
          </span>
        </div>

        {/* Hourly Rate */}
        <div className="service-card__pricing">
          <span className="service-card__price">
            ${service.hourlyRate || 0}/hr
          </span>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="service-card__actions">
            {onEdit && (
              <button
                className="service-card__edit-btn"
                onClick={() => onEdit(service)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="service-card__delete-btn"
                onClick={() => onDelete(service._id || service.id)}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
