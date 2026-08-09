// src/components/pokedex/FilterBar.js
import React from 'react';
import { POKEMON_TYPES } from '../../data/typesData';
import { GENERATIONS } from '../../data/generationsData';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedGen,
  onGenChange,
  sortBy,
  onSortChange,
  onResetFilters
}) => {
  const hasActiveFilters = searchQuery || selectedType || selectedGen || sortBy !== 'id-asc';

  return (
    <div className="filter-bar-card">
      <div className="filter-bar-header">
        <div className="filter-title">
          <SlidersHorizontal size={18} />
          <span>Pokédex Filters & Sorting</span>
        </div>

        {hasActiveFilters && (
          <button className="reset-filters-btn" onClick={onResetFilters}>
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="filter-controls-grid">
        {/* Type Filter */}
        <div className="filter-group">
          <label htmlFor="type-filter">Type</label>
          <select
            id="type-filter"
            className="filter-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="">All Types</option>
            {POKEMON_TYPES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Generation Filter */}
        <div className="filter-group">
          <label htmlFor="gen-filter">Generation</label>
          <select
            id="gen-filter"
            className="filter-select"
            value={selectedGen}
            onChange={(e) => onGenChange(e.target.value)}
          >
            <option value="">All Generations</option>
            {GENERATIONS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.region})
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="filter-group">
          <label htmlFor="sort-filter">Sort By</label>
          <select
            id="sort-filter"
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="id-asc">Pokédex Number (Lowest First)</option>
            <option value="id-desc">Pokédex Number (Highest First)</option>
            <option value="name-asc">Name (A – Z)</option>
            <option value="name-desc">Name (Z – A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
