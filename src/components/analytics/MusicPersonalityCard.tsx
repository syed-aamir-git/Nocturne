import React from 'react';
import { Compass, Sparkles, Radio, Info } from 'lucide-react';
import type { MusicPersonality } from '../../types/analytics';
import './MusicPersonalityCard.css';

interface MusicPersonalityCardProps {
  personality: MusicPersonality;
}

export const MusicPersonalityCard: React.FC<MusicPersonalityCardProps> = ({ personality }) => {
  return (
    <div className="nocturne-personality-card">
      {/* Background ambient glow */}
      <div className="nocturne-personality-card__glow" />

      <div className="nocturne-personality-card__header">
        <div className="nocturne-personality-card__badge-row">
          <span className="nocturne-personality-card__eyebrow">
            <Compass size={13} />
            <span>Acoustic Personality Profile</span>
          </span>
          <span className="nocturne-personality-card__tag">
            <Sparkles size={12} />
            <span>Aesthetic Reflection</span>
          </span>
        </div>

        <div className="nocturne-personality-card__title-row">
          <span className="nocturne-personality-card__atmosphere-label">Your listening atmosphere:</span>
          <h2 className="nocturne-personality-card__archetype">{personality.atmosphere}</h2>
        </div>

        <p className="nocturne-personality-card__tagline">"{personality.tagline}"</p>
      </div>

      <p className="nocturne-personality-card__summary">{personality.summary}</p>

      {/* Traits grid */}
      <div className="nocturne-personality-card__traits-grid">
        {personality.traits.map((t, idx) => (
          <div key={idx} className="nocturne-personality-trait">
            <span className="nocturne-personality-trait__label">{t.label}</span>
            <span className="nocturne-personality-trait__value">{t.value}</span>
            <span className="nocturne-personality-trait__detail">{t.detail}</span>
          </div>
        ))}
      </div>

      {/* Sound Signature Pills */}
      <div className="nocturne-personality-card__signatures">
        <div className="nocturne-personality-signatures-label">
          <Radio size={13} />
          <span>Signature Sonic DNA:</span>
        </div>
        <div className="nocturne-personality-signatures-list">
          {personality.soundSignature.map((sig, idx) => (
            <span key={idx} className="nocturne-personality-sig-pill">
              {sig}
            </span>
          ))}
        </div>
      </div>

      {/* Mandatory Entertainment & Non-scientific Disclaimer */}
      <div className="nocturne-personality-card__disclaimer">
        <Info size={14} className="nocturne-personality-disclaimer-icon" />
        <span>
          <strong>Artistic Entertainment Reflection:</strong> This atmosphere description is an evocative musical
          interpretation of your stored listening statistics in Nocturne, and is not a scientific or psychological assessment.
        </span>
      </div>
    </div>
  );
};
