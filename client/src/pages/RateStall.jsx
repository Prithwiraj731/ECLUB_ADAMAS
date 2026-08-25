import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function RateStall() {
  const { stallId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeStallParam = stallId || searchParams.get('stall') || searchParams.get('id') || '';

  const [stall, setStall] = useState(null);
  const [allStalls, setAllStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Rating Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(null);
  const [serverFeedback, setServerFeedback] = useState({ success: null, message: '' });

  // Quick feedback tag suggestions
  const feedbackTagOptions = [
    '✨ Exceptional Quality',
    '🎨 Highly Creative',
    '🌟 Outstanding Presentation',
    '🤝 Friendly Hospitality',
    '🌱 Eco-Friendly & Sustainable',
    '💡 Innovative Concept',
    '💎 Best Value',
    '🏆 Winner Contender',
  ];

  // Get or initialize persistent client device token for security
  const getClientToken = () => {
    let token = localStorage.getItem('eclub_voter_token');
    if (!token) {
      token = 'voter_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      localStorage.setItem('eclub_voter_token', token);
    }
    return token;
  };

  // Fetch stalls & matched stall
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        setErrorMsg('');

        // Fetch all stalls
        const allRes = await apiFetch('/api/stalls');
        const allData = await allRes.json();
        if (allData.success && allData.stalls) {
          setAllStalls(allData.stalls);
        }

        if (activeStallParam) {
          // Fetch specific stall
          const singleRes = await apiFetch(`/api/stalls/${encodeURIComponent(activeStallParam)}`);
          const singleData = await singleRes.json();
          if (singleData.success && singleData.stall) {
            setStall(singleData.stall);
          } else {
            // Fallback match from allStalls list
            if (allData.stalls) {
              const cleanP = activeStallParam.toLowerCase().trim();
              const found = allData.stalls.find(
                (s) =>
                  s.id.toLowerCase() === cleanP ||
                  s.stall_number.toLowerCase() === cleanP ||
                  s.stall_number === cleanP.padStart(2, '0') ||
                  s.name.toLowerCase().includes(cleanP)
              );
              if (found) {
                setStall(found);
              } else {
                setErrorMsg(`Stall "${activeStallParam}" could not be found.`);
              }
            } else {
              setErrorMsg(`Stall "${activeStallParam}" could not be found.`);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching stall details:', err);
        setErrorMsg('Unable to connect to the E-Club rating server. Please check your network.');
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, [activeStallParam]);

  // Check if current device/visitor has already rated this specific stall
  useEffect(() => {
    if (stall) {
      const key1 = `eclub_voted_${stall.id}`;
      const key2 = `eclub_voted_${stall.stall_number}`;
      const saved = localStorage.getItem(key1) || localStorage.getItem(key2);
      if (saved) {
        try {
          setAlreadyVoted(JSON.parse(saved));
        } catch (e) {
          setAlreadyVoted({ rating: 5 });
        }
      } else {
        setAlreadyVoted(null);
      }
    }
  }, [stall]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectStallChange = (e) => {
    const selectedNum = e.target.value;
    if (selectedNum) {
      navigate(`/rate/${selectedNum}`);
    }
  };

  const getRatingLabel = (score) => {
    switch (score) {
      case 1:
        return '1★ Needs Improvement';
      case 2:
        return '2★ Fair Effort';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stall || alreadyVoted) return;

    try {
      setSubmitting(true);
      setServerFeedback({ success: null, message: '' });

      const finalTags = selectedTags.join(', ');
      const clientToken = getClientToken();

      const res = await apiFetch('/api/stalls/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stall_id: stall.id || stall.stall_number,
          rating,
          reviewer_name: 'Visitor',
          reviewer_contact: '',
          review_text: finalTags,
          client_token: clientToken,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const voteRecord = {
          rating,
          tags: selectedTags,
          timestamp: Date.now(),
        };
        // Securely lock this stall from duplicate votes in browser
        localStorage.setItem(`eclub_voted_${stall.id}`, JSON.stringify(voteRecord));
        localStorage.setItem(`eclub_voted_${stall.stall_number}`, JSON.stringify(voteRecord));
        
        setAlreadyVoted(voteRecord);
        setSubmittedSuccess(true);
        setServerFeedback({
          success: true,
          message: data.message || `Thank you! Your rating for ${stall.name} has been securely recorded.`,
        });
      } else {
        setServerFeedback({
          success: false,
          message: data.message || 'Could not submit rating. Please try again.',
        });
      }
    } catch (err) {
      console.error('Submit review error:', err);
      setServerFeedback({
        success: false,
        message: 'Network connection issue. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const activeRatingDisplay = alreadyVoted ? alreadyVoted.rating : rating;
  const activeTagsDisplay = alreadyVoted && alreadyVoted.tags ? alreadyVoted.tags : selectedTags;

  return (
    <div className="rate-stall-page-wrapper">
      <div className="rate-stall-container">
        {/* Top University & Event Branding Pill */}
        <div className="rate-top-badge-row">
          <div className="rate-brand-chip">
            <i className="fas fa-gem"></i>
            <span>ADAMAS UNIVERSITY E-CLUB</span>
          </div>
          <span className="rate-event-tag">RAKHI STARTUP BAZAAR</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rate-card rate-loading-card">
            <i className="fas fa-spinner fa-spin rate-spinner"></i>
            <h3>Loading Stall Rating Portal...</h3>
            <p>Connecting with the E-Club Evaluation Database</p>
          </div>
        )}

        {/* No Stall Selected / Selector Screen */}
        {!loading && !stall && (
          <div className="rate-card rate-select-card">
            <div className="rate-card-icon-header">
              <i className="fas fa-qrcode"></i>
            </div>
            <h2>Scan Stall QR Code</h2>
            <p className="rate-select-intro">
              Each stall has a unique QR code on-ground. Please scan the QR code located at the physical stall, or select the stall from the list below to submit your rating:
            </p>

            {errorMsg && <div className="rate-alert-warning">{errorMsg}</div>}

            <div className="rate-stall-dropdown-group">
              <label htmlFor="stall-picker-select">Choose Stall to Rate:</label>
              <select
                id="stall-picker-select"
                className="stall-select-dropdown"
                onChange={handleSelectStallChange}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select Stall (#01 to #{allStalls.length || 30}) --
                </option>
                {allStalls.map((s) => (
                  <option key={s.id} value={s.stall_number}>
                    Stall #{s.stall_number}: {s.name} ({s.founders || 'Student Team'})
                  </option>
                ))}
              </select>
            </div>

            <div className="rate-select-footer-links">
              <Link to="/rakhi-stalls" className="btn btn-secondary">
                <i className="fas fa-store"></i> Browse All Stalls Directory
              </Link>
            </div>
          </div>
        )}

        {/* Success / Already Voted Screen (Permanent Lockout) */}
        {!loading && stall && (submittedSuccess || alreadyVoted) && (
          <div className="rate-card rate-success-card animate-scale-up">
            <div className="success-icon-badge">
              <i className="fas fa-check-circle"></i>
            </div>
            <span className="success-pre-title">OFFICIAL RATING RECORDED</span>
            <h2>Thank You for Rating!</h2>
            <p className="success-stall-highlight">
              Your rating for <strong>Stall #{stall.stall_number}: {stall.name}</strong> has been securely logged for the Evaluation Committee.
            </p>

            <div className="submitted-summary-box">
              <div className="summary-row">
                <span>Rating Given:</span>
                <span className="summary-stars">
                  {'★'.repeat(activeRatingDisplay || 5)}{'☆'.repeat(5 - (activeRatingDisplay || 5))} ({activeRatingDisplay || 5}/5 Stars)
                </span>
              </div>
              <div className="summary-row">
                <span>Stall Category:</span>
                <span>{stall.category}</span>
              </div>
              {activeTagsDisplay && activeTagsDisplay.length > 0 && (
                <div className="summary-row">
                  <span>Highlights:</span>
                  <span>{activeTagsDisplay.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="rate-security-badge-note">
              <i className="fas fa-lock"></i>
              <span>Your vote has been officially registered. Single-vote policy active.</span>
            </div>

            <div className="success-actions" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <Link to="/rakhi-stalls" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <i className="fas fa-store"></i> Explore All Stalls
              </Link>
            </div>
          </div>
        )}

        {/* Active Rating Form for the Specific Stall (When not yet voted) */}
        {!loading && stall && !submittedSuccess && !alreadyVoted && (
          <div className="rate-card rate-active-card animate-fade-in">
            {/* Stall Summary Header */}
            <div className="rate-stall-profile-banner">
              <div className="rate-stall-num-badge">Stall #{stall.stall_number}</div>
              <h1 className="rate-stall-title">{stall.name}</h1>
              <span className="rate-stall-cat-chip">{stall.category}</span>

              {stall.founders && (
                <div className="rate-stall-founders">
                  <i className="fas fa-user-circle"></i>
                  <span>
                    <strong>Founder:</strong> {stall.founders}
                  </span>
                </div>
              )}

              {stall.department && (
                <div className="rate-stall-dept">
                  <i className="fas fa-graduation-cap"></i>
                  <span>{stall.department}</span>
                </div>
              )}

              {stall.description && (
                <p className="rate-stall-bio">"{stall.description}"</p>
              )}

              {stall.instagram && (
                <div className="rate-stall-insta-pill">
                  <i className="fab fa-instagram"></i>
                  <span>{stall.instagram.replace('https://www.instagram.com/', '@').replace('https://instagram.com/', '@')}</span>
                </div>
              )}
            </div>

            {/* Error / Alert feedback */}
            {serverFeedback.message && (
              <div
                className={`rate-alert-box ${
                  serverFeedback.success ? 'alert-success' : 'alert-danger'
                }`}
              >
                <i
                  className={`fas ${
                    serverFeedback.success ? 'fa-check-circle' : 'fa-exclamation-triangle'
                  }`}
                ></i>
                <p>{serverFeedback.message}</p>
              </div>
            )}

            {/* Interactive Rating Form */}
            <form onSubmit={handleSubmit} className="rate-interactive-form">
              {/* Star Rating Section */}
              <div className="rate-star-selector-box">
                <label className="rate-section-label">
                  Rate Your Experience with this Stall (1 to 5 Stars) *
                </label>
                <div className="rate-stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`rate-star-btn ${
                        (hoverRating || rating) >= star ? 'active' : ''
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Give ${star} Stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="rate-score-caption">
                  {getRatingLabel(hoverRating || rating)}
                </div>
              </div>

              {/* What stood out about the stall? (Optional) */}
              <div className="rate-tags-section">
                <label className="rate-section-label">What stood out about this stall? (Optional)</label>
                <div className="rate-tags-cloud">
                  {feedbackTagOptions.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className={`rate-tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidentiality Notice */}
              <div className="rate-confidential-notice">
                <i className="fas fa-shield-alt"></i>
                <span>All visitor feedback is submitted directly to the E-Club Evaluation Committee for official winner selection.</span>
              </div>

              {/* Submit CTA Button */}
              <div className="rate-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary rate-submit-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Recording Rating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Rating for Stall #{stall.stall_number}
                    </>
                  )}
                </button>

                <Link to="/rakhi-stalls" className="rate-back-to-directory">
                  ← View All Registered Stalls
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
