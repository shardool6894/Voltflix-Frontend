import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { hasSession, clearSession } from '../utils/auth';
import './stats.css'; // shares the stat-card styles
import './profile.css';

const PAGE_SIZE = 10;

const FILTERS = ['all', 'open', 'in_progress', 'resolved', 'closed'];
const FILTER_LABELS = {
  all: 'All',
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
};
const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

/* ── Icons ─────────────────────────────────────────── */
const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
const IconTotal = () => (
  <svg {...svgProps}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);
const IconOpen = () => (
  <svg {...svgProps}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconProgress = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconResolved = () => (
  <svg {...svgProps}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ── Helpers ───────────────────────────────────────── */
const initialsOf = (name = '') =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '';

const formatMonthYear = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—';

const reportsUrl = (status, page) =>
  `/api/reports/mine?page=${page}&limit=${PAGE_SIZE}${status === 'all' ? '' : `&status=${status}`}`;

// The browser sends the 7-day refresh cookie automatically; the backend accepts it on its own.
async function api(path, options = {}) {
  const res = await fetch(path, { credentials: 'include', ...options });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `Request failed (HTTP ${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);

  // A 401 means the session is gone (expired cookie, signed out elsewhere): go back to sign in.
  const fail = useCallback((err) => {
    if (err.status === 401) {
      clearSession();
      navigate('/auth', { replace: true });
    } else {
      setError(err.message);
    }
  }, [navigate]);

  const applyReports = (body, append) => {
    setReports((prev) => (append ? [...prev, ...body.data] : body.data));
    setSummary(body.summary);
    setPagination(body.pagination);
  };

  useEffect(() => {
    if (!hasSession()) {
      navigate('/auth', { replace: true });
      return undefined;
    }
    let cancelled = false;
    Promise.all([api('/api/auth/me'), api(reportsUrl('all', 1))])
      .then(([me, mine]) => {
        if (cancelled) return;
        setUser(me.data);
        applyReports(mine, false);
      })
      .catch((err) => { if (!cancelled) fail(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [navigate, fail]);

  const changeFilter = (next) => {
    if (next === filter || listLoading) return;
    setFilter(next);
    setListLoading(true);
    api(reportsUrl(next, 1))
      .then((body) => applyReports(body, false))
      .catch(fail)
      .finally(() => setListLoading(false));
  };

  const loadMore = () => {
    if (listLoading || !pagination) return;
    setListLoading(true);
    api(reportsUrl(filter, pagination.currentPage + 1))
      .then((body) => applyReports(body, true))
      .catch(fail)
      .finally(() => setListLoading(false));
  };

  const handleSignOut = async () => {
    // Only the server can clear the httpOnly refresh cookie, so ask it to.
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // offline: still sign out locally
    }
    clearSession();
    navigate('/');
  };

  const stats = summary && [
    { key: 'total', variant: 'volt', icon: <IconTotal />, label: 'Total reports', value: summary.total },
    { key: 'open', variant: 'fault', icon: <IconOpen />, label: 'Open', value: summary.open },
    { key: 'progress', variant: 'volt', icon: <IconProgress />, label: 'In progress', value: summary.in_progress },
    { key: 'resolved', variant: 'live', icon: <IconResolved />, label: 'Resolved', value: summary.resolved },
  ];

  const chipCount = (f) => (summary ? (f === 'all' ? summary.total : summary[f]) : 0);
  const hasMore = pagination && pagination.currentPage < pagination.totalPages;

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="wrap">
          <div className="profile-header">
            <div>
              <p className="eyebrow">Account</p>
              <h1>Dashboard</h1>
              <p className="section-sub">
                Your account details and every report you have submitted.
              </p>
            </div>
            <button type="button" className="btn profile-signout" onClick={handleSignOut}>
              Sign out
            </button>
          </div>

          {loading && <div className="stats-loading">Loading your dashboard…</div>}
          {error && <div className="stats-error" role="alert">{error}</div>}

          {!loading && !error && user && (
            <>
              {/* ── Account + summary ───────────────── */}
              <div className="profile-top">
                <section className="profile-card" aria-label="Account details">
                  <div className="profile-identity">
                    <span className="profile-avatar" aria-hidden="true">{initialsOf(user.name)}</span>
                    <div className="profile-identity-text">
                      <h2>{user.name}</h2>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <dl className="profile-details">
                    <div className="profile-detail">
                      <dt>Role</dt>
                      <dd><span className="role-pill">{user.role === 'admin' ? 'Admin' : 'Driver'}</span></dd>
                    </div>
                    <div className="profile-detail">
                      <dt>Member since</dt>
                      <dd>{formatMonthYear(user.createdAt)}</dd>
                    </div>
                    <div className="profile-detail">
                      <dt>Reports submitted</dt>
                      <dd>{summary.total}</dd>
                    </div>
                  </dl>
                </section>

                <div className="profile-stats">
                  {stats.map((s) => (
                    <article key={s.key} className={`stat-card stat-card--${s.variant}`}>
                      <div className="stat-card-top">
                        <span className="stat-label">{s.label}</span>
                        <span className={`stat-card-icon stat-card-icon--${s.variant}`}>{s.icon}</span>
                      </div>
                      <span className={`stat-value stat-value--${s.variant}`}>{s.value}</span>
                    </article>
                  ))}
                </div>
              </div>

              {/* ── Reports ─────────────────────────── */}
              <section className="profile-reports" aria-label="Your reports">
                <div className="profile-reports-head">
                  <h2>Your reports</h2>
                  <div className="filter-chips" role="group" aria-label="Filter reports by status">
                    {FILTERS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`chip${filter === f ? ' is-active' : ''}`}
                        onClick={() => changeFilter(f)}
                        disabled={listLoading}
                      >
                        {FILTER_LABELS[f]} ({chipCount(f)})
                      </button>
                    ))}
                  </div>
                </div>

                {reports.length === 0 && !listLoading && (
                  <div className="feed-empty">
                    {filter === 'all' ? (
                      <>
                        You have not submitted any reports yet.{' '}
                        <Link to="/reports" className="profile-inline-link">Report a charging problem</Link>
                      </>
                    ) : (
                      `No ${FILTER_LABELS[filter].toLowerCase()} reports.`
                    )}
                  </div>
                )}

                {reports.length > 0 && (
                  <ul className={`profile-report-list${listLoading ? ' is-loading' : ''}`}>
                    {reports.map((r) => (
                      <li key={r._id} className={`profile-report profile-report--${r.status}`}>
                        <div className="profile-report-top">
                          <span className="profile-report-type">{r.issueType}</span>
                          <span className={`report-status report-status--${r.status}`}>
                            {STATUS_LABELS[r.status] || r.status}
                          </span>
                        </div>
                        <h3>{r.stationName}</h3>
                        <p>{r.description}</p>
                        <div className="profile-report-foot">
                          <span className="feed-time">{formatDateTime(r.createdAt)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {reports.length > 0 && (
                  <div className="profile-reports-foot">
                    <span className="profile-count">
                      Showing {reports.length} of {pagination.totalItems}
                    </span>
                    {hasMore && (
                      <button type="button" className="btn profile-more" onClick={loadMore} disabled={listLoading}>
                        {listLoading ? 'Loading…' : 'Load more'}
                      </button>
                    )}
                  </div>
                )}
              </section>
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
