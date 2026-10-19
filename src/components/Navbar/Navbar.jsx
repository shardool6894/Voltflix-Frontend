import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOKEN_KEY, hasSession } from '../../utils/auth';
import './navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(hasSession);

  // Keep in sync if the user signs in or out in another tab.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === TOKEN_KEY || e.key === null) setIsLoggedIn(hasSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
            <Link to="/profile" className="sign-in-btn" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
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