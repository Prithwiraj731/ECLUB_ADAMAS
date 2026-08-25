import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

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

  // Close menu on route change & handle body scroll lock
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleMenu = () => {
    const nextState = !menuOpen;
    setMenuOpen(nextState);
    if (nextState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`nav-backdrop ${menuOpen ? 'active' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className={`header ${isHomeRoute ? 'home-header' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img src="/assets/logo.png" alt="Adamas University Entrepreneurship Club Logo" />
            </Link>
          </div>

          <nav className={`nav ${menuOpen ? 'active' : ''}`}>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/rakhi-stalls" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              Rakhi Stalls
            </NavLink>
            <a href="/#events" onClick={closeMenu}>
              Events
            </a>
            <a href="/#initiatives" onClick={closeMenu}>
              Initiatives
            </a>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              Contact
            </NavLink>
          </nav>

          <button
            className={`menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    </>
  );
}
