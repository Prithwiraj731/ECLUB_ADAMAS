import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="/assets/logo.png" alt="Adamas University Entrepreneurship Club Logo" />
          </Link>
        </div>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            About
          </NavLink>
          <a href="/#events" onClick={() => setMenuOpen(false)}>
            Events
          </a>
          <a href="/#initiatives" onClick={() => setMenuOpen(false)}>
            Initiatives
          </a>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
            Contact
          </NavLink>
        </nav>

        <div
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          role="button"
          tabIndex={0}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
}
