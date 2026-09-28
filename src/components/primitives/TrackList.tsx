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

  if (!tracks || tracks.length === 0) {
    return (
      <div className={`nocturne-tracklist__empty ${className}`}>
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

  return (
    <div className={`nocturne-tracklist-container ${className}`}>
      {showHeader && (
        <div
          className={`nocturne-tracklist__header ${
            !showAlbum ? 'nocturne-tracklist__header--no-album' : ''
          }`}
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

      <div className="nocturne-tracklist__rows">
        {tracks.map((track, index) => {
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
      </div>
    </div>
  );
};
