import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './stations.css';
import './home.css';

const ALL_STATIONS = [
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
  {
    id: 4,
    name: 'Reliance BP Charge — NH-163',
    status: 'available',
    address: 'NH-163, Bhimaram, Warangal, Telangana 506011',
    connectors: ['Type 2'],
    network: 'Reliance BP Charge',
  },
  {
    id: 5,
    name: 'BPCL EVPIN — Kazipet',
    status: 'available',
    address: 'BPCL Petrol Pump, Kazipet, Warangal, Telangana 506003',
    connectors: ['CCS', 'CHAdeMO'],
    network: 'BPCL EV',
  },
];

const STATUS_LABEL = { available: 'Available', 'in-use': 'In use', fault: 'Fault' };
const FILTERS = ['all', 'available', 'in-use', 'fault'];
const FILTER_LABELS = { all: 'All', available: 'Available', 'in-use': 'In use', fault: 'Fault reported' };

export default function Stations() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ALL_STATIONS.filter((s) => {
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

          {/* Grid */}
          <ul className="station-grid" style={{ paddingBottom: '72px' }}>
            {filtered.length === 0 ? (
              <li className="station-empty">No stations match your search.</li>
            ) : (
              filtered.map((station) => (
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
                    <Link to="/reports" className="report-link">
                      Report issue →
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
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