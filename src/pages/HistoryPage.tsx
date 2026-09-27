import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { TrackList } from '../components/primitives/TrackList';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { musicService } from '../services/musicService';
import type { Track } from '../types';

export const HistoryPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();
  const { showToast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    let isCancelled = false;
    musicService.getAllTracks().then((all) => {
      if (!isCancelled) {
        setTracks(all);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const historyGroups = [
    {
      dateLabel: 'Tonight • The Witching Hour (03:14 AM)',
      tracks: tracks.slice(0, 3),
    },
    {
      dateLabel: 'Yesterday • Midnight Descent (11:45 PM)',
      tracks: tracks.slice(3, 7),
    },
    {
      dateLabel: 'September 25 • Crepuscular Dusk (09:12 PM)',
      tracks: tracks.slice(7, 11),
    },
  ];

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

            <TrackList
              tracks={group.tracks}
              currentTrackId={currentTrack?.id}
              isPlaying={status === 'playing'}
              onTrackPlay={(t, _all, i) => playTrack(t, group.tracks, i)}
              onLikeToggle={(t, l) => showToast(l ? 'Liked' : 'Unliked', t.title, 'default')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
