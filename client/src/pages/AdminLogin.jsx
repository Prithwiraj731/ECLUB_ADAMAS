import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid username or password.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B0B0B',
        padding: '2rem',
        position: 'relative',
      }}
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 13, 26, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      ></div>

      <div
        style={{
          background: '#F5F2ED',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2.5rem',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(139, 13, 26, 0.2)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/assets/logo.png"
            alt="Adamas E-Club Logo"
            style={{ height: '56px', margin: '0 auto 1rem auto' }}
          />
          <h1 style={{ fontSize: '1.75rem', color: '#0B0B0B', marginBottom: '0.25rem' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#635E58', margin: 0, fontSize: '0.92rem' }}>
            Sign in to manage E-Club events & notices
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(139, 13, 26, 0.1)',
              color: '#8B0D1A',
              border: '1px solid rgba(139, 13, 26, 0.3)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="adminUsername">Username</label>
            <input
              type="text"
              id="adminUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. admin"
              autoComplete="username"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="adminPassword">Password</label>
            <input
              type="password"
              id="adminPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Authenticating...
              </span>
            ) : (
              <span>
                <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i> Sign In
              </span>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
          <Link
            to="/"
            style={{ color: '#0B0B0B', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fas fa-arrow-left"></i> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
