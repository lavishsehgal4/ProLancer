import { Link } from "react-router-dom";
import { Briefcase, Users } from "lucide-react";
import RoleCard from "../../../components/common/RoleCard/RoleCard";
import "./SignUpChoice.css";

/**
 * SignUpChoice Page
 * User chooses to sign up as Client or Freelancer
 */

const SignUpChoice = () => {
  return (
    <div className="signup-choice">
      {/* Heading */}
      <h1 className="signup-choice__heading">Join Prolancer</h1>
      <p className="signup-choice__subheading">
        Choose your account type to get started
      </p>

      {/* Role Cards */}
      <div className="signup-choice__cards">
        <RoleCard
          icon={Briefcase}
          title="Client"
          description="Hire talented freelancers for your projects"
          link="/signup/client"
        />
        <RoleCard
          icon={Users}
          title="Freelancer"
          description="Find great work and build your career"
          link="/signup/freelancer"
        />
      </div>

      {/* Login Link */}
      <p className="signup-choice__login-link">
        Already have an account?{" "}
        <Link to="/login" className="signup-choice__link">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUpChoice;
