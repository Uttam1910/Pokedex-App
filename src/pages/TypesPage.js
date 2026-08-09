// src/pages/TypesPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { POKEMON_TYPES, calculateTypeEffectiveness, getTypeColor } from '../data/typesData';
import { fetchPokemonByType, fetchPokemonDetail, capitalize } from '../api/pokeapi';
import TypeBadge from '../components/common/TypeBadge';
import PokemonCard from '../components/common/PokemonCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { Sparkles, ArrowLeft } from 'lucide-react';
import './TypesPage.css';

const TypesPage = () => {
  const { typeName } = useParams();
  const navigate = useNavigate();

  const [pokemonList, setPokemonList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const selectedType = typeName ? typeName.toLowerCase() : null;

  useEffect(() => {
    let isMounted = true;

    async function loadTypePokemon() {
      if (!selectedType) return;
      try {
        setLoading(true);
        const typePokemon = await fetchPokemonByType(selectedType);
        setTotalCount(typePokemon.length);

        // Load first 24 Pokemon for this type
        const details = await Promise.all(
          typePokemon.slice(0, 24).map(p => fetchPokemonDetail(p.name).catch(() => null))
        );

        if (isMounted) {
          setPokemonList(details.filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to fetch type pokemon:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTypePokemon();

    return () => { isMounted = false; };
  }, [selectedType]);

  const typeEffectiveness = selectedType ? calculateTypeEffectiveness([selectedType]) : null;

  return (
    <div className="types-page-wrapper">
      <div className="types-container">
        {selectedType ? (
          /* Detailed Type Page View */
          <div className="type-detail-view">
            <button className="back-types-btn" onClick={() => navigate('/types')}>
              <ArrowLeft size={18} />
              <span>Back to All Types</span>
            </button>

            <div className="type-hero-banner" style={{ '--type-color': getTypeColor(selectedType) }}>
              <div className="type-hero-content">
                <h1 className="type-hero-title">{capitalize(selectedType)} Type</h1>
                <p className="type-hero-desc">
                  Explore Pokémon, defensive matrix, and battle match-ups for the {capitalize(selectedType)} type.
                </p>
                <span className="type-count-badge">{totalCount} Known Species</span>
              </div>
            </div>

            {/* Type Defensive Relations */}
            {typeEffectiveness && (
              <div className="type-matrix-card">
                <h3>Type Relationship Matrix</h3>
                <div className="matrix-grid">
                  <div className="matrix-col">
                    <span className="matrix-label text-weakness">Weak Against (Takes 2x Damage)</span>
                    <div className="matrix-badges">
                      {typeEffectiveness.weaknesses.map(w => (
                        <TypeBadge key={w.type} type={w.type} size="medium" clickable onClick={() => navigate(`/types/${w.type}`)} />
                      ))}
                    </div>
                  </div>

                  <div className="matrix-col">
                    <span className="matrix-label text-resistance">Resistant To (Takes 0.5x Damage)</span>
                    <div className="matrix-badges">
                      {typeEffectiveness.resistances.map(r => (
                        <TypeBadge key={r.type} type={r.type} size="medium" clickable onClick={() => navigate(`/types/${r.type}`)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pokémon Belonging to this Type */}
            <div className="type-pokemon-section">
              <h2>{capitalize(selectedType)} Type Pokémon ({totalCount})</h2>
              {loading ? (
                <div className="types-cards-grid">
                  {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="types-cards-grid">
                  {pokemonList.map(pokemon => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* All 18 Types Grid Directory */
          <div className="types-overview-view">
            <div className="types-header">
              <h1 className="types-page-title">
                <Sparkles size={28} className="types-icon" />
                Pokémon Type Directory
              </h1>
              <p className="types-subtitle">
                Select a type to inspect its strengths, weaknesses, and member Pokémon.
              </p>
            </div>

            <div className="all-types-grid">
              {POKEMON_TYPES.map(t => (
                <Link
                  key={t.name}
                  to={`/types/${t.name}`}
                  className="type-directory-card"
                  style={{ '--type-color': t.color, '--type-gradient': t.gradient }}
                >
                  <span className="directory-dot" />
                  <span className="directory-name">{capitalize(t.name)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypesPage;
