import React, { useState } from 'react';
import { Tabs } from '../components/primitives/Tabs';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { TrackRow } from '../components/primitives/TrackRow';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { EmptyState } from '../components/primitives/EmptyState';
import { Button } from '../components/primitives/Button';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { MOCK_ALBUMS, MOCK_ARTISTS, MOCK_PLAYLISTS, MOCK_TRACKS } from '../data/mockData';

export const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [showEmptyDemo, setShowEmptyDemo] = useState(false);
  const { currentTrack, status, playTrack } = usePlayer();
  const { showToast } = useToast();

  const tabs = [
    { id: 'playlists', label: 'Playlists', badge: MOCK_PLAYLISTS.length },
    { id: 'albums', label: 'Saved Albums', badge: MOCK_ALBUMS.length },
    { id: 'artists', label: 'Followed Artists', badge: MOCK_ARTISTS.length },
    { id: 'tracks', label: 'Preserved Tracks', badge: MOCK_TRACKS.length },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Archived Souls</h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
            Your personal collection of twilight memories and late-night recordings
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowEmptyDemo(!showEmptyDemo)}
        >
          {showEmptyDemo ? 'Show Content' : 'Simulate Empty Sanctuary'}
        </Button>
      </div>

      <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

      {showEmptyDemo ? (
        <EmptyState
          title="The Archive Lies Dormant"
          description="You have not yet committed any recordings or midnight rituals to this chamber. Explore the Sanctum to discover sounds tailored to your solitude."
          action={
            <Button
              variant="primary"
              onClick={() => {
                setShowEmptyDemo(false);
                showToast('Chamber Restored', 'Displaying your midnight library', 'atmosphere');
              }}
            >
              Restore Collection
            </Button>
          }
        />
      ) : (
        <>
          {activeTab === 'playlists' && (
            <div className="nocturne-grid-albums">
              {MOCK_PLAYLISTS.map((pl) => (
                <PlaylistCard
                  key={pl.id}
                  playlist={pl}
                  onPlay={() => showToast('Playing Playlist', pl.title, 'atmosphere')}
                />
              ))}
            </div>
          )}

          {activeTab === 'albums' && (
            <div className="nocturne-grid-albums">
              {MOCK_ALBUMS.map((alb) => (
                <AlbumCard
                  key={alb.id}
                  album={alb}
                  onPlay={() => showToast('Playing Album', alb.title, 'atmosphere')}
                />
              ))}
            </div>
          )}

          {activeTab === 'artists' && (
            <div className="nocturne-grid-artists">
              {MOCK_ARTISTS.map((art) => (
                <ArtistCard
                  key={art.id}
                  artist={art}
                  onClick={(a) => showToast('Artist', a.name, 'default')}
                />
              ))}
            </div>
          )}

          {activeTab === 'tracks' && (
            <div className="nocturne-tracklist">
              {MOCK_TRACKS.map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={status === 'playing'}
                  onPlay={(t) => playTrack(t, MOCK_TRACKS)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
