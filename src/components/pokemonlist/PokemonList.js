// src/components/pokemonlist/PokemonList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PokemonList.css';

const PokemonList = ({ searchQuery, onPokemonSelect }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [noResults, setNoResults] = useState(false); // New state variable
  const limit = 20; // Number of Pokémon per page

  useEffect(() => {
    setLoading(true);
    setNoResults(false); // Reset no results message on new search or pagination

    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    if (searchQuery) {
      url = `https://pokeapi.co/api/v2/pokemon/${searchQuery}`;
      axios.get(url)
        .then(response => {
          setPokemonList([response.data]);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
          setNoResults(true); // Set no results message if search fails
        });
    } else {
      axios.get(url)
        .then(response => {
          setPokemonList(response.data.results);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [offset, searchQuery]);

  const handlePokemonClick = async (pokemonName) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      onPokemonSelect(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset(offset - limit);
    }
  };

  const handleNext = () => {
    setOffset(offset + limit);
  };

  return (
    <div className="pokemon-list-container">
      {loading ? (
        <p>Loading...</p>
      ) : noResults ? (
        <p>No results found</p> // Display no results message
      ) : (
        <div className="pokemon-grid">
          {pokemonList.map((pokemon, index) => (
            <div key={index} className="pokemon-card" onClick={() => handlePokemonClick(pokemon.name || pokemon.species.name)}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id || (index + offset + 1)}.png`} alt={pokemon.name || pokemon.species.name} />
              <h3>{(pokemon.name || pokemon.species.name).charAt(0).toUpperCase() + (pokemon.name || pokemon.species.name).slice(1)}</h3>
            </div>
          ))}
        </div>
      )}
      {!searchQuery && !noResults && (
        <div className="pagination">
          <button onClick={handlePrevious} disabled={offset === 0}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
