import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useFavorites } from '../../hooks/useFavorites';
import './PokemonList.css';

// Type color mapping for subtle accents
const TYPE_COLORS = {
  grass: '#7AC74C',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  rock: '#B6A136',
  ground: '#E2BF65',
  psychic: '#F95587',
  normal: '#A8A77A',
  bug: '#A6B91A',
  fairy: '#D685AD',
  ghost: '#735797',
  steel: '#B7B7CE',
  poison: '#A33EA1',
  fighting: '#C22E28',
  ice: '#96D9D6',
  dragon: '#6F35FC',
  flying: '#A98FF3'
};

function getTypeColor(type){
  return TYPE_COLORS[type] || '#ddd';
}

const PokemonList = ({ searchQuery, onPokemonSelect }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [noResults, setNoResults] = useState(false); 
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const detailsCache = useRef({});
  const activeRequest = useRef(0);
  const sentinelRef = useRef(null);
  const limit = 20;

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // Reset list when searching
    if (searchQuery || showFavoritesOnly) {
      setOffset(0);
      setHasMore(true);
      setPokemonList([]);
      setPokemonDetails([]);
    }
  }, [searchQuery, showFavoritesOnly]);

  useEffect(() => {
    let currentRequest = ++activeRequest.current;
    setLoading(true);
    setNoResults(false);

    // If showing favorites only, filter from cache or return early
    if (showFavoritesOnly) {
      const favoriteDetails = favorites
        .map((name) => detailsCache.current[name])
        .filter(Boolean);
      if (favoriteDetails.length === 0 && favorites.length === 0) {
        setNoResults(true);
        setLoading(false);
        return;
      }
      setPokemonDetails(favoriteDetails);
      setLoading(false);
      setHasMore(false);
      return;
    }

    if (!searchQuery && offset === 0) {
      setPokemonDetails([]);
    }

    const listUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    if (searchQuery) {
      // Real-time search: try exact match first, then filter
      axios.get(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`)
        .then(response => {
          if (currentRequest !== activeRequest.current) return;
          setPokemonList([{ name: response.data.name, url: `https://pokeapi.co/api/v2/pokemon/${response.data.name}` }]);
          detailsCache.current[response.data.name] = response.data;
          setPokemonDetails([response.data]);
          setLoading(false);
          setHasMore(false);
        })
        .catch(error => {
          // If exact match fails, search through cached list
          if (currentRequest !== activeRequest.current) return;
          
          // Try to find matches in cache
          const allCachedNames = Object.keys(detailsCache.current);
          const matches = allCachedNames
            .filter(name => name.toLowerCase().startsWith(searchQuery.toLowerCase()))
            .map(name => ({ 
              name, 
              url: `https://pokeapi.co/api/v2/pokemon/${name}`,
              ...detailsCache.current[name]
            }));

          if (matches.length > 0) {
            setPokemonList(matches);
            setPokemonDetails(matches);
            setLoading(false);
            setHasMore(false);
          } else {
            // No matches found
            setLoading(false);
            setNoResults(true);
          }
        });
    } else {
      axios.get(listUrl)
        .then(async response => {
          if (currentRequest !== activeRequest.current) return;
          const results = response.data.results; // {name, url}
          const newTotal = response.data.count;
          
          // For infinite scroll: append new results
          setPokemonList((prev) => offset === 0 ? results : [...prev, ...results]);
          setHasMore(offset + limit < newTotal);

          // Fetch details for visible list with caching
          const detailPromises = results.map(async (p) => {
            const name = p.name;
            if (detailsCache.current[name]) return detailsCache.current[name];
            try {
              const r = await axios.get(p.url);
              detailsCache.current[name] = r.data;
              return r.data;
            } catch (e) {
              return { name };
            }
          });

          const details = await Promise.all(detailPromises);
          if (currentRequest !== activeRequest.current) return;
          setPokemonDetails((prev) => offset === 0 ? details : [...prev, ...details]);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          if (currentRequest !== activeRequest.current) return;
          setLoading(false);
        });
    }
  }, [offset, searchQuery, showFavoritesOnly, favorites]);

  const handlePokemonClick = async (pokemonName) => {
    try {
      setLoading(true);
      if (detailsCache.current[pokemonName]) {
        onPokemonSelect(detailsCache.current[pokemonName]);
        setLoading(false);
        return;
      }
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      detailsCache.current[pokemonName] = response.data;
      onPokemonSelect(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset(offset - limit);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setOffset(offset + limit);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !searchQuery && !showFavoritesOnly) {
          handleNext();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, searchQuery, showFavoritesOnly]);

  return (
    <div className="pokemon-list-container">
      {/* Header Section */}
      <header className="header-section">
        <div className="header-top">
          <div>
            <h1 className="pokemon-title">Pokémon Explorer</h1>
            <p className="subtitle">Discover and learn more about your favorite Pokémon!</p>
          </div>
          <button
            className={`fav-toggle ${showFavoritesOnly ? 'active' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            aria-label={`${showFavoritesOnly ? 'Show all' : 'Show favorites'}`}
          >
            ♥ {favorites.length}
          </button>
        </div>
      </header>

      {/* Fun Fact Section */}
      <section className="fun-fact">
        <h2>Did You Know?</h2>
        <p>There are more than 800 species of Pokémon, each with unique abilities, types, and stories!</p>
      </section>

      {/* Loading and No Results Handling */}
      {loading && pokemonDetails.length === 0 ? (
        <div className="pokemon-grid">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="pokemon-card skeleton">
              <div className="skeleton-img" />
              <div className="skeleton-text" />
            </div>
          ))}
        </div>
      ) : noResults ? (
        <p className="no-results">No results found</p>
      ) : (
        <>
          <div className="pokemon-grid">
            {(pokemonDetails.length ? pokemonDetails : pokemonList).map((pokemon, index) => {
              const name = pokemon.name || pokemon.species?.name || 'unknown';
              const id = pokemon.id || (pokemon.url ? Number(pokemon.url.split('/').filter(Boolean).pop()) : (index + offset + 1));
              const imgSrc = pokemon.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
              const primaryType = (pokemon.types && pokemon.types[0] && pokemon.types[0].type.name) || (pokemon.types ? pokemon.types[0] : null) || null;
              const bgStyle = primaryType ? { background: `linear-gradient(180deg, rgba(255,255,255,0.8), ${getTypeColor(primaryType)}20)` } : {};
              const isFav = isFavorite(name);

              return (
                <div key={`${name}-${id}`} className="pokemon-card-wrapper">
                  <button
                    type="button"
                    className="pokemon-card advanced"
                    onClick={() => handlePokemonClick(name)}
                    aria-label={`View details for ${name}`}
                    style={bgStyle}
                  >
                    <div className="card-top">
                      <span className="poke-id">#{id}</span>
                      {primaryType && <span className={`type-chip ${primaryType}`}>{primaryType}</span>}
                    </div>
                    <img loading="lazy" src={imgSrc} alt={name} onError={(e) => { e.target.onerror = null; e.target.style.opacity = 0.6 }} />
                    <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
                  </button>
                  <button
                    className={`fav-btn ${isFav ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(name); }}
                    aria-label={`${isFav ? 'Remove from' : 'Add to'} favorites`}
                  >
                    ♥
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* Infinite scroll sentinel */}
          {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
          
          {loading && pokemonDetails.length > 0 && (
            <div className="loading-more">
              <div className="spinner" />
            </div>
          )}
        </>
      )}

      {/* Pagination - only show when searching or on first page */}
      {!showFavoritesOnly && searchQuery && !noResults && (
        <div className="pagination">
          <button onClick={handlePrevious} disabled={offset === 0} className="btn-secondary">Previous</button>
          <span className="page-info">Page {Math.floor(offset / limit) + 1}</span>
          <button onClick={handleNext} className="btn-secondary">Next</button>
        </div>
      )}

      {/* Floating Poké Ball Decoration */}
      <div className="floating-pokeball"></div>
    </div>
  );
};

export default PokemonList;
