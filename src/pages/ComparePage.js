// src/pages/ComparePage.js
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonComparer from '../components/compare/PokemonComparer';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const poke1 = searchParams.get('poke1');
  const poke2 = searchParams.get('poke2');

  const initialSelected = [poke1, poke2].filter(Boolean);

  return (
    <div style={{ padding: '40px 24px 80px 24px' }}>
      <PokemonComparer initialSelected={initialSelected} />
    </div>
  );
};

export default ComparePage;
