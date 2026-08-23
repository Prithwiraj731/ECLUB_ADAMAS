import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  { image: '/assets/hero/hero1.png', alt: 'Startup Pitch Presentation' },
  { image: '/assets/hero/hero2.png', alt: 'Team Collaboration' },
  { image: '/assets/hero/hero3.png', alt: 'Innovation Workshop' },
  { image: '/assets/hero/hero4.png', alt: 'Leadership Discussion' },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.image} alt={slide.alt} />
          </div>
        ))}
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>Building Tomorrow's Entrepreneurs Today</h1>
        <p>
          Join the leading entrepreneurship community at Adamas University. Transform your ideas into reality through
          innovation, mentorship, and venture acceleration.
        </p>
        <div className="hero-buttons">
          <a href="#contact" className="btn btn-primary">
            Join the Club
          </a>
          <a href="#events" className="btn btn-outline">
            Explore Events
          </a>
        </div>
      </div>
    </section>
  );
}
