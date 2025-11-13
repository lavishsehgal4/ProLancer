import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import "./AuthLayout.css";

/**
 * AuthLayout Component
 * Clean layout for authentication pages (no navbar/footer)
 * Just logo, content, and simple footer
 */

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Logo at top */}
      <div className="auth-layout__header">
        <Link to="/" className="auth-layout__logo">
          Prolancer
        </Link>
      </div>

      {/* Auth page content (SignUpChoice, SignUpForm, Login) */}
      <main className="auth-layout__content">
        <Outlet />
      </main>

      {/* Simple footer */}
      <footer className="auth-layout__footer">
        <p>&copy; 2024 Prolancer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
