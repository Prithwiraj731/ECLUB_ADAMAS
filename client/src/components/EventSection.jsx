import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function EventSection() {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await apiFetch('/api/events');
        const data = await res.json();
        if (data.success && data.events && data.events.length > 0) {
          setEvents(data.events);
          const featured = data.events.find((e) => e.is_featured);
          if (featured) {
            setFeaturedEvent(featured);
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic events, showing Rakhi Startup Bazaar:', err);
      }
    }
    loadEvents();
  }, []);

  const defaultFeatured = {
    title: 'RAKHI STARTUP BAZAAR',
    badge: 'CAMPUS STARTUP MARKETPLACE',
    date: 'Upcoming Campus Exhibition',
    location: 'Adamas University Campus',
    fee: '₹299/- per stall',
    description:
      'The Entrepreneurship Club is organising the Rakhi Startup Bazaar — a high-energy platform for students and creators to showcase, validate, and sell handcrafted products & innovative goods while experiencing entrepreneurship beyond the classroom!',
    image_url: '/assets/rakhi.jpeg',
    registration_link: 'https://forms.gle/W9u2ewPSW5u2tS7t9',
  };

  // If backend returns the legacy summit or empty, ensure Rakhi Startup Bazaar is featured
  let displayEvent = defaultFeatured;
  if (featuredEvent && featuredEvent.title && !featuredEvent.title.includes('Global Entrepreneurship Summit')) {
    displayEvent = { ...defaultFeatured, ...featuredEvent };
  }
  const regLink = displayEvent.registration_link || defaultFeatured.registration_link;

  return (
    <section id="events" className="featured-event section">
      <div className="container">
        <div className="section-header">
          <div className="section-pre-tag">
            <i className="fas fa-calendar-star"></i>
            <span>FLAGSHIP HAPPENING</span>
          </div>
          <h2>Featured Event</h2>
          <p>Live campus marketplaces and flagship venture gatherings</p>
        </div>

        <div className="featured-content">
          {/* Main Hero Event Card */}
          <div className="event-card">
            <div className="event-poster">
              <img
                src={displayEvent.image_url || '/assets/rakhi.jpeg'}
                alt={displayEvent.title}
                onError={(e) => {
                  e.target.src = '/assets/rakhi.jpeg';
                }}
              />
              <span className="event-badge-tag">
                <i className="fas fa-store"></i> {displayEvent.badge || 'CAMPUS MARKETPLACE'}
              </span>
            </div>

            <div className="event-details">
              <div className="event-title-row">
                <h3>{displayEvent.title}</h3>
                <span className="stall-price-chip" style={{ background: 'rgba(139, 13, 26, 0.12)', color: '#8B0D1A', border: '1px solid rgba(139, 13, 26, 0.3)', fontWeight: '700' }}>
                  <i className="fas fa-lock" style={{ marginRight: '5px' }}></i> Registration Closed
                </span>
              </div>

              <div className="event-meta">
                <span className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  {displayEvent.location || 'Adamas University Campus'}
                </span>
                <span className="meta-item">
                  <i className="fas fa-qrcode"></i> Feedback QR Provided
                </span>
                <span className="meta-item">
                  <i className="fas fa-users-class"></i> Open to All Faculties
                </span>
              </div>

              <p className="event-description">{displayEvent.description}</p>

              {/* Rules & Highlights Pills */}
              <div className="event-highlights-list">
                <div className="event-highlight-pill">
                  <i className="fas fa-check-circle"></i>
                  <span>Segment-wise Participation &amp; Strict Curation</span>
                </div>
                <div className="event-highlight-pill">
                  <i className="fas fa-star"></i>
                  <span>Mandatory Customer Feedback QR (1–5★ Scale)</span>
                </div>
                <div className="event-highlight-pill">
                  <i className="fas fa-bolt"></i>
                  <span>Power Connection &amp; Extra Chairs on Request</span>
                </div>
              </div>

              <div className="event-cta-group">
                <Link to="/rakhi-stalls" className="btn btn-primary event-reg-btn">
                  <i className="fas fa-store"></i> View 31 Stalls Directory →
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ opacity: 0.8, cursor: 'not-allowed', background: '#ece7df', color: '#666', borderColor: '#dcd5ca' }}
                  disabled
                >
                  <i className="fas fa-lock"></i> Registration Closed
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Structured Information & Stallholder Perks */}
          <div className="side-cards">
            <div className="side-cards-header">
              <span className="side-header-tag">
                <i className="fas fa-award"></i> STALL BENEFITS &amp; GUIDELINES
              </span>
            </div>

            {/* Benefit Card 1 */}
            <div className="mini-card-enhanced">
              <div className="mini-card-head">
                <div className="mini-card-icon">
                  <i className="fas fa-store-alt"></i>
                </div>
                <div className="mini-card-title-group">
                  <h4>Direct Campus Commerce</h4>
                  <span className="mini-card-badge">Keep 100% Profits</span>
                </div>
              </div>
              <p>
                Sell handcrafted rakhi creations, gifts, accessories, or startup goods directly to thousands of students and faculty members.
              </p>
              <div className="mini-card-perks">
                <span><i className="fas fa-check"></i> Live Footfall</span>
                <span><i className="fas fa-check"></i> Price Validation</span>
              </div>
            </div>

            {/* Benefit Card 2 */}
            <div className="mini-card-enhanced">
              <div className="mini-card-head">
                <div className="mini-card-icon">
                  <i className="fas fa-qrcode"></i>
                </div>
                <div className="mini-card-title-group">
                  <h4>Official Feedback QR</h4>
                  <span className="mini-card-badge">Rating System</span>
                </div>
              </div>
              <p>
                Every stall is provided with an official E-Club QR code to capture 1–5 star customer ratings, feedback, and post-event analytics.
              </p>
              <div className="mini-card-perks">
                <span><i className="fas fa-check"></i> 1–5★ Ratings</span>
                <span><i className="fas fa-check"></i> Verified Reviews</span>
              </div>
            </div>

            {/* Benefit Card 3 */}
            <div className="mini-card-enhanced">
              <div className="mini-card-head">
                <div className="mini-card-icon">
                  <i className="fas fa-hands-helping"></i>
                </div>
                <div className="mini-card-title-group">
                  <h4>Logistics &amp; Amenities</h4>
                  <span className="mini-card-badge">On-Ground Care</span>
                </div>
              </div>
              <p>
                Organizing committee provides allocated spaces with table setup. Extra chairs and power outlets are available upon request.
              </p>
              <div className="mini-card-perks">
                <span><i className="fas fa-check"></i> Power on Request</span>
                <span><i className="fas fa-check"></i> Clean Zones</span>
              </div>
            </div>

            {/* Quick Registration Steps Bar */}
            <div className="mini-steps-card">
              <div className="steps-title">
                <i className="fas fa-clipboard-list-check"></i> How to Participate:
              </div>
              <div className="steps-flow">
                <span className="step-badge">1. Fill Form</span>
                <span className="step-arrow">→</span>
                <span className="step-badge">2. Pay ₹299</span>
                <span className="step-arrow">→</span>
                <span className="step-badge">3. Get QR &amp; Stall</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
