// src/components/common/StatBar.js
import React from 'react';
import './StatBar.css';

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed'
};

function getStatColor(val) {
  if (val >= 120) return '#10b981'; // S Tier green
  if (val >= 90) return '#3b82f6';  // A Tier blue
  if (val >= 60) return '#f59e0b';  // B Tier yellow/gold
  return '#ef4444';                 // C Tier red
}

const StatBar = ({ label, value, max = 255 }) => {
  const displayLabel = STAT_LABELS[label.toLowerCase()] || label;
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = getStatColor(value);

  return (
    <div className="stat-bar-row">
      <span className="stat-name">{displayLabel}</span>
      <span className="stat-num-val">{value}</span>
      <div className="stat-track">
        <div
          className="stat-fill-bar"
          style={{
            width: `${pct}%`,
            background: color
          }}
        />
      </div>
    </div>
  );
};

export default StatBar;
