import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Disc } from 'lucide-react';
import type { Album } from '../../types';
import { usePlayer } from '../../state/PlayerContext';
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
  const navigate = useNavigate();
  const { playAlbum } = usePlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(album);
    } else {
      playAlbum(album);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(album);
    } else {
      navigate(`/album/${album.id}`);
    }
  };

  const coverSrc = album.artwork || album.coverUrl || '';
  const yearText = album.isSingle
    ? 'Single'
    : album.releaseYear || album.releaseDate?.slice(0, 4) || 'Album';

  return (
    <div
      className={`nocturne-album-card ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="nocturne-album-card__cover-wrap">
        {!imgError && coverSrc ? (
          <img
            src={coverSrc}
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
        <button
          type="button"
          className="nocturne-album-card__play-btn"
          onClick={handlePlayClick}
          aria-label={`Play album ${album.title}`}
        >
          <Play size={20} fill="currentColor" />
        </button>
      </div>

      <div className="nocturne-album-card__info">
        <h3 className="nocturne-album-card__title" title={album.title}>
          {album.title}
        </h3>
        <span className="nocturne-album-card__artist" title={album.artist}>
          {album.artist}
        </span>
        <div className="nocturne-album-card__meta">
          <span>{yearText}</span>
          <span>•</span>
          <span>{album.genre}</span>
        </div>
      </div>
    </div>
  );
};
