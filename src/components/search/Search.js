import React, { useState, useRef } from 'react';
import './Search.css';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce search by 300ms to avoid too many API calls
    debounceTimer.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    onSearch('');
  };

  return (
    <div className="search-container">
      <h2>Search for a Pokémon</h2>
      <form onSubmit={handleSearch} className="search-form" role="search">
        <input 
          type="text" 
          value={query}
          onChange={handleInputChange}
          placeholder="Type to search..." 
          className="search-input"
          aria-label="Search for a Pokémon by name"
        />
        {query && (
          <button type="button" className="search-clear" onClick={handleClear} aria-label="Clear search">×</button>
        )}
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default Search;
