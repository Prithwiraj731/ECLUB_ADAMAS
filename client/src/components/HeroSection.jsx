import React from 'react';

export default function HeroSection() {
  return (
    <section id="home" className="hero-luxury-wrapper">
      <div className="hero-luxury-container">
        {/* Subtle Ambient Background Mesh */}
        <div className="luxury-ambient-mesh"></div>

        {/* Central Volumetric Crimson Eclipse Aura with Concentric Rings */}
        <div className="luxury-eclipse-aura">
          <div className="eclipse-core-glow"></div>
          <div className="eclipse-orbit-ring ring-one"></div>
          <div className="eclipse-orbit-ring ring-two"></div>
          <div className="eclipse-orbit-ring ring-three"></div>
        </div>

        {/* Monumental Display Background Typography (Single Line) */}
        <div className="luxury-hero-title-backdrop" aria-hidden="true">
          <h1 className="backdrop-giant-text">ENTREPRENEURSHIP CLUB</h1>
        </div>

        {/* Astonishing Kinetic Laser Strike-Through Ribbon */}
        <div className="hero-strike-through-container">
          <div className="strike-laser-line line-top"></div>
          <div className="strike-laser-beam"></div>
          <div className="strike-marquee-track">
            <div className="strike-marquee-content">
              <span className="strike-item">ADAMAS UNIVERSITY INNOVATION ECOSYSTEM</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">VENTURE ACCELERATOR</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">STARTUP INCUBATION</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">SEED CAPITAL &amp; GRANTS</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">ADAMAS UNIVERSITY INNOVATION ECOSYSTEM</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">BUILDING FUTURE FOUNDERS</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">GLOBAL MENTORSHIP</span>
              <span className="strike-separator">✦</span>
            </div>
            {/* Duplicate for seamless infinite loop */}
            <div className="strike-marquee-content" aria-hidden="true">
              <span className="strike-item">ADAMAS UNIVERSITY INNOVATION ECOSYSTEM</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">VENTURE ACCELERATOR</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">STARTUP INCUBATION</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">SEED CAPITAL &amp; GRANTS</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">ADAMAS UNIVERSITY INNOVATION ECOSYSTEM</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">BUILDING FUTURE FOUNDERS</span>
              <span className="strike-separator">✦</span>
              <span className="strike-item">GLOBAL MENTORSHIP</span>
              <span className="strike-separator">✦</span>
            </div>
          </div>
          <div className="strike-laser-line line-bottom"></div>
        </div>

        {/* Centerpiece High-Definition Character */}
        <div className="luxury-character-stage">
          <img
            src="/assets/hero/hero-character.png"
            alt="Adamas E-Club Founder"
            className="luxury-character-photo"
          />
          <div className="luxury-character-shadow"></div>
        </div>

        {/* Floating Quick Action CTA Badges (Left & Right Flanks) */}
        <div className="luxury-side-action side-left">
          <a href="#initiatives" className="luxury-action-pill">
            <div className="pill-icon crimson-glow">
              <i className="fas fa-rocket"></i>
            </div>
            <div className="pill-text-group">
              <span className="pill-title">Incubation Studio</span>
              <span className="pill-sub">Cohort '26 Open →</span>
            </div>
          </a>
        </div>

        <div className="luxury-side-action side-right">
          <a href="#events" className="luxury-action-pill">
            <div className="pill-icon crimson-glow">
              <i className="fas fa-gem"></i>
            </div>
            <div className="pill-text-group">
              <span className="pill-title">Rakhi Startup Bazaar Stall</span>
              <span className="pill-sub">Register Now! →</span>
            </div>
          </a>
        </div>

        {/* Bottom Social Proof & Trust Metrics Dock */}
        <div className="luxury-bottom-dock">
          <div className="dock-metric-item">
            <span className="dock-val">500+</span>
            <span className="dock-lbl">Student Founders</span>
          </div>
          <div className="dock-divider"></div>
          <div className="dock-metric-item">
            <span className="dock-val">₹10L+</span>
            <span className="dock-lbl">Seed Grants</span>
          </div>
          <div className="dock-divider"></div>
          <div className="dock-metric-item">
            <span className="dock-val">25+</span>
            <span className="dock-lbl">Patents Filed</span>
          </div>
          <div className="dock-divider"></div>
          <div className="dock-metric-item">
            <span className="dock-val">100+</span>
            <span className="dock-lbl">Masterclasses</span>
          </div>
        </div>
      </div>
    </section>
  );
}
