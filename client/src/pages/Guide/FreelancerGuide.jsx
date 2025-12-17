/**
 * Freelancer Guide Page
 * 
 * Step-by-step guidance for freelancers on how to get started and succeed on ProLancer
 * Features alternating text-image layout sections
 */

import React from 'react';
import { 
  User, 
  Search, 
  DollarSign, 
  Star, 
  MessageCircle, 
  CheckCircle,
  ArrowRight,
  Briefcase,
  Award,
  TrendingUp
} from 'lucide-react';
import './Guide.css';

const FreelancerGuide = () => {
  return (
    <div className="guide-page">
      {/* Hero Section */}
      <section className="guide-hero">
        <div className="container">
          <h1>Your Journey to Freelance Success</h1>
          <p>Follow these simple steps to build a thriving freelance career on ProLancer</p>
          <div className="hero-steps">
            <div className="step-indicator">
              <span className="step-number">1</span>
              <span>Create Profile</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-indicator">
              <span className="step-number">2</span>
              <span>Find Jobs</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-indicator">
              <span className="step-number">3</span>
              <span>Get Hired</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Create Your Profile - Text Left, Image Right */}
      <section className="guide-section">
        <div className="container">
          <div className="section-content text-left">
            <div className="text-content">
              <div className="step-badge">
                <span className="step-number">1</span>
                <span>Step One</span>
              </div>
              <h2>Create Your Professional Profile</h2>
              <p>
                Your profile is your digital storefront. It's the first thing clients see when they 
                discover your services. A well-crafted profile showcases your skills, experience, 
                and personality, helping you stand out from the competition.
              </p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Add a professional profile photo</li>
                <li><CheckCircle size={16} /> Write a compelling headline and overview</li>
                <li><CheckCircle size={16} /> Showcase your best work in your portfolio</li>
                <li><CheckCircle size={16} /> List your skills and certifications</li>
                <li><CheckCircle size={16} /> Set your hourly rate and availability</li>
              </ul>
              <div className="tips-box">
                <h4>💡 Pro Tip</h4>
                <p>Profiles with photos get 40% more views than those without!</p>
              </div>
            </div>
            <div className="image-content">
              <div className="placeholder-image profile-image">
                <User size={64} />
                <span>Professional Profile</span>
                <div className="image-details">
                  <div className="detail-item">
                    <Star size={16} />
                    <span>5.0 Rating</span>
                  </div>
                  <div className="detail-item">
                    <Award size={16} />
                    <span>Top Rated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Browse & Apply to Jobs - Text Right, Image Left */}
      <section className="guide-section alternate">
        <div className="container">
          <div className="section-content text-right">
            <div className="image-content">
              <div className="placeholder-image jobs-image">
                <Search size={64} />
                <span>Find Perfect Jobs</span>
                <div className="image-details">
                  <div className="detail-item">
                    <Briefcase size={16} />
                    <span>1000+ Jobs Daily</span>
                  </div>
                  <div className="detail-item">
                    <TrendingUp size={16} />
                    <span>Growing Market</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-content">
              <div className="step-badge">
                <span className="step-number">2</span>
                <span>Step Two</span>
              </div>
              <h2>Browse & Apply to Jobs</h2>
              <p>
                With thousands of projects posted daily, finding the right opportunities is key to 
                your success. Learn how to search effectively, identify quality clients, and write 
                proposals that win projects.
              </p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Use advanced filters to find relevant jobs</li>
                <li><CheckCircle size={16} /> Research client history and reviews</li>
                <li><CheckCircle size={16} /> Write personalized, compelling proposals</li>
                <li><CheckCircle size={16} /> Set competitive but fair pricing</li>
                <li><CheckCircle size={16} /> Follow up professionally on applications</li>
              </ul>
              <div className="tips-box">
                <h4>💡 Pro Tip</h4>
                <p>Personalized proposals have 3x higher success rates than generic ones!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Get Hired & Work - Text Left, Image Right */}
      <section className="guide-section">
        <div className="container">
          <div className="section-content text-left">
            <div className="text-content">
              <div className="step-badge">
                <span className="step-number">3</span>
                <span>Step Three</span>
              </div>
              <h2>Get Hired & Deliver Excellence</h2>
              <p>
                Congratulations! You've landed your first project. Now it's time to exceed 
                expectations, build lasting relationships, and establish yourself as a top-rated 
                freelancer on the platform.
              </p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Communicate clearly and regularly with clients</li>
                <li><CheckCircle size={16} /> Deliver high-quality work on time</li>
                <li><CheckCircle size={16} /> Use project management tools effectively</li>
                <li><CheckCircle size={16} /> Request feedback and testimonials</li>
                <li><CheckCircle size={16} /> Build long-term client relationships</li>
              </ul>
              <div className="tips-box">
                <h4>💡 Pro Tip</h4>
                <p>Happy clients are 5x more likely to hire you again for future projects!</p>
              </div>
            </div>
            <div className="image-content">
              <div className="placeholder-image success-image">
                <DollarSign size={64} />
                <span>Earn & Grow</span>
                <div className="image-details">
                  <div className="detail-item">
                    <Star size={16} />
                    <span>Top Earnings</span>
                  </div>
                  <div className="detail-item">
                    <MessageCircle size={16} />
                    <span>Great Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="success-metrics">
        <div className="container">
          <h2>Join Thousands of Successful Freelancers</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-number">50K+</div>
              <div className="metric-label">Active Freelancers</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">$2M+</div>
              <div className="metric-label">Paid to Freelancers</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">95%</div>
              <div className="metric-label">Client Satisfaction</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">24/7</div>
              <div className="metric-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="guide-cta">
        <div className="container">
          <h2>Ready to Start Your Freelance Journey?</h2>
          <p>Join ProLancer today and turn your skills into a thriving business</p>
          <button className="cta-button large">
            Get Started Now <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default FreelancerGuide;