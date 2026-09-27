import React, { useState } from 'react';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { useToast } from '../state/ToastContext';
import { usePlayer } from '../state/PlayerContext';
import { MOCK_ALBUMS } from '../data/mockData';
import type { Album } from '../types';

export const AlbumsPage: React.FC = () => {
  const { showToast } = useToast();
  const { playTrack } = usePlayer();
  const [filterGenre, setFilterGenre] = useState<string>('All');

  const genres = ['All', 'Gothic Darkwave', 'Gothic Neoclassical', 'Dark Ambient Drone', 'Midnight Slowcore'];

  const filteredAlbums =
    filterGenre === 'All'
      ? MOCK_ALBUMS
      : MOCK_ALBUMS.filter((a) => a.genre.toLowerCase().includes(filterGenre.toLowerCase()));

  const handlePlay = (album: Album) => {
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks.slice(1));
      showToast('Playing Album', album.title, 'atmosphere');
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Albums</h1>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Complete full-length architectures of nocturnal resonance and master recordings
        </p>
      </div>

      {/* Genre Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {genres.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setFilterGenre(g)}
            style={{
              padding: '6px 14px',
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

      <div className="nocturne-home__grid-cinematic">
        {filteredAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} onPlay={handlePlay} />
        ))}
      </div>
    </div>
  );
};
