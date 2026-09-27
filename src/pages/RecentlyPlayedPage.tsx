import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { TrackList } from '../components/primitives/TrackList';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { musicService } from '../services/musicService';
import type { Track } from '../types';

export const RecentlyPlayedPage: React.FC = () => {
  const { playTrack, currentTrack, status, history } = usePlayer();
  const { showToast } = useToast();
  const [fallbackTracks, setFallbackTracks] = useState<Track[]>([]);

  useEffect(() => {
    let isCancelled = false;
    if (history.length === 0) {
      musicService.getAllTracks().then((all) => {
        if (!isCancelled) {
          setFallbackTracks(all.slice(0, 10));
        }
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [history.length]);

  const tracks = history.length > 0 ? history : fallbackTracks;

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

      <TrackList
        tracks={tracks}
        currentTrackId={currentTrack?.id}
        isPlaying={status === 'playing'}
        onTrackPlay={(t, _all, i) => playTrack(t, tracks, i)}
        onLikeToggle={(t, l) => showToast(l ? 'Liked' : 'Unliked', t.title, 'default')}
      />
    </div>
  );
};
