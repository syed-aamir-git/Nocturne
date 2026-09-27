import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, ArrowLeft, Heart, Sparkles, Music } from 'lucide-react';
import { musicService } from '../services/musicService';
import type { Playlist } from '../types';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { Button } from '../components/primitives/Button';
import { IconButton } from '../components/primitives/IconButton';
import { TrackRow } from '../components/primitives/TrackRow';
import { Skeleton } from '../components/primitives/Skeleton';
import { EmptyState } from '../components/primitives/EmptyState';
import { MOCK_TRACKS } from '../data/mockData';

export const PlaylistViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const { currentTrack, status, playTrack } = usePlayer();
  const { showToast } = useToast();

  useEffect(() => {
    let isCancelled = false;
    musicService.getPlaylistById(id || '').then((pl) => {
      if (!isCancelled) {
        setPlaylist(pl);
        setLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Skeleton height={220} variant="rounded" />
        <Skeleton height={40} width="30%" />
        <Skeleton height={60} variant="rounded" />
        <Skeleton height={60} variant="rounded" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto' }}>
        <EmptyState
          title="Sanctuary Archive Not Found"
          description="The requested nocturnal playlist has dissolved into the shadows or moved to another frequency."
          action={
            <Link to="/">
              <Button variant="primary">Return to Sanctum</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const tracks = MOCK_TRACKS;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Back button */}
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-medium)', fontSize: '13px' }}>
        <ArrowLeft size={16} />
        <span>Return to Sanctum</span>
      </Link>

      {/* Playlist Hero Header */}
      <div
        style={{
          display: 'flex',
          gap: 28,
          alignItems: 'flex-end',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-surface-elevated)',
            boxShadow: 'var(--shadow-lg), 0 0 20px var(--accent-glow)',
          }}
        >
          {!imgError ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={48} color="var(--accent-primary)" />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', color: 'var(--accent-secondary)' }}>
              MIDNIGHT PLAYLIST
            </span>
            {playlist.curatedHour && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-medium)',
                }}
              >
                <Clock size={11} />
                <span>{playlist.curatedHour}</span>
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2.4rem', margin: 0 }}>{playlist.title}</h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', maxWidth: 640 }}>
            {playlist.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play size={16} fill="currentColor" />}
              onClick={() => {
                if (tracks.length > 0) {
                  playTrack(tracks[0], tracks.slice(1));
                  showToast('Playing Playlist', playlist.title, 'atmosphere');
                }
              }}
            >
              Play Ritual
            </Button>
            <IconButton
              variant="secondary"
              size="md"
              aria-label="Add to favorites"
              onClick={() => showToast('Saved', `Added ${playlist.title} to your library`, 'default')}
            >
              <Heart size={18} />
            </IconButton>
            <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
              Curated by {playlist.curator} • {playlist.tracksCount} tracks
            </span>
          </div>
        </div>
      </div>

      {/* Tracks in Playlist */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="var(--accent-primary)" />
            <span>Ritual Sequence</span>
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            Studio Master Quality
          </span>
        </div>

        <div className="nocturne-tracklist">
          {tracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              isActive={currentTrack?.id === track.id}
              isPlaying={status === 'playing'}
              onPlay={(t) => playTrack(t, tracks)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
