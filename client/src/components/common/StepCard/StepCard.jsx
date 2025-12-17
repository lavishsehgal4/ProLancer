import { Link } from "react-router-dom";
import "./StepCard.css";

/**
 * StepCard Component
 * Displays a single step with icon, number, title, and description
 *
 * Props:
 * @param {string} icon - Lucide icon name (e.g., 'FileText', 'Users', 'CheckCircle')
 * @param {number} number - Step number (1, 2, 3)
 * @param {string} title - Step title
 * @param {string} description - Step description text
 * @param {string} link - Optional link to navigate to when clicked
 */

const StepCard = ({ icon: Icon, number, title, description, link }) => {
  const CardContent = () => (
    <>
      {/* Icon Container */}
      <div className="step-card__icon-wrapper">
        <Icon className="step-card__icon" size={40} />
      </div>

      {/* Step Number */}
      <div className="step-card__number">{number}</div>

      {/* Step Title */}
      <h3 className="step-card__title">{title}</h3>

      {/* Step Description */}
      <p className="step-card__description">{description}</p>
    </>
  );

  if (link) {
    return (
      <Link to={link} className="step-card step-card--clickable">
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="step-card">
      <CardContent />
    </div>
  );
};

export default StepCard;
