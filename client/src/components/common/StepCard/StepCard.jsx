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
 */

const StepCard = ({ icon: Icon, number, title, description }) => {
  return (
    <div className="step-card">
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
    </div>
  );
};

export default StepCard;
