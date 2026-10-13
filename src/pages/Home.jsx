import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './home.css';

/* ── Mock data ─────────────────────────────────────────── */
const MOCK_STATIONS = [
  {
    id: 1,
    name: 'NIT Warangal Campus Hub',
    status: 'available',
    address: 'National Institute of Technology Campus, Fatima Nagar, Warangal, Telangana 506004',
    connectors: ['CCS', 'Type 2'],
    network: 'Hitachi Energy',
  },
  {
    id: 2,
    name: 'Ather — Warangal Charging Station',
    status: 'in-use',
    address: 'No 1-1-506, REC Old, Waddepally, Hanumakonda, Telangana 506004',
    connectors: ['CCS'],
    network: 'Ather Grid',
  },
  {
    id: 3,
    name: 'Tata Power EV — Warangal Mall',
    status: 'fault',
    address: '3-6-101, Hanamkonda, Warangal, Telangana 506001',
    connectors: ['CCS', 'CHAdeMO', 'Type 2'],
    network: 'Tata Power EV',
  },
];

const MOCK_FEED = [
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
];

const STATUS_LABEL = { available: 'Available', 'in-use': 'In use', fault: 'Fault' };

/* ── Component ─────────────────────────────────────────── */
export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    stationName: '',
    issueType: '',
    description: '',
    reporterName: '',
  });
  const [formStatus, setFormStatus] = useState({ text: '', isError: false });
  const [feed, setFeed] = useState(MOCK_FEED);
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['all', 'available', 'in-use', 'fault'];
  const filterLabels = { all: 'All', available: 'Available', 'in-use': 'In use', fault: 'Fault reported' };

  const filteredStations = MOCK_STATIONS.filter(
    (s) => activeFilter === 'all' || s.status === activeFilter
  );

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = (e) => {
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
    setFormStatus({ text: '✓ Report submitted — it will appear in the feed below.', isError: false });
    setTimeout(() => setFormStatus({ text: '', isError: false }), 5000);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />

      <main id="top">
        {/* ── HERO ──────────────────────────────────────── */}
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">Live network status</p>
              <h1>Broken chargers shouldn't ruin your trip.</h1>
              <p className="hero-sub">
                Find working stations near you, and report the ones that aren't — in under a
                minute. Every report helps the next driver avoid a dead charger.
              </p>

              <form
                className="hero-search"
                onSubmit={(e) => {
                  e.preventDefault();
                  scrollToSection('stations');
                }}
              >
                <label htmlFor="location-input" className="sr-only">Enter a location</label>
                <input
                  type="text"
                  id="location-input"
                  placeholder="Enter a city, zip, or address"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Find chargers</button>
              </form>

              <a
                href="#report"
                className="hero-secondary-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('report'); }}
              >
                Or report a problem you just ran into →
              </a>
            </div>

            {/* LCD stat panel */}
            <div className="panel" aria-label="Network status readout">
              <div className="panel-row">
                <span className="panel-value">{MOCK_STATIONS.length}</span>
                <span className="panel-label">stations tracked</span>
              </div>
              <div className="panel-row">
                <span className="panel-value panel-value--fault">{feed.length}</span>
                <span className="panel-label">reported today</span>
              </div>
              <div className="panel-row">
                <span className="panel-value panel-value--live">
                  {MOCK_STATIONS.filter((s) => s.status === 'available').length}
                </span>
                <span className="panel-label">available now</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATIONS ──────────────────────────────────── */}
        <section className="stations-section" id="stations">
          <div className="wrap">
            <div className="section-head">
              <h2>Stations near you</h2>
              <p className="section-sub">Status is a mix of live network data and driver reports.</p>
            </div>

            <div className="filter-chips" role="group" aria-label="Filter stations by status">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`chip${activeFilter === f ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>

            <ul className="station-grid">
              {filteredStations.length === 0 ? (
                <li className="station-empty">No stations match that filter.</li>
              ) : (
                filteredStations.map((station) => (
                  <li key={station.id} className="station-card">
                    <div className="station-card-top">
                      <h3>{station.name}</h3>
                      <span className={`status status--${station.status}`}>
                        <span className="status-dot" />
                        {STATUS_LABEL[station.status]}
                      </span>
                    </div>

                    <p className="station-address">{station.address}</p>

                    <div className="connector-tags">
                      {station.connectors.map((c) => (
                        <span key={c} className="connector-tag">{c}</span>
                      ))}
                    </div>

                    <div className="station-card-footer">
                      <span className="station-network">
                        Network: <strong>{station.network}</strong>
                      </span>
                      <button
                        className="report-link"
                        onClick={() => scrollToSection('report')}
                      >
                        Report issue →
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────── */}
        <section className="how-section" id="how">
          <div className="wrap">
            <div className="section-head">
              <h2>Reporting takes three steps</h2>
            </div>
            <ol className="steps">
              <li>
                <span className="step-num">01</span>
                <h3>Spot the problem</h3>
                <p>
                  Cracked screen, dead connector, blocked bay, wrong pricing — whatever's
                  stopping you from charging.
                </p>
              </li>
              <li>
                <span className="step-num">02</span>
                <h3>Report it in under a minute</h3>
                <p>
                  Pick the station, choose an issue type, add a photo if you can. No account
                  required.
                </p>
              </li>
              <li>
                <span className="step-num">03</span>
                <h3>We flag it for other drivers</h3>
                <p>
                  The station status updates instantly, and repeat confirmations get it
                  prioritized for a fix.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── REPORT FORM ───────────────────────────────── */}
        <section className="report-section" id="report">
          <div className="wrap report-inner">
            <div className="section-head">
              <h2>Report a charging problem</h2>
              <p className="section-sub">Takes about a minute. You'll see it appear in the feed below.</p>
            </div>

            <form
              className="report-form"
              onSubmit={handleReportSubmit}
              noValidate
            >
              <div className="form-row">
                <label htmlFor="station-name">Station name or address</label>
                <input
                  type="text"
                  id="station-name"
                  name="stationName"
                  placeholder="e.g. Riverside Mall — Bay 3"
                  value={formData.stationName}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row form-row--split">
                <div>
                  <label htmlFor="issue-type">Issue type</label>
                  <select
                    id="issue-type"
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleFormChange}
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
                  <label htmlFor="photo">Photo (optional)</label>
                  <input type="file" id="photo" name="photo" accept="image/*" />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="issue-desc">What happened?</label>
                <textarea
                  id="issue-desc"
                  name="description"
                  rows="3"
                  placeholder="Screen shows an error code, connector won't latch, etc."
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="reporter-name">Your name (optional)</label>
                <input
                  type="text"
                  id="reporter-name"
                  name="reporterName"
                  placeholder="Stays anonymous if left blank"
                  value={formData.reporterName}
                  onChange={handleFormChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">Submit report</button>

              {formStatus.text && (
                <p className={`form-status${formStatus.isError ? ' is-error' : ''}`} role="status" aria-live="polite">
                  {formStatus.text}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ── RECENT REPORTS FEED ───────────────────────── */}
        <section className="feed-section" id="feed">
          <div className="wrap">
            <div className="section-head">
              <h2>Recent reports</h2>
              <p className="section-sub">Live from drivers across the network.</p>
            </div>

            {feed.length === 0 ? (
              <div className="feed-empty">No reports yet — be the first to report an issue.</div>
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
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <span>© 2026 Voltfix. Not affiliated with any charging network.</span>
          <span className="footer-links">
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              Back to top
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}