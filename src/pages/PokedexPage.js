// src/pages/PokedexPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/pokedex/FilterBar';
import PokemonCard from '../components/common/PokemonCard';
import SkeletonCard from '../components/common/SkeletonCard';
import SearchBar from '../components/common/SearchBar';
import { fetchPokemonList, fetchPokemonDetail, fetchPokemonByType } from '../api/pokeapi';
import { GENERATIONS } from '../data/generationsData';
import { Grid, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import './PokedexPage.css';

const PAGE_SIZE = 24;

const PokedexPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialType = searchParams.get('type') || '';
  const initialGen = searchParams.get('gen') || '';
  const initialSort = searchParams.get('sort') || 'id-asc';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedGen, setSelectedGen] = useState(initialGen);
  const [sortBy, setSortBy] = useState(initialSort);
  const [page, setPage] = useState(1);

  const [pokemonList, setPokemonList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Sync state changes with URL query parameters
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedType) params.type = selectedType;
    if (selectedGen) params.gen = selectedGen;
    if (sortBy && sortBy !== 'id-asc') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedType, selectedGen, sortBy, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    async function loadPokedex() {
      try {
        setLoading(true);
        setError(false);

        let items = [];
        let count = 0;

        if (searchQuery) {
          // Try searching exact name/ID first
          try {
            const single = await fetchPokemonDetail(searchQuery);
            if (single) {
              items = [single];
              count = 1;
            }
          } catch (e) {
            // Search query not exact match
            items = [];
            count = 0;
          }
        } else if (selectedType) {
          // Fetch type list
          const typePokemon = await fetchPokemonByType(selectedType);
          count = typePokemon.length;
          
          // Slice for pagination
          const pageItems = typePokemon.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
          items = await Promise.all(
            pageItems.map(p => fetchPokemonDetail(p.name).catch(() => null))
          );
          items = items.filter(Boolean);
        } else {
          // Standard pagination or Gen filter
          let offset = (page - 1) * PAGE_SIZE;
          let limit = PAGE_SIZE;

          if (selectedGen) {
            const genObj = GENERATIONS.find(g => g.id === Number(selectedGen));
            if (genObj) {
              offset = genObj.startId - 1 + (page - 1) * PAGE_SIZE;
              // Check bounds
              const remainingGenCount = genObj.endId - (genObj.startId - 1 + (page - 1) * PAGE_SIZE);
              limit = Math.min(PAGE_SIZE, Math.max(0, remainingGenCount));
              count = genObj.total;
            }
          }

          if (limit > 0) {
            const data = await fetchPokemonList(limit, offset);
            items = data.results;
            if (!selectedGen) count = data.count;
          }
        }

        // Apply sorting if items exist
        if (items.length > 0) {
          items = [...items].sort((a, b) => {
            if (sortBy === 'id-asc') return (a.id || 0) - (b.id || 0);
            if (sortBy === 'id-desc') return (b.id || 0) - (a.id || 0);
            if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
            if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
            return 0;
          });
        }

        if (isMounted) {
          setPokemonList(items);
          setTotalCount(count);
        }
      } catch (err) {
        console.error('Failed to fetch Pokédex list:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPokedex();

    return () => { isMounted = false; };
  }, [searchQuery, selectedType, selectedGen, sortBy, page]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedGen('');
    setSortBy('id-asc');
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return (
    <div className="pokedex-page-wrapper">
      <div className="pokedex-container">
        {/* Page Header */}
        <div className="pokedex-header">
          <h1 className="pokedex-page-title">
            <Grid size={28} className="pokedex-icon" />
            National Pokédex Directory
          </h1>
          <p className="pokedex-subtitle">
            Search, filter, and discover all official Pokémon species.
          </p>

          <div className="pokedex-search-row">
            <SearchBar
              initialValue={searchQuery}
              onSearch={(q) => { setSearchQuery(q); setPage(1); }}
              placeholder="Search by Pokémon name, ID (#25), or ability..."
            />
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={(t) => { setSelectedType(t); setPage(1); }}
          selectedGen={selectedGen}
          onGenChange={(g) => { setSelectedGen(g); setPage(1); }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Results Info */}
        <div className="results-meta-row">
          <span className="results-count-label">
            Showing {pokemonList.length} of {totalCount} Pokémon
          </span>
        </div>

        {/* Main Grid or State View */}
        {loading ? (
          <div className="pokedex-cards-grid">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="pokedex-error-state">
            <AlertCircle size={40} className="error-icon" />
            <h3>Pokédex Data Unavailable</h3>
            <p>Could not connect to the Pokémon database. Check your internet connection.</p>
            <button className="retry-btn" onClick={() => setPage(1)}>
              <RefreshCw size={16} /> Retry Fetching
            </button>
          </div>
        ) : pokemonList.length === 0 ? (
          <div className="pokedex-empty-state">
            <AlertCircle size={40} className="empty-icon" />
            <h3>No Pokémon Found</h3>
            <p>No Pokémon matches your query '{searchQuery || selectedType || selectedGen}'. Try adjusting your filters.</p>
            <button className="reset-btn" onClick={handleResetFilters}>
              Reset Filters & Search
            </button>
          </div>
        ) : (
          <div className="pokedex-cards-grid">
            {pokemonList.map(pokemon => (
              <PokemonCard key={pokemon.id || pokemon.name} pokemon={pokemon} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="pagination-bar">
            <button
              className="page-nav-btn"
              disabled={page <= 1}
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <span className="page-indicator">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              className="page-nav-btn"
              disabled={page >= totalPages}
              onClick={() => {
                setPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokedexPage;
