// src/components/common/PokemonCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useTeamContext } from '../../context/TeamContext';
import { useToast } from '../../context/ToastContext';
import { formatPokemonId, getPokemonArtwork, capitalize } from '../../api/pokeapi';
import { getTypeColor } from '../../data/typesData';
import TypeBadge from './TypeBadge';
import { Heart, Plus, Check } from 'lucide-react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { isInTeam, addToTeam, removeFromTeam } = useTeamContext();
  const { addToast } = useToast();

  if (!pokemon) return null;

  const id = pokemon.id;
  const name = pokemon.name || 'Unknown';
  const types = pokemon.types
    ? pokemon.types.map(t => typeof t === 'string' ? t : t.type?.name || '')
    : [];

  const primaryType = types[0] || 'normal';
  const primaryColor = getTypeColor(primaryType);

  const artwork = getPokemonArtwork(id, pokemon.sprites || pokemon);
  const fav = isFavorite(name);
  const inTeam = isInTeam(name);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ id, name, types, image: artwork });
    addToast(
      fav ? `Removed ${capitalize(name)} from favorites` : `Added ${capitalize(name)} to favorites!`,
      fav ? 'info' : 'success'
    );
  };

  const handleTeamClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inTeam) {
      removeFromTeam(name);
      addToast(`Removed ${capitalize(name)} from Team`, 'info');
    } else {
      const res = addToTeam({ id, name, types, image: artwork, stats: pokemon.stats });
      if (res.success) {
        addToast(`Added ${capitalize(name)} to Team!`, 'success');
      } else {
        addToast(res.reason, 'error');
      }
    }
  };

  return (
    <div className="pokemon-card-container">
      <Link
        to={`/pokemon/${name}`}
        className="pokemon-card"
        style={{
          '--card-accent': primaryColor
        }}
      >
        {/* Card Header Info */}
        <div className="card-header-row">
          <span className="card-id">{formatPokemonId(id)}</span>
          <button
            className={`card-fav-btn ${fav ? 'is-favorite' : ''}`}
            onClick={handleFavoriteClick}
            title={fav ? 'Remove favorite' : 'Add favorite'}
            aria-label={`Favorite ${name}`}
          >
            <Heart size={16} fill={fav ? '#ef4444' : 'none'} color={fav ? '#ef4444' : 'currentColor'} />
          </button>
        </div>

        {/* Artwork Image */}
        <div className="card-artwork-wrapper">
          <div className="artwork-bg-glow" />
          <img
            src={artwork}
            alt={name}
            loading="lazy"
            className="card-artwork-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id || 1}.png`;
            }}
          />
        </div>

        {/* Title & Types */}
        <div className="card-body-content">
          <h3 className="card-pokemon-name">{capitalize(name)}</h3>

          <div className="card-types-list">
            {types.map(t => (
              <TypeBadge key={t} type={t} size="small" />
            ))}
          </div>
        </div>

        {/* Card Bottom Quick Action */}
        <div className="card-footer-action">
          <button
            className={`team-quick-btn ${inTeam ? 'in-team' : ''}`}
            onClick={handleTeamClick}
            title={inTeam ? 'Remove from team' : 'Add to team'}
          >
            {inTeam ? (
              <>
                <Check size={14} />
                <span>In Team</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add Team</span>
              </>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default PokemonCard;
