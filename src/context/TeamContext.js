// src/context/TeamContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const TeamContext = createContext();
const TEAM_STORAGE_KEY = 'pokedex_team_v1';
const MAX_TEAM_SIZE = 6;

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem(TEAM_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Safe fallback for corrupted localStorage
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    } catch (e) {
      // Storage quota safety
    }
  }, [team]);

  const isInTeam = (nameOrId) => {
    if (!nameOrId) return false;
    const identifier = String(nameOrId).toLowerCase();
    return team.some(
      item => String(item.name).toLowerCase() === identifier || String(item.id) === identifier
    );
  };

  const addToTeam = (pokemonData) => {
    if (!pokemonData || !pokemonData.name) return { success: false, reason: 'Invalid data' };
    if (team.length >= MAX_TEAM_SIZE) {
      return { success: false, reason: 'Team is full (Max 6 Pokémon)' };
    }
    if (isInTeam(pokemonData.name)) {
      return { success: false, reason: 'Already in team' };
    }

    const newItem = {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types ? pokemonData.types.map(t => typeof t === 'string' ? t : t.type?.name || t) : [],
      image: pokemonData.image || pokemonData.sprites?.other?.['official-artwork']?.front_default || pokemonData.sprites?.front_default,
      stats: pokemonData.stats ? pokemonData.stats.map(s => ({ name: s.stat?.name || s.name, value: s.base_stat !== undefined ? s.base_stat : s.value })) : []
    };

    setTeam(prev => [...prev, newItem]);
    return { success: true };
  };

  const removeFromTeam = (nameOrId) => {
    const identifier = String(nameOrId).toLowerCase();
    setTeam(prev => prev.filter(item => String(item.name).toLowerCase() !== identifier && String(item.id) !== identifier));
  };

  const clearTeam = () => setTeam([]);

  return (
    <TeamContext.Provider value={{ team, isInTeam, addToTeam, removeFromTeam, clearTeam, maxTeamSize: MAX_TEAM_SIZE }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = () => useContext(TeamContext);
