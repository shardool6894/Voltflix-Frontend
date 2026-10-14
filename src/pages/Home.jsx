import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './home.css';

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 L4 14 H11 L9 22 L20 8 H13 L13 2 Z" fill="currentColor" />
  </svg>
);

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────── */}
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">Community-powered EV reliability</p>
              <h1>Broken chargers shouldn't ruin your trip.</h1>
              <p className="hero-sub">
                Voltfix is a live network of driver reports. Find working stations, flag broken ones,
                and keep the community moving — all in under a minute.
              </p>
              <div className="hero-actions">
                <Link to="/stations" className="btn btn-primary">Browse stations</Link>
                <Link to="/reports" className="hero-ghost-link">Report a problem →</Link>
              </div>
            </div>

            <div className="hero-panel-wrap">
              <div className="panel">
                <div className="panel-row">
                  <span className="panel-label">stations tracked</span>
                  <span className="panel-value">—</span>
                </div>
                <div className="panel-row">
                  <span className="panel-label">reported today</span>
                  <span className="panel-value panel-value--fault">—</span>
                </div>
                <div className="panel-row">
                  <span className="panel-label">fixed this week</span>
                  <span className="panel-value panel-value--live">—</span>
                </div>
              </div>
              <Link to="/stats" className="panel-footer-link">
                View full network stats →
              </Link>
            </div>
          </div>
        </section>

        {/* ── NAV CARDS ────────────────────────────────── */}
        <section className="nav-cards-section">
          <div className="wrap">
            <div className="nav-cards-grid">
              <Link to="/stations" className="nav-card">
                <div className="nav-card-top">
                  <div className="nav-card-icon nav-card-icon--volt">
                    <BoltIcon />
                  </div>
                  <span className="nav-card-arrow">→</span>
                </div>
                <h3>Stations</h3>
                <p>Browse the live map of charging stations. Filter by availability — available, in-use, or faulty.</p>
                <div className="nav-card-meta">
                  <span>Search by address, network, or connector type</span>
                </div>
              </Link>

              <Link to="/reports" className="nav-card">
                <div className="nav-card-top">
                  <div className="nav-card-icon nav-card-icon--fault">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <span className="nav-card-arrow">→</span>
                </div>
                <h3>Reports</h3>
                <p>Spotted a broken charger? Submit a fault report in under a minute. No account needed.</p>
                <div className="nav-card-meta">
                  <span>Global driver chat on this page</span>
                </div>
              </Link>

              <Link to="/stats" className="nav-card">
                <div className="nav-card-top">
                  <div className="nav-card-icon nav-card-icon--live">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <span className="nav-card-arrow">→</span>
                </div>
                <h3>Stats</h3>
                <p>Live network metrics — stations tracked, issues reported today, and faults resolved this week.</p>
                <div className="nav-card-meta">
                  <span>Updated in real time</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section className="how-section">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">How it works</p>
              <h2>Three steps. Under a minute.</h2>
            </div>
            <ol className="steps">
              <li>
                <span className="step-num">01</span>
                <h3>Find a station</h3>
                <p>
                  Browse the live station list. Green means go, amber means occupied, red means a
                  driver has flagged a fault in the last 24 hours.
                </p>
              </li>
              <li>
                <span className="step-num">02</span>
                <h3>Flag a problem</h3>
                <p>
                  Pick the station, choose an issue type, add a photo if you can. Every report
                  updates the station status immediately for other drivers behind you.
                </p>
              </li>
              <li>
                <span className="step-num">03</span>
                <h3>Help gets dispatched</h3>
                <p>
                  Repeated reports on the same station get escalated to the network operator. Resolved
                  faults are tracked in Stats so the community can see what's improving.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── CTA STRIP ────────────────────────────────── */}
        <section className="cta-strip-section">
          <div className="wrap cta-strip-inner">
            <div className="cta-strip-copy">
              <h2>Track your reports. Get updates.</h2>
              <p>
                Create a free account to see the status of issues you've reported and get notified
                when they're fixed.
              </p>
            </div>
            <div className="cta-strip-actions">
              <Link to="/auth" className="btn btn-primary">Create account</Link>
              <Link to="/auth" className="hero-ghost-link">Sign in →</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>© 2026 Voltfix. Not affiliated with any charging network.</span>
          <span className="footer-links">
            <Link to="/stations">Stations</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/stats">Stats</Link>
          </span>
        </div>
      </footer>
    </>
  );
}