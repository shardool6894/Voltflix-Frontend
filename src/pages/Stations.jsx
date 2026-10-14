import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './stations.css';
import './home.css';

const STATUS_LABEL = { available: 'Available', 'in-use': 'In use', fault: 'Fault', offline: 'Offline', maintenance: 'Maintenance' };
const FILTERS = ['all', 'available', 'in-use', 'fault'];
const FILTER_LABELS = { all: 'All', available: 'Available', 'in-use': 'In use', fault: 'Fault reported' };

export default function Stations() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stations/literallyAll');
        if (!response.ok) {
          throw new Error(`Failed to load stations (HTTP ${response.status})`);
        }
        const data = await response.json();
        setStations(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const filtered = stations.filter((s) => {
    const matchesFilter = activeFilter === 'all' || s.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.network.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Navbar />

      <div className="stations-page">
        <div className="wrap">
          {/* Page header */}
          <div className="stations-page-header">
            <p className="eyebrow">Live network status</p>
            <h1>Stations near you</h1>
            <p className="section-sub">
              Status is a mix of live network data and driver reports.
            </p>

            {/* Search */}
            <div className="stations-search-bar">
              <input
                type="text"
                placeholder="Search by name, address, or network…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>

          {/* Filter chips */}
          <div className="filter-chips" role="group" aria-label="Filter stations by status">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`chip${activeFilter === f ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          {/* States */}
          {loading && (
            <div className="stations-state-msg">Loading stations…</div>
          )}
          {error && (
            <div className="stations-state-msg stations-state-msg--error">
              ⚠ {error}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && (
            <ul className="station-grid" style={{ paddingBottom: '72px' }}>
              {filtered.length === 0 ? (
                <li className="station-empty">No stations match your search.</li>
              ) : (
                filtered.map((station) => (
                  <li key={station._id} className="station-card">
                    <div className="station-card-top">
                      <h3>{station.name}</h3>
                      <span className={`status status--${station.status}`}>
                        <span className="status-dot" />
                        {STATUS_LABEL[station.status] ?? station.status}
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
                      <Link to="/reports" className="report-link">
                        Report issue →
                      </Link>
                    </div>
                  </li>
                ))
              )}
            </ul>
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