import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Sparkles } from 'lucide-react';
import { musicService } from '../services/musicService';
import type { Track, Album, Artist } from '../types';
import { useUI } from '../state/UIContext';
import { usePlayer } from '../state/PlayerContext';
import { TrackRow } from '../components/primitives/TrackRow';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { Skeleton } from '../components/primitives/Skeleton';
import { EmptyState } from '../components/primitives/EmptyState';
import { Button } from '../components/primitives/Button';

const VIBES = [
  'Gothic Darkwave',
  'Gothic Neoclassical',
  'Dark Ambient Drone',
  'Midnight Slowcore',
  'Ethereal Dark Pop',
  'Tape Saturation',
];

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { searchQuery, setSearchQuery } = useUI();
  const { currentTrack, status, playTrack } = usePlayer();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
  }>({ tracks: [], albums: [], artists: [] });

  const queryFromUrl = searchParams.get('q') || '';

  useEffect(() => {
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl]);

  useEffect(() => {
    let isCancelled = false;
    if (!searchQuery.trim()) {
      setResults({ tracks: [], albums: [], artists: [] });
      return;
    }

    setIsLoading(true);
    musicService.search(searchQuery).then((res) => {
      if (!isCancelled) {
        setResults(res);
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [searchQuery]);

  const hasResults =
    results.tracks.length > 0 || results.albums.length > 0 || results.artists.length > 0;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Resonance</h1>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Explore frequencies, nocturnal sub-genres, and acoustic artifacts
        </p>
      </div>

      {/* Curated Vibe Tags */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-low)', marginBottom: 10, letterSpacing: '0.04em' }}>
          FREQUENCIES & VIBES
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {VIBES.map((vibe) => (
            <button
              key={vibe}
              type="button"
              onClick={() => setSearchQuery(vibe)}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                background: searchQuery === vibe ? 'var(--accent-glow)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${searchQuery === vibe ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                color: searchQuery === vibe ? 'var(--accent-secondary)' : 'var(--text-high)',
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all var(--transition-snappy)',
              }}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton height={40} width="200px" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <Skeleton height={180} variant="rounded" />
            <Skeleton height={180} variant="rounded" />
            <Skeleton height={180} variant="rounded" />
          </div>
          <Skeleton height={60} variant="rounded" />
          <Skeleton height={60} variant="rounded" />
        </div>
      )}

      {/* Results */}
      {!isLoading && searchQuery.trim() && !hasResults && (
        <EmptyState
          title="No Resonances Detected"
          description={`The midnight void echoes without response for "${searchQuery}". Try exploring by genre or clearing search.`}
          icon={<SearchIcon size={28} />}
          action={
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          }
        />
      )}

      {!isLoading && !searchQuery.trim() && (
        <div
          style={{
            padding: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Sparkles size={28} color="var(--accent-primary)" style={{ marginBottom: 12 }} />
          <h3 style={{ marginBottom: 8 }}>Begin Your Inquest</h3>
          <p style={{ color: 'var(--text-medium)', fontSize: '13px', maxWidth: 440, margin: '0 auto' }}>
            Type any artist, track, or late-night vibration into the search console above, or click on a nocturnal frequency tag.
          </p>
        </div>
      )}

      {!isLoading && hasResults && (
        <>
          {results.tracks.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Tracks Found</h2>
              <div className="nocturne-tracklist">
                {results.tracks.map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={i}
                    isActive={currentTrack?.id === track.id}
                    isPlaying={status === 'playing'}
                    onPlay={(t) => playTrack(t, results.tracks)}
                  />
                ))}
              </div>
            </section>
          )}

          {results.albums.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Matching Albums</h2>
              <div className="nocturne-grid-albums">
                {results.albums.map((alb) => (
                  <AlbumCard key={alb.id} album={alb} />
                ))}
              </div>
            </section>
          )}

          {results.artists.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Artists</h2>
              <div className="nocturne-grid-artists">
                {results.artists.map((art) => (
                  <ArtistCard key={art.id} artist={art} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
