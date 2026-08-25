import React, { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export default function NoticeBanner() {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotice() {
      try {
        const res = await apiFetch('/api/notices/active');
        const data = await res.json();
        if (data.success && data.notice) {
          setNotice(data.notice);
        }
      } catch (err) {
        console.warn('Could not load live notice:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotice();
  }, []);

  if (loading || !notice) {
    return null; // Do not render if no active notice
  }

  const redirectUrl = notice.link_url ? notice.link_url.trim() : '#contact';
  const isExternal = redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://');

  return (
    <section className="important-notice-section">
      <div className="container">
        <div className="notice-banner">
          <div className="notice-icon-wrapper">
            <div className="notice-icon pulse-ring">
              <i className="fas fa-bell"></i>
            </div>
          </div>
          <div className="notice-content">
            <div className="notice-label">
              <span className="label-badge">{notice.badge_text || 'IMPORTANT NOTICE'}</span>
              <span className="notice-date">
                {notice.created_at
                  ? new Date(notice.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Latest Update'}
              </span>
            </div>
            <h3>
              {redirectUrl !== '#contact' ? (
                <a
                  href={redirectUrl}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {notice.title}
                </a>
              ) : (
                notice.title
              )}
            </h3>
            <p>{notice.content}</p>
          </div>
          <div className="notice-action">
            <a
              href={redirectUrl}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="btn btn-primary"
              aria-label="Open notice link"
              title={redirectUrl !== '#contact' ? 'Open link' : 'Learn more'}
            >
              <i className={isExternal ? 'fas fa-arrow-right' : 'fas fa-arrow-right'}></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
