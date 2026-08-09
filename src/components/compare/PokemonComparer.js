// src/components/compare/PokemonComparer.js
import React, { useState, useEffect } from 'react';
import { fetchPokemonDetail, getPokemonArtwork, formatPokemonId, capitalize } from '../../api/pokeapi';
import TypeBadge from '../common/TypeBadge';
import SearchBar from '../common/SearchBar';
import { useToast } from '../../context/ToastContext';
import { ArrowLeftRight, Trash2, Trophy, Sparkles } from 'lucide-react';
import './PokemonComparer.css';

const DEFAULT_POKEMON_NAMES = ['charizard', 'blastoise', 'venusaur'];

const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

const STAT_NAMES = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed'
};

const PokemonComparer = ({ initialSelected = [] }) => {
  const [selectedList, setSelectedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadDefaults() {
      setLoading(true);
      const namesToFetch = initialSelected.length > 0 ? initialSelected : DEFAULT_POKEMON_NAMES;
      try {
        const details = await Promise.all(
          namesToFetch.map(n => fetchPokemonDetail(n).catch(() => null))
        );
        setSelectedList(details.filter(Boolean));
      } catch (err) {
        console.error('Comparer failed to load:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDefaults();
  }, [initialSelected]);

  const handleAddPokemon = async (query) => {
    if (!query) return;
    if (selectedList.length >= 3) {
      addToast('Maximum 3 Pokémon can be compared side-by-side.', 'error');
      return;
    }
    try {
      const data = await fetchPokemonDetail(query);
      if (selectedList.some(p => p.id === data.id)) {
        addToast(`${capitalize(data.name)} is already in comparison!`, 'info');
        return;
      }
      setSelectedList(prev => [...prev, data]);
      addToast(`Added ${capitalize(data.name)} to comparison!`, 'success');
    } catch (err) {
      addToast(`Could not find Pokémon '${query}'`, 'error');
    }
  };

  const handleRemove = (id) => {
    setSelectedList(prev => prev.filter(p => p.id !== id));
  };

  // Find max value per stat for highlighting
  const getMaxStat = (statName) => {
    if (!selectedList.length) return 0;
    return Math.max(
      ...selectedList.map(p => {
        const st = p.stats.find(s => s.stat.name === statName);
        return st ? st.base_stat : 0;
      })
    );
  };

  const getMaxTotalStat = () => {
    if (!selectedList.length) return 0;
    return Math.max(
      ...selectedList.map(p => p.stats.reduce((sum, s) => sum + s.base_stat, 0))
    );
  };

  return (
    <div className="comparer-container">
      <div className="comparer-header">
        <h2 className="comparer-title">
          <ArrowLeftRight size={24} className="comparer-icon" />
          Pokémon Side-by-Side Comparer
        </h2>
        <p className="comparer-subtitle">
          Compare stats, types, physical specs, and abilities of up to 3 Pokémon.
        </p>

        {selectedList.length < 3 && (
          <div className="comparer-add-box">
            <SearchBar onSearch={handleAddPokemon} placeholder="Add Pokémon to compare (e.g. Lucario, Gengar, Pikachu)..." />
          </div>
        )}
      </div>

      {loading ? (
        <div className="comparer-loading">
          <div className="spinner" />
          <p>Loading comparison metrics...</p>
        </div>
      ) : selectedList.length === 0 ? (
        <div className="comparer-empty">
          <Sparkles size={40} />
          <h3>No Pokémon Selected</h3>
          <p>Search above to add Pokémon for comparison.</p>
        </div>
      ) : (
        <div className="comparer-table-wrapper">
          <table className="comparer-table">
            <thead>
              <tr>
                <th className="spec-col-header">Spec / Attribute</th>
                {selectedList.map(p => (
                  <th key={p.id} className="pokemon-col-header">
                    <button
                      className="remove-poke-btn"
                      onClick={() => handleRemove(p.id)}
                      title="Remove from compare"
                    >
                      <Trash2 size={14} />
                    </button>
                    <img
                      src={getPokemonArtwork(p.id, p.sprites)}
                      alt={p.name}
                      className="compare-poke-img"
                    />
                    <div className="compare-poke-id">{formatPokemonId(p.id)}</div>
                    <div className="compare-poke-name">{capitalize(p.name)}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Types */}
              <tr>
                <td className="row-label">Types</td>
                {selectedList.map(p => (
                  <td key={p.id} className="row-val">
                    <div className="types-center flex-gap">
                      {p.types.map(t => (
                        <TypeBadge key={t.type.name} type={t.type.name} size="small" />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Height & Weight */}
              <tr>
                <td className="row-label">Height</td>
                {selectedList.map(p => (
                  <td key={p.id} className="row-val">{(p.height / 10).toFixed(1)} m</td>
                ))}
              </tr>

              <tr>
                <td className="row-label">Weight</td>
                {selectedList.map(p => (
                  <td key={p.id} className="row-val">{(p.weight / 10).toFixed(1)} kg</td>
                ))}
              </tr>

              {/* Abilities */}
              <tr>
                <td className="row-label">Abilities</td>
                {selectedList.map(p => (
                  <td key={p.id} className="row-val">
                    {p.abilities.map(a => capitalize(a.ability.name)).join(', ')}
                  </td>
                ))}
              </tr>

              {/* Base Stats Rows */}
              {STAT_KEYS.map(statKey => {
                const maxVal = getMaxStat(statKey);
                return (
                  <tr key={statKey}>
                    <td className="row-label">{STAT_NAMES[statKey]}</td>
                    {selectedList.map(p => {
                      const st = p.stats.find(s => s.stat.name === statKey);
                      const val = st ? st.base_stat : 0;
                      const isHighest = val === maxVal && selectedList.length > 1;

                      return (
                        <td key={p.id} className={`row-val stat-val-cell ${isHighest ? 'is-highest-stat' : ''}`}>
                          <span className="stat-num">{val}</span>
                          {isHighest && <Trophy size={14} className="trophy-icon" title="Highest value" />}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Total Base Stat Sum */}
              <tr className="total-stat-row">
                <td className="row-label total-label">Total Stat Sum</td>
                {selectedList.map(p => {
                  const total = p.stats.reduce((sum, s) => sum + s.base_stat, 0);
                  const isMaxTotal = total === getMaxTotalStat() && selectedList.length > 1;
                  return (
                    <td key={p.id} className={`row-val total-val-cell ${isMaxTotal ? 'is-highest-stat' : ''}`}>
                      <strong>{total}</strong>
                      {isMaxTotal && <Trophy size={16} className="trophy-icon" title="Highest Total" />}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PokemonComparer;
