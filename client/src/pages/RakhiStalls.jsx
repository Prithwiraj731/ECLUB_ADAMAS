import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function RakhiStalls() {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load all 23 stalls from backend
  useEffect(() => {
    loadStalls();
  }, []);

  const loadStalls = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/stalls');
      const data = await res.json();
      if (data.success && data.stalls) {
        setStalls(data.stalls);
      }
    } catch (err) {
      console.error('Failed to load stalls:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const categories = ['All', ...new Set(stalls.map((s) => s.category).filter(Boolean))];

  // Filtered stalls list
  const filteredStalls = stalls.filter((stall) => {
    const matchesCat = selectedCategory === 'All' || stall.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesSearch =
      (stall.name && stall.name.toLowerCase().includes(q)) ||
      (stall.stall_number && stall.stall_number.toLowerCase().includes(q)) ||
      (stall.founders && stall.founders.toLowerCase().includes(q)) ||
      (stall.department && stall.department.toLowerCase().includes(q)) ||
      (stall.description && stall.description.toLowerCase().includes(q)) ||
      (stall.category && stall.category.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Rakhi & Festive Products':
        return 'fa-gift';
      case 'Homemade Food & Bakery':
        return 'fa-cookie-bite';
      case 'Eco Friendly & Sustainable Items':
        return 'fa-leaf';
      case 'Merchandise':
        return 'fa-tshirt';
      default:
        return 'fa-store';
    }
  };

  const getShortCategory = (category) => {
    switch (category) {
      case 'Rakhi & Festive Products':
        return 'Festive';
      case 'Homemade Food & Bakery':
        return 'Bakery/Food';
      case 'Eco Friendly & Sustainable Items':
        return 'Eco-Friendly';
      case 'Merchandise':
        return 'Merch';
      default:
        return category;
    }
  };

  return (
    <div className="stalls-page-wrapper">
      {/* Festive Hero Banner */}
      <section className="stalls-hero-banner">
        <div className="container">
          <div className="stalls-hero-badge">
            <i className="fas fa-gem"></i>
            <span>ADAMAS UNIVERSITY ENTREPRENEURSHIP CLUB</span>
          </div>
          <h1 className="stalls-hero-title">RAKHI STARTUP BAZAAR</h1>
          <p className="stalls-hero-subtitle">
            Official Campus Marketplace &amp; Student Venture Directory
          </p>

          <div className="stalls-hero-stats-row">
            <div className="stalls-hero-stat-pill">
              <span className="stat-num">{stalls.length || 23}</span>
              <span className="stat-label">Student Stalls</span>
            </div>
            <div className="stalls-hero-stat-pill">
              <span className="stat-num">4</span>
              <span className="stat-label">Venture Segments</span>
            </div>
            <div className="stalls-hero-stat-pill">
              <span className="stat-num">7+</span>
              <span className="stat-label">Faculties &amp; Schools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Directory & Stalls Listing */}
      <section className="stalls-directory-section section">
        <div className="container">
          {/* Controls Bar: Search & Category Filter */}
          <div className="stalls-controls-bar">
            <div className="stalls-search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search by stall name, number (#01–#23), founder, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="stalls-filter-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <i className={`fas ${getCategoryIcon(cat)}`}></i>
                  <span>
                    {cat} {cat === 'All' ? `(${stalls.length})` : `(${stalls.filter((s) => s.category === cat).length})`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stalls Cards Grid */}
          {loading ? (
            <div className="stalls-loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading Official Rakhi Startup Bazaar Directory...</p>
            </div>
          ) : filteredStalls.length === 0 ? (
            <div className="stalls-empty-state">
              <i className="fas fa-store-slash"></i>
              <h3>No stalls found matching your search</h3>
              <p>Try searching for a different stall name, founder, or change the category filter.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Show All Stalls
              </button>
            </div>
          ) : (
            <div className="stalls-grid showcase-grid">
              {filteredStalls.map((stall) => (
                <div key={stall.id} className="stall-card showcase-stall-card">
                  {/* Card Top Badges */}
                  <div className="stall-card-header">
                    <span className="stall-number-chip">Stall #{stall.stall_number}</span>
                    <span className="stall-category-chip">
                      <i className={`fas ${getCategoryIcon(stall.category)}`}></i>
                      <span className="cat-label-full">{stall.category}</span>
                      <span className="cat-label-short">{getShortCategory(stall.category)}</span>
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div className="stall-card-body">
                    <h3 className="stall-name-title">{stall.name}</h3>

                    {stall.founders && (
                      <div className="stall-founders-row">
                        <i className="fas fa-user-circle"></i>
                        <span>{stall.founders}</span>
                      </div>
                    )}

                    {stall.department && (
                      <div className="stall-dept-chip">
                        <i className="fas fa-graduation-cap"></i>
                        <span>{stall.department}</span>
                      </div>
                    )}

                    <p className="stall-description">{stall.description}</p>

                    {stall.instagram && (
                      <div className="stall-instagram-row">
                        <a
                          href={
                            stall.instagram.startsWith('http')
                              ? stall.instagram
                              : `https://instagram.com/${stall.instagram.replace('@', '')}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="stall-insta-link"
                        >
                          <i className="fab fa-instagram"></i>
                          <span>
                            {stall.instagram.startsWith('http')
                              ? `@${stall.instagram.split('/').filter(Boolean).pop().split('?')[0]}`
                              : stall.instagram}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
