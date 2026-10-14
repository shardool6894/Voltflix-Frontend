import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './stats.css';

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
            <div className="stats-error">⚠ {error}</div>
          )}

          {!loading && !error && stats && (
            <>
              {/* LCD-style summary panel */}
              <div className="stats-panel-row">
                <div className="panel stats-panel-full">
                  <div className="panel-row">
                    <span className="panel-label">Stations tracked</span>
                    <span className="panel-value">{stats.stationsTracked ?? '—'}</span>
                  </div>
                  <div className="panel-row">
                    <span className="panel-label">Reported today</span>
                    <span className="panel-value panel-value--fault">{stats.reportedToday ?? '—'}</span>
                  </div>
                  <div className="panel-row">
                    <span className="panel-label">Fixed this week</span>
                    <span className="panel-value panel-value--live">{stats.fixedThisWeek ?? '—'}</span>
                  </div>
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
