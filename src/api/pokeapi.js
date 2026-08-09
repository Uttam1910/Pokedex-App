// src/api/pokeapi.js
import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

const cache = {
  pokemon: {},
  species: {},
  evolution: {},
  type: {},
  list: {}
};

/**
 * Get high resolution artwork URL with fallback to sprite
 */
export function getPokemonArtwork(id, sprites) {
  if (sprites?.other?.['official-artwork']?.front_default) {
    return sprites.other['official-artwork'].front_default;
  }
  if (sprites?.other?.home?.front_default) {
    return sprites.other.home.front_default;
  }
  if (id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
  return sprites?.front_default || '';
}

/**
 * Format ID with leading zeros (#0001, #0025, #1025)
 */
export function formatPokemonId(id) {
  if (!id) return '#000';
  const num = Number(id);
  if (num < 10) return `#000${num}`;
  if (num < 100) return `#00${num}`;
  if (num < 1000) return `#0${num}`;
  return `#${num}`;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

/**
 * Fetch paginated Pokemon list
 */
export async function fetchPokemonList(limit = 24, offset = 0) {
  const cacheKey = `list_${limit}_${offset}`;
  if (cache.list[cacheKey]) {
    return cache.list[cacheKey];
  }

  const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const results = response.data.results;
  const count = response.data.count;

  // Pre-fetch basic detail info (types, ID, sprites) in parallel
  const details = await Promise.all(
    results.map(p => fetchPokemonDetail(p.name).catch(() => ({ name: p.name })))
  );

  const data = {
    count,
    results: details
  };

  cache.list[cacheKey] = data;
  return data;
}

/**
 * Fetch detailed Pokemon data
 */
export async function fetchPokemonDetail(nameOrId) {
  const key = String(nameOrId).toLowerCase().trim();
  if (cache.pokemon[key]) {
    return cache.pokemon[key];
  }

  const response = await axios.get(`${BASE_URL}/pokemon/${key}`);
  const data = response.data;
  cache.pokemon[data.name] = data;
  cache.pokemon[String(data.id)] = data;
  return data;
}

/**
 * Fetch Pokemon Species data (flavor text, evolution chain link)
 */
export async function fetchPokemonSpecies(nameOrId) {
  const key = String(nameOrId).toLowerCase().trim();
  if (cache.species[key]) {
    return cache.species[key];
  }

  const response = await axios.get(`${BASE_URL}/pokemon-species/${key}`);
  const data = response.data;
  cache.species[data.name] = data;
  cache.species[String(data.id)] = data;
  return data;
}

/**
 * Parse PokeAPI evolution chain response into flat array of evolution stages
 */
function parseEvolutionChain(chainNode) {
  const chain = [];

  function traverse(node) {
    if (!node) return;
    const speciesName = node.species.name;
    const urlParts = node.species.url.split('/').filter(Boolean);
    const speciesId = Number(urlParts[urlParts.length - 1]);
    
    let trigger = null;
    let minLevel = null;
    let item = null;

    if (node.evolution_details && node.evolution_details.length > 0) {
      const details = node.evolution_details[0];
      if (details.min_level) minLevel = details.min_level;
      if (details.trigger?.name) trigger = details.trigger.name.replace(/-/g, ' ');
      if (details.item?.name) item = details.item.name.replace(/-/g, ' ');
    }

    chain.push({
      name: speciesName,
      id: speciesId,
      minLevel,
      trigger,
      item
    });

    if (node.evolves_to && node.evolves_to.length > 0) {
      // Traverse primary branch
      node.evolves_to.forEach(child => traverse(child));
    }
  }

  traverse(chainNode);
  return chain;
}

/**
 * Fetch and parse complete Evolution Chain
 */
export async function fetchEvolutionChainByUrl(url) {
  if (cache.evolution[url]) {
    return cache.evolution[url];
  }

  const response = await axios.get(url);
  const chainData = parseEvolutionChain(response.data.chain);
  cache.evolution[url] = chainData;
  return chainData;
}

/**
 * Fetch Pokemon belonging to a specific type
 */
export async function fetchPokemonByType(typeName) {
  const key = typeName.toLowerCase();
  if (cache.type[key]) {
    return cache.type[key];
  }

  const response = await axios.get(`${BASE_URL}/type/${key}`);
  const pokemonList = response.data.pokemon.map(p => p.pokemon);
  cache.type[key] = pokemonList;
  return pokemonList;
}

/**
 * Fetch a random Pokemon ID between 1 and 1025
 */
export function getRandomPokemonId(max = 1025) {
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Fetch English flavor text summary from species entries
 */
export function getEnglishFlavorText(flavorEntries = []) {
  const englishEntry = flavorEntries.find(
    e => e.language.name === 'en'
  );
  if (!englishEntry) return 'No description available for this Pokémon.';
  return englishEntry.flavor_text.replace(/[\n\f]/g, ' ');
}
