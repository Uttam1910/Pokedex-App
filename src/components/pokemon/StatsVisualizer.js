// src/components/pokemon/StatsVisualizer.js
import React from 'react';
import StatBar from '../common/StatBar';
import { Zap, Trophy } from 'lucide-react';
import './StatsVisualizer.css';

const StatsVisualizer = ({ stats = [] }) => {
  if (!stats || !stats.length) return null;

  const totalStat = stats.reduce((sum, s) => sum + (s.base_stat || s.value || 0), 0);

  let ratingLabel = 'Balanced';
  let ratingColor = 'var(--accent-secondary)';

  if (totalStat >= 600) {
    ratingLabel = 'Legendary / Mythical Tier';
    ratingColor = '#a855f7';
  } else if (totalStat >= 530) {
    ratingLabel = 'S Tier Powerhouse';
    ratingColor = '#10b981';
  } else if (totalStat >= 470) {
    ratingLabel = 'A Tier Competitive';
    ratingColor = '#3b82f6';
  } else if (totalStat >= 400) {
    ratingLabel = 'B Tier Standard';
    ratingColor = '#f59e0b';
  } else {
    ratingLabel = 'Starter / Basic Tier';
    ratingColor = '#ef4444';
  }

  return (
    <div className="stats-visualizer-card">
      <div className="stats-header-row">
        <h3 className="stats-section-title">
          <Zap size={20} className="stats-icon" />
          Base Stats Breakdown
        </h3>

        <div className="total-stat-pill" style={{ '--rating-color': ratingColor }}>
          <Trophy size={14} />
          <span>Total: <strong>{totalStat}</strong></span>
          <span className="rating-badge">{ratingLabel}</span>
        </div>
      </div>

      <div className="stats-list-wrapper">
        {stats.map(s => {
          const name = s.stat?.name || s.name || s.label;
          const val = s.base_stat !== undefined ? s.base_stat : s.value;
          return (
            <StatBar key={name} label={name} value={val} max={255} />
          );
        })}
      </div>
    </div>
  );
};

export default StatsVisualizer;
