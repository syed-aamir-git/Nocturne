import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { Button } from '../components/primitives/Button';
import { PlaylistModal } from '../components/modals/PlaylistModal';
import { useLibrary } from '../state/LibraryContext';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import type { Playlist } from '../types';

export const PlaylistsPage: React.FC = () => {
  const navigate = useNavigate();
  const { playlists } = useLibrary();
  const { playTrack } = usePlayer();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayPlaylist = (p: Playlist) => {
    if (p.tracks && p.tracks.length > 0) {
      playTrack(p.tracks[0], p.tracks, 0);
      showToast('Streaming Playlist', p.title, 'atmosphere');
    }
  };

  const handleCreated = (newPlaylist: Playlist) => {
    navigate(`/playlist/${newPlaylist.id}`);
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 4 }}>Playlists</h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
            Sequenced sonic rituals organized by night hours and acoustic textures ({playlists.length} available)
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
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

      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
};
