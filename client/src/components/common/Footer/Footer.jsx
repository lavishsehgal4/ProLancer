/**
 * Footer Component
 * 
 * A comprehensive footer for the ProLancer platform with links, social media, and company information
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ExternalLink
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <h3>ProLancer</h3>
              <p>Connecting talented freelancers with amazing projects worldwide.</p>
            </div>
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>For Freelancers</h4>
            <ul className="footer-links">
              <li><Link to="/find-work">Find Work</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/earnings">Earnings</Link></li>
            </ul>
          </div>

          {/* Client Links */}
          <div className="footer-section">
            <h4>For Clients</h4>
            <ul className="footer-links">
              <li><Link to="/hire-freelancer">Hire Freelancers</Link></li>
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/browse-services">Browse Services</Link></li>
              <li><Link to="/client-dashboard">Client Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/safety">Trust & Safety</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@prolancer.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
              <Link to="/accessibility">Accessibility</Link>
            </div>
            <div className="footer-copyright">
              <p>
                © {currentYear} ProLancer. Made with <Heart size={14} className="heart-icon" /> for freelancers worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;