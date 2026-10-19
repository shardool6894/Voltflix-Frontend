import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const TOKEN_KEY = 'voltfix_token';

// Logged in = a stored token that hasn't expired (when it's a JWT with an exp claim).
function hasValidToken() {
  let token;
  try {
    token = localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
  } catch {
    // Not a decodable JWT: trust the stored token.
  }
  return true;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(hasValidToken);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Keep in sync if the user signs in or out in another tab.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === TOKEN_KEY || e.key === null) setIsLoggedIn(hasValidToken());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Close the profile menu on outside click or Escape.
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setProfileOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  const handleSignOut = () => {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
    setIsLoggedIn(false);
    setProfileOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/stations', label: 'Stations' },
    { to: '/reports', label: 'Reports' },
    { to: '/stats', label: 'Stats' },
  ];

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2 L4 14 H11 L9 22 L20 8 H13 L13 2 Z" fill="currentColor" />
            </svg>
          </span>
          Voltfix
        </Link>

        {/* Desktop Nav */}
        <nav className={`main-nav${isOpen ? ' is-open' : ''}`} id="main-nav">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="profile-menu" ref={profileRef}>
              <button
                type="button"
                className="sign-in-btn profile-btn"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((o) => !o)}
              >
                Profile
                <svg className="profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {profileOpen && (
                <div className="profile-dropdown" role="menu">
                  <button type="button" role="menuitem" className="profile-dropdown-item" onClick={handleSignOut}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="sign-in-btn" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className={`nav-toggle${isOpen ? ' is-open' : ''}`}
          aria-expanded={isOpen}
          aria-controls="main-nav"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}