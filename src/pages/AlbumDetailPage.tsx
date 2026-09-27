import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, ArrowLeft, Heart, Disc, Calendar, Music } from 'lucide-react';
import { musicService } from '../services/musicService';
import type { Album, Track } from '../types';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { Button } from '../components/primitives/Button';
import { IconButton } from '../components/primitives/IconButton';
import { TrackList } from '../components/primitives/TrackList';
import { Skeleton } from '../components/primitives/Skeleton';
import { EmptyState } from '../components/primitives/EmptyState';
import { formatDuration } from '../utilities/formatters';

export const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const { currentTrack, status, playTrack } = usePlayer();
  const { showToast } = useToast();

  useEffect(() => {
    let isCancelled = false;
    musicService.getAlbumById(id || '').then((alb) => {
      if (!isCancelled) {
        setAlbum(alb);
        if (alb) {
          musicService.getTracksByAlbum(alb.id).then((t) => {
            if (!isCancelled) {
              setTracks(t);
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Skeleton height={240} variant="rounded" />
        <Skeleton height={40} width="35%" />
        <Skeleton height={50} variant="rounded" />
        <Skeleton height={50} variant="rounded" />
      </div>
    );
  }

  if (!album) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto' }}>
        <EmptyState
          title="Album Lost in Shadows"
          description="The requested nocturnal recording could not be retrieved from the archives."
          action={
            <Link to="/albums">
              <Button variant="primary">Browse All Albums</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const coverSrc = album.artwork || album.coverUrl || '';
  const totalSecs = album.totalDuration || tracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAlbum = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks.slice(1));
      showToast('Album Loaded', `Playing "${album.title}" by ${album.artist}`, 'atmosphere');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Return link */}
      <Link
        to="/albums"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-medium)',
          fontSize: '13px',
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Albums</span>
      </Link>

      {/* Album Header Hero */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          alignItems: 'flex-end',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
          flexWrap: 'wrap',
        }}
      >
        {/* Cover Art */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-surface-elevated)',
            boxShadow: 'var(--shadow-lg), 0 0 24px var(--accent-glow)',
          }}
        >
          {!imgError && coverSrc ? (
            <img
              src={coverSrc}
              alt={album.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Disc size={56} color="var(--accent-primary)" />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                color: 'var(--accent-secondary)',
                fontWeight: 600,
              }}
            >
              {album.isSingle ? 'NOCTURNE SINGLE' : 'STUDIO ALBUM'}
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.06)',
                fontSize: '11px',
                color: 'var(--text-medium)',
              }}
            >
              {album.genre}
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', margin: 0, lineHeight: 1.15 }}>{album.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
            <Link
              to={`/artist/${album.artistId}`}
              style={{
                color: 'var(--text-high)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-high)')}
            >
              {album.artist}
            </Link>
            <span style={{ color: 'var(--text-low)' }}>•</span>
            <span style={{ color: 'var(--text-medium)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={13} />
              {album.releaseDate}
            </span>
            <span style={{ color: 'var(--text-low)' }}>•</span>
            <span style={{ color: 'var(--text-medium)' }}>
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}, {formatDuration(totalSecs)}
            </span>
          </div>

          {album.description && (
            <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', margin: '4px 0 0', maxWidth: 640 }}>
              {album.description}
            </p>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play size={16} fill="currentColor" />}
              onClick={handlePlayAlbum}
            >
              Play Album
            </Button>
            <IconButton
              variant="secondary"
              size="md"
              aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
              onClick={() => {
                const next = !liked;
                setLiked(next);
                showToast(
                  next ? 'Saved' : 'Removed',
                  next ? `Saved ${album.title} to your library` : `Removed ${album.title}`,
                  'default'
                );
              }}
              style={liked ? { color: 'var(--accent-primary)' } : undefined}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Music size={18} color="var(--accent-primary)" />
            <span>Tracklist</span>
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            Studio Master FLAC / MQA
          </span>
        </div>

        <TrackList
          tracks={tracks}
          currentTrackId={currentTrack?.id}
          isPlaying={status === 'playing'}
          showAlbum={false}
          onTrackPlay={(track, _all, index) => {
            playTrack(track, tracks.slice(index + 1));
          }}
          onLikeToggle={(t, l) => {
            showToast(l ? 'Liked' : 'Unliked', t.title, 'default');
          }}
        />
      </section>
    </div>
  );
};
