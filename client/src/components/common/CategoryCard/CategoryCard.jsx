import { Link } from "react-router-dom";
import "./CategoryCard.css";

/**
 * CategoryCard Component
 * Displays a single job category with icon and title
 *
 * Props:
 * @param {Object} category - Category object containing:
 *   - icon: Lucide icon component (e.g., Code, Smartphone)
 *   - title: Category name (e.g., "Web Development")
 *   - link: URL to navigate to (e.g., "/categories/web-development")
 */

const CategoryCard = ({ category }) => {
  const { icon: Icon, title, link } = category;
  // Convert title to URL-friendly format
  // "Web Development" -> "web-development"
  const categorySlug = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <Link to={`/categories/${categorySlug}`} className="category-card">
      {/* Large Icon */}
      <div className="category-card__icon-wrapper">
        <Icon className="category-card__icon" size={64} strokeWidth={1.5} />
      </div>

      {/* Category Title */}
      <h3 className="category-card__title">{title}</h3>
    </Link>
  );
};

export default CategoryCard;
