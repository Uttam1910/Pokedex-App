// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import PokemonCard from '../components/common/PokemonCard';
import SkeletonCard from '../components/common/SkeletonCard';
import TypeBadge from '../components/common/TypeBadge';
import { fetchPokemonDetail, getPokemonArtwork, capitalize, formatPokemonId, getRandomPokemonId } from '../api/pokeapi';
import { POKEMON_TYPES } from '../data/typesData';
import { GENERATIONS } from '../data/generationsData';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import {
  Sparkles,
  Grid,
  Shield,
  Shuffle,
  Flame,
  Clock,
  Layers,
  ArrowRight,
  Star
} from 'lucide-react';
import './HomePage.css';

const POPULAR_NAMES = ['pikachu', 'charizard', 'mewtwo', 'lucario', 'gengar', 'greninja', 'rayquaza', 'eevee'];

const HomePage = () => {
  const navigate = useNavigate();
  const { recentlyViewed } = useRecentlyViewed();
  const [popularList, setPopularList] = useState([]);
  const [pokemonOfDay, setPokemonOfDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadHomeData() {
      try {
        setLoading(true);
        // Pokemon of the Day (deterministic based on day of year)
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const potdId = (dayOfYear % 1000) + 1;

        const [potdData, popularDetails] = await Promise.all([
          fetchPokemonDetail(potdId).catch(() => fetchPokemonDetail(25)),
          Promise.all(POPULAR_NAMES.map(n => fetchPokemonDetail(n).catch(() => null)))
        ]);

        if (isMounted) {
          setPokemonOfDay(potdData);
          setPopularList(popularDetails.filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  const handleHeroSearch = (query) => {
    if (query) {
      navigate(`/pokedex?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/pokedex');
    }
  };

  const handleSurpriseMe = () => {
    const randomId = getRandomPokemonId();
    navigate(`/pokemon/${randomId}`);
  };

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Discover & Explore 1,000+ Pokémon</span>
          </div>

          <h1 className="hero-title">
            Explore the World of <span className="hero-highlight">Pokémon.</span>
          </h1>

          <p className="hero-subtitle">
            Discover Pokémon species, compare stat battle metrics, inspect evolution chains, and craft your ultimate competitive team.
          </p>

          <div className="hero-search-box">
            <SearchBar onSearch={handleHeroSearch} placeholder="Search by name (e.g. Pikachu), ID (#25), or ability..." />
          </div>

          {/* Quick Action Pills */}
          <div className="hero-quick-actions">
            <Link to="/pokedex" className="quick-action-pill">
              <Grid size={16} />
              <span>Explore Pokédex</span>
            </Link>

            <button className="quick-action-pill pill-accent" onClick={handleSurpriseMe}>
              <Shuffle size={16} />
              <span>Surprise Me</span>
            </button>

            <Link to="/types" className="quick-action-pill">
              <Sparkles size={16} />
              <span>Browse Types</span>
            </Link>

            <Link to="/team" className="quick-action-pill">
              <Shield size={16} />
              <span>Build a Team</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="home-container">
        {/* Pokémon of the Day Feature Banner */}
        {pokemonOfDay && (
          <section className="potd-banner">
            <div className="potd-badge">
              <Star size={16} />
              <span>Pokémon of the Day</span>
            </div>

            <div className="potd-content">
              <div className="potd-info">
                <span className="potd-id">{formatPokemonId(pokemonOfDay.id)}</span>
                <h2 className="potd-name">{capitalize(pokemonOfDay.name)}</h2>
                <div className="potd-types">
                  {pokemonOfDay.types.map(t => (
                    <TypeBadge key={t.type.name} type={t.type.name} size="medium" />
                  ))}
                </div>
                <p className="potd-stats-summary">
                  Base Stat Total: <strong>{pokemonOfDay.stats.reduce((s, a) => s + a.base_stat, 0)}</strong> | Height: {(pokemonOfDay.height / 10).toFixed(1)}m | Weight: {(pokemonOfDay.weight / 10).toFixed(1)}kg
                </p>
                <Link to={`/pokemon/${pokemonOfDay.name}`} className="potd-cta-btn">
                  Explore {capitalize(pokemonOfDay.name)} Profile <ArrowRight size={16} />
                </Link>
              </div>

              <div className="potd-artwork-frame">
                <img src={getPokemonArtwork(pokemonOfDay.id, pokemonOfDay.sprites)} alt={pokemonOfDay.name} />
              </div>
            </div>
          </section>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <section className="home-section">
            <div className="section-header-row">
              <h2 className="section-title">
                <Clock size={20} className="section-icon text-accent" />
                Recently Viewed
              </h2>
            </div>
            <div className="recent-scroll-grid">
              {recentlyViewed.map(p => (
                <Link key={p.name} to={`/pokemon/${p.name}`} className="recent-card">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <span className="recent-id">{formatPokemonId(p.id)}</span>
                  <span className="recent-name">{capitalize(p.name)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Showcase Grid */}
        <section className="home-section">
          <div className="section-header-row">
            <h2 className="section-title">
              <Flame size={20} className="section-icon text-fire" />
              Popular & Iconic Discoveries
            </h2>
            <Link to="/pokedex" className="view-all-link">
              View All Pokédex <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-cards-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              popularList.map(pokemon => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))
            )}
          </div>
        </section>

        {/* Explore by Type Showcase */}
        <section className="home-section">
          <div className="section-header-row">
            <h2 className="section-title">
              <Sparkles size={20} className="section-icon text-sparkle" />
              Explore by Type
            </h2>
            <Link to="/types" className="view-all-link">
              View All 18 Types <ArrowRight size={16} />
            </Link>
          </div>

          <div className="type-pills-grid">
            {POKEMON_TYPES.map(t => (
              <Link
                key={t.name}
                to={`/types/${t.name}`}
                className="home-type-card"
                style={{ '--type-gradient': t.gradient }}
              >
                <span className="home-type-name">{capitalize(t.name)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Generation Spotlight Showcase */}
        <section className="home-section">
          <div className="section-header-row">
            <h2 className="section-title">
              <Layers size={20} className="section-icon text-gen" />
              Generation Spotlight
            </h2>
            <Link to="/generations" className="view-all-link">
              View All Gens <ArrowRight size={16} />
            </Link>
          </div>

          <div className="gen-spotlight-grid">
            {GENERATIONS.slice(0, 4).map(gen => (
              <Link key={gen.id} to={`/generations/${gen.id}`} className="gen-spotlight-card">
                <span className="gen-region-badge">{gen.region} Region</span>
                <h3>{gen.name}</h3>
                <p>{gen.description}</p>
                <span className="gen-range">Pokédex #{gen.startId} - #{gen.endId}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
