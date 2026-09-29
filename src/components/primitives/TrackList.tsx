import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import type { Track } from '../../types';
import { TrackRow } from './TrackRow';
import './TrackList.css';

export interface TrackListProps {
  tracks: Track[];
  currentTrackId?: string;
  isPlaying?: boolean;
  showHeader?: boolean;
  showAlbum?: boolean;
  onTrackPlay: (track: Track, allTracks: Track[], index: number) => void;
  onTrackPause?: () => void;
  onLikeToggle?: (track: Track, liked: boolean) => void;
  onRemoveTrack?: (track: Track, index: number) => void;
  removeLabel?: string;
  reorderable?: boolean;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  emptyMessage?: string;
  className?: string;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackId,
  isPlaying = false,
  showHeader = true,
  showAlbum = true,
  onTrackPlay,
  onTrackPause,
  onLikeToggle,
  onRemoveTrack,
  removeLabel = 'Remove from Playlist',
  reorderable = false,
  onReorder,
  emptyMessage = 'No tracks preserved in this collection.',
  className = '',
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // For large tracklists, render first 40 tracks and incrementally append chunks on scroll
  const [visibleCount, setVisibleCount] = useState<number>(40);
  const [prevLength, setPrevLength] = useState<number>(tracks.length);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  // Synchronously reset visibleCount if tracks change significantly without cascading effect
  if (tracks.length !== prevLength) {
    setPrevLength(tracks.length);
    setVisibleCount(40);
  }

  React.useEffect(() => {
    if (reorderable || visibleCount >= tracks.length || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(tracks.length, prev + 30));
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, tracks.length, reorderable]);

  if (!tracks || tracks.length === 0) {
    return (
      <div className={`nocturne-tracklist__empty ${className}`} role="status">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, _index: number) => {
    if (reorderable) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex && onReorder) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  // If the active playing track is beyond the current visible window, expand to include it
  const activeTrackIndex = currentTrackId ? tracks.findIndex((t) => t.id === currentTrackId) : -1;
  const effectiveVisibleCount = activeTrackIndex >= visibleCount ? Math.min(tracks.length, activeTrackIndex + 15) : visibleCount;
  const renderedTracks = reorderable ? tracks : tracks.slice(0, effectiveVisibleCount);

  return (
    <div
      className={`nocturne-tracklist-container ${className}`}
      role="region"
      aria-label="Track list"
    >
      {showHeader && (
        <div
          className={`nocturne-tracklist__header ${
            !showAlbum ? 'nocturne-tracklist__header--no-album' : ''
          }`}
          role="row"
          aria-hidden="true"
        >
          <div className="nocturne-tracklist__header-num">#</div>
          <div className="nocturne-tracklist__header-title">Title</div>
          {showAlbum && <div className="nocturne-tracklist__header-album">Album</div>}
          <div className="nocturne-tracklist__header-duration">
            <Clock size={12} />
          </div>
          <div className="nocturne-tracklist__header-actions" />
        </div>
      )}

      <div className="nocturne-tracklist__rows" role="list">
        {renderedTracks.map((track, index) => {
          const isActive = currentTrackId === track.id;
          return (
            <TrackRow
              key={`${track.id}-${index}`}
              track={track}
              index={index}
              isActive={isActive}
              isPlaying={isActive && isPlaying}
              showAlbum={showAlbum}
              onPlay={(t) => onTrackPlay(t, tracks, index)}
              onPause={onTrackPause}
              onLikeToggle={onLikeToggle}
              onRemove={onRemoveTrack ? () => onRemoveTrack(track, index) : undefined}
              removeLabel={removeLabel}
              draggable={reorderable}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          );
        })}
        {visibleCount < tracks.length && !reorderable && (
          <div
            ref={sentinelRef}
            style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-hidden="true"
          >
            <span style={{ fontSize: '11px', color: 'var(--text-low)', letterSpacing: '0.05em' }}>
              Loading more tracks...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

