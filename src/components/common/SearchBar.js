// src/components/common/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { capitalize } from '../../api/pokeapi';
import './SearchBar.css';

const SUGGESTIONS_LIST = [
  'pikachu', 'charizard', 'bulbasaur', 'squirtle', 'charmander', 'gengar',
  'lucario', 'mewtwo', 'eevee', 'snorlax', 'rayquaza', 'greninja', 'dragonite',
  'gyarados', 'arcanine', 'tyranitar', 'blastoise', 'venusaur', 'gardevoir',
  'umbreon', 'sylveon', 'garchomp', 'mew', 'lugia', 'suicune', 'kyogre',
  'groudon', 'dialga', 'palkia', 'giratina', 'reshiram', 'zekrom', 'xerneas',
  'yveltal', 'solgaleo', 'lunala', 'zacian', 'zamazenta', 'koraidon', 'miraidon'
];

const SearchBar = ({ onSearch, initialValue = '', placeholder = 'Search by Pokémon name, ID (#25), or ability...' }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length >= 2) {
      const matches = SUGGESTIONS_LIST.filter(name =>
        name.toLowerCase().includes(val.toLowerCase().trim())
      ).slice(0, 5);
      setSuggestions(matches);
      setShowDropdown(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    onSearch(query.trim());
  };

  const handleSelectSuggestion = (name) => {
    setQuery(name);
    setShowDropdown(false);
    onSearch(name);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    onSearch('');
  };

  return (
    <div className="search-bar-outer-wrapper" ref={wrapperRef}>
      <form className="search-bar-form" onSubmit={handleSubmit} role="search">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input-field"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder={placeholder}
            aria-label="Search Pokémon"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className="search-submit-btn">
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="search-suggestions-dropdown">
          {suggestions.map(s => (
            <button
              key={s}
              type="button"
              className="suggestion-item-btn"
              onClick={() => handleSelectSuggestion(s)}
            >
              <Sparkles size={14} className="suggestion-icon" />
              <span>{capitalize(s)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
