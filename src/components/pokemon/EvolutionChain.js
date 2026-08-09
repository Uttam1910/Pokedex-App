// src/components/pokemon/EvolutionChain.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvolutionChainByUrl, fetchPokemonSpecies, getPokemonArtwork, capitalize, formatPokemonId } from '../../api/pokeapi';
import { ArrowRight, ArrowDown, GitBranch } from 'lucide-react';
import './EvolutionChain.css';

const EvolutionChain = ({ speciesUrl, currentPokemonName }) => {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadChain() {
      if (!speciesUrl) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(false);
        const speciesData = await fetchPokemonSpecies(currentPokemonName);
        if (speciesData?.evolution_chain?.url) {
          const chainData = await fetchEvolutionChainByUrl(speciesData.evolution_chain.url);
          if (isMounted) setChain(chainData);
        }
      } catch (err) {
        console.error('Failed to load evolution chain:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadChain();

    return () => { isMounted = false; };
  }, [speciesUrl, currentPokemonName]);

  if (loading) {
    return (
      <div className="evolution-card loading">
        <h3 className="evolution-title"><GitBranch size={20} /> Evolution Chain</h3>
        <div className="evolution-skeleton-row">
          <div className="skeleton-evo-node" />
          <div className="skeleton-evo-node" />
          <div className="skeleton-evo-node" />
        </div>
      </div>
    );
  }

  if (error || !chain.length) {
    return (
      <div className="evolution-card">
        <h3 className="evolution-title"><GitBranch size={20} /> Evolution Chain</h3>
        <p className="no-evolution-msg">This Pokémon does not evolve or evolution data is unavailable.</p>
      </div>
    );
  }

  return (
    <div className="evolution-card">
      <h3 className="evolution-title">
        <GitBranch size={20} className="evolution-icon" />
        Evolution Family
      </h3>

      <div className="evolution-flow-container">
        {chain.map((item, idx) => {
          const isCurrent = item.name.toLowerCase() === currentPokemonName.toLowerCase();
          const artwork = getPokemonArtwork(item.id);

          return (
            <React.Fragment key={item.name}>
              {idx > 0 && (
                <div className="evolution-arrow-connector">
                  <div className="evolution-condition">
                    {item.minLevel ? `Lvl ${item.minLevel}` : item.item ? item.item : item.trigger || 'Evolves'}
                  </div>
                  <ArrowRight size={20} className="arrow-icon arrow-desktop" />
                  <ArrowDown size={20} className="arrow-icon arrow-mobile" />
                </div>
              )}

              <Link
                to={`/pokemon/${item.name}`}
                className={`evolution-node ${isCurrent ? 'is-active-node' : ''}`}
              >
                <div className="evo-img-bg">
                  <img
                    src={artwork}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;
                    }}
                  />
                </div>
                <span className="evo-node-id">{formatPokemonId(item.id)}</span>
                <span className="evo-node-name">{capitalize(item.name)}</span>
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default EvolutionChain;
