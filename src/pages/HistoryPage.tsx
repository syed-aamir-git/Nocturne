import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { TrackRow } from '../components/primitives/TrackRow';
import { usePlayer } from '../state/PlayerContext';
import { MOCK_TRACKS } from '../data/mockData';
import type { Track } from '../types';

export const HistoryPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();

  const historyGroups = [
    {
      dateLabel: 'Tonight • The Witching Hour (03:14 AM)',
      tracks: [MOCK_TRACKS[0], MOCK_TRACKS[1]],
    },
    {
      dateLabel: 'Yesterday • Midnight Descent (11:45 PM)',
      tracks: [MOCK_TRACKS[2], MOCK_TRACKS[3], MOCK_TRACKS[4]],
    },
    {
      dateLabel: 'September 25 • Crepuscular Dusk (09:12 PM)',
      tracks: [MOCK_TRACKS[5], MOCK_TRACKS[6]],
    },
  ];

  const handlePlayTrack = (track: Track) => {
    playTrack(track, MOCK_TRACKS);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Clock size={22} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Listening History</h1>
        </div>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          An unalterable scroll of frequencies and nocturnal hours observed
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {historyGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)', textTransform: 'uppercase' }}>
              <Calendar size={13} color="var(--accent-secondary)" />
              <span>{group.dateLabel}</span>
            </div>

            <div className="nocturne-tracklist">
              {group.tracks.map((track, i) => (
                <TrackRow
                  key={`${track.id}-${gIdx}-${i}`}
                  track={track}
                  index={i}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={status === 'playing'}
                  onPlay={handlePlayTrack}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
