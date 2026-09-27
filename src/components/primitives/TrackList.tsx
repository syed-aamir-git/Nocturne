import React from 'react';
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
  emptyMessage = 'No tracks preserved in this collection.',
  className = '',
}) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className={`nocturne-tracklist__empty ${className}`}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

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
              key={track.id}
              track={track}
              index={index}
              isActive={isActive}
              isPlaying={isActive && isPlaying}
              onPlay={(t) => onTrackPlay(t, tracks, index)}
              onPause={onTrackPause}
              onLikeToggle={onLikeToggle}
            />
          );
        })}
      </div>
    </div>
  );
};
