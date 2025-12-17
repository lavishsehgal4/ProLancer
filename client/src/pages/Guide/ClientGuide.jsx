/**
 * Client Guide Page
 * 
 * Step-by-step guidance for clients on how to hire freelancers and manage projects
 * Features alternating text-image layout sections
 */

import React from 'react';
import { 
  FileText, 
  Users, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Clock,
  Award,
  MessageCircle,
  DollarSign,
  Star
} from 'lucide-react';
import './Guide.css';

const ClientGuide = () => {
  return (
    <div className="guide-page">
      {/* Hero Section */}
      <section className="guide-hero">
        <div className="container">
          <h1>Hire Top Talent in 3 Simple Steps</h1>
          <p>Find, hire, and work with the best freelancers to bring your projects to life</p>
          <div className="hero-steps">
            <div className="step-indicator">
              <span className="step-number">1</span>
              <span>Post Job</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-indicator">
              <span className="step-number">2</span>
              <span>Review Proposals</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-indicator">
              <span className="step-number">3</span>
              <span>Hire & Pay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Post Your Job - Text Left, Image Right */}
      <section className="guide-section">
        <div className="container">
          <div className="section-content text-left">
            <div className="text-content">
              <div className="step-badge">
                <span className="step-number">1</span>
                <span>Step One</span>
              </div>
              <h2>Post Your Job with Clear Requirements</h2>
              <p>
                A well-written job post attracts the right freelancers and sets clear expectations 
                from the start. The more detailed and specific you are, the better quality proposals 
                you'll receive from qualified professionals.
              </p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Write a clear, descriptive job title</li>
                <li><CheckCircle size={16} /> Define project scope and deliverables</li>
                <li><CheckCircle size={16} /> Set realistic budget and timeline</li>
                <li><CheckCircle size={16} /> Specify required skills and experience</li>
                <li><CheckCircle size={16} /> Add relevant files and examples</li>
              </ul>
              <div className="tips-box">
                <h4>💡 Pro Tip</h4>
                <p>Detailed job posts receive 50% more qualified proposals!</p>
              </div>
            </div>
            <div className="image-content">
              <div className="placeholder-image job-post-image">
                <FileText size={64} />
                <span>Professional Job Post</span>
                <div className="image-details">
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>Quick Setup</span>
                  </div>
                  <div className="detail-item">
                    <Award size={16} />
                    <span>Quality Results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Review Proposals - Text Right, Image Left */}
      <section className="guide-section alternate">
        <div className="container">
          <div className="section-content text-right">
            <div className="image-content">
              <div className="placeholder-image proposals-image">
                <Users size={64} />
                <span>Review Top Talent</span>
                <div className="image-details">
                  <div className="detail-item">
                    <Star size={16} />
                    <span>Rated Freelancers</span>
                  </div>
                  <div className="detail-item">
                    <MessageCircle size={16} />
                    <span>Direct Communication</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-content">
              <div className="step-badge">
                <span className="step-number">2</span>
                <span>Step Two</span>
              </div>
              <h2>Review Proposals from Qualified Freelancers</h2>
              <p>
                Once your job is posted, you'll start receiving proposals from interested freelancers. 
                Take time to review their profiles, portfolios, and proposals to find the perfect 
                match for your project.
              </p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Review freelancer profiles and ratings</li>
                <li><CheckCircle size={16} /> Examine portfolio samples and past work</li>
                <li><CheckCircle size={16} /> Read client testimonials and reviews</li>
                <li><CheckCircle size={16} /> Compare proposals and pricing</li>
                <li><CheckCircle size={16} /> Conduct interviews with top candidates</li>
              </ul>
              <div className="tips-box">
                <h4>💡 Pro Tip</h4>
                <p>Look for freelancers with relevant experience in your industry!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Hire & Pay Securely - Text Left, Image Right */}
      <section className="guide-section">
        <div className="container">
          <div className="section-content text-left">
            <div className="text-content">
              <div className="step-badge">
                <span className="step-number">3</span>
                <span>Step Three</span>
              </div>
              <h2>Hire & Pay Securely with Confidence</h2>
              <p>
                ProLancer's secure payment system protects both you and your freelancer. Our escrow 
                service ensures that funds are only released when you're completely satisfied with 
                the delivered work.
              </p>
              <ul className="feature-list">
                <li><CheckCircle size={16} /> Secure escrow payment protection</li>
                <li><CheckCircle size={16} /> Milestone-based payment system</li>
                <li><CheckCircle size={16} /> Real-time project tracking and updates</li>
                <li><CheckCircle size={16} /> Direct messaging and file sharing</li>
                <li><CheckCircle size={16} /> Dispute resolution support if needed</li>
              </ul>
              <div className="tips-box">
                <h4>💡 Pro Tip</h4>
                <p>Set clear milestones to track progress and ensure quality delivery!</p>
              </div>
            </div>
            <div className="image-content">
              <div className="placeholder-image secure-payment-image">
                <Shield size={64} />
                <span>Secure Payments</span>
                <div className="image-details">
                  <div className="detail-item">
                    <DollarSign size={16} />
                    <span>Escrow Protected</span>
                  </div>
                  <div className="detail-item">
                    <CheckCircle size={16} />
                    <span>100% Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ProLancer Section */}
      <section className="why-choose">
        <div className="container">
          <h2>Why 100,000+ Businesses Choose ProLancer</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={32} />
              </div>
              <h3>Vetted Talent</h3>
              <p>All freelancers go through our rigorous screening process to ensure quality</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Shield size={32} />
              </div>
              <h3>Secure Payments</h3>
              <p>Your money is protected with our escrow system until you're satisfied</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <Clock size={32} />
              </div>
              <h3>Fast Delivery</h3>
              <p>Get your projects completed quickly with our efficient matching system</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <MessageCircle size={32} />
              </div>
              <h3>24/7 Support</h3>
              <p>Our dedicated support team is always here to help you succeed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-stories">
        <div className="container">
          <h2>Success Stories from Our Clients</h2>
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-content">
                <p>"ProLancer helped us find the perfect developer for our mobile app. The quality of work exceeded our expectations!"</p>
              </div>
              <div className="story-author">
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>CEO, TechStart Inc.</span>
                </div>
                <div className="story-rating">
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                </div>
              </div>
            </div>
            <div className="story-card">
              <div className="story-content">
                <p>"The design team we hired delivered stunning visuals that transformed our brand. Highly recommended!"</p>
              </div>
              <div className="story-author">
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <span>Marketing Director, GrowthCo</span>
                </div>
                <div className="story-rating">
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                  <Star size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="guide-cta">
        <div className="container">
          <h2>Ready to Hire Top Talent?</h2>
          <p>Post your first job today and connect with skilled freelancers worldwide</p>
          <button className="cta-button large">
            Post a Job Now <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ClientGuide;