import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('stalls'); // 'stalls', 'qrcodes', 'events', 'notices', 'inquiries'

  // Stalls & Voting Leaderboard State
  const [stallsLeaderboard, setStallsLeaderboard] = useState([]);
  const [stallReviews, setStallReviews] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [qrSearch, setQrSearch] = useState('');
  const [stallForm, setStallForm] = useState({
    stall_number: '',
    name: '',
    category: 'Rakhi & Festive Products',
    founders: '',
    department: '',
    description: '',
    instagram: '',
    image_url: '',
  });
  const [stallAlert, setStallAlert] = useState({ success: null, message: '' });
  const [stallLoading, setStallLoading] = useState(false);
  const [copiedStallNum, setCopiedStallNum] = useState(null);

  // Events State
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image_url: '',
    is_featured: false,
    registration_link: '#contact',
  });
  const [eventAlert, setEventAlert] = useState({ success: null, message: '' });
  const [eventLoading, setEventLoading] = useState(false);

  // Notices State
  const [notices, setNotices] = useState([]);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    link_url: '',
    is_active: false,
    badge_text: 'IMPORTANT NOTICE',
  });
  const [noticeAlert, setNoticeAlert] = useState({ success: null, message: '' });
  const [noticeLoading, setNoticeLoading] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // Load Data on Mount
  useEffect(() => {
    loadStallsLeaderboard();
    loadStallReviews();
    loadEvents();
    loadNotices();
    loadInquiries();
  }, []);

  const loadStallsLeaderboard = async () => {
    try {
      const res = await apiFetch('/api/stalls/leaderboard');
      const data = await res.json();
      if (data.success) {
        setStallsLeaderboard(data.leaderboard || []);
        setTotalVotes(data.total_votes || 0);
      }
    } catch (e) {
      console.error('Failed to load stalls leaderboard:', e);
    }
  };

  const loadStallReviews = async () => {
    try {
      const res = await apiFetch('/api/stalls/reviews');
      const data = await res.json();
      if (data.success) {
        setStallReviews(data.reviews || []);
      }
    } catch (e) {
      console.error('Failed to load stall reviews:', e);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await apiFetch('/api/events');
      const data = await res.json();
      if (data.success) setEvents(data.events || []);
    } catch (e) {
      console.error('Failed to load events:', e);
    }
  };

  const loadNotices = async () => {
    try {
      const res = await apiFetch('/api/notices');
      const data = await res.json();
      if (data.success) setNotices(data.notices || []);
    } catch (e) {
      console.error('Failed to load notices:', e);
    }
  };

  const loadInquiries = async () => {
    try {
      setInquiryLoading(true);
      const res = await apiFetch('/api/contact');
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries || []);
    } catch (e) {
      console.error('Failed to load inquiries:', e);
    } finally {
      setInquiryLoading(false);
    }
  };

  // Handle Stall Submit
  const handleStallSubmit = async (e) => {
    e.preventDefault();
    setStallLoading(true);
    setStallAlert({ success: null, message: '' });

    try {
      const res = await apiFetch('/api/stalls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stallForm),
      });
      const data = await res.json();

      if (data.success) {
        setStallAlert({ success: true, message: 'Stall successfully added to directory!' });
        setStallForm({
          stall_number: '',
          name: '',
          category: 'Rakhi & Festive Products',
          founders: '',
          department: '',
          description: '',
          instagram: '',
          image_url: '',
        });
        loadStallsLeaderboard();
      } else {
        setStallAlert({ success: false, message: data.message || 'Failed to add stall.' });
      }
    } catch (err) {
      setStallAlert({ success: false, message: 'Server error while creating stall.' });
    } finally {
      setStallLoading(false);
    }
  };

  // Delete Stall
  const handleDeleteStall = async (id, stallName) => {
    if (!window.confirm(`Are you sure you want to delete stall "${stallName}"?`)) return;
    try {
      const res = await apiFetch(`/api/stalls/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadStallsLeaderboard();
      } else {
        alert(data.message || 'Failed to delete stall');
      }
    } catch (e) {
      alert('Failed to delete stall');
    }
  };

  // Handle Event Submit
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setEventLoading(true);
    setEventAlert({ success: null, message: '' });

    try {
      const res = await apiFetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();

      if (data.success) {
        setEventAlert({ success: true, message: 'Event successfully published!' });
        setEventForm({
          title: '',
          date: '',
          location: '',
          description: '',
          image_url: '',
          is_featured: false,
          registration_link: '#contact',
        });
        loadEvents();
      } else {
        setEventAlert({ success: false, message: data.message || 'Failed to create event.' });
      }
    } catch (err) {
      setEventAlert({ success: false, message: 'Server error while creating event.' });
    } finally {
      setEventLoading(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await apiFetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadEvents();
    } catch (e) {
      alert('Failed to delete event');
    }
  };

  // Handle Notice Submit
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setNoticeLoading(true);
    setNoticeAlert({ success: null, message: '' });

    try {
      const res = await apiFetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeForm),
      });
      const data = await res.json();

      if (data.success) {
        setNoticeAlert({ success: true, message: 'Notice successfully published!' });
        setNoticeForm({
          title: '',
          content: '',
          link_url: '',
          is_active: false,
          badge_text: 'IMPORTANT NOTICE',
        });
        loadNotices();
      } else {
        setNoticeAlert({ success: false, message: data.message || 'Failed to create notice.' });
      }
    } catch (err) {
      setNoticeAlert({ success: false, message: 'Server error while creating notice.' });
    } finally {
      setNoticeLoading(false);
    }
  };

  // Toggle Notice Active
  const handleToggleNotice = async (id, currentStatus) => {
    try {
      const res = await apiFetch(`/api/notices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) loadNotices();
    } catch (e) {
      alert('Failed to update notice status');
    }
  };

  // Delete Notice
  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await apiFetch(`/api/notices/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadNotices();
    } catch (e) {
      alert('Failed to delete notice');
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await apiFetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) loadInquiries();
    } catch (e) {
      alert('Failed to delete inquiry');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const copyRatingLink = (stallNum) => {
    const url = `${window.location.origin}/rate/${stallNum}`;
    navigator.clipboard.writeText(url);
    setCopiedStallNum(stallNum);
    setTimeout(() => setCopiedStallNum(null), 2000);
  };

  const filteredQrStalls = stallsLeaderboard.filter((s) => {
    const q = qrSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.stall_number.includes(q) ||
      (s.founders && s.founders.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q))
    );
  });

  const topStall = stallsLeaderboard.length > 0 && stallsLeaderboard[0].total_reviews > 0 ? stallsLeaderboard[0] : null;

  return (
    <div className="admin-layout-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar no-print">
        <div>
          <div className="admin-sidebar-brand" style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <img src="/assets/logo.png" alt="Adamas Logo" style={{ height: '44px', margin: '0 auto 0.75rem auto' }} />
            </div>
            <div className="admin-brand-text">
              <h2 style={{ fontSize: '1.15rem', color: 'var(--white)', margin: 0, letterSpacing: '0.5px' }}>E-Club Admin</h2>
              <p style={{ fontSize: '0.78rem', color: '#A8A39D', margin: '4px 0 0 0' }}>Adamas University</p>
            </div>
            <button
              onClick={handleLogout}
              className="admin-mobile-logout btn btn-secondary"
              style={{ display: 'none', padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>

          <nav className="admin-sidebar-nav" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* Tab 1: Stalls & Voting Leaderboard */}
            <button
              onClick={() => setActiveTab('stalls')}
              className={activeTab === 'stalls' ? 'active-tab' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                color: 'var(--white)',
                background: activeTab === 'stalls' ? 'rgba(139, 13, 26, 0.25)' : 'transparent',
                fontWeight: activeTab === 'stalls' ? '700' : '500',
                borderLeft: activeTab === 'stalls' ? '4px solid var(--primary-color)' : '4px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-trophy" style={{ color: activeTab === 'stalls' ? 'var(--primary-color)' : 'inherit' }}></i>
              <span>Leaderboard &amp; Stalls</span>
            </button>

            {/* Tab 2: Stall QR Codes Hub */}
            <button
              onClick={() => setActiveTab('qrcodes')}
              className={activeTab === 'qrcodes' ? 'active-tab' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                color: 'var(--white)',
                background: activeTab === 'qrcodes' ? 'rgba(139, 13, 26, 0.25)' : 'transparent',
                fontWeight: activeTab === 'qrcodes' ? '700' : '500',
                borderLeft: activeTab === 'qrcodes' ? '4px solid var(--primary-color)' : '4px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-qrcode" style={{ color: activeTab === 'qrcodes' ? 'var(--primary-color)' : 'inherit' }}></i>
              <span>Stall QR Codes Hub</span>
            </button>

            {/* Tab 3: Manage Events */}
            <button
              onClick={() => setActiveTab('events')}
              className={activeTab === 'events' ? 'active-tab' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                color: 'var(--white)',
                background: activeTab === 'events' ? 'rgba(139, 13, 26, 0.25)' : 'transparent',
                fontWeight: activeTab === 'events' ? '700' : '500',
                borderLeft: activeTab === 'events' ? '4px solid var(--primary-color)' : '4px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Manage Events</span>
            </button>

            {/* Tab 4: Live Notices */}
            <button
              onClick={() => setActiveTab('notices')}
              className={activeTab === 'notices' ? 'active-tab' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                color: 'var(--white)',
                background: activeTab === 'notices' ? 'rgba(139, 13, 26, 0.25)' : 'transparent',
                fontWeight: activeTab === 'notices' ? '700' : '500',
                borderLeft: activeTab === 'notices' ? '4px solid var(--primary-color)' : '4px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-bullhorn"></i>
              <span>Live Notices</span>
            </button>

            {/* Tab 5: Inquiries */}
            <button
              onClick={() => setActiveTab('inquiries')}
              className={activeTab === 'inquiries' ? 'active-tab' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                color: 'var(--white)',
                background: activeTab === 'inquiries' ? 'rgba(139, 13, 26, 0.25)' : 'transparent',
                fontWeight: activeTab === 'inquiries' ? '700' : '500',
                borderLeft: activeTab === 'inquiries' ? '4px solid var(--primary-color)' : '4px solid transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-envelope-open-text"></i>
              <span>Inquiries ({inquiries.length})</span>
            </button>

            <div style={{ margin: '1.25rem 0', height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>

            <Link
              to="/rakhi-stalls"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: 'var(--primary-color)',
                background: 'rgba(139, 13, 26, 0.12)',
                border: '1px solid rgba(139, 13, 26, 0.3)',
                fontSize: '0.88rem',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              <i className="fas fa-store"></i> View Stalls Showcase ↗
            </Link>

            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: 'var(--white)',
                opacity: 0.8,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              <i className="fas fa-external-link-alt"></i> View Public Website
            </Link>
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.85rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--white)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-main-panel">
        <div className="admin-panel-header no-print">
          <div>
            <h1 style={{ color: 'var(--secondary-color)', fontSize: '1.85rem', fontWeight: '800', margin: 0 }}>
              {activeTab === 'stalls' && 'Rakhi Startup Bazaar • Live Stalls Leaderboard'}
              {activeTab === 'qrcodes' && 'Stall QR Code Hub & Physical Standees'}
              {activeTab === 'events' && 'Events Management'}
              {activeTab === 'notices' && 'Live Notices Management'}
              {activeTab === 'inquiries' && 'Contact Inquiries & Submissions'}
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-light)', fontSize: '0.92rem' }}>
              Logged in as <strong>{admin?.username || 'admin'}</strong>
            </p>
          </div>

          <div className="admin-header-actions" style={{ display: 'flex', gap: '10px' }}>
            {activeTab === 'qrcodes' && (
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
              >
                <i className="fas fa-print" style={{ marginRight: '6px' }}></i> Print All QR Cards
              </button>
            )}
            <button
              onClick={() => {
                if (activeTab === 'stalls' || activeTab === 'qrcodes') {
                  loadStallsLeaderboard();
                  loadStallReviews();
                } else if (activeTab === 'events') {
                  loadEvents();
                } else if (activeTab === 'notices') {
                  loadNotices();
                } else {
                  loadInquiries();
                }
              }}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
            >
              <i className="fas fa-sync-alt" style={{ marginRight: '6px' }}></i> Refresh
            </button>
          </div>
        </div>

        {/* Tab 1: Rakhi Stalls & Voting Leaderboard */}
        {activeTab === 'stalls' && (
          <div>
            {/* Top Metric Cards */}
            <div className="admin-metric-cards-grid">
              <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>Registered Stalls</p>
                <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--secondary-color)', fontWeight: '900' }}>{stallsLeaderboard.length}</h3>
              </div>

              <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>Total QR Votes Cast</p>
                <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-color)', fontWeight: '900' }}>{totalVotes}</h3>
              </div>

              <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', borderLeft: '4px solid var(--primary-color)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-color)', textTransform: 'uppercase' }}>🏆 Leading Contender</p>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--secondary-color)', fontWeight: '800' }}>
                  {topStall ? `${topStall.name} (#${topStall.stall_number} • ${topStall.avg_rating}★)` : 'No ratings submitted yet'}
                </h4>
              </div>
            </div>

            {/* Live Leaderboard Table */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', margin: 0, fontSize: '1.3rem' }}>
                  <i className="fas fa-trophy" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                  Ranked Stall Leaderboard ({stallsLeaderboard.length || 31} Official University Stalls)
                </h3>
              </div>

              <div className="table-responsive">
                <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#FAF8F5', borderBottom: '2px solid var(--border-light)' }}>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>Rank</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>Stall #</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>Stall Name &amp; Segment</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>Founders &amp; Dept</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>Average Score</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>Total Votes</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>QR Link</th>
                      <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stallsLeaderboard.map((stall, idx) => (
                      <tr key={stall.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: '800', color: idx === 0 && stall.total_reviews > 0 ? 'var(--primary-color)' : 'var(--secondary-color)' }}>
                          {idx === 0 && stall.total_reviews > 0 ? '🥇 #1' : `#${idx + 1}`}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '700' }}>#{stall.stall_number}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <strong style={{ color: 'var(--secondary-color)' }}>{stall.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '2px' }}>{stall.category}</div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                          <div style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>{stall.founders || '—'}</div>
                          <div style={{ fontSize: '0.75rem' }}>{stall.department || ''}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: stall.avg_rating >= 4 ? 'rgba(139, 13, 26, 0.12)' : '#FAF8F5', color: stall.avg_rating >= 4 ? 'var(--primary-color)' : 'var(--secondary-color)', padding: '4px 10px', borderRadius: '12px', fontWeight: '800', fontSize: '0.9rem' }}>
                            ★ {stall.avg_rating} / 5.0
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '700' }}>{stall.total_reviews} reviews</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => copyRatingLink(stall.stall_number)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="Copy direct rating URL"
                          >
                            {copiedStallNum === stall.stall_number ? (
                              <span style={{ color: '#16a34a' }}>✓ Copied</span>
                            ) : (
                              <span><i className="fas fa-copy"></i> Copy Link</span>
                            )}
                          </button>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleDeleteStall(stall.id, stall.name)}
                            style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}
                            title="Delete Stall"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add New Stall Form */}
            <div className="admin-card">
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <i className="fas fa-plus-circle" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> Add Additional Stall
              </h3>

              {stallAlert.message && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: stallAlert.success ? '#dcfce7' : '#fee2e2', color: stallAlert.success ? '#16a34a' : '#dc2626' }}>
                  {stallAlert.message}
                </div>
              )}

              <form onSubmit={handleStallSubmit}>
                <div className="admin-form-grid-3">
                  <div className="form-group">
                    <label>Stall Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 24"
                      value={stallForm.stall_number}
                      onChange={(e) => setStallForm({ ...stallForm, stall_number: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stall / Venture Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artisan Jewels"
                      value={stallForm.name}
                      onChange={(e) => setStallForm({ ...stallForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category / Segment *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rakhi & Festive Products"
                      value={stallForm.category}
                      onChange={(e) => setStallForm({ ...stallForm, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-equal-3">
                  <div className="form-group">
                    <label>Founders / Team</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sen"
                      value={stallForm.founders}
                      onChange={(e) => setStallForm({ ...stallForm, founders: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Department / School</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE (SOET) • 3rd Year"
                      value={stallForm.department}
                      onChange={(e) => setStallForm({ ...stallForm, department: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Instagram Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. @artisanjewels"
                      value={stallForm.instagram}
                      onChange={(e) => setStallForm({ ...stallForm, instagram: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Product Description &amp; Offerings</label>
                  <textarea
                    rows="3"
                    placeholder="Describe products, pricing, and specialty..."
                    value={stallForm.description}
                    onChange={(e) => setStallForm({ ...stallForm, description: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={stallLoading}>
                  {stallLoading ? 'Adding Stall...' : 'Save & Register Stall'}
                </button>
              </form>
            </div>

            {/* Live Review Feed */}
            <div className="admin-card">
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <i className="fas fa-comments" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                Live Visitor Ratings &amp; Feedback Feed ({stallReviews.length})
              </h3>

              {stallReviews.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                  No reviews submitted yet. When visitors scan on-ground stall QR codes, their private ratings will stream here in real-time.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stallReviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: '#FAF8F5',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div>
                          <strong style={{ color: 'var(--secondary-color)', fontSize: '1.05rem' }}>{rev.stall_name}</strong>
                          <span style={{ marginLeft: '8px', color: 'var(--primary-color)', fontWeight: '700', fontSize: '0.85rem' }}>
                            (Stall #{rev.stall_number || '—'})
                          </span>
                        </div>
                        <span style={{ fontSize: '1.1rem', color: 'var(--primary-color)', fontWeight: '800' }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)} ({rev.rating}/5)
                        </span>
                      </div>

                      <p style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                        "{rev.review_text || 'No written comment'}"
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '8px' }}>
                        <span>
                          <i className="fas fa-user"></i> {rev.reviewer_name || 'Anonymous Visitor'} {rev.reviewer_contact ? `(${rev.reviewer_contact})` : ''}
                        </span>
                        <span>{new Date(rev.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Stall QR Codes Hub */}
        {activeTab === 'qrcodes' && (
          <div>
            <div className="admin-card no-print" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', color: 'var(--secondary-color)', fontSize: '1.25rem' }}>
                    <i className="fas fa-qrcode" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                    Physical Stall Standees &amp; QR Hub
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.88rem' }}>
                    Each stall has a dedicated QR code. Visitors who scan Stall #05's QR code will be routed directly to <code>{window.location.origin}/rate/05</code> to rate only that stall.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Filter by stall number or name..."
                    value={qrSearch}
                    onChange={(e) => setQrSearch(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.88rem' }}
                  />
                  <button onClick={() => window.print()} className="btn btn-primary">
                    <i className="fas fa-print"></i> Print QR Standees (A4)
                  </button>
                </div>
              </div>
            </div>

            {/* Standee Cards Grid */}
            <div className="admin-standees-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {filteredQrStalls.map((stall) => {
                const targetUrl = `${window.location.origin}/rate/${stall.stall_number}`;
                return (
                  <div
                    key={stall.id}
                    className="stall-standee-card"
                    style={{
                      background: 'var(--white)',
                      borderRadius: '20px',
                      border: '2px solid rgba(139, 13, 26, 0.25)',
                      padding: '1.75rem 1.5rem',
                      textAlign: 'center',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pageBreakInside: 'avoid',
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      {/* Standee Top Header */}
                      <div style={{ borderBottom: '2px solid #8B0D1A', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800', color: '#8B0D1A', display: 'block' }}>
                          ADAMAS UNIVERSITY E-CLUB
                        </span>
                        <h4 style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: '#0B0B0B', fontWeight: '800' }}>
                          RAKHI STARTUP BAZAAR
                        </h4>
                      </div>

                      {/* Stall Number Badge */}
                      <div
                        style={{
                          background: '#8B0D1A',
                          color: '#F5F2ED',
                          fontWeight: '900',
                          fontSize: '1.1rem',
                          padding: '6px 18px',
                          borderRadius: '20px',
                          display: 'inline-block',
                          marginBottom: '0.75rem',
                          boxShadow: '0 4px 12px rgba(139, 13, 26, 0.3)',
                        }}
                      >
                        STALL #{stall.stall_number}
                      </div>

                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: '900', color: '#0B0B0B' }}>
                        {stall.name}
                      </h3>

                      <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>
                        {stall.founders}
                      </p>

                      <span style={{ display: 'inline-block', background: '#F4EBE1', color: '#8B0D1A', fontSize: '0.72rem', fontWeight: '750', padding: '3px 10px', borderRadius: '10px', marginBottom: '1.25rem' }}>
                        {stall.category}
                      </span>
                    </div>

                    {/* QR Code SVG Frame */}
                    <div
                      style={{
                        padding: '12px',
                        background: '#FFFFFF',
                        border: '2px dashed rgba(139, 13, 26, 0.4)',
                        borderRadius: '16px',
                        display: 'inline-block',
                        marginBottom: '1rem',
                      }}
                    >
                      <QRCodeSVG
                        value={targetUrl}
                        size={170}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <div style={{ width: '100%' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.82rem', fontWeight: '800', color: '#8B0D1A' }}>
                        <i className="fas fa-camera"></i> SCAN TO RATE &amp; VOTE
                      </p>
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.7rem', color: '#777', wordBreak: 'break-all' }}>
                        {targetUrl}
                      </p>

                      {/* Card Actions (Hidden in Print) */}
                      <div className="no-print" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <a
                          href={`/rate/${stall.stall_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <i className="fas fa-external-link-alt"></i> Open
                        </a>
                        <button
                          onClick={() => copyRatingLink(stall.stall_number)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          {copiedStallNum === stall.stall_number ? '✓ Copied' : 'Copy URL'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Events Management */}
        {activeTab === 'events' && (
          <div>
            <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <i className="fas fa-plus-circle" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> Publish New Event
              </h3>

              {eventAlert.message && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: eventAlert.success ? '#dcfce7' : '#fee2e2', color: eventAlert.success ? '#16a34a' : '#dc2626' }}>
                  {eventAlert.message}
                </div>
              )}

              <form onSubmit={handleEventSubmit}>
                <div className="form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. HACK-A-VENTURE 2026"
                  />
                </div>

                <div className="admin-form-grid-2">
                  <div className="form-group">
                    <label>Date &amp; Time</label>
                    <input
                      type="text"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      placeholder="e.g. March 15-16, 2026"
                    />
                  </div>
                  <div className="form-group">
                    <label>Campus Location</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="e.g. Main Auditorium"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    rows="3"
                    required
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Event overview, agenda, prizes..."
                  ></textarea>
                </div>

                <div className="admin-form-grid-2" style={{ marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label>Image URL / Poster Asset</label>
                    <input
                      type="text"
                      value={eventForm.image_url}
                      onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                      placeholder="/assets/rakhi.jpeg"
                    />
                  </div>
                  <div className="form-group">
                    <label>Registration Link</label>
                    <input
                      type="text"
                      value={eventForm.registration_link}
                      onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })}
                      placeholder="https://forms.gle/..."
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={eventForm.is_featured}
                      onChange={(e) => setEventForm({ ...eventForm, is_featured: e.target.checked })}
                    />
                    <span>Set as Featured Event on Homepage</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={eventLoading}>
                  {eventLoading ? 'Publishing...' : 'Publish Event'}
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="admin-card">
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                Existing Published Events ({events.length})
              </h3>

              {events.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No events published yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: '#FAF8F5',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--secondary-color)' }}>{evt.title}</strong>
                          {evt.is_featured && (
                            <span style={{ background: 'var(--primary-color)', color: 'var(--off-white)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                              FEATURED
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-light)', fontSize: '0.88rem' }}>
                          <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                          {evt.date || 'Date TBA'} • <i className="fas fa-map-marker-alt" style={{ margin: '0 6px 0 10px' }}></i>
                          {evt.location || 'Adamas Campus'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Notices */}
        {activeTab === 'notices' && (
          <div>
            <div className="admin-card" style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <i className="fas fa-bullhorn" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> Broadcast Notice
              </h3>

              {noticeAlert.message && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: noticeAlert.success ? '#dcfce7' : '#fee2e2', color: noticeAlert.success ? '#16a34a' : '#dc2626' }}>
                  {noticeAlert.message}
                </div>
              )}

              <form onSubmit={handleNoticeSubmit}>
                <div className="form-group">
                  <label>Notice Headline *</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="e.g. Recruitment Drive 2026 Open!"
                  />
                </div>

                <div className="form-group">
                  <label>Notice Content *</label>
                  <textarea
                    rows="3"
                    required
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    placeholder="Detailed notice announcement..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Redirection Link / Google Form URL (Optional)</label>
                  <input
                    type="text"
                    value={noticeForm.link_url}
                    onChange={(e) => setNoticeForm({ ...noticeForm, link_url: e.target.value })}
                    placeholder="e.g. https://forms.gle/W9u2ewPSW5u2tS7t9"
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    When visitors click the notice arrow button on the homepage banner, it will automatically open this link.
                  </small>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={noticeForm.is_active}
                      onChange={(e) => setNoticeForm({ ...noticeForm, is_active: e.target.checked })}
                    />
                    <span>Activate Notice Immediately (Shows in Live Homepage Banner)</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={noticeLoading}>
                  {noticeLoading ? 'Broadcasting...' : 'Broadcast Notice'}
                </button>
              </form>
            </div>

            {/* Notices List */}
            <div className="admin-card">
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                Notice Archives ({notices.length})
              </h3>

              {notices.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: '#FAF8F5',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong>{n.title}</strong>
                      <span style={{ background: n.is_active ? '#16a34a' : '#9ca3af', color: 'var(--white)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {n.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-light)', fontSize: '0.88rem' }}>{n.content}</p>
                    {n.link_url && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--primary-color)' }}>
                        <i className="fas fa-link" style={{ marginRight: '4px' }}></i>
                        <a href={n.link_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                          {n.link_url}
                        </a>
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleNotice(n.id, n.is_active)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      {n.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(n.id)}
                      style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="admin-card">
            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <i className="fas fa-inbox" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i> Incoming Contact Messages ({inquiries.length})
            </h3>

            {inquiries.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No messages submitted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {inquiries.map((inq) => (
                  <div key={inq.id} style={{ padding: '1.25rem', borderRadius: '12px', background: '#FAF8F5', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>{inq.name} ({inq.email})</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(inq.created_at).toLocaleString()}</span>
                    </div>
                    <p style={{ fontWeight: '700', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>{inq.subject}</p>
                    <p style={{ margin: 0, color: 'var(--text-dark)', lineHeight: '1.6' }}>{inq.message}</p>
                    <div style={{ marginTop: '8px', textAlign: 'right' }}>
                      <button onClick={() => handleDeleteInquiry(inq.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <i className="fas fa-trash-alt"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
