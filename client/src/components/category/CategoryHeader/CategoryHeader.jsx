import { useState } from "react";
import { Search } from "lucide-react";
import "./CategoryHeader.css";

/**
 * CategoryHeader Component
 * Dark header section with title, description, and search bar
 *
 * Props:
 * @param {string} categoryTitle - Display title (e.g., "Web Development")
 */

const CategoryHeader = ({ categoryTitle }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here (filter freelancers)
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="category-header">
      <div className="category-header__container">
        {/* Page Title */}
        <h1 className="category-header__title">
          Get High Quality {categoryTitle} Services
        </h1>

        {/* Description */}
        <p className="category-header__description">
          Looking for {categoryTitle} offers and services? We've got you
          covered.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="category-header__search">
          <input
            type="text"
            placeholder="Search offers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="category-header__search-input"
          />
          <button
            type="submit"
            className="category-header__search-button"
            aria-label="Search"
          >
            <Search size={24} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default CategoryHeader;
