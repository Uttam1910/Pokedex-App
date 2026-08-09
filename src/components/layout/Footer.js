// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="brand-text">POKÉ<span className="brand-text-accent">DEX</span></span>
            </div>
            <p className="footer-tagline">
              A modern Pokémon discovery, Pokédex, and exploration platform. Uncover stats, evolutions, types, and build your ultimate team.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Explore</h4>
              <ul>
                <li><Link to="/">Discover Home</Link></li>
                <li><Link to="/pokedex">All Pokémon</Link></li>
                <li><Link to="/types">Type Directory</Link></li>
                <li><Link to="/generations">Generations I - IX</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Tools</h4>
              <ul>
                <li><Link to="/compare">Pokémon Comparer</Link></li>
                <li><Link to="/team">Team Builder</Link></li>
                <li><Link to="/favorites">Saved Favorites</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-column footer-credits-col">
            <h4>Data & Credits</h4>
            <p className="footer-info">
              Powered by official data from <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI <ExternalLink size={12} /></a>. Pokémon and Pokémon character names are trademarks of Nintendo.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PokéDex Discovery Platform. Designed for Pokémon fans everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
