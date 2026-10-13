import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './pages.css';

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 L4 14 H11 L9 22 L20 8 H13 L13 2 Z" fill="currentColor" />
  </svg>
);

export default function ErrorPage() {
  return (
    <>
      <Navbar />
      <div className="error-page">
        <div className="error-content">
          <div className="error-bolt">
            <BoltIcon />
          </div>
          <div className="error-code">404</div>
          <h1 className="error-title">Connection Lost</h1>
          <p className="error-desc">
            Oops — looks like a broken circuit. The page you're looking for doesn't exist,
            has been moved, or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}