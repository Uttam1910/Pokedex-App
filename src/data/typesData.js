// src/data/typesData.js

export const POKEMON_TYPES = [
  { name: 'normal', color: '#A8A77A', gradient: 'linear-gradient(135deg, #A8A77A, #79794E)' },
  { name: 'fire', color: '#EE8130', gradient: 'linear-gradient(135deg, #EE8130, #C24D00)' },
  { name: 'water', color: '#6390F0', gradient: 'linear-gradient(135deg, #6390F0, #1E53C4)' },
  { name: 'electric', color: '#F7D02C', gradient: 'linear-gradient(135deg, #F7D02C, #C79E00)' },
  { name: 'grass', color: '#7AC74C', gradient: 'linear-gradient(135deg, #7AC74C, #4B9423)' },
  { name: 'ice', color: '#96D9D6', gradient: 'linear-gradient(135deg, #96D9D6, #4CA6A2)' },
  { name: 'fighting', color: '#C22E28', gradient: 'linear-gradient(135deg, #C22E28, #821410)' },
  { name: 'poison', color: '#A33EA1', gradient: 'linear-gradient(135deg, #A33EA1, #691A68)' },
  { name: 'ground', color: '#E2BF65', gradient: 'linear-gradient(135deg, #E2BF65, #A0802B)' },
  { name: 'flying', color: '#A98FF3', gradient: 'linear-gradient(135deg, #A98FF3, #6D48D7)' },
  { name: 'psychic', color: '#F95587', gradient: 'linear-gradient(135deg, #F95587, #C6154F)' },
  { name: 'bug', color: '#A6B91A', gradient: 'linear-gradient(135deg, #A6B91A, #6D7B00)' },
  { name: 'rock', color: '#B6A136', gradient: 'linear-gradient(135deg, #B6A136, #786918)' },
  { name: 'ghost', color: '#735797', gradient: 'linear-gradient(135deg, #735797, #452D63)' },
  { name: 'dragon', color: '#6F35FC', gradient: 'linear-gradient(135deg, #6F35FC, #3C08B6)' },
  { name: 'steel', color: '#B7B7CE', gradient: 'linear-gradient(135deg, #B7B7CE, #777799)' },
  { name: 'fairy', color: '#D685AD', gradient: 'linear-gradient(135deg, #D685AD, #9E4574)' }
];

export const TYPE_COLORS = POKEMON_TYPES.reduce((acc, t) => {
  acc[t.name] = t.color;
  return acc;
}, {});

export function getTypeColor(typeName) {
  return TYPE_COLORS[typeName?.toLowerCase()] || '#94a3b8';
}

// Complete Type Damage Relation Matrix (Attacker -> Defender)
// 2: super effective, 0.5: not very effective, 0: immune
export const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Calculate defensive effectiveness against given defender types
export function calculateTypeEffectiveness(defenderTypes = []) {
  if (!defenderTypes.length) return { weaknesses: [], resistances: [], immunities: [] };

  const multipliers = {};
  POKEMON_TYPES.forEach(t => { multipliers[t.name] = 1; });

  defenderTypes.forEach(defType => {
    const typeName = defType.toLowerCase();
    POKEMON_TYPES.forEach(atkType => {
      const atkName = atkType.name;
      const chartEntry = TYPE_CHART[atkName] || {};
      const mult = chartEntry[typeName] !== undefined ? chartEntry[typeName] : 1;
      multipliers[atkName] *= mult;
    });
  });

  const weaknesses = [];
  const resistances = [];
  const immunities = [];

  Object.entries(multipliers).forEach(([type, mult]) => {
    if (mult > 1) {
      weaknesses.push({ type, multiplier: mult });
    } else if (mult === 0) {
      immunities.push({ type, multiplier: 0 });
    } else if (mult < 1) {
      resistances.push({ type, multiplier: mult });
    }
  });

  return {
    weaknesses: weaknesses.sort((a, b) => b.multiplier - a.multiplier),
    resistances: resistances.sort((a, b) => a.multiplier - b.multiplier),
    immunities
  };
}
