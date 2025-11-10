import "./BenefitCard.css";

/**
 * BenefitCard Component
 * Displays a single platform benefit with icon, title, and description
 *
 * Props:
 * @param {Object} benefit - Benefit object containing:
 *   - icon: Lucide icon component (e.g., ShieldCheck, Lock)
 *   - title: Benefit title (e.g., "Verified Freelancers")
 *   - description: Benefit description text
 */

const BenefitCard = ({ benefit }) => {
  const { icon: Icon, title, description } = benefit;

  return (
    <div className="benefit-card">
      {/* Icon Container */}
      <div className="benefit-card__icon-wrapper">
        <Icon className="benefit-card__icon" size={40} />
      </div>

      {/* Benefit Title */}
      <h3 className="benefit-card__title">{title}</h3>

      {/* Benefit Description */}
      <p className="benefit-card__description">{description}</p>
    </div>
  );
};

export default BenefitCard;
