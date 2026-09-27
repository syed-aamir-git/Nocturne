import React from 'react';
import { Play } from 'lucide-react';
import type { Playlist } from '../../types';
import { formatNumber } from '../../utilities/formatters';
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
  return (
    <div
      className={`nocturne-playlist-card ${className}`}
      onClick={() => onClick?.(playlist)}
    >
      <div className="nocturne-playlist-card__cover-wrap">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="nocturne-playlist-card__cover"
          loading="lazy"
        />
        {playlist.curatedHour && (
          <span className="nocturne-playlist-card__badge-hour">
            {playlist.curatedHour}
          </span>
        )}
        {onPlay && (
          <button
            type="button"
            className="nocturne-playlist-card__play-btn"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(playlist);
            }}
            aria-label={`Play playlist ${playlist.title}`}
          >
            <Play size={20} fill="currentColor" />
          </button>
        )}
      </div>

      <h3 className="nocturne-playlist-card__title" title={playlist.title}>
        {playlist.title}
      </h3>
      <p className="nocturne-playlist-card__desc">{playlist.description}</p>

      <div className="nocturne-playlist-card__footer">
        <span>{playlist.tracksCount} tracks</span>
        <span>{formatNumber(playlist.followersCount)} listeners</span>
      </div>
    </div>
  );
};
