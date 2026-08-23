import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import NoticeBanner from '../components/NoticeBanner';
import EventSection from '../components/EventSection';
import InitiativeSection from '../components/InitiativeCard';
import ContactSection from '../components/ContactSection';

export default function Home() {
  return (
    <div>
      {/* Modern Hero Section */}
      <HeroSection />

      {/* Live Notice Banner */}
      <NoticeBanner />

      {/* About Section */}
      <section id="about" className="about section">
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <img src="/assets/hero/hero2.png" alt="Adamas Entrepreneurship Club Team" />
            </div>

            <div className="about-text">
              <h2>About the Entrepreneurship Club</h2>
              <p>
                The Adamas University Entrepreneurship Club (E-Club) is a student-led innovation ecosystem committed to
                catalyzing startup culture, venture building, and business leadership across faculties.
              </p>
              <p>
                From ideation to launch, we connect aspiring student founders with expert faculty mentors, angel
                investors, seed grants, and practical hands-on venture-building bootcamps.
              </p>

              <div className="about-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <div className="highlight-text">
                    <h4>Ideation & MVPs</h4>
                    <p>Structured validation sprints to turn concepts into viable prototypes.</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="highlight-text">
                    <h4>Founder Community</h4>
                    <p>A thriving network of ambitious creators, coders, and business minds.</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-chalkboard-teacher"></i>
                  </div>
                  <div className="highlight-text">
                    <h4>CXO Masterclasses</h4>
                    <p>Direct exposure to venture capitalists and startup leaders.</p>
                  </div>
                </div>

                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div className="highlight-text">
                    <h4>Pitch Competitions</h4>
                    <p>Win seed funding and represent Adamas at national conclaves.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <Link to="/about" className="btn btn-secondary">
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      <EventSection />

      {/* Initiatives Section */}
      <InitiativeSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}
