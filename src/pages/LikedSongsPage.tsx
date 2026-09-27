import React, { useState, useEffect } from 'react';
import { Heart, Play } from 'lucide-react';
import { TrackList } from '../components/primitives/TrackList';
import { Button } from '../components/primitives/Button';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { musicService } from '../services/musicService';
import type { Track } from '../types';

export const LikedSongsPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();
  const { showToast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    let isCancelled = false;
    musicService.getAllTracks().then((all) => {
      if (!isCancelled) {
        setTracks(all.slice(0, 12));
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks.slice(1));
      showToast('Playing Preserved Tracks', `${tracks.length} tracks queued`, 'atmosphere');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'flex-end',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(157, 114, 255, 0.25) 0%, rgba(20, 20, 30, 0.9) 100%)',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 24px var(--accent-glow)',
          }}
        >
          <Heart size={54} color="var(--accent-primary)" fill="currentColor" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'var(--accent-secondary)' }}>
            PRESERVED COLLECTION
          </span>
          <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Liked Songs</h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '13px', margin: 0 }}>
            {tracks.length} recordings anchored to your midnight memories
          </p>

          <div style={{ marginTop: 6 }}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play size={16} fill="currentColor" />}
              onClick={handlePlayAll}
            >
              Play All Preserved
            </Button>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <TrackList
        tracks={tracks}
        currentTrackId={currentTrack?.id}
        isPlaying={status === 'playing'}
        onTrackPlay={(t, _all, i) => playTrack(t, tracks.slice(i + 1))}
        onLikeToggle={(t, l) => showToast(l ? 'Liked' : 'Unliked', t.title, 'default')}
      />
    </div>
  );
};
