import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/launchpad.css';

// =========================================================================
// CONFIGURATION: Set the official Google Form URL for Team Nominations here
// =========================================================================
export const GOOGLE_FORM_NOMINATION_URL = 'https://forms.gle/launchpad2026';
export const COORDINATOR_PHONE = '6291289553';
export const COORDINATOR_NAME = 'Aaditya Prasad';

export default function StartupLaunchPad() {
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Target Event Time: September 16, 2026, 14:00:00 IST (UTC+05:30)
  useEffect(() => {
    const targetDate = new Date('2026-09-16T14:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(COORDINATOR_PHONE);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const schools = [
    {
      acronym: 'SOET',
      name: 'School of Engineering & Technology',
      coordinators: 'Preyashee & Soodipa Ma’am',
      icon: 'fa-laptop-code',
      badgeColor: '#38bdf8'
    },
    {
      acronym: 'SOB',
      name: 'School of Business',
      coordinators: 'Aaditya Prasad',
      icon: 'fa-chart-line',
      badgeColor: '#f59e0b'
    },
    {
      acronym: 'SOBAS',
      name: 'School of Basic & Applied Sciences',
      coordinators: 'Soodipa Ma’am',
      icon: 'fa-flask',
      badgeColor: '#10b981'
    },
    {
      acronym: 'SOLACS',
      name: 'School of Liberal Arts & Cultural Studies',
      coordinators: 'Tathagata Sir',
      icon: 'fa-landmark',
      badgeColor: '#a855f7'
    },
    {
      acronym: 'SOLB',
      name: 'School of Life Science & Biotechnology',
      coordinators: 'Preyashee',
      icon: 'fa-dna',
      badgeColor: '#ec4899'
    },
    {
      acronym: 'SOSA',
      name: 'School of Smart Agriculture',
      coordinators: 'Soodipa Ma’am',
      icon: 'fa-seedling',
      badgeColor: '#84cc16'
    },
    {
      acronym: 'SOE',
      name: 'School of Education',
      coordinators: 'Tathagata Sir',
      icon: 'fa-graduation-cap',
      badgeColor: '#06b6d4'
    },
    {
      acronym: 'SOMC',
      name: 'School of Media and Communication',
      coordinators: 'Tathagata Sir',
      icon: 'fa-bullhorn',
      badgeColor: '#f97316'
    },
    {
      acronym: 'SOHMS',
      name: 'School of Health & Medical Sciences',
      coordinators: 'Soodipa Ma’am',
      icon: 'fa-heartbeat',
      badgeColor: '#ef4444'
    },
    {
      acronym: 'SOLJ',
      name: 'School of Law and Justice',
      coordinators: 'Aaditya Prasad',
      icon: 'fa-balance-scale',
      badgeColor: '#eab308'
    }
  ];

  return (
    <div className="launchpad-page">
      {/* Ambient decorative lights */}
      <div className="lp-ambient-orb lp-orb-gold" aria-hidden="true" />
      <div className="lp-ambient-orb lp-orb-crimson" aria-hidden="true" />
      <div className="lp-ambient-orb lp-orb-blue" aria-hidden="true" />

      <div className="launchpad-container">
        {/* ================== HERO BANNER ================== */}
        <section className="lp-hero-section">
          {/* Breadcrumb Navigation */}
          <nav className="lp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <a href="/#events">Events</a>
            <span>/</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>Start Up Launch Pad</span>
          </nav>

          <div className="lp-hero-grid">
            {/* Left Hero Content */}
            <div className="lp-hero-text-col">
              <div className="lp-badge-row">
                <span className="lp-tag-naac">
                  <i className="fas fa-award"></i> NAAC GRADE A • ADAMAS UNIVERSITY
                </span>
                <span className="lp-tag-live">
                  <span className="lp-pulse-dot"></span> INTER-SCHOOL COMPETITION
                </span>
              </div>

              <div className="lp-sub-title">ENTREPRENEURSHIP CLUB PRESENTS</div>
              <h1 className="lp-main-heading">START UP LAUNCH PAD</h1>
              <div className="lp-tagline-motto">BUILD. COMPETE. ADAPT.</div>

              <div className="lp-quote-box">
                <p>“It's not just about having the best idea, but making the best decisions.”</p>
              </div>

              {/* Core Logistics Meta Bar */}
              <div className="lp-meta-bar">
                <div className="lp-meta-item">
                  <div className="lp-meta-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="lp-meta-info">
                    <span className="lp-meta-label">Date</span>
                    <span className="lp-meta-val">16.09.2026 (Wednesday)</span>
                  </div>
                </div>

                <div className="lp-meta-item">
                  <div className="lp-meta-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="lp-meta-info">
                    <span className="lp-meta-label">Time</span>
                    <span className="lp-meta-val">2:00 PM – 5:00 PM</span>
                  </div>
                </div>

                <div className="lp-meta-item">
                  <div className="lp-meta-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="lp-meta-info">
                    <span className="lp-meta-label">Venue</span>
                    <span className="lp-meta-val">AU International Lounge</span>
                  </div>
                </div>

                <div className="lp-meta-item">
                  <div className="lp-meta-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="lp-meta-info">
                    <span className="lp-meta-label">Team Structure</span>
                    <span className="lp-meta-val">1 Team / School (3–5 Students)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lp-actions-group">
                <a
                  href={GOOGLE_FORM_NOMINATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn-nominate"
                  id="btn-google-form-nominate"
                >
                  <i className="fas fa-file-alt"></i> Submit Team Nomination (Google Form)
                </a>

                <a
                  href={`tel:${COORDINATOR_PHONE}`}
                  className="lp-btn-secondary-action"
                  title="Call Aaditya Prasad"
                >
                  <i className="fas fa-phone-alt"></i> Call Coordinator ({COORDINATOR_PHONE})
                </a>

                <a
                  href={`https://wa.me/91${COORDINATOR_PHONE}?text=Hi%20Aaditya,%20I%20am%20reaching%20out%20regarding%20the%20Inter-School%20Start%20Up%20Launch%20Pad%20competition`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn-secondary-action"
                  style={{ color: '#25d366', borderColor: 'rgba(37, 211, 102, 0.3)' }}
                >
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </a>
              </div>
            </div>

            {/* Right Poster Creative Preview */}
            <div className="lp-poster-col">
              <div className="lp-poster-card" onClick={() => setPosterModalOpen(true)}>
                <img
                  src="/assets/startup-launchpad.jpg"
                  alt="Inter-School Start Up Launch Pad Official Competition Poster"
                  className="lp-poster-img"
                  loading="eager"
                />
                <div className="lp-poster-overlay">
                  <span className="lp-poster-caption">Official Competition Poster</span>
                  <button type="button" className="lp-poster-zoom-btn">
                    <i className="fas fa-search-plus"></i> View Full Poster
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================== LIVE COUNTDOWN TIMER ================== */}
        <div className="lp-countdown-wrap">
          <div className="lp-countdown-header">
            <h3>Time Remaining Until Battle Begins</h3>
            <p>Wednesday, 16 September 2026 • 2:00 PM IST • AU International Lounge</p>
          </div>

          <div className="lp-countdown-digits">
            <div className="lp-count-unit">
              <span className="lp-count-num">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="lp-count-label">Days</span>
            </div>
            <span className="lp-count-separator">:</span>

            <div className="lp-count-unit">
              <span className="lp-count-num">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="lp-count-label">Hours</span>
            </div>
            <span className="lp-count-separator">:</span>

            <div className="lp-count-unit">
              <span className="lp-count-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="lp-count-label">Minutes</span>
            </div>
            <span className="lp-count-separator">:</span>

            <div className="lp-count-unit">
              <span className="lp-count-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="lp-count-label">Seconds</span>
            </div>
          </div>
        </div>

        {/* ================== MANDATORY BRIEFING BANNER ================== */}
        <div className="lp-briefing-banner">
          <div className="lp-briefing-left">
            <div className="lp-briefing-icon">
              <i className="fas fa-bullhorn"></i>
            </div>
            <div className="lp-briefing-text">
              <h4>Mandatory Participant Briefing Session</h4>
              <p>
                <strong>Tuesday evening, 15 September 2026:</strong> A comprehensive orientation session will be
                conducted for all selected school teams to review competition mechanics, 1,000 AU Credits system, and
                rules.
              </p>
            </div>
          </div>
          <a
            href={GOOGLE_FORM_NOMINATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-secondary-action"
            style={{ whiteSpace: 'nowrap' }}
          >
            Nominate Your School <i className="fas fa-arrow-right"></i>
          </a>
        </div>

        {/* ================== THREE-ROUND COMPETITION ARENA ================== */}
        <section className="lp-rounds-section">
          <div className="lp-section-title-wrap">
            <span className="lp-section-eyebrow">COMPETITION MECHANICS</span>
            <h2>Three High-Stakes Rounds</h2>
            <p>
              Designed to test your team's strategic acumen, tactical execution in live markets, and resilience during
              unpredictable business crises.
            </p>
          </div>

          <div className="lp-rounds-grid">
            {/* ROUND 1 */}
            <div className="lp-round-card lp-round-1">
              <div className="lp-round-header">
                <span className="lp-round-tag">
                  <i className="fas fa-lightbulb"></i> Round 1
                </span>
                <span className="lp-round-weight">25% of Overall Score</span>
              </div>

              <h3 className="lp-round-title">DISCOVER &amp; STRATEGISE</h3>
              <p className="lp-round-subtitle">“Find the opportunity.”</p>

              <div className="lp-time-chip">
                <i className="fas fa-stopwatch"></i> Duration: 45 Minutes
              </div>

              <ul className="lp-round-checklist">
                <li>
                  <i className="fas fa-search"></i>
                  <span>Analyse a real-world business scenario</span>
                </li>
                <li>
                  <i className="fas fa-bullseye"></i>
                  <span>Identify the problem statement &amp; target customer persona</span>
                </li>
                <li>
                  <i className="fas fa-cogs"></i>
                  <span>Develop a viable and scalable solution concept</span>
                </li>
                <li>
                  <i className="fas fa-coins"></i>
                  <span>Allocate limited resources (<strong>1,000 AU Credits</strong>)</span>
                </li>
                <li>
                  <i className="fas fa-sync-alt"></i>
                  <span>Adapt swiftly to an unexpected mid-round market update</span>
                </li>
              </ul>

              <div className="lp-round-footer">
                <div className="lp-round-outcome">
                  <i className="fas fa-users"></i> 10 Teams Proceed
                </div>
                <div className="lp-round-owner">Designed by Preyashee</div>
              </div>
            </div>

            {/* ROUND 2 */}
            <div className="lp-round-card lp-round-2">
              <div className="lp-round-header">
                <span className="lp-round-tag">
                  <i className="fas fa-cogs"></i> Round 2
                </span>
                <span className="lp-round-weight">40% of Overall Score</span>
              </div>

              <h3 className="lp-round-title">BUILD, EXECUTE &amp; ELIMINATE</h3>
              <p className="lp-round-subtitle">“Turn your strategy into reality.”</p>

              <div className="lp-time-chip">
                <i className="fas fa-stopwatch"></i> Duration: 65 Minutes
              </div>

              <ul className="lp-round-checklist">
                <li>
                  <i className="fas fa-box-open"></i>
                  <span>Build your product/service prototype or visual mock-up</span>
                </li>
                <li>
                  <i className="fas fa-bullhorn"></i>
                  <span>Prepare an aggressive Go-To-Market (GTM) execution plan</span>
                </li>
                <li>
                  <i className="fas fa-handshake"></i>
                  <span>Enter the live market floor and sell/negotiate with customers</span>
                </li>
                <li>
                  <i className="fas fa-chart-line"></i>
                  <span>Generate revenue, book sales, and create measurable business value</span>
                </li>
              </ul>

              <div className="lp-round-footer">
                <div className="lp-round-outcome">
                  <i className="fas fa-filter"></i> Top 5 Teams Advance
                </div>
                <div className="lp-round-owner">Designed by Preyashee</div>
              </div>
            </div>

            {/* ROUND 3 */}
            <div className="lp-round-card lp-round-3">
              <div className="lp-round-header">
                <span className="lp-round-tag">
                  <i className="fas fa-exclamation-triangle"></i> Round 3
                </span>
                <span className="lp-round-weight">35% of Overall Score</span>
              </div>

              <h3 className="lp-round-title">CRISIS &amp; ADAPT</h3>
              <p className="lp-round-subtitle">“When the plan changes.”</p>

              <div className="lp-time-chip">
                <i className="fas fa-stopwatch"></i> Duration: 50 Minutes
              </div>

              <ul className="lp-round-checklist">
                <li>
                  <i className="fas fa-bomb"></i>
                  <span>Face a high-impact, real-world business crisis</span>
                </li>
                <li>
                  <i className="fas fa-hourglass-half"></i>
                  <span>Make strategic survival decisions under severe time &amp; resource constraints</span>
                </li>
                <li>
                  <i className="fas fa-bolt"></i>
                  <span>Absorb and respond to a second surprise market shock</span>
                </li>
                <li>
                  <i className="fas fa-gavel"></i>
                  <span>Defend your decisions under cross-examination before the Grand Jury</span>
                </li>
              </ul>

              <div className="lp-round-footer">
                <div className="lp-round-outcome">
                  <i className="fas fa-trophy"></i> Top 3 Qualify for Final Podium
                </div>
                <div className="lp-round-owner">Designed by Aaditya Prasad</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================== 10 PARTICIPATING SCHOOLS ================== */}
        <section className="lp-schools-section">
          <div className="lp-section-title-wrap">
            <span className="lp-section-eyebrow">CAMPUS-WIDE INVOLVEMENT</span>
            <h2>10 Schools of Adamas University</h2>
            <p>
              Each school nominates exactly one elite team of 3 to 5 students to compete for university-wide entrepreneurship supremacy.
            </p>
          </div>

          <div className="lp-schools-grid">
            {schools.map((school, index) => (
              <div className="lp-school-card" key={school.acronym}>
                <div className="lp-school-head">
                  <div
                    className="lp-school-badge"
                    style={{ borderColor: school.badgeColor, color: school.badgeColor }}
                  >
                    <i className={`fas ${school.icon}`}></i>
                  </div>
                  <div className="lp-school-title-wrap">
                    <div className="lp-school-acronym">{school.acronym}</div>
                    <div className="lp-school-fullname">{school.name}</div>
                  </div>
                </div>

                <div className="lp-school-coord">
                  <span className="lp-coord-label">Assigned Coordinator</span>
                  <span className="lp-coord-name">{school.coordinators}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================== JUDGES & MENTORS ================== */}
        <section className="lp-judges-section">
          <div className="lp-section-title-wrap">
            <span className="lp-section-eyebrow">EVALUATION PANEL</span>
            <h2>Judges &amp; Mentors</h2>
            <p>
              Multidisciplinary experts evaluating strategy, fiscal discipline, execution grit, and crisis management.
            </p>
          </div>

          <div className="lp-judges-grid">
            <div className="lp-judge-card">
              <div className="lp-judge-icon-box">
                <i className="fas fa-user-tie"></i>
              </div>
              <h4 className="lp-judge-role">Entrepreneur</h4>
              <p className="lp-judge-desc">
                Assessing real-world product-market fit, founder hustle, resilience, and commercial viability.
              </p>
            </div>

            <div className="lp-judge-card">
              <div className="lp-judge-icon-box">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h4 className="lp-judge-role">Finance &amp; Investment Pro</h4>
              <p className="lp-judge-desc">
                Evaluating resource efficiency, 1,000 AU Credits budget allocation, and sustainable unit economics.
              </p>
            </div>

            <div className="lp-judge-card">
              <div className="lp-judge-icon-box">
                <i className="fas fa-bullseye"></i>
              </div>
              <h4 className="lp-judge-role">Industry / Marketing Pro</h4>
              <p className="lp-judge-desc">
                Scoring Go-To-Market execution, customer acquisition tactics, and negotiation prowess on the live floor.
              </p>
            </div>

            <div className="lp-judge-card">
              <div className="lp-judge-icon-box">
                <i className="fas fa-university"></i>
              </div>
              <h4 className="lp-judge-role">Faculty Representative</h4>
              <p className="lp-judge-desc">
                Ensuring inter-school fairness, academic rigor, teamwork dynamics, and strategic problem framing.
              </p>
            </div>
          </div>
        </section>

        {/* ================== CONTACT & NOMINATION CTA DESK ================== */}
        <div className="lp-contact-box">
          <h3>Ready to Represent Your School?</h3>
          <p>
            Submit your team nomination through the official Google Form or contact the coordinating team for queries,
            guidance, and briefing details.
          </p>

          <div className="lp-contact-buttons">
            <a
              href={GOOGLE_FORM_NOMINATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-nominate"
            >
              <i className="fas fa-paper-plane"></i> Submit Team Nomination
            </a>

            <a href={`tel:${COORDINATOR_PHONE}`} className="lp-contact-btn phone">
              <i className="fas fa-phone-alt"></i> Call Aaditya ({COORDINATOR_PHONE})
            </a>

            <a
              href={`https://wa.me/91${COORDINATOR_PHONE}?text=Hi%20Aaditya,%20I%20have%20a%20question%20regarding%20the%20Start%20Up%20Launch%20Pad%20competition`}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-contact-btn whatsapp"
            >
              <i className="fab fa-whatsapp"></i> WhatsApp Coordinator
            </a>

            <button
              type="button"
              className="lp-contact-btn"
              onClick={handleCopyPhone}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
            >
              <i className={copiedPhone ? 'fas fa-check' : 'fas fa-copy'}></i>
              {copiedPhone ? 'Phone Copied!' : 'Copy Phone'}
            </button>
          </div>
        </div>
      </div>

      {/* ================== FULL POSTER LIGHTBOX MODAL ================== */}
      {posterModalOpen && (
        <div className="lp-modal-backdrop" onClick={() => setPosterModalOpen(false)}>
          <div className="lp-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lp-modal-close"
              onClick={() => setPosterModalOpen(false)}
              aria-label="Close modal"
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src="/assets/startup-launchpad.jpg"
              alt="Inter-School Start Up Launch Pad Poster"
              className="lp-modal-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
