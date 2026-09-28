import React, { useState } from 'react';
import { Music, Sparkles } from 'lucide-react';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { useLibrary } from '../../state/LibraryContext';
import { useToast } from '../../state/ToastContext';
import type { Playlist, Track } from '../../types';
import './PlaylistModal.css';

const NOCTURNE_ARTWORK_PRESETS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
];

export interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistToEdit?: Playlist | null;
  initialTracks?: Track[];
  onSuccess?: (playlist: Playlist) => void;
}

const PlaylistModalContent: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  playlistToEdit,
  initialTracks = [],
  onSuccess,
}) => {
  const { createPlaylist, updatePlaylist } = useLibrary();
  const { showToast } = useToast();

  const isEditing = Boolean(playlistToEdit);

  const [title, setTitle] = useState(() => {
    if (playlistToEdit) return playlistToEdit.title;
    return initialTracks.length > 0 ? `Sanctuary with ${initialTracks[0].title}` : '';
  });
  const [description, setDescription] = useState(() => {
    return playlistToEdit?.description || '';
  });
  const [artwork, setArtwork] = useState(() => {
    if (playlistToEdit) return playlistToEdit.artwork || playlistToEdit.coverUrl || NOCTURNE_ARTWORK_PRESETS[0];
    return initialTracks[0]?.artwork || NOCTURNE_ARTWORK_PRESETS[0];
  });
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      showToast('Validation Error', 'Please enter a ritual title', 'warning');
      return;
    }

    if (isEditing && playlistToEdit) {
      updatePlaylist(playlistToEdit.id, {
        title: cleanTitle,
        description: description.trim(),
        artwork: artwork.trim() || NOCTURNE_ARTWORK_PRESETS[0],
      });
      showToast('Playlist Re-inscribed', `"${cleanTitle}" has been updated`, 'success');
    } else {
      const created = createPlaylist({
        title: cleanTitle,
        description: description.trim(),
        initialTracks,
        artwork: artwork.trim() || NOCTURNE_ARTWORK_PRESETS[0],
      });
      showToast(
        'Ritual Created',
        `"${cleanTitle}" established with ${initialTracks.length} hymns`,
        'success'
      );
      onSuccess?.(created);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '1.15rem', fontWeight: 600 }}>
            {isEditing ? 'Re-inscribe Playlist' : 'Establish New Playlist'}
          </span>
        </div>
      }
      maxWidth="540px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            {isEditing ? 'Save Inscription' : 'Create Ritual'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="nocturne-playlist-modal">
        <div className="nocturne-playlist-modal__row">
          {/* Artwork preview */}
          <div className="nocturne-playlist-modal__artwork-preview">
            {!imgError && artwork ? (
              <img
                src={artwork}
                alt="Artwork preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <Music size={40} color="var(--accent-secondary)" />
            )}
          </div>

          {/* Form fields */}
          <div className="nocturne-playlist-modal__fields">
            <div className="nocturne-playlist-modal__field">
              <label className="nocturne-playlist-modal__label" htmlFor="nocturne-pl-title">
                Ritual Title *
              </label>
              <input
                id="nocturne-pl-title"
                className="nocturne-playlist-modal__input"
                type="text"
                placeholder="e.g., Midnight Catharsis"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="nocturne-playlist-modal__field">
              <label className="nocturne-playlist-modal__label" htmlFor="nocturne-pl-desc">
                Description
              </label>
              <textarea
                id="nocturne-pl-desc"
                className="nocturne-playlist-modal__textarea"
                placeholder="Add an evocative description of this sonic chamber..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Artwork selector */}
        <div className="nocturne-playlist-modal__field">
          <label className="nocturne-playlist-modal__label" htmlFor="nocturne-pl-artwork">
            Artwork URL
          </label>
          <input
            id="nocturne-pl-artwork"
            className="nocturne-playlist-modal__input"
            type="url"
            placeholder="https://..."
            value={artwork}
            onChange={(e) => {
              setArtwork(e.target.value);
              setImgError(false);
            }}
          />

          <span className="nocturne-playlist-modal__presets-label">
            Or choose a nocturnal aesthetic preset:
          </span>
          <div className="nocturne-playlist-modal__presets">
            {NOCTURNE_ARTWORK_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className={`nocturne-playlist-modal__preset-thumb ${
                  artwork === preset ? 'nocturne-playlist-modal__preset-thumb--active' : ''
                }`}
                onClick={() => {
                  setArtwork(preset);
                  setImgError(false);
                }}
              >
                <img src={preset} alt={`Preset ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export const PlaylistModal: React.FC<PlaylistModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <PlaylistModalContent
      key={props.playlistToEdit?.id || 'new-playlist'}
      {...props}
    />
  );
};
