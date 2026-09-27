import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Tabs } from '../components/primitives/Tabs';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { TrackList } from '../components/primitives/TrackList';
import { EmptyState } from '../components/primitives/EmptyState';
import { Button } from '../components/primitives/Button';
import { PlaylistModal } from '../components/modals/PlaylistModal';
import { usePlayer } from '../state/PlayerContext';
import { useLibrary } from '../state/LibraryContext';
import { useToast } from '../state/ToastContext';
import { musicService } from '../services/musicService';
import type { Album, Artist } from '../types';

export const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [showEmptyDemo, setShowEmptyDemo] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  const { playlists, getLikedTracks } = useLibrary();
  const { currentTrack, status, playTrack } = usePlayer();
  const { showToast } = useToast();

  const likedTracks = getLikedTracks();

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      musicService.getAllAlbums(),
      musicService.getAllArtists(),
    ]).then(([albs, arts]) => {
      if (!isCancelled) {
        setAlbums(albs);
        setArtists(arts);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const tabs = [
    { id: 'playlists', label: 'Playlists', badge: playlists.length },
    { id: 'albums', label: 'Saved Albums', badge: albums.length },
    { id: 'artists', label: 'Followed Artists', badge: artists.length },
    { id: 'tracks', label: 'Preserved Tracks', badge: likedTracks.length },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 4 }}>Archived Souls</h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
            Your personal collection of twilight memories, rituals, and late-night recordings
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeTab === 'playlists' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={15} />}
              onClick={() => setIsPlaylistModalOpen(true)}
            >
              New Playlist
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEmptyDemo(!showEmptyDemo)}
          >
            {showEmptyDemo ? 'Show Content' : 'Simulate Empty Sanctuary'}
          </Button>
        </div>
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
              {playlists.map((pl) => (
                <PlaylistCard
                  key={pl.id}
                  playlist={pl}
                  onPlay={(p) => {
                    if (p.tracks && p.tracks.length > 0) {
                      playTrack(p.tracks[0], p.tracks, 0);
                      showToast('Playing Playlist', p.title, 'atmosphere');
                    }
                  }}
                />
              ))}
            </div>
          )}

          {activeTab === 'albums' && (
            <div className="nocturne-grid-albums">
              {albums.map((alb) => (
                <AlbumCard
                  key={alb.id}
                  album={alb}
                  onPlay={(a) => {
                    if (a.tracks && a.tracks.length > 0) {
                      playTrack(a.tracks[0], a.tracks, 0);
                      showToast('Playing Album', alb.title, 'atmosphere');
                    }
                  }}
                />
              ))}
            </div>
          )}

          {activeTab === 'artists' && (
            <div className="nocturne-grid-artists">
              {artists.map((art) => (
                <ArtistCard
                  key={art.id}
                  artist={art}
                />
              ))}
            </div>
          )}

          {activeTab === 'tracks' && (
            <TrackList
              tracks={likedTracks}
              currentTrackId={currentTrack?.id}
              isPlaying={status === 'playing'}
              onTrackPlay={(t, _all, i) => playTrack(t, likedTracks, i)}
              emptyMessage="No preserved tracks in your collection. Press the heart icon on any recording to save it."
            />
          )}
        </>
      )}

      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
      />
    </div>
  );
};
