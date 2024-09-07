import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PokemonList.css';

const PokemonList = ({ searchQuery, onPokemonSelect }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [noResults, setNoResults] = useState(false); 
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    setNoResults(false);

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
          setNoResults(true);
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
      {/* Header Section */}
      <header className="header-section">
        <h1 className="pokemon-title">Pokémon Explorer</h1>
        <p className="subtitle">Discover and learn more about your favorite Pokémon!</p>
      </header>

      {/* Fun Fact Section */}
      <section className="fun-fact">
        <h2>Did You Know?</h2>
        <p>There are more than 800 species of Pokémon, each with unique abilities, types, and stories!</p>
      </section>

      {/* Loading and No Results Handling */}
      {loading ? (
        <p>Loading...</p>
      ) : noResults ? (
        <p>No results found</p>
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

      {/* Pagination */}
      {!searchQuery && !noResults && (
        <div className="pagination">
          <button onClick={handlePrevious} disabled={offset === 0}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* Floating Poké Ball Decoration */}
      <div className="floating-pokeball"></div>
    </div>
  );
};

export default PokemonList;
