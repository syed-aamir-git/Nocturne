import React, { useState } from 'react';
import { Play, Disc } from 'lucide-react';
import type { Album } from '../../types';
import './AlbumCard.css';

export interface AlbumCardProps {
  album: Album;
  onPlay?: (album: Album) => void;
  onClick?: (album: Album) => void;
  className?: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onPlay,
  onClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`nocturne-album-card ${className}`}
      onClick={() => onClick?.(album)}
    >
      <div className="nocturne-album-card__cover-wrap">
        {!imgError ? (
          <img
            src={album.coverUrl}
            alt={album.title}
            className="nocturne-album-card__cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-surface-elevated)',
            }}
          >
            <Disc size={36} color="var(--accent-primary)" />
          </div>
        )}
        {onPlay && (
          <button
            type="button"
            className="nocturne-album-card__play-btn"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(album);
            }}
            aria-label={`Play ${album.title}`}
          >
            <Play size={20} fill="currentColor" />
          </button>
        )}
      </div>

      <div className="nocturne-album-card__info">
        <h3 className="nocturne-album-card__title" title={album.title}>
          {album.title}
        </h3>
        <span className="nocturne-album-card__artist" title={album.artist}>
          {album.artist}
        </span>
        <div className="nocturne-album-card__meta">
          <span>{album.releaseYear}</span>
          <span>•</span>
          <span>{album.genre}</span>
        </div>
      </div>
    </div>
  );
};
