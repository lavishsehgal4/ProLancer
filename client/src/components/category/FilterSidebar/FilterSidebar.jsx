import { useState } from "react";
import "./FilterSidebar.css";

/**
 * FilterSidebar Component
 * Left sidebar with filters for budget, rating, and experience
 */

const FilterSidebar = () => {
  // Filter states
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedExperience, setSelectedExperience] = useState([]);

  // Handle experience checkbox change
  const handleExperienceChange = (level) => {
    if (selectedExperience.includes(level)) {
      setSelectedExperience(
        selectedExperience.filter((item) => item !== level)
      );
    } else {
      setSelectedExperience([...selectedExperience, level]);
    }
  };

  // Apply filters function
  const handleApplyFilters = () => {
    // Handle filter logic here
    console.log("Filters applied:", {
      budget: selectedBudget,
      rating: selectedRating,
      experience: selectedExperience,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedBudget("");
    setSelectedRating("");
    setSelectedExperience([]);
  };

  return (
    <aside className="filter-sidebar">
      <h3 className="filter-sidebar__title">Filters</h3>

      {/* Budget Filter */}
      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Budget</h4>
        <div className="filter-sidebar__options">
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="budget"
              value="0-25"
              checked={selectedBudget === "0-25"}
              onChange={(e) => setSelectedBudget(e.target.value)}
            />
            <span>$0 - $25/hr</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="budget"
              value="25-50"
              checked={selectedBudget === "25-50"}
              onChange={(e) => setSelectedBudget(e.target.value)}
            />
            <span>$25 - $50/hr</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="budget"
              value="50-100"
              checked={selectedBudget === "50-100"}
              onChange={(e) => setSelectedBudget(e.target.value)}
            />
            <span>$50 - $100/hr</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="budget"
              value="100+"
              checked={selectedBudget === "100+"}
              onChange={(e) => setSelectedBudget(e.target.value)}
            />
            <span>$100+/hr</span>
          </label>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Rating</h4>
        <div className="filter-sidebar__options">
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="rating"
              value="5"
              checked={selectedRating === "5"}
              onChange={(e) => setSelectedRating(e.target.value)}
            />
            <span>⭐⭐⭐⭐⭐ 5 stars</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="rating"
              value="4"
              checked={selectedRating === "4"}
              onChange={(e) => setSelectedRating(e.target.value)}
            />
            <span>⭐⭐⭐⭐ 4+ stars</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="rating"
              value="3"
              checked={selectedRating === "3"}
              onChange={(e) => setSelectedRating(e.target.value)}
            />
            <span>⭐⭐⭐ 3+ stars</span>
          </label>
        </div>
      </div>

      {/* Experience Filter */}
      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Experience Level</h4>
        <div className="filter-sidebar__options">
          <label className="filter-sidebar__checkbox">
            <input
              type="checkbox"
              checked={selectedExperience.includes("entry")}
              onChange={() => handleExperienceChange("entry")}
            />
            <span>Entry Level</span>
          </label>
          <label className="filter-sidebar__checkbox">
            <input
              type="checkbox"
              checked={selectedExperience.includes("intermediate")}
              onChange={() => handleExperienceChange("intermediate")}
            />
            <span>Intermediate</span>
          </label>
          <label className="filter-sidebar__checkbox">
            <input
              type="checkbox"
              checked={selectedExperience.includes("expert")}
              onChange={() => handleExperienceChange("expert")}
            />
            <span>Expert</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="filter-sidebar__actions">
        <button
          className="filter-sidebar__button filter-sidebar__button--apply"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className="filter-sidebar__button filter-sidebar__button--clear"
          onClick={handleClearFilters}
        >
          Clear All
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
