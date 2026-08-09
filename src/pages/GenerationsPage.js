// src/pages/GenerationsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GENERATIONS, getGenById } from '../data/generationsData';
import { fetchPokemonList } from '../api/pokeapi';
import PokemonCard from '../components/common/PokemonCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { Layers, ArrowLeft, Globe } from 'lucide-react';
import './GenerationsPage.css';

const GenerationsPage = () => {
  const { genId } = useParams();
  const navigate = useNavigate();

  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedGen = genId ? getGenById(genId) : null;

  useEffect(() => {
    let isMounted = true;

    async function loadGenPokemon() {
      if (!selectedGen) return;
      try {
        setLoading(true);
        const offset = selectedGen.startId - 1;
        const limit = Math.min(30, selectedGen.total);
        const data = await fetchPokemonList(limit, offset);

        if (isMounted) {
          setPokemonList(data.results);
        }
      } catch (err) {
        console.error('Failed to load gen pokemon:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadGenPokemon();

    return () => { isMounted = false; };
  }, [genId, selectedGen]);

  return (
    <div className="generations-page-wrapper">
      <div className="generations-container">
        {selectedGen ? (
          /* Detailed Generation View */
          <div className="gen-detail-view">
            <button className="back-gen-btn" onClick={() => navigate('/generations')}>
              <ArrowLeft size={18} />
              <span>Back to All Generations</span>
            </button>

            <div className="gen-hero-banner">
              <span className="gen-region-tag"><Globe size={14} /> {selectedGen.region} Region</span>
              <h1 className="gen-hero-title">{selectedGen.name}</h1>
              <p className="gen-hero-desc">{selectedGen.description}</p>
              <div className="gen-meta-row">
                <span>Pokédex Range: <strong>#{selectedGen.startId} - #{selectedGen.endId}</strong></span>
                <span>Total Species: <strong>{selectedGen.total}</strong></span>
              </div>
            </div>

            <div className="gen-pokemon-section">
              <h2>{selectedGen.name} Pokémon Showcase</h2>
              {loading ? (
                <div className="gen-cards-grid">
                  {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="gen-cards-grid">
                  {pokemonList.map(pokemon => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* All Generations Overview Grid */
          <div className="generations-overview-view">
            <div className="generations-header">
              <h1 className="generations-page-title">
                <Layers size={28} className="gen-icon" />
                Pokémon Generations Directory
              </h1>
              <p className="generations-subtitle">
                Explore Pokémon species across all 9 official generations from Kanto to Paldea.
              </p>
            </div>

            <div className="all-gens-grid">
              {GENERATIONS.map(gen => (
                <Link key={gen.id} to={`/generations/${gen.id}`} className="gen-directory-card">
                  <div className="gen-card-header">
                    <span className="gen-card-region">{gen.region}</span>
                    <span className="gen-card-count">{gen.total} Pokémon</span>
                  </div>
                  <h3 className="gen-card-title">{gen.name}</h3>
                  <p className="gen-card-desc">{gen.description}</p>
                  <span className="gen-card-range">Range: #{gen.startId} – #{gen.endId}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationsPage;
