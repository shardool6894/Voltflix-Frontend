import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './auth.css';

/* SVG icons as tiny components */
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconArrow = () => (
  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const BoltLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 L4 14 H11 L9 22 L20 8 H13 L13 2 Z" fill="currentColor" />
  </svg>
);

export default function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [status, setStatus] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  const [signinForm, setSigninForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!signinForm.email || !signinForm.password) {
      setStatus({ text: 'Please fill in all fields.', isError: true });
      return;
    }
    setLoading(true);
    setStatus({ text: 'Signing in…', isError: false });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: signinForm.email, password: signinForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      if (data.token) localStorage.setItem('voltfix_token', data.token);
      setStatus({ text: '✓ Signed in! Redirecting…', isError: false });
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setStatus({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setStatus({ text: 'Please fill in all fields.', isError: true });
      return;
    }
    setLoading(true);
    setStatus({ text: 'Creating account…', isError: false });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: signupForm.name, email: signupForm.email, password: signupForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      if (data.token) localStorage.setItem('voltfix_token', data.token);
      setStatus({ text: '✓ Account created! Redirecting…', isError: false });
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setStatus({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card-header">
            <Link to="/" className="auth-logo">
              <span className="auth-logo-mark"><BoltLogo /></span>
              <span className="auth-logo-text">Voltfix</span>
            </Link>
            <p className="eyebrow">Driver Portal</p>
            <h2 className="auth-title">
              {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="auth-subtitle">
              {activeTab === 'signin'
                ? 'Sign in to your Voltfix account'
                : 'Join Voltfix to report & track charger issues'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs" role="tablist">
            <button
              className={`auth-tab-btn${activeTab === 'signin' ? ' is-active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'signin'}
              onClick={() => { setActiveTab('signin'); setStatus({ text: '', isError: false }); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn${activeTab === 'signup' ? ' is-active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'signup'}
              onClick={() => { setActiveTab('signup'); setStatus({ text: '', isError: false }); }}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form className="auth-form" onSubmit={handleSignin} noValidate>
              <div className="form-row">
                <label htmlFor="signin-email">Email address</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMail /></span>
                  <input
                    type="email"
                    id="signin-email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={signinForm.email}
                    onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="signin-password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock /></span>
                  <input
                    type="password"
                    id="signin-password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={signinForm.password}
                    onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-glow" disabled={loading}>
                {loading ? 'Signing in…' : <><span>Sign In</span> <IconArrow /></>}
              </button>

              {status.text && (
                <p className={`auth-status${status.isError ? ' is-error' : ''}`} role="status" aria-live="polite">
                  {status.text}
                </p>
              )}
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form className="auth-form" onSubmit={handleSignup} noValidate>
              <div className="form-row">
                <label htmlFor="signup-name">Full name</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconUser /></span>
                  <input
                    type="text"
                    id="signup-name"
                    placeholder="Your name"
                    autoComplete="name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="signup-email">Email address</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconMail /></span>
                  <input
                    type="email"
                    id="signup-email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="signup-password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock /></span>
                  <input
                    type="password"
                    id="signup-password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-glow" disabled={loading}>
                {loading ? 'Creating account…' : <><span>Create account</span> <IconArrow /></>}
              </button>

              {status.text && (
                <p className={`auth-status${status.isError ? ' is-error' : ''}`} role="status" aria-live="polite">
                  {status.text}
                </p>
              )}
            </form>
          )}

          <Link to="/" className="auth-back">← Back to Voltfix</Link>
        </div>
      </div>
    </>
  );
}