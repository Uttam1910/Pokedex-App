// src/context/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();
const FAVORITES_STORAGE_KEY = 'pokedex_favorites_v2';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Fallback for corrupted localStorage data
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      // Storage quota exceeded or disabled
    }
  }, [favorites]);

  const isFavorite = (nameOrId) => {
    if (!nameOrId) return false;
    const identifier = String(nameOrId).toLowerCase();
    return favorites.some(
      item => String(item.name).toLowerCase() === identifier || String(item.id) === identifier
    );
  };

  const toggleFavorite = (pokemonData) => {
    if (!pokemonData || !pokemonData.name) return;
    const name = pokemonData.name;
    const identifier = String(name).toLowerCase();

    setFavorites(prev => {
      const exists = prev.some(item => String(item.name).toLowerCase() === identifier);
      if (exists) {
        return prev.filter(item => String(item.name).toLowerCase() !== identifier);
      } else {
        const newItem = {
          id: pokemonData.id,
          name: pokemonData.name,
          types: pokemonData.types ? pokemonData.types.map(t => typeof t === 'string' ? t : t.type?.name || t) : [],
          image: pokemonData.image || pokemonData.sprites?.other?.['official-artwork']?.front_default || pokemonData.sprites?.front_default
        };
        return [newItem, ...prev];
      }
    });
  };

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => useContext(FavoritesContext);
