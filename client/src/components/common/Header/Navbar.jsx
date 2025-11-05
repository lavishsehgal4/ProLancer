import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  // State to control mobile menu open/close
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State to track which dropdown is currently open (for mobile click behavior)
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Toggle mobile hamburger menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle dropdown in mobile view (click to open/close)
  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null); // Close if already open
    } else {
      setActiveDropdown(dropdownName); // Open the clicked dropdown
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Hamburger Icon - Mobile Only */}
        <button
          className="navbar__hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
        </button>
        {/* LEFT SIDE - Logo */}
        <Link to="/" className="navbar__logo">
          <img
            src="../../assets/react.svg"
            alt="Prolancer Logo"
            className="navbar__logo-image"
          />
        </Link>

        {/* MIDDLE - Navigation Links (Desktop) */}
        <ul
          className={`navbar__menu ${
            isMobileMenuOpen ? "navbar__menu--active" : ""
          }`}
        >
          {/* Hire Freelancer Dropdown */}
          <li
            className="navbar__item navbar__item--dropdown"
            onClick={() => toggleDropdown("hire")} // Mobile: click to toggle
          >
            <span className="navbar__link">
              Hire Freelancer
              <span
                className={`navbar__arrow ${
                  activeDropdown === "hire" ? "navbar__arrow--rotate" : ""
                }`}
              >
                ▼
              </span>
            </span>
            {/* Dropdown Menu - Empty for now, add links later */}
            <ul className="navbar__dropdown-menu">
              {/* Add your dropdown items here later */}
              <li>
                <a href="#" className="navbar__dropdown-link">
                  Coming Soon...
                </a>
              </li>
            </ul>
          </li>

          {/* Find Work Dropdown */}
          <li
            className="navbar__item navbar__item--dropdown"
            onClick={() => toggleDropdown("work")} // Mobile: click to toggle
          >
            <span className="navbar__link">
              Find Work
              <span
                className={`navbar__arrow ${
                  activeDropdown === "work" ? "navbar__arrow--rotate" : ""
                }`}
              >
                ▼
              </span>
            </span>
            {/* Dropdown Menu - Empty for now, add links later */}
            <ul className="navbar__dropdown-menu">
              {/* Add your dropdown items here later */}
              <li>
                <a href="#" className="navbar__dropdown-link">
                  Coming Soon...
                </a>
              </li>
            </ul>
          </li>

          {/* What's New Dropdown */}
          <li
            className="navbar__item navbar__item--dropdown"
            onClick={() => toggleDropdown("news")} // Mobile: click to toggle
          >
            <span className="navbar__link">
              What's New
              <span
                className={`navbar__arrow ${
                  activeDropdown === "news" ? "navbar__arrow--rotate" : ""
                }`}
              >
                ▼
              </span>
            </span>
            {/* Dropdown Menu - Empty for now, add links later */}
            <ul className="navbar__dropdown-menu">
              {/* Add your dropdown items here later */}
              <li>
                <a href="#" className="navbar__dropdown-link">
                  Coming Soon...
                </a>
              </li>
            </ul>
          </li>

          {/* Pricing - Regular Link (No Dropdown) */}
          <li className="navbar__item">
            <Link to="/pricing" className="navbar__link">
              Pricing
            </Link>
          </li>

          {/* Sign Up Button - Only visible in mobile menu */}
          <li className="navbar__item navbar__item--mobile-only">
            <Link to="/signup">
              <button className="navbar__button navbar__button--signup">
                Sign Up
              </button>
            </Link>
          </li>
        </ul>

        {/* RIGHT SIDE - Action Buttons */}
        <div className="navbar__actions">
          {/* Login Button - Always visible */}
          <Link to="/login">
            <button className="navbar__button navbar__button--login">
              Login
            </button>
          </Link>

          {/* Sign Up Button - Hidden on mobile */}
          <Link to="/signup" className="navbar__signup-desktop">
            <button className="navbar__button navbar__button--signup">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
