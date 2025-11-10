import { useState, useEffect } from "react";

import {
  FileText,
  Users,
  CheckCircle,
  UserPlus,
  Briefcase,
  DollarSign,
  Code,
  Smartphone,
  Palette,
  Server,
  Cloud,
  Database,
  Wrench,
  TestTube,
} from "lucide-react";
import StepCard from "../components/common/StepCard/StepCard";
import CategoryCard from "../components/common/CategoryCard/CategoryCard";
import {
  ShieldCheck,
  Lock,
  Zap,
  MessageCircle,
  Target,
  Star,
} from "lucide-react";
import BenefitCard from "../components/common/BenefitCard/BenefitCard";
import "./Home.css";

const categories = [
  {
    icon: Code,
    title: "Web Development",
    link: "", // Keep empty for now, add later like "/categories/web-development"
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    link: "",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    link: "",
  },
  {
    icon: Server,
    title: "Backend Development",
    link: "",
  },
  {
    icon: Cloud,
    title: "DevOps & Cloud",
    link: "",
  },
  {
    icon: Database,
    title: "Database Management",
    link: "",
  },
  {
    icon: Wrench,
    title: "API Development",
    link: "",
  },
  {
    icon: TestTube,
    title: "Software Testing",
    link: "",
  },
];
const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Freelancers",
    description: "Vetted professionals you can trust",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Safe transactions with escrow protection",
  },
  {
    icon: Zap,
    title: "Fast Hiring",
    description: "Find the perfect match in minutes",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Always here to help you succeed",
  },
  {
    icon: Target,
    title: "Smart Matching",
    description: "AI-powered talent recommendations",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description: "Satisfaction or money-back",
  },
];
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
      {/* Categories/Services Section */}
      <section className="categories-section">
        <div className="categories-section__container">
          {/* Section Heading */}
          <h2 className="categories-section__heading">Explore Services</h2>

          {/* Categories Grid */}
          <div className="categories-section__grid">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>
      {/* ============================================
 ADD THIS SECTION IN YOUR RETURN STATEMENT
(AFTER CATEGORIES SECTION)
 ============================================ */}

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-section__container">
          {/* Section Header */}
          <div className="benefits-section__header">
            <h2 className="benefits-section__heading">Why Choose Prolancer</h2>
            <p className="benefits-section__subheading">
              Everything you need to succeed
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="benefits-section__grid">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
