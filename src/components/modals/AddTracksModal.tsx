import React, { useState, useMemo } from 'react';
import { Search, Plus, Check, Music } from 'lucide-react';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { MOCK_TRACKS } from '../../data/mockData';
import { formatDuration } from '../../utilities/formatters';
import type { Track } from '../../types';

export interface AddTracksModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTrackIds?: string[];
  onAddTracks: (tracks: Track[]) => void;
  title?: string;
}

export const AddTracksModal: React.FC<AddTracksModalProps> = ({
  isOpen,
  onClose,
  existingTrackIds = [],
  onAddTracks,
  title = 'Add Tracks to Ritual',
}) => {
  const [query, setQuery] = useState('');
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());

  const existingSet = useMemo(() => new Set(existingTrackIds), [existingTrackIds]);

  const filteredTracks = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return MOCK_TRACKS;
    return MOCK_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
    );
  }, [query]);

  const toggleSelect = (id: string) => {
    setSelectedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const tracksToAdd = MOCK_TRACKS.filter((t) => selectedTrackIds.has(t.id));
    if (tracksToAdd.length > 0) {
      onAddTracks(tracksToAdd);
    }
    setSelectedTrackIds(new Set());
    setQuery('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="620px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            {selectedTrackIds.size} selected
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={selectedTrackIds.size === 0}
              onClick={handleConfirm}
            >
              Add {selectedTrackIds.size > 0 ? `(${selectedTrackIds.size})` : ''}
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={16} color="var(--text-low)" />
          <input
            type="text"
            placeholder="Search tracks by title, artist, genre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-pure)',
              fontSize: '13px',
              width: '100%',
            }}
            autoFocus
          />
        </div>

        {/* Tracks List */}
        <div
          style={{
            maxHeight: '340px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            paddingRight: 4,
          }}
        >
          {filteredTracks.map((track) => {
            const isAlreadyAdded = existingSet.has(track.id);
            const isSelected = selectedTrackIds.has(track.id);

            return (
              <div
                key={track.id}
                onClick={() => {
                  if (!isAlreadyAdded) toggleSelect(track.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected
                    ? 'rgba(157, 114, 255, 0.12)'
                    : 'transparent',
                  border: `1px solid ${
                    isSelected ? 'var(--accent-primary)' : 'transparent'
                  }`,
                  cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                  opacity: isAlreadyAdded ? 0.45 : 1,
                  transition: 'background 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'var(--bg-surface-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {track.artwork ? (
                    <img
                      src={track.artwork}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Music size={16} color="var(--accent-secondary)" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '13px',
                      color: isSelected ? 'var(--accent-secondary)' : 'var(--text-high)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {track.title}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-low)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {track.artist} • {track.album}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-low)',
                    marginRight: 6,
                  }}
                >
                  {formatDuration(track.duration)}
                </span>

                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    border: `1px solid ${
                      isSelected
                        ? 'var(--accent-primary)'
                        : isAlreadyAdded
                        ? 'var(--border-subtle)'
                        : 'var(--border-subtle)'
                    }`,
                    background: isSelected
                      ? 'var(--accent-primary)'
                      : isAlreadyAdded
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={14} />}
                  {isAlreadyAdded && !isSelected && (
                    <span style={{ fontSize: '10px', color: 'var(--text-low)' }}>✓</span>
                  )}
                  {!isSelected && !isAlreadyAdded && (
                    <Plus size={12} color="var(--text-low)" />
                  )}
                </div>
              </div>
            );
          })}

          {filteredTracks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-low)', fontSize: '13px' }}>
              No tracks matched "{query}"
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
