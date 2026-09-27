import React, { useState } from 'react';
import { Play, Pause, Heart, Music, AlignLeft, MoreHorizontal, GripVertical } from 'lucide-react';
import type { Track, Playlist } from '../../types';
import { formatDuration } from '../../utilities/formatters';
import { IconButton } from './IconButton';
import { TrackContextMenu } from './TrackContextMenu';
import { PlaylistModal } from '../modals/PlaylistModal';
import { useLibrary } from '../../state/LibraryContext';
import { useToast } from '../../state/ToastContext';
import './TrackRow.css';

export interface TrackRowProps {
  track: Track;
  index: number;
  isActive?: boolean;
  isPlaying?: boolean;
  onPlay: (track: Track) => void;
  onPause?: () => void;
  onLikeToggle?: (track: Track, liked: boolean) => void;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  isActive = false,
  isPlaying = false,
  onPlay,
  onPause,
  onLikeToggle,
  onRemove,
  removeLabel = 'Remove',
  className = '',
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const { isLiked, toggleLike } = useLibrary();
  const { showToast } = useToast();
  const [imgError, setImgError] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const liked = isLiked(track.id);

  const handleRowClick = () => {
    if (isActive && isPlaying) {
      onPause?.();
    } else {
      onPlay(track);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleLike(track);
    showToast(
      next ? 'Anchored to Liked Songs' : 'Removed from Liked Songs',
      track.title,
      'default'
    );
    onLikeToggle?.(track, next);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setIsMenuOpen(true);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom + 4 });
    setIsMenuOpen(true);
  };

  const coverSrc = track.artwork || track.coverUrl || '';

  return (
    <>
      <div
        className={`nocturne-track-row ${isActive ? 'nocturne-track-row--active' : ''} ${className}`}
        onClick={handleRowClick}
        onContextMenu={handleContextMenu}
        role="button"
        tabIndex={0}
        draggable={draggable}
        onDragStart={(e) => onDragStart?.(e, index)}
        onDragOver={(e) => onDragOver?.(e, index)}
        onDrop={(e) => onDrop?.(e, index)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleRowClick();
          }
        }}
      >
        {/* Index or Equalizer or Play icon (or drag handle if draggable) */}
        <div className="nocturne-track-row__index">
          {draggable && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginRight: 4,
                cursor: 'grab',
                opacity: 0.6,
              }}
              title="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={13} />
            </span>
          )}
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

        {/* Actions: Heart & 3-dots More button */}
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

          <IconButton
            variant="ghost"
            size="sm"
            onClick={handleMoreClick}
            aria-label="Track options"
          >
            <MoreHorizontal size={15} />
          </IconButton>
        </div>
      </div>

      {/* Context Menu */}
      <TrackContextMenu
        track={track}
        position={menuPosition}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onRemove={onRemove}
        removeLabel={removeLabel}
        onCreatePlaylistWithTrack={() => setIsPlaylistModalOpen(true)}
      />

      {/* Playlist Creation Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        initialTracks={[track]}
        onSuccess={(pl: Playlist) => {
          showToast('Ritual Created', `"${track.title}" added to ${pl.title}`, 'atmosphere');
        }}
      />
    </>
  );
};
