import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import GlobalChat from '../components/GlobalChat/GlobalChat';
import './pages.css';
import './home.css';

export default function Reports() {
  /* ── Report form state ─────────────────────────── */
  const [formData, setFormData] = useState({
    stationName: '', issueType: '', description: '', reporterName: '', photo: null,
  });
  const [formStatus, setFormStatus] = useState({ text: '', isError: false });
  const [submitting, setSubmitting] = useState(false);

  /* ── Feed state ────────────────────────────────── */
  const [feed, setFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState(null);

  /* ── Data fetching ─────────────────────────────── */
  const fetchFeed = async () => {
    try {
      setFeedLoading(true);
      const res = await fetch('/api/reports/');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setFeed(data.data);
    } catch (err) {
      setFeedError(err.message);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  /* ── Handlers ──────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] ?? null : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.stationName || !formData.issueType || !formData.description) {
      setFormStatus({ text: 'Please fill in all required fields.', isError: true });
      return;
    }
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append('stationName', formData.stationName);
      body.append('issueType', formData.issueType);
      body.append('description', formData.description);
      if (formData.reporterName) body.append('reporterName', formData.reporterName);
      if (formData.photo) body.append('photo', formData.photo);

      const res = await fetch('/api/reports/', { method: 'POST', body });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setFormData({ stationName: '', issueType: '', description: '', reporterName: '', photo: null });
      setFormStatus({ text: '✓ Report submitted — appearing in feed.', isError: false });
      setTimeout(() => setFormStatus({ text: '', isError: false }), 5000);
      await fetchFeed();
    } catch (err) {
      setFormStatus({ text: `Error: ${err.message}`, isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = Date.now() - new Date(iso).getTime();
    const m = Math.floor(d / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <>
      <Navbar />

      <div className="reports-page">
        <div className="wrap">
          {/* ── Page header ─────────────────────── */}
          <div className="reports-page-header">
            <p className="eyebrow">Driver Reporting</p>
            <h1>Report a charging problem</h1>
            <p className="section-sub">Takes about a minute. No account required.</p>
          </div>

          {/* ── Top row: Form + Chat ────────────── */}
          <div className="reports-layout">
            {/* Left: Report form */}
            <form className="report-form-card" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="r-station-name">Station name or address *</label>
                <input type="text" id="r-station-name" name="stationName"
                  placeholder="e.g. Riverside Mall — Bay 3"
                  value={formData.stationName} onChange={handleChange} required />
              </div>

              <div className="form-row form-row--split">
                <div>
                  <label htmlFor="r-issue-type">Issue type *</label>
                  <select id="r-issue-type" name="issueType"
                    value={formData.issueType} onChange={handleChange} required>
                    <option value="" disabled>Select an issue</option>
                    <option value="Not charging">Connector won't charge</option>
                    <option value="Blocked bay">Bay blocked / ICEd</option>
                    <option value="Screen/payment">Screen or payment not working</option>
                    <option value="Damaged">Physically damaged</option>
                    <option value="Power outage">Power outage</option>
                    <option value="Connector damaged">Connector damaged</option>
                    <option value="Network issue">Network issue</option>
                    <option value="Other">Something else</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="r-photo">Photo (optional)</label>
                  <input type="file" id="r-photo" name="photo" accept="image/*" onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="r-issue-desc">What happened? *</label>
                <textarea id="r-issue-desc" name="description" rows="4"
                  placeholder="Screen shows an error code, connector won't latch, etc."
                  value={formData.description} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <label htmlFor="r-reporter-name">Your name (optional)</label>
                <input type="text" id="r-reporter-name" name="reporterName"
                  placeholder="Stays anonymous if left blank"
                  value={formData.reporterName} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit report'}
              </button>

              {formStatus.text && (
                <p className={`form-status${formStatus.isError ? ' is-error' : ''}`} role="status" aria-live="polite">
                  {formStatus.text}
                </p>
              )}
            </form>

            {/* Right: Global chat */}
            <GlobalChat />
          </div>

          {/* ── Feed ────────────────────────────── */}
          <div className="reports-feed-col">
            <h2>Recent reports</h2>
            <p className="section-sub">Live from drivers across the network.</p>

            {feedLoading && <div className="feed-empty">Loading reports…</div>}
            {feedError && <div className="feed-empty" style={{ color: 'var(--accent-fault)' }}>⚠ {feedError}</div>}

            {!feedLoading && !feedError && (
              feed.length === 0 ? (
                <div className="feed-empty">No reports yet — be the first.</div>
              ) : (
                <ul className="feed-list">
                  {feed.map((item) => (
                    <li key={item._id} className="feed-item">
                      <span className="feed-issue-type">{item.issueType}</span>
                      <div className="feed-body">
                        <h4>{item.stationName}</h4>
                        <p>{item.description}</p>
                      </div>
                      <div className="feed-footer">
                        <span className="feed-reporter">Reported by {item.reporterName || 'Anonymous'}</span>
                        <span className="feed-time">{formatTime(item.createdAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>© 2026 Voltfix. Not affiliated with any charging network.</span>
          <span className="footer-links"><Link to="/">Back to home</Link></span>
        </div>
      </footer>
    </>
  );
}