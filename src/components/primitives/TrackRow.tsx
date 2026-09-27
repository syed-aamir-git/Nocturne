import React, { useState } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import type { Track } from '../../types';
import { formatDuration } from '../../utilities/formatters';
import { IconButton } from './IconButton';
import './TrackRow.css';

export interface TrackRowProps {
  track: Track;
  index: number;
  isActive?: boolean;
  isPlaying?: boolean;
  onPlay: (track: Track) => void;
  onPause?: () => void;
  onLikeToggle?: (track: Track, liked: boolean) => void;
  className?: string;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  isActive = false,
  isPlaying = false,
  onPlay,
  onPause,
  onLikeToggle,
  className = '',
}) => {
  const [liked, setLiked] = useState(false);

  const handleRowClick = () => {
    if (isActive && isPlaying) {
      onPause?.();
    } else {
      onPlay(track);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    onLikeToggle?.(track, next);
  };

  return (
    <div
      className={`nocturne-track-row ${isActive ? 'nocturne-track-row--active' : ''} ${className}`}
      onClick={handleRowClick}
    >
      {/* Index or Equalizer or Play icon */}
      <div className="nocturne-track-row__index">
        {isActive && isPlaying ? (
          <div className="nocturne-equalizer">
            <span className="nocturne-equalizer__bar" />
            <span className="nocturne-equalizer__bar" />
            <span className="nocturne-equalizer__bar" />
          </div>
        ) : (
          <>
            <span className="nocturne-track-row__num">{index + 1}</span>
            <span className="nocturne-track-row__play-icon">
              {isActive && isPlaying ? (
                <Pause size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
            </span>
          </>
        )}
      </div>

      {/* Album cover art */}
      <img
        src={track.coverUrl}
        alt={track.title}
        className="nocturne-track-row__cover"
        loading="lazy"
      />

      {/* Title & Artist */}
      <div className="nocturne-track-row__title-wrap">
        <span className="nocturne-track-row__title">{track.title}</span>
        <span className="nocturne-track-row__artist">{track.artist}</span>
      </div>

      {/* Album */}
      <div className="nocturne-track-row__album">{track.album}</div>

      {/* Audio format badge */}
      <div>
        <span className="nocturne-track-row__badge">
          {track.bitrate?.includes('MQA')
            ? 'MQA'
            : track.bitrate?.includes('FLAC')
            ? 'FLAC'
            : 'HI-RES'}
        </span>
      </div>

      {/* Duration */}
      <div className="nocturne-track-row__duration">
        {formatDuration(track.duration)}
      </div>

      {/* Actions */}
      <div
        className="nocturne-track-row__actions"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
          style={liked ? { color: 'var(--accent-primary)' } : undefined}
        >
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
        </IconButton>
      </div>
    </div>
  );
};
