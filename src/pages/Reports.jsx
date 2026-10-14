import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './pages.css';
import './home.css';

/* ── Icons ─────────────────────────────────────────── */
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9l20-7z" />
  </svg>
);

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

  /* ── Global chat state ─────────────────────────── */
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: 'Ravi K.', text: 'Anyone tried the Ather hub near Kazipet today?', time: '14 min ago', isSystem: false },
    { id: 2, author: 'Priya M.', text: 'Yeah it was down this morning, back up now.', time: '11 min ago', isSystem: false },
    { id: 3, author: 'System', text: 'New report: Not charging @ NIT Warangal Campus Hub', time: '7 min ago', isSystem: true },
    { id: 4, author: 'Anon', text: 'Bay 3 at Riverside is blocked by an ICE vehicle again 🙄', time: '3 min ago', isSystem: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatName, setChatName] = useState('');
  const chatEndRef = useRef(null);

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
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

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

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      author: chatName.trim() || 'Anonymous',
      text: chatInput.trim(),
      time: 'just now',
      isSystem: false,
    }]);
    setChatInput('');
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
            <div className="chat-panel">
              <div className="chat-panel-header">
                <div className="chat-header-left">
                  <span className="chat-live-dot" aria-hidden="true" />
                  <h3>Global chat</h3>
                </div>
                <span className="chat-online-count">{chatMessages.filter(m => !m.isSystem).length} in chat</span>
              </div>

              <div className="chat-messages" role="log" aria-live="polite">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`chat-msg${msg.isSystem ? ' chat-msg--system' : ''}`}>
                    {msg.isSystem ? (
                      <span className="chat-system-text">{msg.text}</span>
                    ) : (
                      <>
                        <div className="chat-msg-meta">
                          <span className="chat-author">{msg.author}</span>
                          <span className="chat-time">{msg.time}</span>
                        </div>
                        <p className="chat-text">{msg.text}</p>
                      </>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form className="chat-compose" onSubmit={handleChatSend}>
                <input
                  className="chat-name-input"
                  type="text"
                  placeholder="Name (optional)"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  maxLength={32}
                />
                <div className="chat-input-row">
                  <input
                    className="chat-text-input"
                    type="text"
                    placeholder="Say something to other drivers…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    maxLength={280}
                    autoComplete="off"
                  />
                  <button type="submit" className="chat-send-btn" aria-label="Send message" disabled={!chatInput.trim()}>
                    <IconSend />
                  </button>
                </div>
              </form>
            </div>
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