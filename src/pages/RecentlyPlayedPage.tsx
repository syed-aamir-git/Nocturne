import React from 'react';
import { History } from 'lucide-react';
import { TrackRow } from '../components/primitives/TrackRow';
import { usePlayer } from '../state/PlayerContext';
import { MOCK_TRACKS } from '../data/mockData';
import type { Track } from '../types';

export const RecentlyPlayedPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();

  const handlePlayTrack = (track: Track) => {
    playTrack(track, MOCK_TRACKS);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <History size={22} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Recently Played</h1>
        </div>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Chronological echoes of your late-night explorations
        </p>
      </div>

      <div className="nocturne-tracklist">
        {MOCK_TRACKS.map((track, i) => (
          <TrackRow
            key={track.id}
            track={track}
            index={i}
            isActive={currentTrack?.id === track.id}
            isPlaying={status === 'playing'}
            onPlay={handlePlayTrack}
          />
        ))}
      </div>
    </div>
  );
};
