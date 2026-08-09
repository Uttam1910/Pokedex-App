// src/hooks/useRecentlyViewed.js
import { useState, useEffect } from 'react';

const RECENT_KEY = 'pokedex_recently_viewed_v1';
const MAX_RECENT = 10;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Safe fallback for corrupted data
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed));
    } catch (e) {
      // Storage quota safety
    }
  }, [recentlyViewed]);

  const addRecentlyViewed = (pokemonData) => {
    if (!pokemonData || !pokemonData.name) return;
    const name = pokemonData.name;
    const newItem = {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types ? pokemonData.types.map(t => typeof t === 'string' ? t : t.type?.name || t) : [],
      image: pokemonData.sprites?.other?.['official-artwork']?.front_default || pokemonData.sprites?.front_default || pokemonData.image
    };

    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.name.toLowerCase() !== name.toLowerCase());
      return [newItem, ...filtered].slice(0, MAX_RECENT);
    });
  };

  const clearRecentlyViewed = () => setRecentlyViewed([]);

  return { recentlyViewed, addRecentlyViewed, clearRecentlyViewed };
};
