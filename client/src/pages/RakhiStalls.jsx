import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RakhiStalls() {
  const location = useLocation();
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Rating Modal State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    reviewer_name: '',
    reviewer_contact: '',
    review_text: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({ success: null, message: '' });

  // Load stalls from backend
  useEffect(() => {
    loadStalls();
  }, []);

  const loadStalls = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stalls');
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

  // Check URL params for direct stall selection (e.g. ?stall=stall_1)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stallParam = params.get('stall') || params.get('id');
    if (stallParam && stalls.length > 0) {
      const match = stalls.find(
        (s) => s.id === stallParam || s.stall_number === stallParam || s.name.toLowerCase().includes(stallParam.toLowerCase())
      );
      if (match) {
        openRatingModal(match);
      }
    }
  }, [location.search, stalls]);

  const openRatingModal = (stall) => {
    setSelectedStall(stall);
    setRatingForm({
      rating: 5,
      reviewer_name: '',
      reviewer_contact: '',
      review_text: '',
    });
    setHoverRating(0);
    setFeedbackStatus({ success: null, message: '' });
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedStall(null);
    setFeedbackStatus({ success: null, message: '' });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStall) return;

    try {
      setSubmitting(true);
      setFeedbackStatus({ success: null, message: '' });

      const res = await fetch('/api/stalls/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stall_id: selectedStall.id,
          rating: ratingForm.rating,
          reviewer_name: ratingForm.reviewer_name,
          reviewer_contact: ratingForm.reviewer_contact,
          review_text: ratingForm.review_text,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFeedbackStatus({
          success: true,
          message: data.message || `Thank you! Your rating for ${selectedStall.name} has been submitted.`,
        });
        setTimeout(() => {
          closeRatingModal();
        }, 2200);
      } else {
        setFeedbackStatus({
          success: false,
          message: data.message || 'Could not submit rating. Please try again.',
        });
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setFeedbackStatus({
        success: false,
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Extract unique categories
  const categories = ['All', ...new Set(stalls.map((s) => s.category).filter(Boolean))];

  // Filtered stalls list
  const filteredStalls = stalls.filter((stall) => {
    const matchesCat = selectedCategory === 'All' || stall.category === selectedCategory;
    const matchesSearch =
      stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stall.stall_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stall.founders && stall.founders.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (stall.description && stall.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getRatingLabel = (score) => {
    switch (score) {
      case 1:
        return '1★ Needs Improvement';
      case 2:
        return '2★ Fair Attempt';
      case 3:
        return '3★ Good Quality & Service';
      case 4:
        return '4★ Very Good & Creative!';
      case 5:
        return '5★ Outstanding! Winner Contender 🏆';
      default:
        return `${score}★`;
    }
  };

  return (
    <div className="stalls-page-wrapper">
      {/* Festive Hero Banner */}
      <section className="stalls-hero-banner">
        <div className="container">
          <div className="stalls-hero-badge">
            <i className="fas fa-gem"></i>
            <span>ADAMAS ENTREPRENEURSHIP CLUB</span>
          </div>
          <h1>RAKHI STARTUP BAZAAR</h1>
          <p className="stalls-hero-subtitle">
            Official Campus Voting &amp; Stall Feedback Directory
          </p>
          <div className="stalls-hero-notice-pill">
            <i className="fas fa-shield-alt"></i>
            <span>All visitor ratings are confidential and submitted directly to the Evaluation Committee</span>
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
                placeholder="Search by stall name, number, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
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
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stalls Cards Grid */}
          {loading ? (
            <div className="stalls-loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading Rakhi Startup Bazaar Directory...</p>
            </div>
          ) : filteredStalls.length === 0 ? (
            <div className="stalls-empty-state">
              <i className="fas fa-store-slash"></i>
              <h3>No stalls found matching your criteria</h3>
              <p>Try clearing your search or changing the segment filter.</p>
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
            <div className="stalls-grid">
              {filteredStalls.map((stall) => (
                <div key={stall.id} className="stall-card">
                  <div className="stall-card-header">
                    <span className="stall-number-chip">Stall #{stall.stall_number}</span>
                    <span className="stall-category-chip">{stall.category}</span>
                  </div>

                  <div className="stall-image-frame">
                    <img
                      src={stall.image_url || '/assets/hero/hero1.png'}
                      alt={stall.name}
                      onError={(e) => {
                        e.target.src = '/assets/hero/hero1.png';
                      }}
                    />
                  </div>

                  <div className="stall-card-body">
                    <h3>{stall.name}</h3>

                    {stall.founders && (
                      <div className="stall-founders-row">
                        <i className="fas fa-user-friends"></i>
                        <span>{stall.founders}</span>
                      </div>
                    )}

                    <p className="stall-description">{stall.description}</p>
                  </div>

                  <div className="stall-card-footer">
                    <button
                      className="btn btn-primary rate-stall-btn"
                      onClick={() => openRatingModal(stall)}
                    >
                      <i className="fas fa-star"></i> Rate This Stall
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive 1-5 Star Rating Modal */}
      {ratingModalOpen && selectedStall && (
        <div className="rating-modal-overlay" onClick={closeRatingModal}>
          <div
            className="rating-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button className="rating-modal-close" onClick={closeRatingModal} aria-label="Close modal">
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-stall-header">
              <span className="modal-stall-num">Stall #{selectedStall.stall_number}</span>
              <h2>{selectedStall.name}</h2>
              <span className="modal-stall-cat">{selectedStall.category}</span>
            </div>

            {feedbackStatus.message ? (
              <div
                className={`rating-alert-box ${
                  feedbackStatus.success ? 'alert-success' : 'alert-danger'
                }`}
              >
                <i
                  className={`fas ${
                    feedbackStatus.success ? 'fa-check-circle' : 'fa-exclamation-triangle'
                  }`}
                ></i>
                <p>{feedbackStatus.message}</p>
              </div>
            ) : null}

            {!feedbackStatus.success && (
              <form onSubmit={handleRatingSubmit} className="rating-form">
                {/* 1-5 Star Interactive Selector */}
                <div className="star-rating-control-group">
                  <label className="control-label">Your Rating (1 to 5 Stars) *</label>
                  <div className="stars-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`star-btn ${
                          (hoverRating || ratingForm.rating) >= star ? 'filled' : ''
                        }`}
                        onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} star`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="rating-score-label">
                    {getRatingLabel(hoverRating || ratingForm.rating)}
                  </div>
                </div>

                {/* Reviewer Name */}
                <div className="form-group">
                  <label htmlFor="reviewer_name">Your Name (Optional / Recommended)</label>
                  <input
                    id="reviewer_name"
                    type="text"
                    placeholder="e.g. Rahul Sen / Visitor"
                    value={ratingForm.reviewer_name}
                    onChange={(e) => setRatingForm({ ...ratingForm, reviewer_name: e.target.value })}
                  />
                </div>

                {/* Reviewer Contact / Student ID */}
                <div className="form-group">
                  <label htmlFor="reviewer_contact">Student ID / Contact (Optional)</label>
                  <input
                    id="reviewer_contact"
                    type="text"
                    placeholder="e.g. AU/2024/0482 or email/phone"
                    value={ratingForm.reviewer_contact}
                    onChange={(e) =>
                      setRatingForm({ ...ratingForm, reviewer_contact: e.target.value })
                    }
                  />
                </div>

                {/* Review Notes */}
                <div className="form-group">
                  <label htmlFor="review_text">Feedback / Review Notes (Optional)</label>
                  <textarea
                    id="review_text"
                    rows="3"
                    placeholder="Share your thoughts on product quality, creativity, customer service, or stall setup..."
                    value={ratingForm.review_text}
                    onChange={(e) => setRatingForm({ ...ratingForm, review_text: e.target.value })}
                  ></textarea>
                </div>

                <div className="rating-modal-actions">
                  <button
                    type="submit"
                    className="btn btn-primary submit-rating-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Submit Official Rating
                      </>
                    )}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeRatingModal}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
