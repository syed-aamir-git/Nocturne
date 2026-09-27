import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, ArrowLeft, CheckCircle2, User, Disc, Radio } from 'lucide-react';
import { musicService } from '../services/musicService';
import type { Artist, Track, Album } from '../types';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { Button } from '../components/primitives/Button';
import { IconButton } from '../components/primitives/IconButton';
import { TrackList } from '../components/primitives/TrackList';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { Skeleton } from '../components/primitives/Skeleton';
import { EmptyState } from '../components/primitives/EmptyState';
import { formatNumber } from '../utilities/formatters';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { currentTrack, status, playTrack } = usePlayer();
  const { showToast } = useToast();

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      musicService.getArtistById(id || ''),
      musicService.getTracksByArtist(id || ''),
      musicService.getAllAlbums(),
    ]).then(([art, trks, allAlbs]) => {
      if (!isCancelled) {
        setArtist(art);
        setTracks(trks);
        setAlbums(allAlbs.filter((a) => a.artistId === id));
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
        <Skeleton height={260} variant="rounded" />
        <Skeleton height={40} width="30%" />
        <Skeleton height={60} variant="rounded" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto' }}>
        <EmptyState
          title="Artist Unknown to the Sanctum"
          description="The artist you seek has retreated into anonymity or the ether."
          action={
            <Link to="/artists">
              <Button variant="primary">Browse All Artists</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const avatarSrc = artist.image || artist.avatarUrl || '';
  const bannerSrc = artist.bannerUrl || avatarSrc;
  const bio = artist.biography || artist.bio || '';

  const handlePlayArtist = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks, 0);
      showToast('Playing Artist', artist.name, 'atmosphere');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Return link */}
      <Link
        to="/artists"
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
        <span>Return to Artists</span>
      </Link>

      {/* Artist Hero Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          minHeight: 280,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '32px',
        }}
      >
        {/* Backdrop image */}
        {bannerSrc && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${bannerSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              opacity: 0.28,
              filter: 'blur(3px)',
              pointerEvents: 'none',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--bg-surface) 10%, rgba(10, 10, 12, 0.75) 70%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 24,
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              background: 'var(--bg-surface-elevated)',
              boxShadow: 'var(--shadow-lg), 0 0 20px var(--accent-glow)',
              border: '2px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {!imgError && avatarSrc ? (
              <img
                src={avatarSrc}
                alt={artist.name}
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
                <User size={48} color="var(--accent-secondary)" />
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 260 }}>
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
                FEATURED ARTIST
              </span>
              {artist.verified && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '11px',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <CheckCircle2 size={13} fill="currentColor" /> Verified Sanctuary
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.6rem', margin: 0, lineHeight: 1.1 }}>{artist.name}</h1>

            {artist.monthlyListeners !== undefined && (
              <span style={{ fontSize: '13px', color: 'var(--text-medium)', fontFamily: 'var(--font-mono)' }}>
                {formatNumber(artist.monthlyListeners)} monthly listeners in silence
              </span>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {artist.genres.map((g) => (
                <span
                  key={g}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    fontSize: '11px',
                    color: 'var(--text-medium)',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Play size={16} fill="currentColor" />}
                onClick={handlePlayArtist}
              >
                Play Artist
              </Button>
              <Button
                variant={following ? 'secondary' : 'gothic'}
                size="md"
                onClick={() => {
                  const next = !following;
                  setFollowing(next);
                  showToast(
                    next ? 'Followed' : 'Unfollowed',
                    next ? `Now receiving updates from ${artist.name}` : `Unfollowed ${artist.name}`,
                    'default'
                  );
                }}
              >
                {following ? 'Preserved in Library' : 'Follow'}
              </Button>
              <IconButton
                variant="ghost"
                size="md"
                aria-label="Start artist radio"
                onClick={() => showToast('Artist Radio', `Generated radio for ${artist.name}`, 'atmosphere')}
              >
                <Radio size={18} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Biography */}
      {bio && (
        <section
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <h2 style={{ fontSize: '1.15rem', marginBottom: 10, color: 'var(--text-high)' }}>Biography</h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            {bio}
          </p>
        </section>
      )}

      {/* Popular Tracks */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Essential Recordings</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
          </span>
        </div>

        <TrackList
          tracks={tracks}
          currentTrackId={currentTrack?.id}
          isPlaying={status === 'playing'}
          onTrackPlay={(t, _all, i) => {
            playTrack(t, tracks, i);
          }}
          onLikeToggle={(t, l) => {
            showToast(l ? 'Liked' : 'Unliked', t.title, 'default');
          }}
        />
      </section>

      {/* Discography */}
      {albums.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Disc size={18} color="var(--accent-primary)" />
              <span>Discography</span>
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
              {albums.length} {albums.length === 1 ? 'release' : 'releases'}
            </span>
          </div>

          <div className="nocturne-home__grid-cinematic">
            {albums.map((alb) => (
              <AlbumCard
                key={alb.id}
                album={alb}
                onPlay={(a) => {
                  if (a.tracks && a.tracks.length > 0) {
                    playTrack(a.tracks[0], a.tracks.slice(1));
                    showToast('Album Loaded', a.title, 'atmosphere');
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
