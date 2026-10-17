import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './stats.css';

const IconStation = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 L4 14 H11 L9 22 L20 8 H13 L13 2 Z" fill="currentColor" />
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/');
        if (!response.ok) {
          throw new Error(`Failed to load stats (HTTP ${response.status})`);
        }
        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats && [
    {
      key: 'tracked',
      variant: 'volt',
      icon: <IconStation />,
      label: 'Stations tracked',
      value: stats.stationsTracked,
      desc: 'Charging stations currently monitored across the network.',
    },
    {
      key: 'reported',
      variant: 'fault',
      icon: <IconAlert />,
      label: 'Reported today',
      value: stats.reportedToday,
      desc: 'Fault reports submitted by drivers today.',
    },
    {
      key: 'fixed',
      variant: 'live',
      icon: <IconCheck />,
      label: 'Fixed this week',
      value: stats.fixedThisWeek,
      desc: 'Reported faults resolved during the past week.',
    },
  ];

  return (
    <>
      <Navbar />

      <div className="stats-page">
        <div className="wrap">
          <div className="stats-page-header">
            <p className="eyebrow">Network overview</p>
            <h1>Live network stats</h1>
            <p className="section-sub">
              A real-time snapshot of Voltfix-tracked stations and community reports.
            </p>
          </div>

          {loading && (
            <div className="stats-loading">Loading stats…</div>
          )}

          {error && (
            <div className="stats-error" role="alert">{error}</div>
          )}

          {!loading && !error && stats && (
            <>
              <div className="stats-grid">
                {cards.map((card) => (
                  <article key={card.key} className={`stat-card stat-card--${card.variant}`}>
                    <div className="stat-card-top">
                      <span className="stat-label">{card.label}</span>
                      <span className={`stat-card-icon stat-card-icon--${card.variant}`}>
                        {card.icon}
                      </span>
                    </div>
                    <span className={`stat-value stat-value--${card.variant}`}>
                      {card.value ?? '—'}
                    </span>
                    <p className="stat-desc">{card.desc}</p>
                  </article>
                ))}
              </div>

              <div className="stats-cta">
                <p>Seen a problem at a charging station?</p>
                <div className="stats-cta-actions">
                  <Link to="/reports" className="btn btn-primary">Report an issue</Link>
                  <Link to="/stations" className="cta-signin-link">Browse stations →</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>© 2026 Voltfix. Not affiliated with any charging network.</span>
          <span className="footer-links">
            <Link to="/">Back to home</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
