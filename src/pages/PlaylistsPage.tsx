import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { Button } from '../components/primitives/Button';
import { useToast } from '../state/ToastContext';
import { MOCK_PLAYLISTS } from '../data/mockData';

export const PlaylistsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

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
          onClick={() => showToast('New Playlist Chamber', 'Create ritual modal placeholder', 'atmosphere')}
        >
          Create Playlist
        </Button>
      </div>

      <div className="nocturne-home__grid-cinematic">
        {MOCK_PLAYLISTS.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={(p) => navigate(`/playlist/${p.id}`)}
            onPlay={(p) => showToast('Streaming Playlist', p.title, 'atmosphere')}
          />
        ))}
      </div>
    </div>
  );
};
