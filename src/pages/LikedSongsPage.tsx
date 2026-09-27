import React from 'react';
import { Heart, Play } from 'lucide-react';
import { TrackRow } from '../components/primitives/TrackRow';
import { Button } from '../components/primitives/Button';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { MOCK_TRACKS } from '../data/mockData';
import type { Track } from '../types';

export const LikedSongsPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();
  const { showToast } = useToast();

  const handlePlayTrack = (track: Track) => {
    playTrack(track, MOCK_TRACKS);
    showToast('Immersed', `${track.title} • ${track.artist}`, 'default');
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
            {MOCK_TRACKS.length} recordings anchored to your midnight memories
          </p>

          <div style={{ marginTop: 6 }}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play size={16} fill="currentColor" />}
              onClick={() => handlePlayTrack(MOCK_TRACKS[0])}
            >
              Play All Preserved
            </Button>
          </div>
        </div>
      </div>

      {/* Tracklist */}
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
