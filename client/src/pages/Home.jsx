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
import heroImage from "../assets/images/Gemini_Generated_Image_k66m3pk66m3pk66m.png";
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
      link: "/guide/client",
    },
    {
      icon: Users,
      number: 2,
      title: "Review Proposals",
      description: "Browse applications from qualified freelancers",
      link: "/guide/client",
    },
    {
      icon: CheckCircle,
      number: 3,
      title: "Hire & Pay Securely",
      description: "Choose the best fit and collaborate with confidence",
      link: "/guide/client",
    },
  ];

  // Steps data for "For Finding Work" (Freelancers)
  const workSteps = [
    {
      icon: UserPlus,
      number: 1,
      title: "Create Your Profile",
      description: "Showcase your skills, portfolio, and experience",
      link: "/guide/freelancer",
    },
    {
      icon: Briefcase,
      number: 2,
      title: "Browse & Apply to Jobs",
      description: "Find projects matching your expertise and submit proposals",
      link: "/guide/freelancer",
    },
    {
      icon: DollarSign,
      number: 3,
      title: "Get Hired & Work",
      description: "Land your next gig and earn on your terms",
      link: "/guide/freelancer",
    },
  ];

  // Choose which steps to display based on active toggle
  const currentSteps = isHiringActive ? hiringSteps : workSteps;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-section__container">
          <div className="hero-section__content">
            <div className="hero-section__text">
              <h1 className="hero-section__title">
                Hire Verified Freelancers.<br />
                Get Work Done Faster.
              </h1>
              <p className="hero-section__description">
                Post a job, review proposals, and hire with confidence — all in one place.
              </p>
              <button className="hero-section__cta-button">
                Get Started
              </button>
            </div>
          </div>
        </div>
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
                link={step.link}
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

      {/* Client Reviews Section */}
      <section className="client-reviews-section">
        <div className="client-reviews-section__container">
          {/* Section Header */}
          <div className="client-reviews-section__header">
            <h2 className="client-reviews-section__heading">Real results from clients</h2>
          </div>

          {/* Reviews Grid */}
          <div className="client-reviews-section__grid">
            {/* Review 1 - AI Services */}
            <div className="review-card">
              <div className="review-card__category">
                <span className="review-card__category-icon">🤖</span>
                <span className="review-card__category-text">AI SERVICES</span>
              </div>
              <div className="review-card__content">
                <p className="review-card__text">
                  "Rick is a fantastic AI/ML engineer with specialization in LLMs, delivering end-to-end solutions. He understood our requirements and started the work. Ultimately, he delivered a working solution. Looking forward to working with him again."
                </p>
                <div className="review-card__rating">
                  <span className="review-card__stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="review-card__footer">
                <div className="review-card__client">
                  <div className="review-card__avatar">
                    <div className="review-card__avatar-placeholder"></div>
                  </div>
                  <div className="review-card__client-info">
                    <span className="review-card__client-name">Work done by Rajesh K.</span>
                    <span className="review-card__client-title">LARAVEL expert system development</span>
                    <span className="review-card__date">Mar 18, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 2 - Got a IT */}
            <div className="review-card">
              <div className="review-card__category">
                <span className="review-card__category-icon">💻</span>
                <span className="review-card__category-text">GOT A IT</span>
              </div>
              <div className="review-card__content">
                <p className="review-card__text">
                  "Sania came in well-backed up in technical knowledge from our demanding developer. She was able to understand the requirements and knowledge and experience are exceptional."
                </p>
                <div className="review-card__rating">
                  <span className="review-card__stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="review-card__footer">
                <div className="review-card__client">
                  <div className="review-card__avatar">
                    <div className="review-card__avatar-placeholder"></div>
                  </div>
                  <div className="review-card__client-info">
                    <span className="review-card__client-name">Work done by Sania R.</span>
                    <span className="review-card__client-title">Full Stack Developer</span>
                    <span className="review-card__date">Apr 2, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 3 - Design & Creative */}
            <div className="review-card">
              <div className="review-card__category">
                <span className="review-card__category-icon">🎨</span>
                <span className="review-card__category-text">DESIGN & CREATIVE</span>
              </div>
              <div className="review-card__content">
                <p className="review-card__text">
                  "Ezreal did an amazing job setting my website—fast turnaround, great attention to detail, and excellent communication. The site looks awesome and delivers high-quality work. Extremely highly recommend him!"
                </p>
                <div className="review-card__rating">
                  <span className="review-card__stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="review-card__footer">
                <div className="review-card__client">
                  <div className="review-card__avatar">
                    <div className="review-card__avatar-placeholder"></div>
                  </div>
                  <div className="review-card__client-info">
                    <span className="review-card__client-name">Work done by Ezreal S.</span>
                    <span className="review-card__client-title">Shopify and Woo commerce expert</span>
                    <span className="review-card__date">Sep 14, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 4 - Sales & Marketing */}
            <div className="review-card">
              <div className="review-card__category">
                <span className="review-card__category-icon">📊</span>
                <span className="review-card__category-text">SALES & MARKETING</span>
              </div>
              <div className="review-card__content">
                <p className="review-card__text">
                  "We hired working with Javier and his team. They are very professional and know what they are doing. Very responsive and actually care about the project. Their communication skills are very methodical and thoughtful about how to approach each project. They are very knowledgeable and creative. We will definitely work with them again."
                </p>
                <div className="review-card__rating">
                  <span className="review-card__stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="review-card__footer">
                <div className="review-card__client">
                  <div className="review-card__avatar">
                    <div className="review-card__avatar-placeholder"></div>
                  </div>
                  <div className="review-card__client-info">
                    <span className="review-card__client-name">Work done by Javier J.</span>
                    <span className="review-card__client-title">Social media expert and marketing</span>
                    <span className="review-card__date">Nov 7, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 5 - Writing & Translation */}
            <div className="review-card">
              <div className="review-card__category">
                <span className="review-card__category-icon">✍️</span>
                <span className="review-card__category-text">WRITING & TRANSLATION</span>
              </div>
              <div className="review-card__content">
                <p className="review-card__text">
                  "Michael is very detailed and highly professional. Understood the assignment, followed instructions, and was also able to work in flexible timelines. He was able to come up with something outside the box, but still on brand. Would definitely hire him again!"
                </p>
                <div className="review-card__rating">
                  <span className="review-card__stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="review-card__footer">
                <div className="review-card__client">
                  <div className="review-card__avatar">
                    <div className="review-card__avatar-placeholder"></div>
                  </div>
                  <div className="review-card__client-info">
                    <span className="review-card__client-name">Work done by Michael L.</span>
                    <span className="review-card__client-title">Content writer and business brand expert</span>
                    <span className="review-card__date">Jan 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 6 - Admin & Customer Support */}
            <div className="review-card">
              <div className="review-card__category">
                <span className="review-card__category-icon">🎧</span>
                <span className="review-card__category-text">ADMIN & CUSTOMER SUPPORT</span>
              </div>
              <div className="review-card__content">
                <p className="review-card__text">
                  "Ahmed was a great asset to our team. He brought a fresh eye to inefficiencies, applied process rigor, and expertly configured our CRM. He was professional, detail-oriented, and moving forward. His insights and structured approach have had a lasting positive workflow."
                </p>
                <div className="review-card__rating">
                  <span className="review-card__stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="review-card__footer">
                <div className="review-card__client">
                  <div className="review-card__avatar">
                    <div className="review-card__avatar-placeholder"></div>
                  </div>
                  <div className="review-card__client-info">
                    <span className="review-card__client-name">Work done by Ahmed S.</span>
                    <span className="review-card__client-title">Technical Project Manager</span>
                    <span className="review-card__date">Feb 8, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
