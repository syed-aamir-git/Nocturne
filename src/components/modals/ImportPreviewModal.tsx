import React from 'react';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { Check, AlertTriangle, HelpCircle, Download } from 'lucide-react';
import type { PlaylistImportPreview } from '../../services/importer/types';
import { formatDuration } from '../../utilities/formatters';
import './ImportPreviewModal.css';

export interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preview: PlaylistImportPreview | null;
  isImporting: boolean;
  importStep: string;
  onConfirmImport: () => void;
}

export const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  isOpen,
  onClose,
  preview,
  isImporting,
  importStep,
  onConfirmImport,
}) => {
  if (!preview) return null;

  const { playlist, totalTracks, matchedCount, unmatchedCount, possibleCount, matches } = preview;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Import "${playlist.title}"`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Playlist metadata overview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src={playlist.artwork || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'}
            alt={playlist.title}
            style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
          />
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px 0', color: 'var(--text-pure)' }}>
              {playlist.title}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
              Curated by {playlist.owner} • {playlist.isPublic ? 'Public' : 'Private'} Spotify Playlist
            </span>
          </div>
        </div>

        {/* Statistical Overview Pills */}
        <div className="nocturne-import-modal__stats">
          <div className="nocturne-import-modal__stat-card">
            <span className="nocturne-import-modal__stat-value">{totalTracks}</span>
            <span className="nocturne-import-modal__stat-label">Total Tracks</span>
          </div>

          <div className="nocturne-import-modal__stat-card">
            <span
              className="nocturne-import-modal__stat-value"
              style={{ color: 'var(--indicator-success, #34d399)' }}
            >
              {matchedCount}
            </span>
            <span className="nocturne-import-modal__stat-label">✓ Matched</span>
          </div>

          <div className="nocturne-import-modal__stat-card">
            <span
              className="nocturne-import-modal__stat-value"
              style={{ color: 'var(--indicator-lossless, #fbbf24)' }}
            >
              {possibleCount}
            </span>
            <span className="nocturne-import-modal__stat-label">? Possible</span>
          </div>

          <div className="nocturne-import-modal__stat-card">
            <span
              className="nocturne-import-modal__stat-value"
              style={{ color: 'var(--indicator-error, #f87171)' }}
            >
              {unmatchedCount}
            </span>
            <span className="nocturne-import-modal__stat-label">⚠ No Match</span>
          </div>
        </div>

        {/* Notice on unavailable tracks */}
        {unmatchedCount > 0 && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '12px',
              color: 'var(--text-medium)',
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: 'var(--text-pure)' }}>Notice on library availability:</strong> {unmatchedCount}{' '}
            {unmatchedCount === 1 ? 'track' : 'tracks'} cannot be matched to Nocturne's audio library. They will be
            retained as unplayable metadata in your playlist rather than silently deleted.
          </div>
        )}

        {/* Scrollable Track list with match status pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-low)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Track Mapping Verification
          </span>

          <div className="nocturne-import-modal__tracklist">
            {matches.map((item, index) => {
              const orig = item.original;
              return (
                <div key={orig.id || index} className="nocturne-import-modal__track-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-low)',
                        width: 20,
                        textAlign: 'right',
                      }}
                    >
                      {index + 1}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--text-pure)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {orig.title}
                      </span>
                      <span
                        style={{
                          fontSize: '11.5px',
                          color: 'var(--text-medium)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {orig.artist} • {orig.album}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                      {formatDuration(orig.duration)}
                    </span>

                    {item.status === 'matched' && (
                      <span className="nocturne-import-modal__match-pill nocturne-import-modal__match-pill--matched">
                        <Check size={11} />
                        ✓ Matched
                      </span>
                    )}

                    {item.status === 'possible' && (
                      <span className="nocturne-import-modal__match-pill nocturne-import-modal__match-pill--possible">
                        <HelpCircle size={11} />
                        ? Possible Match
                      </span>
                    )}

                    {item.status === 'unmatched' && (
                      <span className="nocturne-import-modal__match-pill nocturne-import-modal__match-pill--unmatched">
                        <AlertTriangle size={11} />
                        ⚠ No Match
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal actions / Loading step */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {isImporting ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '12.5px', color: 'var(--accent-secondary)' }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid var(--accent-primary)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span>{importStep || 'Importing playlist...'}</span>
            </div>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--text-low)' }}>
              Ready to create Nocturne playlist
            </span>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" onClick={onClose} disabled={isImporting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<Download size={15} />}
              onClick={onConfirmImport}
              disabled={isImporting}
            >
              {isImporting ? 'Importing...' : 'Import Playlist'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
