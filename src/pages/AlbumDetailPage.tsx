import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Shuffle,
  ArrowLeft,
  Heart,
  Disc,
  Calendar,
  Music,
  ListPlus,
  Share2,
  Sparkles,
} from 'lucide-react';
import { musicService } from '../services/musicService';
import type { Album, Track } from '../types';
import { usePlayer } from '../state/PlayerContext';
import { useLibrary } from '../state/LibraryContext';
import { useToast } from '../state/ToastContext';
import { Button } from '../components/primitives/Button';
import { IconButton } from '../components/primitives/IconButton';
import { TrackList } from '../components/primitives/TrackList';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { Skeleton } from '../components/primitives/Skeleton';
import { EmptyState } from '../components/primitives/EmptyState';
import { Tooltip } from '../components/primitives/Tooltip';
import { formatDuration } from '../utilities/formatters';
import './AlbumDetailPage.css';

export const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artistOtherAlbums, setArtistOtherAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgErrorAlbumId, setImgErrorAlbumId] = useState<string | null>(null);

  const { currentTrack, isPlaying, playTrack, addTracksToQueue } = usePlayer();
  const { isAlbumSaved, toggleSaveAlbum } = useLibrary();
  const { showToast } = useToast();

  const isSaved = album ? isAlbumSaved(album.id) : false;
  const imgError = Boolean(album && imgErrorAlbumId === album.id);
  const isLoading = loading || (album?.id !== id);

  useEffect(() => {
    let isCancelled = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    musicService.getAlbumById(id || '').then((alb) => {
      if (isCancelled) return;
      setAlbum(alb);

      if (alb) {
        Promise.all([
          musicService.getTracksByAlbum(alb.id),
          musicService.getAllAlbums(),
        ]).then(([t, allAlbs]) => {
          if (!isCancelled) {
            setTracks(t);
            setArtistOtherAlbums(
              allAlbs.filter((a) => a.artistId === alb.artistId && a.id !== alb.id)
            );
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const totalSecs = useMemo(() => {
    if (album?.totalDuration) return album.totalDuration;
    return tracks.reduce((acc, t) => acc + t.duration, 0);
  }, [album, tracks]);

  const releaseTypeLabel = useMemo(() => {
    if (!album) return 'STUDIO ALBUM';
    if (album.type === 'single' || album.isSingle || tracks.length === 1) return 'NOCTURNE SINGLE';
    if (album.type === 'ep' || tracks.length <= 3) return 'EXTENDED PLAY';
    return 'STUDIO ALBUM';
  }, [album, tracks.length]);

  if (isLoading) {
    return (
      <div className="nocturne-album-page">
        <Skeleton height={300} variant="rounded" />
        <Skeleton height={40} width="35%" />
        <Skeleton height={60} variant="rounded" />
        <Skeleton height={60} variant="rounded" />
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
  const isCurrentlyPlayingAlbum = Boolean(
    isPlaying && currentTrack && tracks.some((t) => t.id === currentTrack.id)
  );

  // Actions
  const handlePlayAlbum = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks, 0);
      showToast('Album Loaded', `Playing "${album.title}" by ${album.artist}`, 'atmosphere');
    }
  };

  const handleShuffleAlbum = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled, 0);
      showToast('Shuffling Album', `Shuffled ${shuffled.length} tracks from ${album.title}`, 'atmosphere');
    }
  };

  const handleToggleSave = () => {
    const next = toggleSaveAlbum(album.id);
    showToast(
      next ? 'Anchored to Library' : 'Removed from Library',
      next ? `Saved "${album.title}" to your sanctuary library` : `Removed "${album.title}"`,
      'default'
    );
  };

  const handleAddAllToQueue = () => {
    if (tracks.length > 0) {
      addTracksToQueue(tracks);
      showToast('Added to Queue', `Added all ${tracks.length} tracks to upcoming sequence`, 'default');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Sanctuary Link Copied', `Link to "${album.title}" copied to clipboard`, 'default');
    }
  };

  return (
    <div className="nocturne-album-page">
      {/* Return link */}
      <Link to="/albums" className="nocturne-album-page__back-link">
        <ArrowLeft size={16} />
        <span>Return to Albums</span>
      </Link>

      {/* Album Header Centerpiece */}
      <header className="nocturne-album-page__hero">
        {coverSrc && (
          <div
            className="nocturne-album-page__hero-backdrop"
            style={{ backgroundImage: `url(${coverSrc})` }}
          />
        )}
        <div className="nocturne-album-page__hero-overlay" />

        <div className="nocturne-album-page__hero-content">
          {/* Vinyl Sleeve Cover */}
          <div className="nocturne-album-page__cover-wrap">
            {!imgError && coverSrc ? (
              <img
                src={coverSrc}
                alt={album.title}
                className="nocturne-album-page__cover"
                onError={() => album && setImgErrorAlbumId(album.id)}
              />
            ) : (
              <div className="nocturne-album-page__cover-fallback">
                <Disc size={64} />
              </div>
            )}
          </div>

          {/* Album Metadata */}
          <div className="nocturne-album-page__meta">
            <div className="nocturne-album-page__tags-row">
              <span className="nocturne-album-page__type-tag">{releaseTypeLabel}</span>
              <span className="nocturne-album-page__genre-pill">{album.genre}</span>
            </div>

            <h1 className="nocturne-album-page__title">{album.title}</h1>

            <div className="nocturne-album-page__info-row">
              <Link
                to={`/artist/${album.artistId}`}
                className="nocturne-album-page__artist-link"
              >
                {album.artist}
              </Link>
              <span className="nocturne-album-page__dot">•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} />
                {album.releaseDate || album.releaseYear || '2025'}
              </span>
              <span className="nocturne-album-page__dot">•</span>
              <span>
                {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}, {formatDuration(totalSecs)}
              </span>
              <span className="nocturne-album-page__dot">•</span>
              <span className="nocturne-album-page__audio-badge">24-BIT / 96KHZ FLAC</span>
            </div>

            {album.description && (
              <p className="nocturne-album-page__desc">{album.description}</p>
            )}

            {/* Actions Toolbar */}
            <div className="nocturne-album-page__actions">
              <Button
                variant="primary"
                size="md"
                className="nocturne-album-page__play-btn"
                leftIcon={isCurrentlyPlayingAlbum ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
                onClick={handlePlayAlbum}
              >
                {isCurrentlyPlayingAlbum ? 'Pause' : 'Play Album'}
              </Button>

              <Button
                variant="secondary"
                size="md"
                leftIcon={<Shuffle size={16} />}
                onClick={handleShuffleAlbum}
              >
                Shuffle
              </Button>

              <Tooltip content={isSaved ? 'Remove from Sanctuary Library' : 'Save to Sanctuary Library'} position="top">
                <IconButton
                  variant={isSaved ? 'secondary' : 'ghost'}
                  size="md"
                  aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                  onClick={handleToggleSave}
                  style={isSaved ? { color: 'var(--accent-primary)' } : undefined}
                >
                  <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </IconButton>
              </Tooltip>

              <Tooltip content="Add Entire Album to Queue" position="top">
                <IconButton
                  variant="ghost"
                  size="md"
                  aria-label="Add album to queue"
                  onClick={handleAddAllToQueue}
                >
                  <ListPlus size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip content="Share Album" position="top">
                <IconButton
                  variant="ghost"
                  size="md"
                  aria-label="Share album"
                  onClick={handleShare}
                >
                  <Share2 size={18} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Tracklist Section */}
      <section className="nocturne-album-page__tracklist-section">
        <div className="nocturne-album-page__tracklist-header">
          <h2 className="nocturne-album-page__section-title">
            <Music size={20} color="var(--accent-primary)" />
            <span>Master Tracklist</span>
          </h2>
          <span className="nocturne-album-page__section-badge">
            BIT-PERFECT DIRECT FLAC STREAM
          </span>
        </div>

        <TrackList
          tracks={tracks}
          currentTrackId={currentTrack?.id}
          isPlaying={isPlaying}
          showAlbum={false}
          onTrackPlay={(track, _all, index) => {
            playTrack(track, tracks, index);
          }}
          onLikeToggle={(t, l) => {
            showToast(l ? 'Liked' : 'Unliked', t.title, 'default');
          }}
        />
      </section>

      {/* Liner Notes & Production Credits */}
      <section>
        <div className="nocturne-album-page__tracklist-header">
          <h2 className="nocturne-album-page__section-title">
            <Sparkles size={18} color="var(--accent-secondary)" />
            <span>Acoustic Credits & Liner Notes</span>
          </h2>
        </div>

        <div className="nocturne-album-page__credits-card">
          <div className="nocturne-album-page__credit-item">
            <span className="nocturne-album-page__credit-label">Principal Artist</span>
            <span className="nocturne-album-page__credit-val">{album.artist}</span>
          </div>

          <div className="nocturne-album-page__credit-item">
            <span className="nocturne-album-page__credit-label">Record Label</span>
            <span className="nocturne-album-page__credit-val">Nocturne High-Resolution Archives</span>
          </div>

          <div className="nocturne-album-page__credit-item">
            <span className="nocturne-album-page__credit-label">Acoustic Master</span>
            <span className="nocturne-album-page__credit-val">24-bit / 96kHz Lossless FLAC</span>
          </div>

          <div className="nocturne-album-page__credit-item">
            <span className="nocturne-album-page__credit-label">Release Year</span>
            <span className="nocturne-album-page__credit-val">{album.releaseDate || album.releaseYear || '2025'}</span>
          </div>
        </div>
      </section>

      {/* More Releases By Artist */}
      {artistOtherAlbums.length > 0 && (
        <section>
          <div className="nocturne-album-page__tracklist-header">
            <h2 className="nocturne-album-page__section-title">
              <Disc size={20} color="var(--accent-primary)" />
              <span>More Inscriptions by {album.artist}</span>
            </h2>
          </div>

          <div className="nocturne-album-page__more-grid">
            {artistOtherAlbums.map((alb) => (
              <AlbumCard
                key={alb.id}
                album={alb}
                onPlay={(a) => {
                  if (a.tracks && a.tracks.length > 0) {
                    playTrack(a.tracks[0], a.tracks, 0);
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

export default AlbumDetailPage;
