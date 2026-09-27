import React, { useState, useEffect } from 'react';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { useToast } from '../state/ToastContext';
import { usePlayer } from '../state/PlayerContext';
import { musicService } from '../services/musicService';
import type { Album } from '../types';

export const AlbumsPage: React.FC = () => {
  const { showToast } = useToast();
  const { playTrack } = usePlayer();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filterGenre, setFilterGenre] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'albums' | 'singles'>('all');
  const [genres, setGenres] = useState<string[]>(['All']);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      musicService.getAllAlbums(),
      musicService.getGenres(),
    ]).then(([allAlbs, gnrs]) => {
      if (!isCancelled) {
        setAlbums(allAlbs);
        setGenres(['All', ...gnrs]);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredAlbums = albums.filter((a) => {
    const matchesGenre =
      filterGenre === 'All' || a.genre.toLowerCase().includes(filterGenre.toLowerCase());
    const matchesType =
      filterType === 'all' ||
      (filterType === 'singles' && a.isSingle) ||
      (filterType === 'albums' && !a.isSingle);
    return matchesGenre && matchesType;
  });

  const handlePlay = (album: Album) => {
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks, 0);
      showToast('Playing Album', album.title, 'atmosphere');
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Albums & Releases</h1>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Complete full-length architectures of nocturnal resonance and master recordings
        </p>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Type pills (All / Albums / Singles) */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'albums', 'singles'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: filterType === type ? 'var(--accent-primary)' : 'var(--bg-surface)',
                border: `1px solid ${filterType === type ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                color: filterType === type ? '#ffffff' : 'var(--text-medium)',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--transition-snappy)',
              }}
            >
              {type === 'all' ? 'All Releases' : type}
            </button>
          ))}
        </div>

        {/* Genre Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFilterGenre(g)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: filterGenre === g ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: `1px solid ${filterGenre === g ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                color: filterGenre === g ? 'var(--accent-secondary)' : 'var(--text-medium)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all var(--transition-snappy)',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="nocturne-home__grid-cinematic">
        {filteredAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} onPlay={handlePlay} />
        ))}
      </div>
    </div>
  );
};
