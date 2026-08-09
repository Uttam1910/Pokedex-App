// src/pages/PokemonDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchPokemonByType,
  getEnglishFlavorText,
  getPokemonArtwork,
  formatPokemonId,
  capitalize
} from '../api/pokeapi';
import { getTypeColor } from '../data/typesData';
import TypeBadge from '../components/common/TypeBadge';
import PokemonCard from '../components/common/PokemonCard';
import StatsVisualizer from '../components/pokemon/StatsVisualizer';
import EvolutionChain from '../components/pokemon/EvolutionChain';
import TypeEffectiveness from '../components/pokemon/TypeEffectiveness';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useTeamContext } from '../context/TeamContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useToast } from '../context/ToastContext';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Check,
  Share2,
  ArrowLeftRight,
  Sparkles,
  Ruler,
  Weight,
  Zap,
  Swords,
  Compass
} from 'lucide-react';
import './PokemonDetailPage.css';

const PokemonDetailPage = () => {
  const { idOrName } = useParams();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { isInTeam, addToTeam, removeFromTeam } = useTeamContext();
  const { addToast } = useToast();
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      try {
        setLoading(true);
        setError(false);

        const data = await fetchPokemonDetail(idOrName);
        const speciesData = await fetchPokemonSpecies(data.name).catch(() => null);

        // Fetch related Pokemon of primary type
        let related = [];
        if (data.types && data.types.length > 0) {
          const primaryTypeName = data.types[0].type.name;
          const typePokemon = await fetchPokemonByType(primaryTypeName).catch(() => []);
          const filtered = typePokemon.filter(p => p.name.toLowerCase() !== data.name.toLowerCase()).slice(0, 4);
          related = await Promise.all(
            filtered.map(p => fetchPokemonDetail(p.name).catch(() => null))
          );
        }

        if (isMounted) {
          setPokemon(data);
          setSpecies(speciesData);
          setRelatedList(related.filter(Boolean));
          setIsShiny(false);

          // Dynamic Document Title for SEO
          document.title = `${capitalize(data.name)} (${formatPokemonId(data.id)}) — Pokédex`;

          // Track in Recently Viewed
          addRecentlyViewed(data);
        }
      } catch (err) {
        console.error('Failed to load Pokemon detail:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDetail();

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOrName]);

  if (loading) {
    return (
      <div className="detail-loading-page">
        <div className="spinner" />
        <p>Loading Pokémon profile...</p>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="detail-error-page">
        <h2>Pokémon Not Found</h2>
        <p>The Pokémon '{idOrName}' could not be located in the PokéAPI database.</p>
        <div className="detail-error-actions">
          <Link to="/pokedex" className="action-btn-primary">Explore Pokédex</Link>
          <button onClick={() => navigate(-1)} className="action-btn-secondary">Go Back</button>
        </div>
      </div>
    );
  }

  const id = pokemon.id;
  const name = pokemon.name;
  const types = pokemon.types.map(t => t.type.name);
  const primaryType = types[0] || 'normal';
  const primaryColor = getTypeColor(primaryType);

  const defaultArtwork = getPokemonArtwork(id, pokemon.sprites);
  const shinyArtwork = pokemon.sprites?.other?.['official-artwork']?.front_shiny || pokemon.sprites?.front_shiny || defaultArtwork;
  const activeArtwork = isShiny ? shinyArtwork : defaultArtwork;

  const fav = isFavorite(name);
  const inTeam = isInTeam(name);

  const flavorText = species ? getEnglishFlavorText(species.flavor_text_entries) : 'Discover base stats, evolutions, and battle attributes for this Pokémon.';

  const prevId = id > 1 ? id - 1 : 1025;
  const nextId = id < 1025 ? id + 1 : 1;

  const handleFavoriteToggle = () => {
    toggleFavorite({ id, name, types, image: defaultArtwork });
    addToast(
      fav ? `Removed ${capitalize(name)} from favorites` : `Added ${capitalize(name)} to favorites!`,
      fav ? 'info' : 'success'
    );
  };

  const handleTeamToggle = () => {
    if (inTeam) {
      removeFromTeam(name);
      addToast(`Removed ${capitalize(name)} from Team`, 'info');
    } else {
      const res = addToTeam({ id, name, types, image: defaultArtwork, stats: pokemon.stats });
      if (res.success) {
        addToast(`Added ${capitalize(name)} to Team!`, 'success');
      } else {
        addToast(res.reason, 'error');
      }
    }
  };

  const handleShareLink = () => {
    const url = window.location.href;
    const title = `${capitalize(name)} — Pokédex`;

    if (navigator.share) {
      navigator.share({
        title,
        text: `Check out ${capitalize(name)} on Pokédex Discovery!`,
        url
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      addToast('Pokémon profile URL copied to clipboard!', 'success');
    }
  };

  const handleCompareClick = () => {
    navigate(`/compare?poke1=${name}`);
  };

  return (
    <div className="detail-page-wrapper">
      {/* Top Prev / Next Navigation Header */}
      <div className="detail-nav-bar">
        <div className="detail-nav-container">
          <Link to={`/pokemon/${prevId}`} className="poke-nav-btn prev-btn">
            <ChevronLeft size={18} />
            <span>#{prevId}</span>
          </Link>

          <Link to="/pokedex" className="back-to-pokedex-link">
            Back to Pokédex
          </Link>

          <Link to={`/pokemon/${nextId}`} className="poke-nav-btn next-btn">
            <span>#{nextId}</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className="detail-content-container">
        {/* Main Hero Card */}
        <div className="detail-hero-card" style={{ '--type-theme': primaryColor }}>
          <div className="hero-left-art">
            <div className="art-glow-backdrop" />
            <img src={activeArtwork} alt={name} className="hero-main-artwork" />

            {/* Shiny Sprite Switcher */}
            <button
              className={`shiny-toggle-btn ${isShiny ? 'active' : ''}`}
              onClick={() => setIsShiny(!isShiny)}
              title="Toggle Shiny Form"
            >
              <Sparkles size={15} />
              <span>{isShiny ? 'Shiny Form' : 'Normal Form'}</span>
            </button>
          </div>

          <div className="hero-right-info">
            <div className="hero-top-row">
              <span className="hero-poke-id">{formatPokemonId(id)}</span>
              {species?.generation && (
                <span className="hero-gen-tag">
                  {capitalize(species.generation.name)}
                </span>
              )}
            </div>

            <h1 className="hero-poke-name">{capitalize(name)}</h1>

            <div className="hero-types-flex">
              {types.map(t => (
                <TypeBadge key={t} type={t} size="large" />
              ))}
            </div>

            <p className="hero-flavor-text">"{flavorText}"</p>

            {/* Spec Badges Grid */}
            <div className="hero-specs-grid">
              <div className="spec-card">
                <Ruler size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Height</span>
                  <span className="spec-value">{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
              </div>

              <div className="spec-card">
                <Weight size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
              </div>

              <div className="spec-card">
                <Zap size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Abilities</span>
                  <span className="spec-value">
                    {pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="hero-actions-row">
              <button
                className={`action-btn-primary ${fav ? 'fav-active' : ''}`}
                onClick={handleFavoriteToggle}
              >
                <Heart size={18} fill={fav ? 'white' : 'none'} />
                <span>{fav ? 'Favorite Saved' : 'Add Favorite'}</span>
              </button>

              <button
                className={`action-btn-primary ${inTeam ? 'team-active' : ''}`}
                onClick={handleTeamToggle}
              >
                {inTeam ? <Check size={18} /> : <Plus size={18} />}
                <span>{inTeam ? 'In Your Team' : 'Add to Team'}</span>
              </button>

              <button className="action-btn-secondary" onClick={handleCompareClick}>
                <ArrowLeftRight size={18} />
                <span>Compare</span>
              </button>

              <button className="action-btn-secondary" onClick={handleShareLink} title="Share Link">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="detail-sections-grid">
          {/* Stats Visualizer */}
          <StatsVisualizer stats={pokemon.stats} />

          {/* Type Effectiveness & Weaknesses */}
          <TypeEffectiveness types={types} />
        </div>

        {/* Evolution Chain */}
        <EvolutionChain speciesUrl={species?.evolution_chain?.url} currentPokemonName={name} />

        {/* Related Discoveries Section */}
        {relatedList.length > 0 && (
          <div className="related-pokemon-section">
            <h3 className="related-section-title">
              <Compass size={20} className="related-icon" />
              Related {capitalize(primaryType)} Discoveries
            </h3>
            <div className="related-cards-grid">
              {relatedList.map(related => (
                <PokemonCard key={related.id} pokemon={related} />
              ))}
            </div>
          </div>
        )}

        {/* Top Battle Moves Section */}
        <div className="moves-section-card">
          <h3 className="moves-section-title">
            <Swords size={20} className="moves-icon" />
            Top Learnable Moves ({pokemon.moves.length})
          </h3>
          <div className="moves-pills-flex">
            {pokemon.moves.slice(0, 16).map(m => (
              <span key={m.move.name} className="move-pill">
                {capitalize(m.move.name)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;
