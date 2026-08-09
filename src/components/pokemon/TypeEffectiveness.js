// src/components/pokemon/TypeEffectiveness.js
import React from 'react';
import { calculateTypeEffectiveness } from '../../data/typesData';
import TypeBadge from '../common/TypeBadge';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import './TypeEffectiveness.css';

const TypeEffectiveness = ({ types = [] }) => {
  const typeNames = types.map(t => typeof t === 'string' ? t : t.type?.name || '');
  const { weaknesses, resistances, immunities } = calculateTypeEffectiveness(typeNames);

  return (
    <div className="type-effectiveness-card">
      <h3 className="effectiveness-title">
        <ShieldCheck size={20} className="effectiveness-icon" />
        Type Match-ups & Weaknesses
      </h3>

      <div className="effectiveness-sections-grid">
        {/* Weaknesses */}
        <div className="effectiveness-block">
          <div className="block-header text-weakness">
            <ShieldAlert size={16} />
            <span>Weak Against (Takes 2x - 4x Damage)</span>
          </div>
          {weaknesses.length > 0 ? (
            <div className="badges-flex">
              {weaknesses.map(w => (
                <div key={w.type} className="badge-with-mult">
                  <TypeBadge type={w.type} size="medium" />
                  <span className="mult-label text-weakness">{w.multiplier}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="none-label">None (No type weaknesses!)</p>
          )}
        </div>

        {/* Resistances */}
        <div className="effectiveness-block">
          <div className="block-header text-resistance">
            <ShieldCheck size={16} />
            <span>Resistant To (Takes 0.5x - 0.25x Damage)</span>
          </div>
          {resistances.length > 0 ? (
            <div className="badges-flex">
              {resistances.map(r => (
                <div key={r.type} className="badge-with-mult">
                  <TypeBadge type={r.type} size="medium" />
                  <span className="mult-label text-resistance">{r.multiplier}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="none-label">None</p>
          )}
        </div>

        {/* Immunities */}
        {immunities.length > 0 && (
          <div className="effectiveness-block">
            <div className="block-header text-immunity">
              <ShieldCheck size={16} />
              <span>Immune To (Takes 0x Damage)</span>
            </div>
            <div className="badges-flex">
              {immunities.map(i => (
                <div key={i.type} className="badge-with-mult">
                  <TypeBadge type={i.type} size="medium" />
                  <span className="mult-label text-immunity">0x</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeEffectiveness;
