// src/components/team/TeamBuilderComponent.js
import React, { useState } from 'react';
import { useTeamContext } from '../../context/TeamContext';
import { fetchPokemonDetail, formatPokemonId, capitalize } from '../../api/pokeapi';
import { calculateTypeEffectiveness } from '../../data/typesData';
import TypeBadge from '../common/TypeBadge';
import SearchBar from '../common/SearchBar';
import { useToast } from '../../context/ToastContext';
import { Shield, Plus, Trash2, AlertTriangle, Sparkles, Check } from 'lucide-react';
import './TeamBuilderComponent.css';

const TeamBuilderComponent = () => {
  const { team, removeFromTeam, addToTeam, clearTeam, maxTeamSize } = useTeamContext();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { addToast } = useToast();

  const handleSearchAdd = async (query) => {
    if (!query) return;
    try {
      const data = await fetchPokemonDetail(query);
      const res = addToTeam(data);
      if (res.success) {
        addToast(`Added ${capitalize(data.name)} to your team!`, 'success');
        setShowSearchModal(false);
      } else {
        addToast(res.reason, 'error');
      }
    } catch (err) {
      addToast(`Could not find Pokémon '${query}'`, 'error');
    }
  };

  // Calculate team type coverage & weak points
  const teamTypes = team.flatMap(p => p.types || []);
  const uniqueTypesCovered = Array.from(new Set(teamTypes));

  // Calculate shared team weaknesses
  const weaknessCount = {};
  team.forEach(member => {
    const { weaknesses } = calculateTypeEffectiveness(member.types || []);
    weaknesses.forEach(w => {
      weaknessCount[w.type] = (weaknessCount[w.type] || 0) + 1;
    });
  });

  const commonWeaknesses = Object.entries(weaknessCount)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  // Team stat totals
  const aggregatedStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 0,
    speed: 0
  };

  team.forEach(p => {
    if (p.stats) {
      p.stats.forEach(s => {
        const name = s.name || s.stat?.name;
        if (aggregatedStats[name] !== undefined) {
          aggregatedStats[name] += (s.value || s.base_stat || 0);
        }
      });
    }
  });

  const slots = Array.from({ length: maxTeamSize });

  return (
    <div className="team-builder-container">
      <div className="team-builder-header">
        <div className="team-title-row">
          <h2 className="team-title">
            <Shield size={24} className="team-icon" />
            Pokémon Team Builder
          </h2>
          {team.length > 0 && (
            <button className="clear-team-btn" onClick={clearTeam}>
              <Trash2 size={15} />
              <span>Clear Team</span>
            </button>
          )}
        </div>
        <p className="team-subtitle">
          Assemble a balanced 6-Pokémon team and analyze its type coverage and vulnerabilities.
        </p>
      </div>

      {/* 6 Team Slots Grid */}
      <div className="team-slots-grid">
        {slots.map((_, idx) => {
          const member = team[idx];

          if (member) {
            return (
              <div key={member.id || idx} className="team-member-card">
                <button
                  className="remove-member-btn"
                  onClick={() => removeFromTeam(member.name)}
                  title="Remove from team"
                >
                  <Trash2 size={14} />
                </button>

                <div className="member-artwork-bg">
                  <img src={member.image} alt={member.name} className="member-img" />
                </div>

                <div className="member-id">{formatPokemonId(member.id)}</div>
                <h4 className="member-name">{capitalize(member.name)}</h4>

                <div className="member-types">
                  {member.types.map(t => (
                    <TypeBadge key={t} type={t} size="small" />
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="empty-team-slot" onClick={() => setShowSearchModal(true)}>
              <div className="add-slot-circle">
                <Plus size={24} />
              </div>
              <span className="add-slot-text">Slot {idx + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Search Modal for adding to team */}
      {showSearchModal && (
        <div className="team-modal-backdrop" onClick={() => setShowSearchModal(false)}>
          <div className="team-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add Pokémon to Team</h3>
            <SearchBar onSearch={handleSearchAdd} placeholder="Type Pokémon name or ID..." />
            <button className="modal-close-btn" onClick={() => setShowSearchModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Analysis Dashboard */}
      {team.length > 0 && (
        <div className="team-analysis-dashboard">
          <h3 className="analysis-dashboard-title">
            <Sparkles size={20} className="analysis-icon" />
            Team Analysis & Defensive Coverage
          </h3>

          <div className="analysis-grid">
            {/* Type Coverage */}
            <div className="analysis-card">
              <h4>Type Representation ({uniqueTypesCovered.length} Types)</h4>
              {uniqueTypesCovered.length > 0 ? (
                <div className="types-flex">
                  {uniqueTypesCovered.map(t => (
                    <TypeBadge key={t} type={t} size="medium" />
                  ))}
                </div>
              ) : (
                <p className="analysis-empty-text">No types in team yet.</p>
              )}
            </div>

            {/* Common Weaknesses */}
            <div className="analysis-card">
              <h4>Shared Team Weaknesses</h4>
              {commonWeaknesses.length > 0 ? (
                <div className="weakness-warnings-list">
                  {commonWeaknesses.map(([type, count]) => (
                    <div key={type} className="weakness-warning-item">
                      <AlertTriangle size={16} className="warning-icon" />
                      <TypeBadge type={type} size="small" />
                      <span className="warning-text">{count} members weak</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-weakness-pass">
                  <Check size={16} color="#10b981" />
                  <span>Great coverage! No major shared type vulnerabilities.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBuilderComponent;
