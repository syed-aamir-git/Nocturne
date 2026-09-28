import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Play, Shuffle, PlusSquare, Sparkles } from 'lucide-react';
import { TrackList } from '../components/primitives/TrackList';
import { Button } from '../components/primitives/Button';
import { EmptyState } from '../components/primitives/EmptyState';
import { PlaylistModal } from '../components/modals/PlaylistModal';
import { usePlayer } from '../state/PlayerContext';
import { useLibrary } from '../state/LibraryContext';
import { useToast } from '../state/ToastContext';
import type { Playlist } from '../types';
import './LikedSongsPage.css';

export const LikedSongsPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();
  const { getLikedTracks, playlists, addTracksToPlaylist } = useLibrary();
  const { showToast } = useToast();

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

  const likedTracks = getLikedTracks();

  const totalDuration = useMemo(() => {
    return likedTracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  }, [likedTracks]);

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) {
      return `${hrs} hr ${remMins} min`;
    }
    return `${mins} min ${seconds % 60} sec`;
  };

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks, 0);
      showToast('Playing Preserved Collection', `${likedTracks.length} tracks queued`, 'atmosphere');
    }
  };

  const handleShuffleAll = () => {
    if (likedTracks.length === 0) return;
    const shuffled = [...likedTracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled, 0);
    showToast('Shuffling Liked Songs', 'Randomized midnight sequence', 'atmosphere');
  };

  const handleAddToExistingPlaylist = (playlistId: string, playlistTitle: string) => {
    const addedCount = addTracksToPlaylist(playlistId, likedTracks);
    showToast(
      'Tracks Preserved in Ritual',
      `Added ${addedCount} tracks to "${playlistTitle}"`,
      'atmosphere'
    );
    setShowPlaylistPicker(false);
  };

  return (
    <div className="nocturne-liked-page">
      {/* Header Banner */}
      <div className="nocturne-liked-hero">
        <div className="nocturne-liked-icon-wrap">
          <Heart size={64} color="#ffffff" fill="currentColor" />
        </div>

        <div className="nocturne-liked-meta">
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              color: 'var(--accent-secondary)',
            }}
          >
            SANCTUM ARCHIVE • FAVORITES
          </span>

          <h1 className="nocturne-liked-title">
            Liked Songs
          </h1>

          <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', margin: 0 }}>
            {likedTracks.length} recordings anchored to your midnight memories • {formatTotalTime(totalDuration)}
          </p>

          {likedTracks.length > 0 && (
            <div className="nocturne-liked-actions">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Play size={16} fill="currentColor" />}
                onClick={handlePlayAll}
              >
                Play All
              </Button>

              <Button
                variant="secondary"
                size="md"
                leftIcon={<Shuffle size={15} />}
                onClick={handleShuffleAll}
              >
                Shuffle All
              </Button>

              {/* Add Liked Songs to Playlist Dropdown/Trigger */}
              <div style={{ position: 'relative' }}>
                <Button
                  variant="ghost"
                  size="md"
                  leftIcon={<PlusSquare size={15} />}
                  onClick={() => setShowPlaylistPicker((prev) => !prev)}
                >
                  Add to Playlist
                </Button>

                {showPlaylistPicker && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      minWidth: 220,
                      maxHeight: 260,
                      overflowY: 'auto',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: 6,
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowPlaylistPicker(false);
                        setIsPlaylistModalOpen(true);
                      }}
                      style={{
                        padding: '8px 10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-secondary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: 4,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Sparkles size={13} />
                      <span>New Playlist from Liked</span>
                    </button>

                    {playlists.length > 0 && (
                      <div
                        style={{
                          height: 1,
                          background: 'var(--border-subtle)',
                          margin: '4px 0',
                        }}
                      />
                    )}

                    {playlists.map((pl) => (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => handleAddToExistingPlaylist(pl.id, pl.title)}
                        style={{
                          padding: '7px 10px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-medium)',
                          fontSize: '12px',
                          borderRadius: 4,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {pl.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tracklist or Empty State */}
      {likedTracks.length === 0 ? (
        <EmptyState
          title="No Preserved Midnight Tracks"
          description="You have not yet anchored any recordings to your liked songs. Listen and press the heart icon on any track to preserve it here."
          action={
            <Link to="/discover">
              <Button variant="primary">Explore Sanctum</Button>
            </Link>
          }
        />
      ) : (
        <TrackList
          tracks={likedTracks}
          currentTrackId={currentTrack?.id}
          isPlaying={status === 'playing'}
          onTrackPlay={(t, _all, i) => playTrack(t, likedTracks, i)}
        />
      )}

      {/* Playlist Modal for creating a playlist with liked tracks */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        initialTracks={likedTracks}
        onSuccess={(pl: Playlist) => {
          showToast('Ritual Established', `Preserved ${likedTracks.length} tracks in "${pl.title}"`, 'atmosphere');
        }}
      />
    </div>
  );
};
