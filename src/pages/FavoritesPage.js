// src/pages/FavoritesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import PokemonCard from '../components/common/PokemonCard';
import { Heart, Trash2, Compass } from 'lucide-react';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const { favorites, clearFavorites } = useFavoritesContext();

  return (
    <div className="favorites-page-wrapper">
      <div className="favorites-container">
        <div className="favorites-header">
          <div className="fav-title-row">
            <h1 className="favorites-page-title">
              <Heart size={28} fill="#ef4444" color="#ef4444" className="fav-icon" />
              Saved Favorites ({favorites.length})
            </h1>

            {favorites.length > 0 && (
              <button className="clear-fav-btn" onClick={clearFavorites}>
                <Trash2 size={15} />
                <span>Clear All Favorites</span>
              </button>
            )}
          </div>

          <p className="favorites-subtitle">
            Your collection of favorited Pokémon saved locally in your browser.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="favorites-empty-state">
            <div className="empty-heart-circle">
              <Heart size={32} color="#ef4444" />
            </div>
            <h2>No Favorites Saved Yet</h2>
            <p>
              Click the heart icon on any Pokémon card or profile page to save them here for quick access.
            </p>
            <Link to="/pokedex" className="explore-btn">
              <Compass size={18} />
              <span>Explore Pokédex</span>
            </Link>
          </div>
        ) : (
          <div className="favorites-cards-grid">
            {favorites.map(pokemon => (
              <PokemonCard key={pokemon.id || pokemon.name} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
