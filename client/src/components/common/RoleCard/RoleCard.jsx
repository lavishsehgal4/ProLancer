import { Link } from "react-router-dom";
import "./RoleCard.css";

/**
 * RoleCard Component
 * Card for choosing account type (Client or Freelancer)
 *
 * Props:
 * @param {string} icon - Lucide icon component
 * @param {string} title - "Client" or "Freelancer"
 * @param {string} description - Card description
 * @param {string} link - Route to navigate to
 */

const RoleCard = ({ icon: Icon, title, description, link }) => {
  return (
    <Link to={link} className="role-card">
      {/* Icon */}
      <div className="role-card__icon-wrapper">
        <Icon className="role-card__icon" size={48} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="role-card__title">{title}</h3>

      {/* Description */}
      <p className="role-card__description">{description}</p>

      {/* Arrow indicator */}
      <div className="role-card__arrow">→</div>
    </Link>
  );
};

export default RoleCard;
