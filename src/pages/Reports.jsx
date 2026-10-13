import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './pages.css';
import './home.css';

const INITIAL_FEED = [
  {
    id: 1,
    issueType: 'Not charging',
    stationName: 'Tata Power EV — Warangal Mall',
    description: "Connector won't latch. Screen shows error E-04. Tried three times.",
    reporter: 'Anonymous',
    time: '12 min ago',
  },
  {
    id: 2,
    issueType: 'Screen/payment',
    stationName: 'Ather — Warangal Charging Station',
    description: "Payment terminal rebooting in a loop. Can't initiate session.",
    reporter: 'Ravi K.',
    time: '1 hr ago',
  },
  {
    id: 3,
    issueType: 'Blocked bay',
    stationName: 'NIT Warangal Campus Hub',
    description: 'Bay 2 is blocked by a petrol car. No campus security around.',
    reporter: 'Priya M.',
    time: '3 hrs ago',
  },
];

export default function Reports() {
  const [formData, setFormData] = useState({
    stationName: '',
    issueType: '',
    description: '',
    reporterName: '',
  });
  const [formStatus, setFormStatus] = useState({ text: '', isError: false });
  const [feed, setFeed] = useState(INITIAL_FEED);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.stationName || !formData.issueType || !formData.description) {
      setFormStatus({ text: 'Please fill in all required fields.', isError: true });
      return;
    }
    const newItem = {
      id: Date.now(),
      issueType: formData.issueType,
      stationName: formData.stationName,
      description: formData.description,
      reporter: formData.reporterName || 'Anonymous',
      time: 'just now',
    };
    setFeed([newItem, ...feed]);
    setFormData({ stationName: '', issueType: '', description: '', reporterName: '' });
    setFormStatus({ text: '✓ Report submitted successfully.', isError: false });
    setTimeout(() => setFormStatus({ text: '', isError: false }), 5000);
  };

  return (
    <>
      <Navbar />

      <div className="reports-page">
        <div className="wrap">
          {/* Page header */}
          <div className="reports-page-header">
            <p className="eyebrow">Driver Reporting</p>
            <h1>Report a charging problem</h1>
            <p className="section-sub">
              Takes about a minute. You'll see it appear in the feed immediately.
            </p>
          </div>

          <div className="reports-layout">
            {/* Left: Form */}
            <form className="report-form-card" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="r-station-name">Station name or address</label>
                <input
                  type="text"
                  id="r-station-name"
                  name="stationName"
                  placeholder="e.g. Riverside Mall — Bay 3"
                  value={formData.stationName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row form-row--split">
                <div>
                  <label htmlFor="r-issue-type">Issue type</label>
                  <select
                    id="r-issue-type"
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select an issue</option>
                    <option value="Not charging">Connector won't charge</option>
                    <option value="Blocked bay">Bay blocked / ICEd</option>
                    <option value="Screen/payment">Screen or payment not working</option>
                    <option value="Damaged">Physically damaged</option>
                    <option value="Wrong info">Wrong listing info</option>
                    <option value="Other">Something else</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="r-photo">Photo (optional)</label>
                  <input type="file" id="r-photo" name="photo" accept="image/*" />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="r-issue-desc">What happened?</label>
                <textarea
                  id="r-issue-desc"
                  name="description"
                  rows="4"
                  placeholder="Screen shows an error code, connector won't latch, etc."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="r-reporter-name">Your name (optional)</label>
                <input
                  type="text"
                  id="r-reporter-name"
                  name="reporterName"
                  placeholder="Stays anonymous if left blank"
                  value={formData.reporterName}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">Submit report</button>

              {formStatus.text && (
                <p className={`form-status${formStatus.isError ? ' is-error' : ''}`} role="status" aria-live="polite">
                  {formStatus.text}
                </p>
              )}
            </form>

            {/* Right: Live feed */}
            <div className="reports-feed-col">
              <h2>Recent reports</h2>
              <p className="section-sub">Live from drivers across the network.</p>

              {feed.length === 0 ? (
                <div className="feed-empty">No reports yet — be the first.</div>
              ) : (
                <ul className="feed-list">
                  {feed.map((item) => (
                    <li key={item.id} className="feed-item">
                      <span className="feed-issue-type">{item.issueType}</span>
                      <div className="feed-body">
                        <h4>{item.stationName}</h4>
                        <p>{item.description}</p>
                      </div>
                      <div className="feed-footer">
                        <span className="feed-reporter">Reported by {item.reporter}</span>
                        <span className="feed-time">{item.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
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