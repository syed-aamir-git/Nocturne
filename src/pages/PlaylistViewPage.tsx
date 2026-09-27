import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Shuffle,
  Clock,
  ArrowLeft,
  Sparkles,
  Music,
  Edit3,
  Copy,
  Trash2,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { spotifyApi } from '../services/spotify/spotifyApi';
import { matchPlaylistTracks, convertToNocturneTrack } from '../services/importer/trackMatcher';
import { MOCK_TRACKS } from '../data/mockData';
import { useLibrary } from '../state/LibraryContext';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { Button } from '../components/primitives/Button';
import { IconButton } from '../components/primitives/IconButton';
import { TrackList } from '../components/primitives/TrackList';
import { EmptyState } from '../components/primitives/EmptyState';
import { Modal } from '../components/primitives/Modal';
import { PlaylistModal } from '../components/modals/PlaylistModal';
import { AddTracksModal } from '../components/modals/AddTracksModal';
import { formatNumber } from '../utilities/formatters';
import type { Track } from '../types';

export const PlaylistViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getPlaylistById,
    duplicatePlaylist,
    deletePlaylist,
    addTracksToPlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
    updatePlaylist,
  } = useLibrary();
  const { currentTrack, status, playTrack } = usePlayer();
  const { showToast } = useToast();

  const [imgError, setImgError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const playlist = getPlaylistById(id || '');

  const tracks = useMemo(() => playlist?.tracks || [], [playlist?.tracks]);

  const totalDurationSeconds = useMemo(() => {
    return tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  }, [tracks]);

  const formattedTotalTime = useMemo(() => {
    const mins = Math.floor(totalDurationSeconds / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) {
      return `${hrs} hr ${remMins} min`;
    }
    return `${mins} min ${totalDurationSeconds % 60} sec`;
  }, [totalDurationSeconds]);

  if (!playlist) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto' }}>
        <EmptyState
          title="Sanctuary Archive Not Found"
          description="The requested nocturnal playlist has dissolved into the shadows or moved to another frequency."
          action={
            <Link to="/playlists">
              <Button variant="primary">Return to Playlists</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const coverSrc = playlist.artwork || playlist.coverUrl || '';

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks, 0);
      showToast('Playing Ritual Sequence', playlist.title, 'atmosphere');
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled, 0);
    showToast('Shuffling Playlist', playlist.title, 'atmosphere');
  };

  const handleDuplicate = () => {
    const duplicated = duplicatePlaylist(playlist.id);
    if (duplicated) {
      showToast('Ritual Replicated', `Created "${duplicated.title}"`, 'atmosphere');
      navigate(`/playlist/${duplicated.id}`);
    }
  };

  const handleDelete = () => {
    deletePlaylist(playlist.id);
    showToast('Ritual Dissolved', `"${playlist.title}" removed from collection`, 'default');
    setIsDeleteModalOpen(false);
    navigate('/playlists');
  };

  const handleAddTracks = (newTracks: Track[]) => {
    const addedCount = addTracksToPlaylist(playlist.id, newTracks);
    showToast(
      'Tracks Added',
      `Inscribed ${addedCount} tracks to "${playlist.title}"`,
      'atmosphere'
    );
  };

  const handleRemoveTrack = (_track: Track, index: number) => {
    removeTrackFromPlaylist(playlist.id, index);
    showToast('Track Removed', 'Removed track from playlist', 'default');
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    reorderPlaylistTracks(playlist.id, fromIndex, toIndex);
    showToast('Sequence Reordered', 'Ritual track sequence updated', 'default');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Return link */}
      <Link
        to="/playlists"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-medium)',
          fontSize: '13px',
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Playlists</span>
      </Link>

      {/* Playlist Hero Banner */}
      <div
        style={{
          display: 'flex',
          gap: 28,
          alignItems: 'flex-end',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
          flexWrap: 'wrap',
        }}
      >
        {/* Artwork */}
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-surface-elevated)',
            boxShadow: 'var(--shadow-lg), 0 0 20px var(--accent-glow)',
            position: 'relative',
          }}
        >
          {!imgError && coverSrc ? (
            <img
              src={coverSrc}
              alt={playlist.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Music size={54} color="var(--accent-primary)" />
            </div>
          )}
        </div>

        {/* Metadata & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em',
                color: 'var(--accent-secondary)',
              }}
            >
              {playlist.source === 'spotify_import' ? 'SPOTIFY IMPORT' : 'NOCTURNE PLAYLIST'}
            </span>
            {playlist.source === 'spotify_import' ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: '#34d399',
                }}
              >
                <span>Spotify Imported</span>
              </span>
            ) : playlist.curatedHour ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-medium)',
                }}
              >
                <Clock size={11} />
                <span>{playlist.curatedHour}</span>
              </span>
            ) : null}
          </div>

          <h1 style={{ fontSize: '2.4rem', margin: 0, letterSpacing: '-0.02em' }}>
            {playlist.title}
          </h1>

          <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', maxWidth: 640, margin: 0 }}>
            {playlist.description || 'Nocturnal collection created for solitary listening.'}
          </p>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-low)',
              fontFamily: 'var(--font-mono)',
              marginTop: 4,
            }}
          >
            Curated by {playlist.creator} • {tracks.length} tracks • {formattedTotalTime}
            {playlist.followersCount ? ` • ${formatNumber(playlist.followersCount)} listeners` : ''}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play size={16} fill="currentColor" />}
              onClick={handlePlayAll}
              disabled={tracks.length === 0}
            >
              Play Ritual
            </Button>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<Shuffle size={15} />}
              onClick={handleShufflePlay}
              disabled={tracks.length === 0}
            >
              Shuffle
            </Button>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<Plus size={15} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Tracks
            </Button>

            {playlist.source === 'spotify_import' && playlist.sourceMetadata?.originalPlaylistId && (
              <Button
                variant="secondary"
                size="md"
                leftIcon={<RefreshCw size={14} className={isSyncing ? 'spin' : ''} />}
                onClick={async () => {
                  setIsSyncing(true);
                  try {
                    const extTracks = await spotifyApi.getPlaylistTracks(playlist.sourceMetadata!.originalPlaylistId);
                    const preview = matchPlaylistTracks(
                      {
                        id: playlist.sourceMetadata!.originalPlaylistId,
                        provider: 'spotify',
                        title: playlist.title,
                        description: playlist.description,
                        artwork: playlist.artwork,
                        trackCount: extTracks.length,
                        owner: playlist.creator,
                        isPublic: true,
                      },
                      extTracks,
                      MOCK_TRACKS
                    );

                    const refreshedTracks = preview.matches.map((m, idx) =>
                      convertToNocturneTrack(m, playlist.title, idx)
                    );

                    updatePlaylist(playlist.id, {
                      tracks: refreshedTracks,
                      tracksCount: refreshedTracks.length,
                      sourceMetadata: {
                        ...playlist.sourceMetadata!,
                        lastSyncedAt: new Date().toISOString(),
                        totalSpotifyTracks: preview.totalTracks,
                        matchedTracksCount: preview.matchedCount,
                        unmatchedTracksCount: preview.unmatchedCount,
                        possibleMatchCount: preview.possibleCount,
                      },
                    });

                    showToast(
                      'Playlist Synchronized',
                      `Updated with latest Spotify tracklist (${preview.matchedCount}/${preview.totalTracks} available).`,
                      'atmosphere'
                    );
                  } catch (err: any) {
                    showToast('Sync Warning', err.message || 'Could not synchronize with Spotify', 'warning');
                  } finally {
                    setIsSyncing(false);
                  }
                }}
                disabled={isSyncing}
                title="Sync playlist with Spotify"
              >
                {isSyncing ? 'Syncing...' : 'Sync with Spotify'}
              </Button>
            )}

            <IconButton
              variant="ghost"
              size="md"
              aria-label="Edit playlist metadata"
              onClick={() => setIsEditModalOpen(true)}
              title="Edit playlist"
            >
              <Edit3 size={16} />
            </IconButton>

            <IconButton
              variant="ghost"
              size="md"
              aria-label="Duplicate playlist"
              onClick={handleDuplicate}
              title="Duplicate ritual"
            >
              <Copy size={16} />
            </IconButton>

            <IconButton
              variant="ghost"
              size="md"
              aria-label="Delete playlist"
              onClick={() => setIsDeleteModalOpen(true)}
              title="Delete playlist"
              style={{ color: 'var(--indicator-error)' }}
            >
              <Trash2 size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Tracks in Playlist */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="var(--accent-primary)" />
            <span>Ritual Sequence ({tracks.length})</span>
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            Drag handle to reorder sequence
          </span>
        </div>

        {tracks.length === 0 ? (
          <EmptyState
            title="Ritual Sequence is Silent"
            description="There are currently no recordings in this playlist chamber. Add tracks to begin sequencing your nocturnal ritual."
            action={
              <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                Add Tracks
              </Button>
            }
          />
        ) : (
          <TrackList
            tracks={tracks}
            currentTrackId={currentTrack?.id}
            isPlaying={status === 'playing'}
            onTrackPlay={(track, _all, index) => {
              playTrack(track, tracks, index);
            }}
            reorderable={true}
            onReorder={handleReorder}
            onRemoveTrack={handleRemoveTrack}
            removeLabel="Remove from Ritual"
          />
        )}
      </section>

      {/* Edit Playlist Modal */}
      <PlaylistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        playlistToEdit={playlist}
      />

      {/* Add Tracks Modal */}
      <AddTracksModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingTrackIds={tracks.map((t) => t.id)}
        onAddTracks={handleAddTracks}
        title={`Add Tracks to ${playlist.title}`}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Dissolve Ritual Chamber"
        maxWidth="440px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" size="md" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              style={{ background: 'var(--indicator-error)', borderColor: 'var(--indicator-error)' }}
              onClick={handleDelete}
            >
              Delete Playlist
            </Button>
          </div>
        }
      >
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>
          Are you certain you wish to dissolve <strong>"{playlist.title}"</strong>? All track
          associations within this ritual will be lost forever.
        </p>
      </Modal>
    </div>
  );
};
