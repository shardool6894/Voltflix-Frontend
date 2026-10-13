import {useState} from 'react'
import './navbar.css'
export default function Navbar () { 
  const [isMenu,setIsMenu] = useState(false)
  const toggle = () => {
    setIsMenu(!isMenu)
  }
  return (
    <nav className="navbar">
    <div className="nav-container">
      <a href="#" className="logo">
        <div className="logo-icon">
          <i className="ph-bold ph-lightning"></i>
        </div>
        <span className="logo-text">Volt<span className="text-blue">fix</span></span>
      </a>
      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">Projects</a>
        <a href="#">About</a>
      </div>
      <a href="#" className="btn-primary desktop-only">Sign In</a>
      <button className="mobile-toggle" id="mobile-toggle" onClick = {toggle}>
        <i className={isMenu?'ph ph-x' : 'ph ph-list'} id="menu-icon">≡</i>
      </button>

    </div>
    <div className={`mobile-menu ${isMenu? 'active' : ''}`} id="mobile-menu">
      <a href="#" className="active">Home</a>
      <a href="#">Services</a>
      <a href="#">Projects</a>
      <a href="#">About</a>
      <a href="#" className="btn-primary mobile-btn">Sign Up</a>
    </div>
  </nav>)
}