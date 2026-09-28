import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Shuffle,
  ArrowLeft,
  CheckCircle2,
  User,
  Disc,
  Radio,
  Share2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { musicService } from '../services/musicService';
import type { Artist, Track, Album } from '../types';
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
import { formatNumber } from '../utilities/formatters';
import './ArtistDetailPage.css';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [similarArtists, setSimilarArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgErrorArtistId, setImgErrorArtistId] = useState<string | null>(null);
  const [releaseFilter, setReleaseFilter] = useState<'all' | 'albums' | 'eps' | 'singles'>('all');
  const [showAllPopular, setShowAllPopular] = useState(false);

  const { currentTrack, isPlaying, playTrack } = usePlayer();
  const { isArtistFollowed, toggleFollowArtist } = useLibrary();
  const { showToast } = useToast();

  const isFollowed = artist ? isArtistFollowed(artist.id) : false;
  const imgError = Boolean(artist && imgErrorArtistId === artist.id);
  const isLoading = loading || (artist?.id !== id);

  useEffect(() => {
    let isCancelled = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Promise.all([
      musicService.getArtistById(id || ''),
      musicService.getTracksByArtist(id || ''),
      musicService.getAllAlbums(),
      musicService.getSimilarArtists(id || ''),
    ]).then(([art, trks, allAlbs, similar]) => {
      if (!isCancelled) {
        setArtist(art);
        // Sort tracks by playCount for popular songs
        const sortedTrks = [...trks].sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
        setTracks(sortedTrks);
        setAlbums(allAlbs.filter((a) => a.artistId === id));
        setSimilarArtists(similar);
        setLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Segregate discography into Albums, EPs, and Singles
  const categorizedAlbums = useMemo(() => {
    const fullAlbums: Album[] = [];
    const eps: Album[] = [];
    const singles: Album[] = [];

    albums.forEach((alb) => {
      const tracksCount = alb.tracksCount ?? (alb.tracks ? alb.tracks.length : 0);
      if (alb.type === 'single' || alb.isSingle || tracksCount === 1) {
        singles.push(alb);
      } else if (alb.type === 'ep' || alb.title.toLowerCase().includes('ep') || tracksCount <= 3) {
        eps.push(alb);
      } else {
        fullAlbums.push(alb);
      }
    });

    return { fullAlbums, eps, singles };
  }, [albums]);

  const filteredReleases = useMemo(() => {
    if (releaseFilter === 'albums') return categorizedAlbums.fullAlbums;
    if (releaseFilter === 'eps') return categorizedAlbums.eps;
    if (releaseFilter === 'singles') return categorizedAlbums.singles;
    return albums;
  }, [releaseFilter, categorizedAlbums, albums]);

  if (isLoading) {
    return (
      <div className="nocturne-artist-page">
        <Skeleton height={320} variant="rounded" />
        <Skeleton height={40} width="35%" />
        <Skeleton height={200} variant="rounded" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto' }}>
        <EmptyState
          title="Artist Unknown to the Sanctum"
          description="The creator you seek has retreated into anonymity or the ether."
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
  const isCurrentlyPlayingArtist = Boolean(
    isPlaying && currentTrack && tracks.some((t) => t.id === currentTrack.id)
  );

  // Actions
  const handlePlayArtist = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks, 0);
      showToast('Playing Artist', artist.name, 'atmosphere');
    }
  };

  const handleShuffleArtist = () => {
    if (tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled, 0);
      showToast('Shuffling Artist', `Shuffled ${shuffled.length} hymns by ${artist.name}`, 'atmosphere');
    }
  };

  const handleToggleFollow = () => {
    const next = toggleFollowArtist(artist.id);
    showToast(
      next ? 'Preserved in Sanctum' : 'Removed from Sanctum',
      next ? `Now following ${artist.name}` : `Unfollowed ${artist.name}`,
      'default'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Sanctuary Link Copied', `Link to ${artist.name} copied to clipboard`, 'default');
    }
  };

  const displayedTracks = showAllPopular ? tracks : tracks.slice(0, 5);

  return (
    <div className="nocturne-artist-page">
      {/* Return link */}
      <Link to="/artists" className="nocturne-artist-page__back-link">
        <ArrowLeft size={16} />
        <span>Return to Artists</span>
      </Link>

      {/* Hero Banner Centerpiece */}
      <header className="nocturne-artist-page__hero">
        {bannerSrc && (
          <div
            className="nocturne-artist-page__hero-backdrop"
            style={{ backgroundImage: `url(${bannerSrc})` }}
          />
        )}
        <div className="nocturne-artist-page__hero-overlay" />

        <div className="nocturne-artist-page__hero-content">
          {/* Avatar */}
          <div className="nocturne-artist-page__avatar-wrap">
            {!imgError && avatarSrc ? (
              <img
                src={avatarSrc}
                alt={artist.name}
                className="nocturne-artist-page__avatar"
                onError={() => artist && setImgErrorArtistId(artist.id)}
              />
            ) : (
              <div className="nocturne-artist-page__avatar-fallback">
                <User size={56} />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="nocturne-artist-page__meta">
            <div className="nocturne-artist-page__eyebrow-row">
              <span className="nocturne-artist-page__eyebrow">FEATURED ARTIST</span>
              {artist.verified && (
                <span className="nocturne-artist-page__verified-pill">
                  <CheckCircle2 size={13} fill="currentColor" /> Verified Sanctuary
                </span>
              )}
            </div>

            <h1 className="nocturne-artist-page__name">{artist.name}</h1>

            {artist.monthlyListeners !== undefined && (
              <span className="nocturne-artist-page__listener-stat">
                {formatNumber(artist.monthlyListeners)} monthly listeners in silence
              </span>
            )}

            <div className="nocturne-artist-page__genre-pills">
              {artist.genres.map((g) => (
                <span key={g} className="nocturne-artist-page__genre-pill">
                  {g}
                </span>
              ))}
            </div>

            {/* Actions Toolbar */}
            <div className="nocturne-artist-page__actions">
              <Button
                variant="primary"
                size="md"
                className="nocturne-artist-page__play-btn"
                leftIcon={isCurrentlyPlayingArtist ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
                onClick={handlePlayArtist}
              >
                {isCurrentlyPlayingArtist ? 'Pause' : 'Play Artist'}
              </Button>

              <Button
                variant="secondary"
                size="md"
                leftIcon={<Shuffle size={16} />}
                onClick={handleShuffleArtist}
              >
                Shuffle
              </Button>

              <Button
                variant={isFollowed ? 'secondary' : 'gothic'}
                size="md"
                leftIcon={isFollowed ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                onClick={handleToggleFollow}
              >
                {isFollowed ? 'Preserved in Library' : 'Follow'}
              </Button>

              <Tooltip content="Artist Radio" position="top">
                <IconButton
                  variant="ghost"
                  size="md"
                  aria-label="Start artist radio"
                  onClick={() => showToast('Artist Radio', `Generated ambient radio for ${artist.name}`, 'atmosphere')}
                >
                  <Radio size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip content="Share Artist" position="top">
                <IconButton
                  variant="ghost"
                  size="md"
                  aria-label="Share artist"
                  onClick={handleShare}
                >
                  <Share2 size={18} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Biography & Lore */}
      {bio && (
        <section className="nocturne-artist-page__bio-card">
          <div className="nocturne-artist-page__bio-header">
            <h2 className="nocturne-artist-page__bio-title">Sanctuary Inscriptions</h2>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
              CHRONICLES OF {artist.name.toUpperCase()}
            </span>
          </div>
          <p className="nocturne-artist-page__bio-text">{bio}</p>
        </section>
      )}

      {/* Popular Songs / Essential Recordings */}
      {tracks.length > 0 && (
        <section>
          <div className="nocturne-artist-page__section-header">
            <h2 className="nocturne-artist-page__section-title">
              <Sparkles size={20} color="var(--accent-primary)" />
              <span>Essential Recordings</span>
            </h2>
            {tracks.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllPopular(!showAllPopular)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-secondary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                {showAllPopular ? 'Show Less' : `Show All (${tracks.length})`}
              </button>
            )}
          </div>

          <TrackList
            tracks={displayedTracks}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            onTrackPlay={(t, _all, i) => {
              playTrack(t, tracks, i);
            }}
            onLikeToggle={(t, l) => {
              showToast(l ? 'Liked' : 'Unliked', t.title, 'default');
            }}
          />
        </section>
      )}

      {/* Discography: Albums, EPs, Singles */}
      <section>
        <div className="nocturne-artist-page__discography-header">
          <h2 className="nocturne-artist-page__section-title">
            <Disc size={20} color="var(--accent-primary)" />
            <span>Discography</span>
          </h2>

          <div className="nocturne-artist-page__filter-tabs">
            <button
              type="button"
              className={`nocturne-artist-page__filter-btn ${
                releaseFilter === 'all' ? 'nocturne-artist-page__filter-btn--active' : ''
              }`}
              onClick={() => setReleaseFilter('all')}
            >
              All ({albums.length})
            </button>
            <button
              type="button"
              className={`nocturne-artist-page__filter-btn ${
                releaseFilter === 'albums' ? 'nocturne-artist-page__filter-btn--active' : ''
              }`}
              onClick={() => setReleaseFilter('albums')}
            >
              Albums ({categorizedAlbums.fullAlbums.length})
            </button>
            <button
              type="button"
              className={`nocturne-artist-page__filter-btn ${
                releaseFilter === 'eps' ? 'nocturne-artist-page__filter-btn--active' : ''
              }`}
              onClick={() => setReleaseFilter('eps')}
            >
              EPs ({categorizedAlbums.eps.length})
            </button>
            <button
              type="button"
              className={`nocturne-artist-page__filter-btn ${
                releaseFilter === 'singles' ? 'nocturne-artist-page__filter-btn--active' : ''
              }`}
              onClick={() => setReleaseFilter('singles')}
            >
              Singles ({categorizedAlbums.singles.length})
            </button>
          </div>
        </div>

        {filteredReleases.length > 0 ? (
          <div className="nocturne-artist-page__release-grid">
            {filteredReleases.map((alb) => (
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
        ) : (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-low)' }}>
            <p style={{ margin: 0, fontStyle: 'italic' }}>
              No releases in this category yet.
            </p>
          </div>
        )}
      </section>

      {/* Similar Artists / Kindred Spirits */}
      {similarArtists.length > 0 && (
        <section>
          <div className="nocturne-artist-page__section-header">
            <h2 className="nocturne-artist-page__section-title">
              <Users size={20} color="var(--accent-secondary)" />
              <span>Kindred Spirits</span>
            </h2>
            <span className="nocturne-artist-page__section-badge">
              ATMOSPHERIC RESONANCES
            </span>
          </div>

          <div className="nocturne-artist-page__similar-grid">
            {similarArtists.map((sim) => {
              const simAvatar = sim.image || sim.avatarUrl || '';
              return (
                <Link
                  key={sim.id}
                  to={`/artist/${sim.id}`}
                  className="nocturne-artist-page__similar-card"
                >
                  <div className="nocturne-artist-page__similar-avatar-wrap">
                    {simAvatar ? (
                      <img
                        src={simAvatar}
                        alt={sim.name}
                        className="nocturne-artist-page__similar-avatar"
                      />
                    ) : (
                      <div className="nocturne-artist-page__avatar-fallback">
                        <User size={36} />
                      </div>
                    )}
                  </div>
                  <span className="nocturne-artist-page__similar-name" title={sim.name}>
                    {sim.name}
                  </span>
                  <span className="nocturne-artist-page__similar-genre">
                    {sim.genres[0] || 'Gothic Atmosphere'}
                  </span>
                  {sim.monthlyListeners !== undefined && (
                    <span className="nocturne-artist-page__similar-listeners">
                      {formatNumber(sim.monthlyListeners)} listeners
                    </span>
                  )}
                  <div className="nocturne-artist-page__similar-actions">
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-secondary)',
                      }}
                    >
                      Enter Sanctum →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArtistDetailPage;
