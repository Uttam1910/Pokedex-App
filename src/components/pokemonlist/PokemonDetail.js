// src/components/pokemonlist/PokemonDetail.js
import React, { useEffect, useRef } from 'react';
import './PokemonDetail.css';

const StatBar = ({ label, value, max = 200 }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="stat-row">
      <div className="stat-label">{label}</div>
      <div className="stat-bar">
        <div className="stat-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
};

const PokemonDetail = ({ pokemon, onBack }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // focus the close button for keyboard users
    closeButtonRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onBack();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onBack]);

  if (!pokemon) return null;

  const name = pokemon.name || 'Unknown';
  const img = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default;

  return (
    <div className="pd-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onBack(); }}>
      <aside
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pd-title"
        className="pd-modal"
      >
        <button ref={closeButtonRef} className="pd-close" onClick={onBack} aria-label="Close details">✕</button>
        <div className="pd-header">
          <h2 id="pd-title">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
          <div className="type-badges">
            {pokemon.types.map(t => (
              <span key={t.type.name} className={`badge ${t.type.name}`}>{t.type.name}</span>
            ))}
          </div>
        </div>

        <div className="pd-body">
          <div className="pd-image">
            {img ? (
              <img src={img} alt={name} />
            ) : (
              <div className="pd-placeholder">No image</div>
            )}
            <div className="pd-meta">
              <div><strong>Height:</strong> {pokemon.height} dm</div>
              <div><strong>Weight:</strong> {pokemon.weight} hg</div>
              <div><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</div>
            </div>
          </div>

          <div className="pd-stats">
            <h3>Base Stats</h3>
            {pokemon.stats.map(s => (
              <StatBar key={s.stat.name} label={s.stat.name} value={s.base_stat} max={200} />
            ))}

            <h3 className="moves-title">Top Moves</h3>
            <div className="moves-list">
              {pokemon.moves.slice(0, 8).map(m => (
                <span className="move-pill" key={m.move.name}>{m.move.name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="pd-actions">
          <button className="pd-action" onClick={onBack}>Back</button>
          <a className="pd-action pd-primary" href={`https://www.pokemon.com/us/pokedex/${name}`} target="_blank" rel="noreferrer">Official</a>
        </div>
      </aside>
    </div>
  );
};

export default PokemonDetail;
