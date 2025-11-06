import { useState, useEffect } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  UserPlus,
  Briefcase,
  DollarSign,
} from "lucide-react";
import StepCard from "../components/common/StepCard/StepCard";
import "./Home.css";

const Home = () => {
  // State to track which toggle is active (true = "For hiring", false = "For finding work")
  const [isHiringActive, setIsHiringActive] = useState(true);

  // State for fade animation
  const [fadeIn, setFadeIn] = useState(true);

  // Handle toggle button click with fade animation
  const handleToggle = (hiringMode) => {
    if (isHiringActive !== hiringMode) {
      setFadeIn(false); // Start fade out

      // Wait for fade out, then switch content and fade in
      setTimeout(() => {
        setIsHiringActive(hiringMode);
        setFadeIn(true);
      }, 300); // Match transition duration
    }
  };

  // Steps data for "For Hiring" (Clients)
  const hiringSteps = [
    {
      icon: FileText,
      number: 1,
      title: "Post Your Job",
      description: "Create a detailed job listing with requirements and budget",
    },
    {
      icon: Users,
      number: 2,
      title: "Review Proposals",
      description: "Browse applications from qualified freelancers",
    },
    {
      icon: CheckCircle,
      number: 3,
      title: "Hire & Pay Securely",
      description: "Choose the best fit and collaborate with confidence",
    },
  ];

  // Steps data for "For Finding Work" (Freelancers)
  const workSteps = [
    {
      icon: UserPlus,
      number: 1,
      title: "Create Your Profile",
      description: "Showcase your skills, portfolio, and experience",
    },
    {
      icon: Briefcase,
      number: 2,
      title: "Browse & Apply to Jobs",
      description: "Find projects matching your expertise and submit proposals",
    },
    {
      icon: DollarSign,
      number: 3,
      title: "Get Hired & Work",
      description: "Land your next gig and earn on your terms",
    },
  ];

  // Choose which steps to display based on active toggle
  const currentSteps = isHiringActive ? hiringSteps : workSteps;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Hero content will be added later */}
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="how-it-works__container">
          {/* Section Header */}
          <div className="how-it-works__header">
            <h2 className="how-it-works__heading">
              Get started in three simple steps
            </h2>

            {/* Toggle Buttons - Right aligned */}
            <div className="how-it-works__toggle">
              <button
                className={`toggle-button ${
                  isHiringActive ? "toggle-button--active" : ""
                }`}
                onClick={() => handleToggle(true)}
              >
                For hiring
              </button>
              <button
                className={`toggle-button ${
                  !isHiringActive ? "toggle-button--active" : ""
                }`}
                onClick={() => handleToggle(false)}
              >
                For finding work
              </button>
            </div>
          </div>

          {/* Steps Grid - Fades in/out when switching */}
          <div
            className={`how-it-works__steps ${fadeIn ? "fade-in" : "fade-out"}`}
          >
            {currentSteps.map((step) => (
              <StepCard
                key={step.number}
                icon={step.icon}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
