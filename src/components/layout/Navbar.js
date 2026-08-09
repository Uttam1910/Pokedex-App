// src/components/layout/Navbar.js
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useTeamContext } from '../../context/TeamContext';
import { getRandomPokemonId } from '../../api/pokeapi';
import {
  Compass,
  Grid,
  Layers,
  Sparkles,
  ArrowLeftRight,
  Shield,
  Heart,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Shuffle
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { themeMode, toggleTheme, activeTheme } = useTheme();
  const { favorites } = useFavoritesContext();
  const { team } = useTeamContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile navigation when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Handle Escape key to close mobile menu & lock scroll when menu is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleRandomClick = () => {
    const randomId = getRandomPokemonId();
    setMobileMenuOpen(false);
    navigate(`/pokemon/${randomId}`);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Identity */}
        <NavLink to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <div className="pokeball-icon">
              <div className="pokeball-top"></div>
              <div className="pokeball-center"></div>
              <div className="pokeball-bottom"></div>
            </div>
          </div>
          <span className="brand-text">POKÉ<span className="brand-text-accent">DEX</span></span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links desktop-only" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <Compass size={16} />
            <span>Discover</span>
          </NavLink>
          
          <NavLink to="/pokedex" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Grid size={16} />
            <span>Pokédex</span>
          </NavLink>

          <NavLink to="/types" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Sparkles size={16} />
            <span>Types</span>
          </NavLink>

          <NavLink to="/generations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Layers size={16} />
            <span>Generations</span>
          </NavLink>

          <NavLink to="/compare" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowLeftRight size={16} />
            <span>Compare</span>
          </NavLink>

          <NavLink to="/team" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Shield size={16} />
            <span>Team</span>
            {team.length > 0 && <span className="nav-badge team-badge">{team.length}</span>}
          </NavLink>

          <NavLink to="/favorites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Heart size={16} />
            <span>Favorites</span>
            {favorites.length > 0 && <span className="nav-badge fav-badge">{favorites.length}</span>}
          </NavLink>
        </nav>

        {/* Header Right Actions */}
        <div className="navbar-actions">
          {/* Surprise Me / Random Button (Desktop) */}
          <button 
            className="action-btn btn-random desktop-only"
            onClick={handleRandomClick}
            title="Random Pokémon"
            aria-label="Random Pokémon"
          >
            <Shuffle size={16} />
            <span>Surprise Me</span>
          </button>

          {/* Theme Selector (Desktop) */}
          <div className="theme-toggle-group desktop-only" role="group" aria-label="Theme toggle">
            <button
              className={`theme-btn ${themeMode === 'light' ? 'active' : ''}`}
              onClick={() => toggleTheme('light')}
              title="Light Theme"
              aria-label="Light mode"
            >
              <Sun size={15} />
            </button>
            <button
              className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`}
              onClick={() => toggleTheme('dark')}
              title="Dark Theme"
              aria-label="Dark mode"
            >
              <Moon size={15} />
            </button>
            <button
              className={`theme-btn ${themeMode === 'system' ? 'active' : ''}`}
              onClick={() => toggleTheme('system')}
              title="System Default Theme"
              aria-label="System theme"
            >
              <Monitor size={15} />
            </button>
          </div>

          {/* Quick Theme Toggle Button (Mobile Header) */}
          <button
            className="mobile-quick-theme-btn mobile-only"
            onClick={() => toggleTheme(activeTheme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {activeTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Mobile Hamburger Menu Trigger Button */}
          <button
            className="mobile-menu-btn mobile-only"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className="mobile-overlay-header">
            <div className="mobile-overlay-brand">
              <div className="pokeball-icon">
                <div className="pokeball-top"></div>
                <div className="pokeball-center"></div>
                <div className="pokeball-bottom"></div>
              </div>
              <span className="brand-text">POKÉ<span className="brand-text-accent">DEX</span></span>
            </div>

            <button
              className="mobile-overlay-close-btn"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mobile-overlay-body">
            <nav className="mobile-menu-list">
              <NavLink to="/" className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu} end>
                <Compass size={20} className="menu-item-icon" />
                <span>Discover</span>
              </NavLink>

              <NavLink to="/pokedex" className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Grid size={20} className="menu-item-icon" />
                <span>Pokédex</span>
              </NavLink>

              <NavLink to="/types" className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Sparkles size={20} className="menu-item-icon" />
                <span>Types</span>
              </NavLink>

              <NavLink to="/generations" className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Layers size={20} className="menu-item-icon" />
                <span>Generations</span>
              </NavLink>

              <NavLink to="/compare" className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <ArrowLeftRight size={20} className="menu-item-icon" />
                <span>Compare</span>
              </NavLink>

              <NavLink to="/team" className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Shield size={20} className="menu-item-icon" />
                <span>Team Builder</span>
                {team.length > 0 && <span className="nav-badge team-badge">{team.length}</span>}
              </NavLink>

              <NavLink to="/favorites" className={({ isActive }) => `mobile-menu-item ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Heart size={20} className="menu-item-icon" />
                <span>Favorites</span>
                {favorites.length > 0 && <span className="nav-badge fav-badge">{favorites.length}</span>}
              </NavLink>

              <button className="mobile-menu-item surprise-item-btn" onClick={handleRandomClick}>
                <Shuffle size={20} className="menu-item-icon" />
                <span>Surprise Me (Random)</span>
              </button>
            </nav>

            {/* Mobile Theme Preference Selector */}
            <div className="mobile-theme-selector-box">
              <span className="theme-box-title">Appearance Theme</span>
              <div className="theme-toggle-group full-width" role="group">
                <button
                  className={`theme-btn ${themeMode === 'light' ? 'active' : ''}`}
                  onClick={() => toggleTheme('light')}
                >
                  <Sun size={15} /> Light
                </button>
                <button
                  className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`}
                  onClick={() => toggleTheme('dark')}
                >
                  <Moon size={15} /> Dark
                </button>
                <button
                  className={`theme-btn ${themeMode === 'system' ? 'active' : ''}`}
                  onClick={() => toggleTheme('system')}
                >
                  <Monitor size={15} /> System
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
