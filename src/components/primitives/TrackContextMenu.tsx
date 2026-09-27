import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  CornerDownRight,
  ListPlus,
  PlusSquare,
  Heart,
  User,
  Disc,
  Trash2,
  ChevronRight,
  Plus,
} from 'lucide-react';
import type { Track } from '../../types';
import { usePlayer } from '../../state/PlayerContext';
import { useLibrary } from '../../state/LibraryContext';
import { useToast } from '../../state/ToastContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import './TrackContextMenu.css';

export interface TrackContextMenuProps {
  track: Track;
  position: { x: number; y: number } | null;
  isOpen: boolean;
  onClose: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  onCreatePlaylistWithTrack?: (track: Track) => void;
}

export const TrackContextMenu: React.FC<TrackContextMenuProps> = ({
  track,
  position,
  isOpen,
  onClose,
  onRemove,
  removeLabel = 'Remove',
  onCreatePlaylistWithTrack,
}) => {
  const navigate = useNavigate();
  const { playTrack, playNext, addToQueue } = usePlayer();
  const { isLiked, toggleLike, playlists, addTrackToPlaylist } = useLibrary();
  const { showToast } = useToast();

  const [showPlaylistsSubmenu, setShowPlaylistsSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    if (isOpen) onClose();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  // Clamp menu inside window bounds
  const menuWidth = 220;
  const menuHeight = onRemove ? 300 : 260;
  const clampedX = Math.min(position.x, window.innerWidth - menuWidth - 10);
  const clampedY = Math.min(position.y, window.innerHeight - menuHeight - 10);

  const liked = isLiked(track.id);
  const submenuOpensLeft = clampedX > window.innerWidth - 440;

  const handlePlay = () => {
    playTrack(track);
    onClose();
  };

  const handlePlayNext = () => {
    playNext(track);
    showToast('Sequence Updated', `Playing "${track.title}" next`, 'atmosphere');
    onClose();
  };

  const handleAddToQueue = () => {
    addToQueue(track);
    showToast('Added to Queue', `"${track.title}" added to sequence`, 'default');
    onClose();
  };

  const handleToggleLike = () => {
    const next = toggleLike(track);
    showToast(
      next ? 'Anchored to Liked Songs' : 'Removed from Liked Songs',
      track.title,
      'default'
    );
    onClose();
  };

  const handleAddToPlaylist = (playlistId: string, playlistTitle: string) => {
    const added = addTrackToPlaylist(playlistId, track);
    if (added) {
      showToast('Archived in Ritual', `Added "${track.title}" to ${playlistTitle}`, 'atmosphere');
    } else {
      showToast('Already Present', `"${track.title}" is already in ${playlistTitle}`, 'warning');
    }
    onClose();
  };

  const handleCreateNewPlaylist = () => {
    onClose();
    if (onCreatePlaylistWithTrack) {
      onCreatePlaylistWithTrack(track);
    }
  };

  const handleGoToArtist = () => {
    onClose();
    navigate(`/artist/${track.artistId}`);
  };

  const handleGoToAlbum = () => {
    onClose();
    navigate(`/album/${track.albumId}`);
  };

  return (
    <div
      ref={menuRef}
      className="nocturne-track-menu"
      style={{ left: Math.max(10, clampedX), top: Math.max(10, clampedY) }}
      onClick={(e) => e.stopPropagation()}
      role="menu"
    >
      {/* Play */}
      <button type="button" className="nocturne-track-menu__item" onClick={handlePlay}>
        <div className="nocturne-track-menu__item-left">
          <Play size={14} fill="currentColor" />
          <span>Play Now</span>
        </div>
      </button>

      {/* Play Next */}
      <button type="button" className="nocturne-track-menu__item" onClick={handlePlayNext}>
        <div className="nocturne-track-menu__item-left">
          <CornerDownRight size={14} />
          <span>Play Next</span>
        </div>
      </button>

      {/* Add to Queue */}
      <button type="button" className="nocturne-track-menu__item" onClick={handleAddToQueue}>
        <div className="nocturne-track-menu__item-left">
          <ListPlus size={14} />
          <span>Add to Queue</span>
        </div>
      </button>

      <div className="nocturne-track-menu__divider" />

      {/* Add to Playlist Submenu Trigger */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setShowPlaylistsSubmenu(true)}
        onMouseLeave={() => setShowPlaylistsSubmenu(false)}
      >
        <button
          type="button"
          className="nocturne-track-menu__item"
          onClick={() => setShowPlaylistsSubmenu((prev) => !prev)}
        >
          <div className="nocturne-track-menu__item-left">
            <PlusSquare size={14} />
            <span>Add to Playlist</span>
          </div>
          <ChevronRight size={12} color="var(--text-low)" />
        </button>

        {showPlaylistsSubmenu && (
          <div
            ref={submenuRef}
            className={`nocturne-track-menu__submenu ${
              submenuOpensLeft ? 'nocturne-track-menu__submenu-left' : ''
            }`}
          >
            <button
              type="button"
              className="nocturne-track-menu__playlist-item"
              onClick={handleCreateNewPlaylist}
              style={{ color: 'var(--accent-secondary)', fontWeight: 500 }}
            >
              <Plus size={13} />
              <span>Create New Playlist</span>
            </button>

            {playlists.length > 0 && <div className="nocturne-track-menu__divider" />}

            {playlists.map((pl) => (
              <button
                key={pl.id}
                type="button"
                className="nocturne-track-menu__playlist-item"
                onClick={() => handleAddToPlaylist(pl.id, pl.title)}
                title={pl.title}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 2,
                    background: 'var(--bg-surface)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={pl.artwork || pl.coverUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span className="nocturne-track-menu__playlist-title">{pl.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Like / Unlike */}
      <button type="button" className="nocturne-track-menu__item" onClick={handleToggleLike}>
        <div className="nocturne-track-menu__item-left">
          <Heart
            size={14}
            fill={liked ? 'var(--accent-primary)' : 'none'}
            color={liked ? 'var(--accent-primary)' : 'currentColor'}
          />
          <span>{liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</span>
        </div>
      </button>

      <div className="nocturne-track-menu__divider" />

      {/* Go to Artist */}
      <button type="button" className="nocturne-track-menu__item" onClick={handleGoToArtist}>
        <div className="nocturne-track-menu__item-left">
          <User size={14} />
          <span>Go to Artist</span>
        </div>
      </button>

      {/* Go to Album */}
      <button type="button" className="nocturne-track-menu__item" onClick={handleGoToAlbum}>
        <div className="nocturne-track-menu__item-left">
          <Disc size={14} />
          <span>Go to Album</span>
        </div>
      </button>

      {/* Optional Remove button (e.g. from playlist or queue) */}
      {onRemove && (
        <>
          <div className="nocturne-track-menu__divider" />
          <button
            type="button"
            className="nocturne-track-menu__item nocturne-track-menu__item--danger"
            onClick={() => {
              onRemove();
              onClose();
            }}
          >
            <div className="nocturne-track-menu__item-left">
              <Trash2 size={14} />
              <span>{removeLabel}</span>
            </div>
          </button>
        </>
      )}
    </div>
  );
};
