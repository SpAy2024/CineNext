import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isBlack, setIsBlack] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsBlack(true);
      } else {
        setIsBlack(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isBlack ? 'navbar-black' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          <img 
            src="https://i.postimg.cc/nckQ0v80/LOGO_MOVIE_NUEVO_2024-02.png" 
            alt="Netflix Clone Logo" 
            className="logo-image"
          />
        </Link>
        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/admin">Admin Panel</Link>
        </div>
      </div>
      
      <div className="navbar-right">
        <SearchBar />
      </div>
    </nav>
  );
};

export default Navbar;