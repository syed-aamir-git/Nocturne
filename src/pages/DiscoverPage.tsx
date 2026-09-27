import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Sparkles,
  Moon,
  Flame,
  Radio,
  Music,
  Users,
  Disc,
} from 'lucide-react';
import { Button } from '../components/primitives/Button';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { TrackList } from '../components/primitives/TrackList';
import { usePlayer } from '../state/PlayerContext';
import { useLibrary } from '../state/LibraryContext';
import { useToast } from '../state/ToastContext';
import { musicService } from '../services/musicService';
import {
  recommendationService,
  MOOD_COLLECTIONS,
  type MoodCollection,
} from '../services/recommendationService';
import type { Album, Track, Artist } from '../types';
import './DiscoverPage.css';

export const DiscoverPage: React.FC = () => {
  const { playTrack, currentTrack, status, history } = usePlayer();
  const { likedTrackIds } = useLibrary();
  const { showToast } = useToast();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      musicService.getAllAlbums(),
      musicService.getAllArtists(),
      musicService.getAllTracks(),
      musicService.getGenres(),
    ]).then(([albs, arts, trks, gnrs]) => {
      if (!isCancelled) {
        setAlbums(albs);
        setArtists(arts);
        setTracks(trks);
        setGenres(['All', ...gnrs]);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Compute personalized recommendations based on actual user listening behavior
  const personalized = useMemo(() => {
    return recommendationService.getPersonalizedRecommendations(
      history,
      likedTrackIds,
      currentTrack
    );
  }, [history, likedTrackIds, currentTrack]);

  // Compute similar songs & similar artists based on current track (or first history track)
  const focalTrack = currentTrack || history[history.length - 1] || tracks[0];

  const similarSongs = useMemo(() => {
    if (!focalTrack) return [];
    return recommendationService.getSimilarSongs(focalTrack);
  }, [focalTrack]);

  const similarArtists = useMemo(() => {
    if (!focalTrack) return [];
    return recommendationService.getSimilarArtists(focalTrack.artistId);
  }, [focalTrack]);

  // New releases & trending tracks
  const newReleases = useMemo(() => {
    return recommendationService.getNewReleases().slice(0, 6);
  }, []);

  const trendingTracks = useMemo(() => {
    return recommendationService.getTrendingTracks().slice(0, 6);
  }, []);

  // Mood tracks when a mood is selected
  const moodTracks = useMemo(() => {
    if (!selectedMood) return [];
    return recommendationService.getTracksByMood(selectedMood);
  }, [selectedMood]);

  const handlePlayMood = (e: React.MouseEvent, mood: MoodCollection) => {
    e.stopPropagation();
    const moodT = recommendationService.getTracksByMood(mood.id);
    if (moodT.length > 0) {
      playTrack(moodT[0], moodT, 0);
      showToast('Atmosphere Initiated', `Streaming ${mood.name} collection`, 'atmosphere');
    }
  };

  const handleSelectMood = (moodId: string) => {
    if (selectedMood === moodId) {
      setSelectedMood(null);
    } else {
      setSelectedMood(moodId);
      const mood = MOOD_COLLECTIONS.find((m) => m.id === moodId);
      if (mood) {
        showToast('Mood Filtered', `Displaying ${mood.name} sonic chamber`, 'default');
      }
    }
  };

  const filteredTracks =
    activeGenre === 'All'
      ? tracks
      : tracks.filter((t) => t.genre.toLowerCase().includes(activeGenre.toLowerCase()));

  return (
    <div className="nocturne-discover">
      {/* Gothic Atmospheric Hero Banner */}
      <section className="nocturne-hero">
        <div className="nocturne-hero__badge">
          <Moon size={13} />
          <span>MIDNIGHT RESONANCE SELECTION</span>
        </div>
        <h1 className="nocturne-hero__title">The Hours That Belong To You</h1>
        <p className="nocturne-hero__tagline">
          When the world recedes into silence, music ceases to be background sound. Step inside our
          curated darkwave, liturgical reverb, and analog ambient sanctum.
        </p>
        <div className="nocturne-hero__actions">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play size={18} fill="currentColor" />}
            onClick={() => {
              if (tracks.length > 0) {
                playTrack(tracks[0], tracks, 0);
                showToast('Sanctuary Unlocked', 'Beginning midnight listening ritual', 'atmosphere');
              }
            }}
          >
            Enter Sanctuary
          </Button>

          <Button
            variant="gothic"
            size="lg"
            leftIcon={<Radio size={16} />}
            onClick={() => {
              const ambient = recommendationService.getTracksByMood('ambient');
              if (ambient.length > 0) {
                playTrack(ambient[0], ambient, 0);
                showToast('Ambient Drift Active', 'Subterranean drone stream initiated', 'atmosphere');
              }
            }}
          >
            Ambient Drift
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. MOOD COLLECTIONS (The 10 Required Moods) */}
      {/* ========================================================================= */}
      <section>
        <div className="nocturne-section__header">
          <div>
            <h2 className="nocturne-section__title">Mood Collections</h2>
            <span className="nocturne-section__sub">
              Curated sonic atmospheres tailored to every hour of solitude
            </span>
          </div>
          {selectedMood && (
            <button
              type="button"
              onClick={() => setSelectedMood(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Show All Moods
            </button>
          )}
        </div>

        <div className="nocturne-mood-grid">
          {MOOD_COLLECTIONS.map((mood) => {
            const isActive = selectedMood === mood.id;
            return (
              <div
                key={mood.id}
                className={`nocturne-mood-card ${isActive ? 'nocturne-mood-card--active' : ''}`}
                style={
                  {
                    '--mood-accent': mood.accentColor,
                    '--mood-glow': `${mood.accentColor}33`,
                  } as React.CSSProperties
                }
                onClick={() => handleSelectMood(mood.id)}
              >
                <img src={mood.artwork} alt={mood.name} className="nocturne-mood-card__bg" />
                <div className="nocturne-mood-card__overlay" />

                <div className="nocturne-mood-card__content">
                  <span className="nocturne-mood-card__title">{mood.name}</span>
                  <span className="nocturne-mood-card__tagline">{mood.tagline}</span>
                </div>

                <button
                  type="button"
                  className="nocturne-mood-card__play-btn"
                  onClick={(e) => handlePlayMood(e, mood)}
                  aria-label={`Play ${mood.name} mood`}
                  title={`Play ${mood.name} collection`}
                >
                  <Play size={14} fill="currentColor" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Mood Tracklist View */}
        {selectedMood && moodTracks.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {selectedMood.toUpperCase()} MOOD SEQUENCE ({moodTracks.length})
              </span>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Play size={14} fill="currentColor" />}
                onClick={() => playTrack(moodTracks[0], moodTracks, 0)}
              >
                Play Mood
              </Button>
            </div>
            <TrackList
              tracks={moodTracks}
              currentTrackId={currentTrack?.id}
              isPlaying={status === 'playing'}
              onTrackPlay={(t, _all, i) => playTrack(t, moodTracks, i)}
            />
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZED RECOMMENDATIONS (Behavior-driven Heuristics) */}
      {/* ========================================================================= */}
      <section className="nocturne-personal-banner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  color: 'var(--accent-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                BEHAVIOR-DRIVEN RESONANCE
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-pure)' }}>
              {personalized.title}
            </h2>
            <span style={{ fontSize: '12.5px', color: 'var(--text-medium)', fontStyle: 'italic' }}>
              {personalized.reason}
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<Play size={16} fill="currentColor" />}
            onClick={() => {
              if (personalized.tracks.length > 0) {
                playTrack(personalized.tracks[0], personalized.tracks, 0);
                showToast('Playing Recommendations', personalized.title, 'atmosphere');
              }
            }}
          >
            Play Recommendations
          </Button>
        </div>

        <TrackList
          tracks={personalized.tracks}
          currentTrackId={currentTrack?.id}
          isPlaying={status === 'playing'}
          onTrackPlay={(t, _all, i) => playTrack(t, personalized.tracks, i)}
        />
      </section>

      {/* ========================================================================= */}
      {/* 3. SIMILAR SONGS & SIMILAR ARTISTS */}
      {/* ========================================================================= */}
      {focalTrack && similarSongs.length > 0 && (
        <section>
          <div className="nocturne-section__header">
            <div>
              <h2 className="nocturne-section__title">Similar Recordings</h2>
              <span className="nocturne-section__sub">
                Acoustic textures matching "{focalTrack.title}" ({focalTrack.genre})
              </span>
            </div>
          </div>
          <TrackList
            tracks={similarSongs}
            currentTrackId={currentTrack?.id}
            isPlaying={status === 'playing'}
            onTrackPlay={(t, _all, i) => playTrack(t, similarSongs, i)}
          />
        </section>
      )}

      {focalTrack && similarArtists.length > 0 && (
        <section>
          <div className="nocturne-section__header">
            <div>
              <h2 className="nocturne-section__title">Related Artists</h2>
              <span className="nocturne-section__sub">
                Composers sharing acoustic kinship with {focalTrack.artist}
              </span>
            </div>
          </div>
          <div className="nocturne-grid-artists">
            {similarArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. NEW RELEASES */}
      {/* ========================================================================= */}
      <section>
        <div className="nocturne-section__header">
          <div>
            <h2 className="nocturne-section__title">New Releases</h2>
            <span className="nocturne-section__sub">
              Recently inscribed studio master albums and recordings
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            2025 Studio Master FLAC
          </span>
        </div>
        <div className="nocturne-grid-albums">
          {newReleases.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRENDING DEMO MUSIC */}
      {/* ========================================================================= */}
      <section>
        <div className="nocturne-section__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={18} color="var(--indicator-lossless, #f59e0b)" />
            <h2 className="nocturne-section__title" style={{ margin: 0 }}>
              Trending in the Sanctuary
            </h2>
          </div>
          <span className="nocturne-section__sub">Most streamed nocturnal recordings</span>
        </div>
        <TrackList
          tracks={trendingTracks}
          currentTrackId={currentTrack?.id}
          isPlaying={status === 'playing'}
          onTrackPlay={(t, _all, i) => playTrack(t, trendingTracks, i)}
        />
      </section>

      {/* ========================================================================= */}
      {/* 6. RECOMMENDED ARTISTS & ALBUMS */}
      {/* ========================================================================= */}
      <section>
        <div className="nocturne-section__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="var(--accent-primary)" />
            <h2 className="nocturne-section__title" style={{ margin: 0 }}>
              Recommended Artists
            </h2>
          </div>
          <span className="nocturne-section__sub">Sanctuary creators of liturgical darkwave</span>
        </div>
        <div className="nocturne-grid-artists">
          {artists.slice(0, 6).map((art) => (
            <ArtistCard key={art.id} artist={art} />
          ))}
        </div>
      </section>

      <section>
        <div className="nocturne-section__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Disc size={18} color="var(--accent-primary)" />
            <h2 className="nocturne-section__title" style={{ margin: 0 }}>
              Recommended Albums
            </h2>
          </div>
          <span className="nocturne-section__sub">Cohesive nocturnal long-players</span>
        </div>
        <div className="nocturne-grid-albums">
          {albums.slice(0, 6).map((alb) => (
            <AlbumCard key={alb.id} album={alb} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. GENRE EXPLORATION */}
      {/* ========================================================================= */}
      <section>
        <div className="nocturne-section__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Music size={18} color="var(--accent-primary)" />
            <h2 className="nocturne-section__title" style={{ margin: 0 }}>
              Explore By Genre
            </h2>
          </div>
          <span className="nocturne-section__sub">Sonic sub-disciplines</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              className={`nocturne-search__filter-pill ${
                activeGenre === genre ? 'nocturne-search__filter-pill--active' : ''
              }`}
              onClick={() => setActiveGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <TrackList
          tracks={filteredTracks.slice(0, 10)}
          currentTrackId={currentTrack?.id}
          isPlaying={status === 'playing'}
          onTrackPlay={(t, _all, i) => playTrack(t, filteredTracks, i)}
        />
      </section>
    </div>
  );
};
