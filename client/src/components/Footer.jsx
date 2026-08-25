import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/">
              <img src="/assets/logo.png" alt="E-Club Logo" />
            </Link>
            <p>
              Empowering the next generation of visionary founders, changemakers, and innovators at Adamas University.
            </p>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/adamas-entrepreneurship-club/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://www.instagram.com/eclubadamas?igsi=MW1rcmJ4ZHIzM3JwYg==" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a> */}
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About E-Club</Link></li>
              <li><Link to="/rakhi-stalls">Rakhi Bazaar Stalls</Link></li>
              <li><a href="/#events">Upcoming Events</a></li>
              <li><a href="/#initiatives">Flagship Initiatives</a></li>
              <li><Link to="/contact">Get in Touch</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Campus Hub</h4>
            <ul>
              <li><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> Adamas Knowledge City, Barasat</li>
              <li><i className="fas fa-envelope" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> eclub@adamasuniversity.ac.in</li>
              <li><i className="fas fa-phone-alt" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> +91 70039 05850</li>
              <li><i className="fas fa-clock" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> Mon - Fri: 9:30 AM - 5:30 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Adamas University Entrepreneurship Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
