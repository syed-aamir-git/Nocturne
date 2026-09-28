import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon,
  X,
  Clock,
  Trash2,
  Sparkles,
  Music,
  Disc,
  Users,
  ListMusic,
  Compass,
} from 'lucide-react';
import { musicService, type SearchResult } from '../services/musicService';
import { storageService } from '../services/storageService';
import { useUI } from '../state/UIContext';
import { usePlayer } from '../state/PlayerContext';
import { TrackList } from '../components/primitives/TrackList';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { Skeleton } from '../components/primitives/Skeleton';
import { EmptyState } from '../components/primitives/EmptyState';
import { Button } from '../components/primitives/Button';
import './SearchPage.css';

type SearchFilter = 'all' | 'tracks' | 'artists' | 'albums' | 'playlists';

const QUICK_VIBES = [
  'Gothic Darkwave',
  'Gothic Neoclassical',
  'Dark Ambient Drone',
  'Midnight Slowcore',
  'Coldwave / EBM',
  'Dungeon Synth',
  'Ethereal Dark Pop',
  'Tape Saturation',
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, setSearchQuery } = useUI();
  const { currentTrack, status, playTrack } = usePlayer();

  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult>({
    tracks: [],
    albums: [],
    artists: [],
    playlists: [],
    genres: [],
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return storageService.getSearchHistory();
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const queryFromUrl = useMemo(() => searchParams.get('q') || '', [searchParams]);

  useEffect(() => {
    if (queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFromUrl]);

  // Dynamic live search with 120ms debounce
  useEffect(() => {
    let isCancelled = false;
    const trimmed = searchQuery.trim();

    const timer = setTimeout(() => {
      if (!trimmed) {
        if (!isCancelled) {
          setResults({ tracks: [], albums: [], artists: [], playlists: [], genres: [] });
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      musicService.search(trimmed).then((res) => {
        if (!isCancelled) {
          setResults(res);
          setIsLoading(false);
        }
      });
    }, trimmed ? 120 : 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Update URL search param on change
  const handleInputChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleSelectQuery = (q: string) => {
    setSearchQuery(q);
    setSearchParams({ q }, { replace: true });
    const updated = storageService.addSearchHistory(q);
    setRecentSearches(updated);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const updated = storageService.addSearchHistory(searchQuery.trim());
      setRecentSearches(updated);
    }
  };

  const handleClearInput = () => {
    setSearchQuery('');
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  const handleRemoveRecent = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = storageService.removeSearchHistoryItem(item);
    setRecentSearches(updated);
  };

  const handleClearRecent = () => {
    storageService.clearSearchHistory();
    setRecentSearches([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (searchQuery) {
        handleClearInput();
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const hasResults =
    results.tracks.length > 0 ||
    results.albums.length > 0 ||
    results.artists.length > 0 ||
    results.playlists.length > 0 ||
    results.genres.length > 0;

  const totalResultsCount =
    results.tracks.length +
    results.albums.length +
    results.artists.length +
    results.playlists.length;

  return (
    <div className="nocturne-search">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4.5vw, 2.4rem)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Search & Resonance
        </h1>
        <p style={{ color: 'var(--text-medium)', fontSize: '14px', margin: 0 }}>
          Search songs, artists, albums, playlists, and acoustic nocturnal genres
        </p>
      </div>

      {/* Prominent Search Bar */}
      <form onSubmit={handleSearchSubmit} className="nocturne-search__input-wrap">
        <SearchIcon size={20} color="var(--accent-secondary)" />
        <input
          ref={inputRef}
          type="text"
          className="nocturne-search__input"
          placeholder="Search tracks, artists, albums, playlists, or genres..."
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearInput}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-low)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Filter Tabs (when searching) */}
      {searchQuery.trim() && (
        <div className="nocturne-search__filter-bar">
          <button
            type="button"
            className={`nocturne-search__filter-pill ${
              activeFilter === 'all' ? 'nocturne-search__filter-pill--active' : ''
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All Results ({totalResultsCount})
          </button>
          <button
            type="button"
            className={`nocturne-search__filter-pill ${
              activeFilter === 'tracks' ? 'nocturne-search__filter-pill--active' : ''
            }`}
            onClick={() => setActiveFilter('tracks')}
          >
            Songs ({results.tracks.length})
          </button>
          <button
            type="button"
            className={`nocturne-search__filter-pill ${
              activeFilter === 'artists' ? 'nocturne-search__filter-pill--active' : ''
            }`}
            onClick={() => setActiveFilter('artists')}
          >
            Artists ({results.artists.length})
          </button>
          <button
            type="button"
            className={`nocturne-search__filter-pill ${
              activeFilter === 'albums' ? 'nocturne-search__filter-pill--active' : ''
            }`}
            onClick={() => setActiveFilter('albums')}
          >
            Albums ({results.albums.length})
          </button>
          <button
            type="button"
            className={`nocturne-search__filter-pill ${
              activeFilter === 'playlists' ? 'nocturne-search__filter-pill--active' : ''
            }`}
            onClick={() => setActiveFilter('playlists')}
          >
            Playlists ({results.playlists.length})
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Skeleton height={32} width="160px" />
          <Skeleton height={56} variant="rounded" />
          <Skeleton height={56} variant="rounded" />
          <Skeleton height={56} variant="rounded" />
        </div>
      )}

      {/* EMPTY STATE: Before Typing */}
      {!isLoading && !searchQuery.trim() && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={15} color="var(--accent-secondary)" />
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-medium)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Recent Inquests
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClearRecent}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-low)',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indicator-error)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-low)')}
                >
                  <Trash2 size={12} />
                  <span>Clear History</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {recentSearches.map((item) => (
                  <div
                    key={item}
                    className="nocturne-search__recent-item"
                    onClick={() => handleSelectQuery(item)}
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      className="nocturne-search__recent-remove"
                      onClick={(e) => handleRemoveRecent(e, item)}
                      title="Remove from history"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Frequency & Vibe Tags */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Compass size={15} color="var(--accent-secondary)" />
              <span
                style={{
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-medium)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Popular Midnight Frequencies
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {QUICK_VIBES.map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  className="nocturne-search__recent-item"
                  onClick={() => handleSelectQuery(vibe)}
                >
                  <Sparkles size={11} color="var(--accent-primary)" />
                  <span>{vibe}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NO-RESULT STATE */}
      {!isLoading && searchQuery.trim() && !hasResults && (
        <EmptyState
          title="No Resonances Detected"
          description={`The nocturnal void returns no frequencies for "${searchQuery}". Check your spelling or explore by genre.`}
          icon={<SearchIcon size={32} />}
          action={
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" onClick={handleClearInput}>
                Clear Search
              </Button>
              <Button variant="primary" onClick={() => handleSelectQuery('Gothic Darkwave')}>
                Explore Gothic Darkwave
              </Button>
            </div>
          }
        />
      )}

      {/* CATEGORIZED RESULTS */}
      {!isLoading && hasResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {/* Matching Genres Chips */}
          {results.genres.length > 0 && (activeFilter === 'all' || activeFilter === 'tracks') && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {results.genres.map((g) => (
                <div
                  key={g}
                  className="nocturne-search__recent-item"
                  style={{ borderColor: 'var(--accent-primary)', background: 'rgba(157, 114, 255, 0.1)' }}
                  onClick={() => handleSelectQuery(g)}
                >
                  <Sparkles size={12} color="var(--accent-secondary)" />
                  <span>Genre: {g}</span>
                </div>
              ))}
            </div>
          )}

          {/* Songs Section */}
          {(activeFilter === 'all' || activeFilter === 'tracks') && results.tracks.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Music size={16} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Songs ({results.tracks.length})
                </h2>
              </div>
              <TrackList
                tracks={results.tracks}
                currentTrackId={currentTrack?.id}
                isPlaying={status === 'playing'}
                onTrackPlay={(t, _all, i) => playTrack(t, results.tracks, i)}
              />
            </section>
          )}

          {/* Artists Section */}
          {(activeFilter === 'all' || activeFilter === 'artists') && results.artists.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Users size={16} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Artists ({results.artists.length})
                </h2>
              </div>
              <div className="nocturne-grid-artists">
                {results.artists.map((art) => (
                  <ArtistCard key={art.id} artist={art} />
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          {(activeFilter === 'all' || activeFilter === 'albums') && results.albums.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Disc size={16} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Albums ({results.albums.length})
                </h2>
              </div>
              <div className="nocturne-grid-albums">
                {results.albums.map((alb) => (
                  <AlbumCard key={alb.id} album={alb} />
                ))}
              </div>
            </section>
          )}

          {/* Playlists Section */}
          {(activeFilter === 'all' || activeFilter === 'playlists') && results.playlists.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <ListMusic size={16} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Playlists ({results.playlists.length})
                </h2>
              </div>
              <div className="nocturne-home__grid-cinematic">
                {results.playlists.map((pl) => (
                  <PlaylistCard key={pl.id} playlist={pl} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
