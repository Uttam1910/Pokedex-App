// src/components/common/TypeBadge.js
import React from 'react';
import { getTypeColor } from '../../data/typesData';
import { capitalize } from '../../api/pokeapi';
import './TypeBadge.css';

const TypeBadge = ({ type, size = 'medium', clickable = false, onClick }) => {
  if (!type) return null;

  const typeName = typeof type === 'string' ? type : type.type?.name || '';
  const color = getTypeColor(typeName);

  const Component = clickable ? 'button' : 'span';

  return (
    <Component
      className={`type-badge type-${typeName} size-${size} ${clickable ? 'clickable' : ''}`}
      style={{ '--badge-color': color }}
      onClick={onClick}
      type={clickable ? 'button' : undefined}
    >
      <span className="type-dot" />
      <span className="type-name">{capitalize(typeName)}</span>
    </Component>
  );
};

export default TypeBadge;
