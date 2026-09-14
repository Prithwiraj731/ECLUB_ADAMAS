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
        console.warn('Could not load dynamic events, showing Start Up Launch Pad:', err);
      }
    }
    loadEvents();
  }, []);

  const defaultFeatured = {
    id: 'e0',
    title: 'INTER-SCHOOL START UP LAUNCH PAD',
    badge: 'INTER-SCHOOL COMPETITION',
    date: 'Wednesday, 16 September 2026 • 2:00 PM – 5:00 PM',
    location: 'AU International Lounge, Adamas University',
    fee: '1 Team per School (3–5 Students)',
    tagline: 'BUILD. COMPETE. ADAPT.',
    description:
      'The Entrepreneurship Club presents the Inter-School Start Up Launch Pad! Teams from all 10 schools of Adamas University compete across 3 intense rounds: Discover & Strategise (45m), Build & Execute (65m), and Crisis & Adapt (50m). “It’s not just about having the best idea, but making the best decisions.”',
    image_url: '/assets/startup-launchpad.jpg',
    registration_link: '/launchpad',
  };

  // If backend returns an event, merge it, otherwise fallback to defaultFeatured
  let displayEvent = defaultFeatured;
  if (featuredEvent && featuredEvent.title) {
    displayEvent = { ...defaultFeatured, ...featuredEvent };
  }

  const isLaunchPad = displayEvent.title.toUpperCase().includes('LAUNCH PAD') || displayEvent.title.toUpperCase().includes('INTER-SCHOOL');

  return (
    <section id="events" className="featured-event section">
      <div className="container">
        <div className="section-header">
          <div className="section-pre-tag">
            <i className="fas fa-calendar-star"></i>
            <span>UPCOMING FLAGSHIP EVENT</span>
          </div>
          <h2>Featured Event</h2>
          <p>Live campus marketplaces and flagship university-wide venture competitions</p>
        </div>

        <div className="featured-content">
          {/* Main Hero Event Card */}
          <div className="event-card">
            <div className="event-poster">
              <img
                src={displayEvent.image_url || '/assets/startup-launchpad.jpg'}
                alt={displayEvent.title}
                onError={(e) => {
                  e.target.src = '/assets/startup-launchpad.jpg';
                }}
              />
              <span className="event-badge-tag">
                <i className={isLaunchPad ? "fas fa-rocket" : "fas fa-store"}></i> {displayEvent.badge || 'FLAGSHIP EVENT'}
              </span>
            </div>

            <div className="event-details">
              <div className="event-title-row">
                <h3>{displayEvent.title}</h3>
                {isLaunchPad ? (
                  <span className="stall-price-chip" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: '800' }}>
                    <i className="fas fa-fire" style={{ marginRight: '5px' }}></i> Active Competition
                  </span>
                ) : (
                  <span className="stall-price-chip" style={{ background: 'rgba(139, 13, 26, 0.12)', color: '#8B0D1A', border: '1px solid rgba(139, 13, 26, 0.3)', fontWeight: '700' }}>
                    <i className="fas fa-lock" style={{ marginRight: '5px' }}></i> Registration Closed
                  </span>
                )}
              </div>

              <div className="event-meta">
                <span className="meta-item">
                  <i className="fas fa-calendar-alt"></i>
                  {displayEvent.date || 'Wednesday, 16.09.2026'}
                </span>
                <span className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  {displayEvent.location || 'AU International Lounge'}
                </span>
                <span className="meta-item">
                  <i className="fas fa-users"></i> 10 Adamas Schools
                </span>
              </div>

              <p className="event-description">{displayEvent.description}</p>

              {/* Rules & Highlights Pills */}
              {isLaunchPad ? (
                <div className="event-highlights-list">
                  <div className="event-highlight-pill">
                    <i className="fas fa-layer-group"></i>
                    <span>3 Simulation Rounds (Strategy 25% • Execution 40% • Adaptability 35%)</span>
                  </div>
                  <div className="event-highlight-pill">
                    <i className="fas fa-coins"></i>
                    <span>Resource Allocation: 1,000 AU Credits Simulation</span>
                  </div>
                  <div className="event-highlight-pill">
                    <i className="fas fa-bullhorn"></i>
                    <span>Mandatory Participant Briefing: Tuesday evening, 15 Sept 2026</span>
                  </div>
                </div>
              ) : (
                <div className="event-highlights-list">
                  <div className="event-highlight-pill">
                    <i className="fas fa-check-circle"></i>
                    <span>Segment-wise Participation &amp; Strict Curation</span>
                  </div>
                  <div className="event-highlight-pill">
                    <i className="fas fa-star"></i>
                    <span>Mandatory Customer Feedback QR (1–5★ Scale)</span>
                  </div>
                </div>
              )}

              <div className="event-cta-group">
                {isLaunchPad ? (
                  <>
                    <Link to="/launchpad" className="btn btn-primary event-reg-btn">
                      <i className="fas fa-rocket"></i> Explore Launch Pad Arena →
                    </Link>
                    <a
                      href="https://forms.gle/launchpad2026"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      <i className="fas fa-file-alt"></i> Submit Team Nomination
                    </a>
                  </>
                ) : (
                  <>
                    <Link to="/rakhi-stalls" className="btn btn-primary event-reg-btn">
                      <i className="fas fa-store"></i> View 32 Stalls Directory →
                    </Link>
                    <Link to="/launchpad" className="btn btn-secondary">
                      <i className="fas fa-rocket"></i> Launch Pad '26
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Structured Information */}
          <div className="side-cards">
            <div className="side-cards-header">
              <span className="side-header-tag">
                <i className="fas fa-award"></i> {isLaunchPad ? 'COMPETITION HIGHLIGHTS' : 'STALL BENEFITS & GUIDELINES'}
              </span>
            </div>

            {isLaunchPad ? (
              <>
                {/* Benefit Card 1 */}
                <div className="mini-card-enhanced">
                  <div className="mini-card-head">
                    <div className="mini-card-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      <i className="fas fa-chess-knight"></i>
                    </div>
                    <div className="mini-card-title-group">
                      <h4>Round 1: Discover &amp; Strategise</h4>
                      <span className="mini-card-badge">45 Mins • 25%</span>
                    </div>
                  </div>
                  <p>
                    Analyse business scenarios, define problems &amp; target personas, allocate 1,000 AU Credits and adapt to dynamic market updates.
                  </p>
                  <div className="mini-card-perks">
                    <span><i className="fas fa-check"></i> 1,000 AU Credits</span>
                    <span><i className="fas fa-check"></i> 10 Teams Proceed</span>
                  </div>
                </div>

                {/* Benefit Card 2 */}
                <div className="mini-card-enhanced">
                  <div className="mini-card-head">
                    <div className="mini-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="mini-card-title-group">
                      <h4>Round 2: Build &amp; Eliminate</h4>
                      <span className="mini-card-badge">65 Mins • 40%</span>
                    </div>
                  </div>
                  <p>
                    Prototype products, deploy Go-To-Market plans, negotiate with live customers, and generate revenue. Top 5 teams move forward!
                  </p>
                  <div className="mini-card-perks">
                    <span><i className="fas fa-check"></i> Live Market Floor</span>
                    <span><i className="fas fa-check"></i> Top 5 Advance</span>
                  </div>
                </div>

                {/* Benefit Card 3 */}
                <div className="mini-card-enhanced">
                  <div className="mini-card-head">
                    <div className="mini-card-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                      <i className="fas fa-fire"></i>
                    </div>
                    <div className="mini-card-title-group">
                      <h4>Round 3: Crisis &amp; Adapt</h4>
                      <span className="mini-card-badge">50 Mins • 35%</span>
                    </div>
                  </div>
                  <p>
                    Tackle real-world business crises, absorb sudden shockwaves, and defend survival decisions before the multidisciplinary Grand Jury.
                  </p>
                  <div className="mini-card-perks">
                    <span><i className="fas fa-check"></i> Surprise Shockwaves</span>
                    <span><i className="fas fa-check"></i> Top 3 Podium</span>
                  </div>
                </div>

                {/* Quick Registration Steps Bar */}
                <div className="mini-steps-card">
                  <div className="steps-title">
                    <i className="fas fa-clipboard-check"></i> How to Participate:
                  </div>
                  <div className="steps-flow">
                    <span className="step-badge">1. Form Team (3-5)</span>
                    <span className="step-arrow">→</span>
                    <span className="step-badge">2. Nominate via Form</span>
                    <span className="step-arrow">→</span>
                    <span className="step-badge">3. Attend Briefing</span>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                    Sell handcrafted rakhi creations, gifts, accessories, or startup goods directly to students and faculty.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
