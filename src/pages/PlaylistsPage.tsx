import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { Button } from '../components/primitives/Button';
import { useToast } from '../state/ToastContext';
import { usePlayer } from '../state/PlayerContext';
import { musicService } from '../services/musicService';
import type { Playlist } from '../types';

export const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { showToast } = useToast();
  const { playTrack } = usePlayer();

  useEffect(() => {
    let isCancelled = false;
    musicService.getAllPlaylists().then((pls) => {
      if (!isCancelled) {
        setPlaylists(pls);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handlePlayPlaylist = (p: Playlist) => {
    if (p.tracks && p.tracks.length > 0) {
      playTrack(p.tracks[0], p.tracks, 0);
      showToast('Streaming Playlist', p.title, 'atmosphere');
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Playlists</h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
            Sequenced sonic rituals organized by night hours and acoustic textures
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => showToast('New Playlist Chamber', 'Create ritual modal will open here', 'atmosphere')}
        >
          Create Playlist
        </Button>
      </div>

      <div className="nocturne-home__grid-cinematic">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onPlay={handlePlayPlaylist}
          />
        ))}
      </div>
    </div>
  );
};
