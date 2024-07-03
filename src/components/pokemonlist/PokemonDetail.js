// src/components/pokemonlist/PokemonDetail.js
import React from 'react';
import './PokemonDetail.css';

const PokemonDetail = ({ pokemon, onBack }) => {
  return (
    <div className="pokemon-detail">
      <button className="back-button" onClick={onBack}>Back to List</button>
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <div className="pokemon-info">
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <div>
          <p><strong>Type:</strong> {pokemon.types.map(type => type.type.name).join(', ')}</p>
          <p><strong>Height:</strong> {pokemon.height} decimetres</p>
          <p><strong>Weight:</strong> {pokemon.weight} hectograms</p>
          <p><strong>Abilities:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <p><strong>Base Stats:</strong></p>
          <ul>
            {pokemon.stats.map(stat => (
              <li key={stat.stat.name}><strong>{stat.stat.name}:</strong> {stat.base_stat}</li>
            ))}
          </ul>
          <p><strong>Moves:</strong></p>
          <ul className="moves-list">
            {pokemon.moves.slice(0, 5).map(move => (
              <li key={move.move.name}>{move.move.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
