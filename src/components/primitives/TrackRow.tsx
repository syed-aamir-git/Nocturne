import React, { useState } from 'react';
import { Play, Pause, Heart, Music, AlignLeft } from 'lucide-react';
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
  const [imgError, setImgError] = useState(false);

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

  const coverSrc = track.artwork || track.coverUrl || '';

  return (
    <div
      className={`nocturne-track-row ${isActive ? 'nocturne-track-row--active' : ''} ${className}`}
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleRowClick();
        }
      }}
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

      {/* Album cover art with error fallback */}
      <div className="nocturne-track-row__cover-wrap">
        {!imgError && coverSrc ? (
          <img
            src={coverSrc}
            alt={track.title}
            className="nocturne-track-row__cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="nocturne-track-row__cover nocturne-track-row__cover--fallback">
            <Music size={16} color="var(--accent-secondary)" />
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="nocturne-track-row__title-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="nocturne-track-row__title">{track.title}</span>
          {track.explicit && (
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: 'var(--text-low)',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '1px 4px',
                borderRadius: '2px',
                lineHeight: 1,
              }}
              title="Explicit Content"
            >
              E
            </span>
          )}
          {(track.lyrics || track.syncedLyrics) && (
            <span title="Lyrics available" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <AlignLeft size={11} color="var(--text-low)" />
            </span>
          )}
        </div>
        <span className="nocturne-track-row__artist">{track.artist}</span>
      </div>

      {/* Album */}
      <div className="nocturne-track-row__album">{track.album}</div>

      {/* Audio format badge column */}
      <div className="nocturne-track-row__badge-col">
        <span className="nocturne-track-row__badge">
          {track.bitrate?.includes('MQA')
            ? 'MQA'
            : track.bitrate?.includes('FLAC')
            ? 'FLAC'
            : track.bitrate?.includes('Master')
            ? 'MASTER'
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
