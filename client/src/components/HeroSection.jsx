import React from 'react';

export default function HeroSection() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToInitiatives = (e) => {
    e.preventDefault();
    const target = document.getElementById('initiatives');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#initiatives';
    }
  };

  return (
    <section id="home" className="hero-luxury-wrapper">
      <div className="hero-luxury-container">
        {/* Subtle Ambient Background Mesh */}
        <div className="luxury-ambient-mesh" aria-hidden="true"></div>

        {/* Central Volumetric Crimson Eclipse Aura with Orbiting Rings */}
        <div className="luxury-eclipse-aura" aria-hidden="true">
          <div className="eclipse-core-glow"></div>
          <div className="eclipse-orbit-ring ring-one"></div>
          <div className="eclipse-orbit-ring ring-two"></div>
          <div className="eclipse-orbit-ring ring-three"></div>
        </div>

        {/* Mobile-Only Halo Arc behind characters */}
        <div className="hero-mobile-halo-arch" aria-hidden="true"></div>

        {/* ===== DESKTOP HERO ELEMENTS ===== */}
        {/* Monumental Display Background Typography (Single Line for Desktop) */}
        <div className="luxury-hero-title-backdrop" aria-hidden="true">
          <h1 className="backdrop-giant-text">ENTREPRENEURSHIP CLUB</h1>
        </div>

        {/* Astonishing Kinetic Laser Strike-Through Ribbon */}
        <div className="hero-strike-through-container" aria-hidden="true">
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

        {/* ===== MOBILE-SPECIFIC HERO CONTENT (EXACT MATCH TO REFERENCE DESIGN) ===== */}
        <div className="hero-mobile-content-overlay">
          {/* Top Tagline with Crimson Red Dots */}
          <div className="hero-mobile-tagline">
            IDEATE<span className="hero-dot">.</span> INNOVATE<span className="hero-dot">.</span> ELEVATE<span className="hero-dot">.</span>
          </div>

          {/* Main Mobile Heading */}
          <div className="hero-mobile-heading-group">
            <h2 className="hero-mobile-subtitle">ENTREPRENEURSHIP</h2>
            <h1 className="hero-mobile-main-title">CLUB</h1>
          </div>

          {/* Crimson Red Accent Line Under Heading */}
          <div className="hero-mobile-accent-bar" aria-hidden="true"></div>

          {/* Mission Subtitle Statement */}
          <p className="hero-mobile-desc">
            Empowering <span className="hero-highlight-red">visionaries</span> to build tomorrow's legacy.
          </p>

          {/* CTA Link + Circular Button */}
          <a href="#initiatives" onClick={scrollToInitiatives} className="hero-mobile-cta-link">
            <span className="cta-text">JOIN THE MOVEMENT</span>
            <span className="cta-arrow-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </a>
        </div>

        {/* ===== HIGH-DEFINITION DUAL CHARACTER STAGE (MALE + FEMALE) ===== */}
        <div className="luxury-character-stage">
          <div className="luxury-character-duo-container">
            {/* Male Character (Leading / Front) */}
            <div className="duo-char-wrap char-male">
              <img
                src="/assets/hero/hero-character.png"
                alt="Adamas E-Club Male Founder"
                className="luxury-character-photo photo-male"
              />
            </div>

            {/* Female Character (Duo Partner / Right) */}
            <div className="duo-char-wrap char-female">
              <img
                src="/assets/hero/hero-character-female.png"
                alt="Adamas E-Club Female Founder"
                className="luxury-character-photo photo-female"
              />
            </div>
          </div>

          {/* Floor Shadow / Ambient Ground Reflection */}
          <div className="luxury-character-shadow"></div>
          <div className="hero-ground-fade" aria-hidden="true"></div>
        </div>

        {/* ===== DESKTOP FLOATING QUICK ACTION BADGES ===== */}
        <div className="luxury-side-action side-left">
          <a href="#initiatives" onClick={scrollToInitiatives} className="luxury-action-pill">
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

        {/* ===== DESKTOP BOTTOM SOCIAL PROOF & TRUST METRICS DOCK ===== */}
        <div className="luxury-bottom-dock desktop-only-dock">
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

        {/* ===== MOBILE BOTTOM 3-PILLAR METRICS STRIP (EXACT REFERENCE MATCH) ===== */}
        <div className="hero-mobile-pillars-strip">
          {/* Pillar 1: ACCELERATE IDEAS */}
          <div className="hero-mobile-pillar-item">
            <div className="pillar-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="svg-pillar-rocket">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke="#FF2E4C" strokeWidth="1.8"></path>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="#FF2E4C" strokeWidth="1.8"></path>
              </svg>
            </div>
            <div className="pillar-text-group">
              <span className="pillar-primary-txt">ACCELERATE</span>
              <span className="pillar-sub-txt">IDEAS</span>
            </div>
          </div>

          <div className="pillar-vertical-divider" aria-hidden="true"></div>

          {/* Pillar 2: DRIVE INNOVATION */}
          <div className="hero-mobile-pillar-item">
            <div className="pillar-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="svg-pillar-target">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6" stroke="#FF2E4C" strokeWidth="1.8"></circle>
                <circle cx="12" cy="12" r="2" fill="#FF2E4C"></circle>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#FF2E4C" strokeWidth="1.4"></path>
              </svg>
            </div>
            <div className="pillar-text-group">
              <span className="pillar-primary-txt">DRIVE</span>
              <span className="pillar-sub-txt">INNOVATION</span>
            </div>
          </div>

          <div className="pillar-vertical-divider" aria-hidden="true"></div>

          {/* Pillar 3: FUEL GROWTH */}
          <div className="hero-mobile-pillar-item">
            <div className="pillar-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="svg-pillar-sprout">
                <path d="M12 22V10"></path>
                <path d="M12 10C12 5.5 16 3 20 3c0 4.5-2.5 8.5-8 7z" stroke="#FF2E4C" strokeWidth="1.8"></path>
                <path d="M12 14c-4.5 0-7-2-8-6 4 0 7.5 2 8 6z"></path>
                <path d="M9 22h6"></path>
              </svg>
            </div>
            <div className="pillar-text-group">
              <span className="pillar-primary-txt">FUEL</span>
              <span className="pillar-sub-txt">GROWTH</span>
            </div>
          </div>
        </div>

        {/* ===== MOBILE BOTTOM CHEVRON SCROLL INDICATOR ===== */}
        <button
          className="hero-mobile-scroll-chevron"
          onClick={scrollToAbout}
          aria-label="Scroll down to About section"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
            <polyline points="7 9 12 14 17 9"></polyline>
            <polyline points="7 14 12 19 17 14" stroke="#FF2E4C"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
