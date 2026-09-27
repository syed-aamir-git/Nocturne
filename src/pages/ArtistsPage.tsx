import React, { useState, useEffect } from 'react';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { musicService } from '../services/musicService';
import type { Artist } from '../types';

export const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    let isCancelled = false;
    musicService.getAllArtists().then((arts) => {
      if (!isCancelled) {
        setArtists(arts);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Artists</h1>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Composers, darkwave auteurs, and sound engineers crafting sonic sanctuaries
        </p>
      </div>

      <div className="nocturne-home__grid-artists">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
          />
        ))}
      </div>
    </div>
  );
};
