// src/App.js
import React, { useState } from 'react';
import Search from './components/search/Search';
import PokemonList from './components/pokemonlist/PokemonList';
import PokemonDetail from './components/pokemonlist/PokemonDetail';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedPokemon(null); // Clear selected Pokemon when searching
  };

  const handlePokemonSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleBackToList = () => {
    setSearchQuery(''); // Reset the search query
    setSelectedPokemon(null); // Clear the selected Pokemon to show the list
  };

  return (
    <div className="App">
      <Search onSearch={handleSearch} />
      {selectedPokemon ? (
        <PokemonDetail pokemon={selectedPokemon} onBack={handleBackToList} />
      ) : (
        <PokemonList searchQuery={searchQuery} onPokemonSelect={handlePokemonSelect} />
      )}
    </div>
  );
};

export default App;
