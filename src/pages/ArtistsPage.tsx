import React from 'react';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { useToast } from '../state/ToastContext';
import { MOCK_ARTISTS } from '../data/mockData';

export const ArtistsPage: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Artists</h1>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Composers, darkwave auteurs, and sound engineers crafting sonic sanctuaries
        </p>
      </div>

      <div className="nocturne-home__grid-artists">
        {MOCK_ARTISTS.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={(a) => showToast('Artist Discovered', a.name, 'default')}
          />
        ))}
      </div>
    </div>
  );
};
