import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Music } from 'lucide-react';
import type { Playlist } from '../../types';
import { formatNumber } from '../../utilities/formatters';
import { usePlayer } from '../../state/PlayerContext';
import './PlaylistCard.css';

export interface PlaylistCardProps {
  playlist: Playlist;
  onPlay?: (playlist: Playlist) => void;
  onClick?: (playlist: Playlist) => void;
  className?: string;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onPlay,
  onClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { playPlaylist } = usePlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(playlist);
    } else {
      playPlaylist(playlist);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(playlist);
    } else {
      navigate(`/playlist/${playlist.id}`);
    }
  };

  const coverSrc = playlist.artwork || playlist.coverUrl || '';
  const tracksLength = playlist.tracks ? playlist.tracks.length : playlist.tracksCount || 0;

  return (
    <div
      className={`nocturne-playlist-card ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="nocturne-playlist-card__cover-wrap">
        {!imgError && coverSrc ? (
          <img
            src={coverSrc}
            alt={playlist.title}
            className="nocturne-playlist-card__cover"
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
            <Music size={32} color="var(--accent-primary)" />
          </div>
        )}
        {playlist.curatedHour && (
          <span className="nocturne-playlist-card__badge-hour">
            {playlist.curatedHour}
          </span>
        )}
        <button
          type="button"
          className="nocturne-playlist-card__play-btn"
          onClick={handlePlayClick}
          aria-label={`Play playlist ${playlist.title}`}
        >
          <Play size={20} fill="currentColor" />
        </button>
      </div>

      <h3 className="nocturne-playlist-card__title" title={playlist.title}>
        {playlist.title}
      </h3>
      <p className="nocturne-playlist-card__desc">{playlist.description}</p>

      <div className="nocturne-playlist-card__footer">
        <span>{tracksLength} tracks</span>
        {playlist.followersCount !== undefined && (
          <span>{formatNumber(playlist.followersCount)} listeners</span>
        )}
      </div>
    </div>
  );
};
