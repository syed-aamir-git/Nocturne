import React, { useState } from 'react';
import { CheckCircle2, User } from 'lucide-react';
import type { Artist } from '../../types';
import { formatNumber } from '../../utilities/formatters';
import './ArtistCard.css';

export interface ArtistCardProps {
  artist: Artist;
  onClick?: (artist: Artist) => void;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`nocturne-artist-card ${className}`}
      onClick={() => onClick?.(artist)}
    >
      <div className="nocturne-artist-card__avatar-wrap">
        {!imgError ? (
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="nocturne-artist-card__avatar"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-surface-elevated)',
            }}
          >
            <User size={32} color="var(--accent-secondary)" />
          </div>
        )}
      </div>

      <h3 className="nocturne-artist-card__name">
        <span>{artist.name}</span>
        {artist.verified && (
          <CheckCircle2 size={14} className="text-accent" color="var(--accent-primary)" />
        )}
      </h3>

      <span className="nocturne-artist-card__listeners">
        {formatNumber(artist.monthlyListeners)} listeners
      </span>

      <div className="nocturne-artist-card__genres">
        {artist.genres.slice(0, 2).map((genre) => (
          <span key={genre} className="nocturne-artist-card__genre-tag">
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
};
