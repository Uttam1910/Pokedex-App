// src/data/generationsData.js

export const GENERATIONS = [
  {
    id: 1,
    name: 'Generation I',
    region: 'Kanto',
    startId: 1,
    endId: 151,
    total: 151,
    starters: ['bulbasaur', 'charmander', 'squirtle'],
    iconic: 'pikachu',
    description: 'The original 151 Pokémon that started the global phenomenon in Kanto.'
  },
  {
    id: 2,
    name: 'Generation II',
    region: 'Johto',
    startId: 152,
    endId: 251,
    total: 100,
    starters: ['chikorita', 'cyndaquil', 'totodile'],
    iconic: 'lugia',
    description: 'Introduced 100 new species, Steel and Dark types, and day/night cycles in Johto.'
  },
  {
    id: 3,
    name: 'Generation III',
    region: 'Hoenn',
    startId: 252,
    endId: 386,
    total: 135,
    starters: ['treecko', 'torchic', 'mudkip'],
    iconic: 'rayquaza',
    description: 'Brought 135 new Pokémon, abilities, double battles, and nature traits in Hoenn.'
  },
  {
    id: 4,
    name: 'Generation IV',
    region: 'Sinnoh',
    startId: 387,
    endId: 493,
    total: 107,
    starters: ['turtwig', 'chimchar', 'piplup'],
    iconic: 'lucario',
    description: 'Expanded the lore of creation and physical/special attack split in Sinnoh.'
  },
  {
    id: 5,
    name: 'Generation V',
    region: 'Unova',
    startId: 494,
    endId: 649,
    total: 156,
    starters: ['snivy', 'tepig', 'oshawott'],
    iconic: 'zoroark',
    description: 'The largest single generation introducing 156 all-new species in Unova.'
  },
  {
    id: 6,
    name: 'Generation VI',
    region: 'Kalos',
    startId: 650,
    endId: 721,
    total: 72,
    starters: ['chespin', 'fennekin', 'froakie'],
    iconic: 'greninja',
    description: 'Introduced Fairy type, 3D graphics, and Mega Evolution in Kalos.'
  },
  {
    id: 7,
    name: 'Generation VII',
    region: 'Alola',
    startId: 722,
    endId: 809,
    total: 88,
    starters: ['rowlet', 'litten', 'popplio'],
    iconic: 'mimikyu',
    description: 'Featured tropical Island Trials, Regional Variants, and Z-Moves in Alola.'
  },
  {
    id: 8,
    name: 'Generation VIII',
    region: 'Galar',
    startId: 810,
    endId: 905,
    total: 96,
    starters: ['grookey', 'scorbunny', 'sobble'],
    iconic: 'dragapult',
    description: 'Introduced the Wild Area, Dynamax phenomena, and Hisuian species in Galar.'
  },
  {
    id: 9,
    name: 'Generation IX',
    region: 'Paldea',
    startId: 906,
    endId: 1025,
    total: 120,
    starters: ['sprigatito', 'fuecoco', 'quaxly'],
    iconic: 'koraidon',
    description: 'Seamless open-world exploration and Terastal phenomenon in Paldea.'
  }
];

export function getGenById(id) {
  return GENERATIONS.find(g => g.id === Number(id)) || GENERATIONS[0];
}
