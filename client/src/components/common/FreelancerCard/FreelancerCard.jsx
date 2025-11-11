import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import "./FreelancerCard.css";

/**
 * FreelancerCard Component
 * Displays a single freelancer with profile info
 *
 * Props:
 * @param {Object} freelancer - Freelancer object containing:
 *   - id: Unique identifier
 *   - profilePicture: Image URL
 *   - name: Freelancer name
 *   - title: Professional title/tagline
 *   - rating: Rating number (e.g., 4.9)
 *   - reviewsCount: Number of reviews
 *   - hourlyRate: Hourly rate in dollars
 *   - skills: Array of skill strings
 *   - bio: Short biography (1-2 lines)
 */

const FreelancerCard = ({ freelancer }) => {
  const {
    id,
    profilePicture,
    name,
    title,
    rating,
    reviewsCount,
    hourlyRate,
    skills,
    bio,
  } = freelancer;

  // Display only top 3 skills
  const displaySkills = skills.slice(0, 3);

  return (
    <Link to={`/freelancer/${id}`} className="freelancer-card">
      {/* Profile Picture */}
      <div className="freelancer-card__image-wrapper">
        <img
          src={profilePicture}
          alt={name}
          className="freelancer-card__image"
        />
      </div>

      {/* Freelancer Name */}
      <h3 className="freelancer-card__name">{name}</h3>

      {/* Professional Title */}
      <p className="freelancer-card__title">{title}</p>

      {/* Rating Section */}
      <div className="freelancer-card__rating">
        {/* Star icons */}
        <div className="freelancer-card__stars">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className={`star ${
                index < Math.floor(rating) ? "star--filled" : "star--empty"
              }`}
              fill={index < Math.floor(rating) ? "#FFB800" : "none"}
              stroke={index < Math.floor(rating) ? "#FFB800" : "#D1D5DB"}
            />
          ))}
        </div>
        <span className="freelancer-card__rating-number">{rating}</span>
        <span className="freelancer-card__reviews">
          ({reviewsCount} reviews)
        </span>
      </div>

      {/* Hourly Rate */}
      <div className="freelancer-card__rate">
        <span className="freelancer-card__rate-amount">${hourlyRate}/hr</span>
      </div>

      {/* Skills Tags */}
      <div className="freelancer-card__skills">
        {displaySkills.map((skill, index) => (
          <span key={index} className="freelancer-card__skill-tag">
            {skill}
          </span>
        ))}
      </div>

      {/* Short Bio */}
      <p className="freelancer-card__bio">{bio}</p>

      {/* View Profile Button */}
      <button className="freelancer-card__button">View Profile</button>
    </Link>
  );
};

export default FreelancerCard;
