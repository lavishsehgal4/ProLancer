import { useState, useEffect } from "react";
import "./FilterSidebar.css";

/**
 * FilterSidebar Component
 * Left sidebar with filters for budget, rating, and experience
 * 
 * @param {Object} filters - Current filter values from parent
 * @param {Function} onFilterChange - Callback to update filters in parent
 */

const FilterSidebar = ({ filters = {}, onFilterChange }) => {
  // Local filter states
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  // Sync local state with props
  useEffect(() => {
    // Parse budget from minRate and maxRate
    const { minRate, maxRate, rating, experience } = filters;
    
    if (minRate && maxRate) {
      if (minRate == 0 && maxRate == 25) setSelectedBudget("0-25");
      else if (minRate == 25 && maxRate == 50) setSelectedBudget("25-50");
      else if (minRate == 50 && maxRate == 100) setSelectedBudget("50-100");
      else if (minRate == 100) setSelectedBudget("100+");
      else setSelectedBudget("");
    } else {
      setSelectedBudget("");
    }

    setSelectedRating(rating || "");
    setSelectedExperience(experience || "");
  }, [filters]);

  // Handle budget change
  const handleBudgetChange = (budgetRange) => {
    setSelectedBudget(budgetRange);
    
    let minRate = "";
    let maxRate = "";
    
    switch (budgetRange) {
      case "0-25":
        minRate = "0";
        maxRate = "25";
        break;
      case "25-50":
        minRate = "25";
        maxRate = "50";
        break;
      case "50-100":
        minRate = "50";
        maxRate = "100";
        break;
      case "100+":
        minRate = "100";
        maxRate = "";
        break;
      default:
        minRate = "";
        maxRate = "";
    }

    if (onFilterChange) {
      onFilterChange({ minRate, maxRate });
    }
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    if (onFilterChange) {
      onFilterChange({ rating });
    }
  };

  // Handle experience change
  const handleExperienceChange = (experience) => {
    setSelectedExperience(experience);
    if (onFilterChange) {
      onFilterChange({ experience });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedBudget("");
    setSelectedRating("");
    setSelectedExperience("");
    
    if (onFilterChange) {
      onFilterChange({
        minRate: "",
        maxRate: "",
        rating: "",
        experience: ""
      });
    }
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
              onChange={(e) => handleBudgetChange(e.target.value)}
            />
            <span>$0 - $25/hr</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="budget"
              value="25-50"
              checked={selectedBudget === "25-50"}
              onChange={(e) => handleBudgetChange(e.target.value)}
            />
            <span>$25 - $50/hr</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="budget"
              value="50-100"
              checked={selectedBudget === "50-100"}
              onChange={(e) => handleBudgetChange(e.target.value)}
            />
            <span>$50 - $100/hr</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="budget"
              value="100+"
              checked={selectedBudget === "100+"}
              onChange={(e) => handleBudgetChange(e.target.value)}
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
              onChange={(e) => handleRatingChange(e.target.value)}
            />
            <span>⭐⭐⭐⭐⭐ 5 stars</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="rating"
              value="4"
              checked={selectedRating === "4"}
              onChange={(e) => handleRatingChange(e.target.value)}
            />
            <span>⭐⭐⭐⭐ 4+ stars</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="rating"
              value="3"
              checked={selectedRating === "3"}
              onChange={(e) => handleRatingChange(e.target.value)}
            />
            <span>⭐⭐⭐ 3+ stars</span>
          </label>
        </div>
      </div>

      {/* Experience Filter */}
      <div className="filter-sidebar__section">
        <h4 className="filter-sidebar__section-title">Experience Level</h4>
        <div className="filter-sidebar__options">
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="experience"
              value="entry"
              checked={selectedExperience === "entry"}
              onChange={(e) => handleExperienceChange(e.target.value)}
            />
            <span>Entry Level</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="experience"
              value="intermediate"
              checked={selectedExperience === "intermediate"}
              onChange={(e) => handleExperienceChange(e.target.value)}
            />
            <span>Intermediate</span>
          </label>
          <label className="filter-sidebar__radio">
            <input
              type="radio"
              name="experience"
              value="expert"
              checked={selectedExperience === "expert"}
              onChange={(e) => handleExperienceChange(e.target.value)}
            />
            <span>Expert</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="filter-sidebar__actions">
        <button
          className="filter-sidebar__button filter-sidebar__button--clear"
          onClick={handleClearFilters}
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
