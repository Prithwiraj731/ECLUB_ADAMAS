import React, { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, message: '' });

    try {
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({
          loading: false,
          success: true,
          message: data.message || 'Thank you! Your message has been sent successfully.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          loading: false,
          success: false,
          message: data.message || 'Failed to submit message. Please try again.',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: 'Could not connect to server. Please try again later.',
      });
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <p>Have questions about joining, partnerships, or pitching your venture? Reach out to us!</p>
        </div>

        <div className="contact-container">
          <div className="contact-form">
            {status.message && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  background: status.success ? '#dcfce7' : '#fee2e2',
                  color: status.success ? '#16a34a' : '#dc2626',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <i className={`fas ${status.success ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="student@adamasuniversity.ac.in"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Club Membership Inquiry"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status.loading}>
                {status.loading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Sending...
                  </span>
                ) : (
                  <span>
                    <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i> Send Message
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <h3>Contact Information</h3>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-text">
                <h4>Campus Location</h4>
                <p>Adamas Knowledge City, Barasat - Barrackpore Road, Kolkata - 700126, West Bengal, India</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="info-text">
                <h4>Email Us</h4>
                <p>adamaseclub@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="info-text">
                <h4>Call Us</h4>
                <p>+91 70039 05850</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="info-text">
                <h4>Club Office Hours</h4>
                <p>Monday - Friday: 9:30 AM - 5:30 PM (IST)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
