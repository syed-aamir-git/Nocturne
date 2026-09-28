import React, { useState } from 'react';
import {
  X,
  Activity,
  Music,
  Info,
  ListMusic,
  Trash2,
  Play,
  Pause,
  CornerDownRight,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Plus,
  Mic2,
  ScrollText,
  Maximize2,
} from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { usePlayer } from '../../state/PlayerContext';
import { useToast } from '../../state/ToastContext';
import { IconButton } from '../primitives/IconButton';
import { AddTracksModal } from '../modals/AddTracksModal';
import { formatDuration } from '../../utilities/formatters';
import type { Track } from '../../types';
import './RightPanel.css';

export const RightPanel: React.FC = () => {
  const { rightPanelOpen, toggleRightPanel, rightPanelTab, setRightPanelTab, openLyrics } = useUI();
  const {
    currentTrack,
    queue,
    queueIndex,
    currentTime,
    isPlaying,
    playQueueIndex,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    playNext,
    addTracksToQueue,
    togglePlayPause,
    seek,
  } = usePlayer();
  const { showToast } = useToast();

  const [imgError, setImgError] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!rightPanelOpen) return null;

  const coverSrc = currentTrack?.artwork || currentTrack?.coverUrl || '';

  // HTML5 Drag and Drop handlers for queue
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderQueue(draggedIndex, targetIndex);
      showToast('Queue Reordered', 'Updated playback sequence', 'default');
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderQueue(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < queue.length - 1) {
      reorderQueue(index, index + 1);
    }
  };

  const handleAddTracks = (tracks: Track[]) => {
    addTracksToQueue(tracks);
    showToast('Tracks Queued', `Added ${tracks.length} tracks to sequence`, 'atmosphere');
  };

  return (
    <aside className="nocturne-right-panel" aria-label="Now Playing Sanctuary Details">
      <div className="nocturne-right-panel__header">
        <span className="nocturne-right-panel__title">Sanctum Inspector</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              display: 'flex',
              gap: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              padding: 2,
              borderRadius: 4,
            }}
          >
            <button
              type="button"
              onClick={() => setRightPanelTab('queue')}
              style={{
                background: rightPanelTab === 'queue' ? 'var(--bg-surface-elevated)' : 'transparent',
                border: 'none',
                color: rightPanelTab === 'queue' ? 'var(--accent-secondary)' : 'var(--text-low)',
                padding: '3px 8px',
                borderRadius: 3,
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: rightPanelTab === 'queue' ? 600 : 400,
              }}
            >
              <ListMusic size={12} />
              <span>Queue ({queue.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setRightPanelTab('lyrics')}
              style={{
                background: rightPanelTab === 'lyrics' ? 'var(--bg-surface-elevated)' : 'transparent',
                border: 'none',
                color: rightPanelTab === 'lyrics' ? 'var(--accent-secondary)' : 'var(--text-low)',
                padding: '3px 8px',
                borderRadius: 3,
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: rightPanelTab === 'lyrics' ? 600 : 400,
              }}
            >
              <Mic2 size={12} />
              <span>Lyrics</span>
            </button>

            <button
              type="button"
              onClick={() => setRightPanelTab('info')}
              style={{
                background: rightPanelTab === 'info' ? 'var(--bg-surface-elevated)' : 'transparent',
                border: 'none',
                color: rightPanelTab === 'info' ? 'var(--accent-secondary)' : 'var(--text-low)',
                padding: '3px 8px',
                borderRadius: 3,
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: rightPanelTab === 'info' ? 600 : 400,
              }}
            >
              <Info size={12} />
              <span>Info</span>
            </button>

            <button
              type="button"
              onClick={() => setRightPanelTab('credits')}
              style={{
                background: rightPanelTab === 'credits' ? 'var(--bg-surface-elevated)' : 'transparent',
                border: 'none',
                color: rightPanelTab === 'credits' ? 'var(--accent-secondary)' : 'var(--text-low)',
                padding: '3px 8px',
                borderRadius: 3,
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: rightPanelTab === 'credits' ? 600 : 400,
              }}
            >
              <ScrollText size={12} />
              <span>Credits</span>
            </button>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={toggleRightPanel}
            aria-label="Close details panel"
          >
            <X size={16} />
          </IconButton>
        </div>
      </div>

      <div className="nocturne-right-panel__content">
        {/* ==================== TAB 1: QUEUE ==================== */}
        {rightPanelTab === 'queue' && (
          <div className="nocturne-queue-container">
            {/* Queue Controls Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-low)',
                  letterSpacing: '0.06em',
                }}
              >
                PLAYBACK SEQUENCE ({queue.length})
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-secondary)',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                  title="Add tracks to sequence"
                >
                  <Plus size={12} />
                  <span>Add Tracks</span>
                </button>

                {queue.length > 1 && (
                  <button
                    type="button"
                    onClick={clearQueue}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-low)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      padding: '3px 6px',
                      borderRadius: 4,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--indicator-error)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-low)')}
                    title="Clear upcoming sequence"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Currently Playing Track Highlight */}
            {currentTrack && (
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-secondary)',
                    letterSpacing: '0.08em',
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  NOW RESONATING
                </span>

                <div className="nocturne-queue-now-playing">
                  <div className="nocturne-queue-now-playing__badge">
                    <span>Active Frequency</span>
                    {isPlaying && (
                      <div className="nocturne-equalizer">
                        <span className="nocturne-equalizer__bar" />
                        <span className="nocturne-equalizer__bar" />
                        <span className="nocturne-equalizer__bar" />
                      </div>
                    )}
                  </div>

                  <div className="nocturne-queue-now-playing__content">
                    <img
                      src={currentTrack.artwork || currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="nocturne-queue-now-playing__art"
                    />

                    <div className="nocturne-queue-now-playing__info">
                      <span className="nocturne-queue-now-playing__title">
                        {currentTrack.title}
                      </span>
                      <span className="nocturne-queue-now-playing__artist">
                        {currentTrack.artist} • {currentTrack.album}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'var(--accent-secondary)',
                          fontFamily: 'var(--font-mono)',
                          marginTop: 4,
                        }}
                      >
                        {currentTrack.bitrate || '24-bit / 96kHz FLAC'}
                      </span>
                    </div>

                    <IconButton
                      variant="primary"
                      size="sm"
                      onClick={togglePlayPause}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                    </IconButton>
                  </div>
                </div>
              </div>
            )}

            {/* Up Next List */}
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-low)',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                UP NEXT IN QUEUE ({Math.max(0, queue.length - 1)})
              </span>

              {queue.length <= 1 ? (
                <div
                  style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.01)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed var(--border-subtle)',
                  }}
                >
                  <p style={{ color: 'var(--text-low)', fontSize: '12px', margin: '0 0 10px 0' }}>
                    No upcoming tracks in sequence.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-pure)',
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={12} />
                    <span>Choose Tracks</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {queue.map((item, idx) => {
                    const isCurrent = idx === queueIndex;
                    const itemCover = item.artwork || item.coverUrl || '';
                    const isDraggingThis = draggedIndex === idx;
                    const isDropTargetThis = dragOverIndex === idx;

                    return (
                      <div
                        key={`${item.id}-${idx}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, idx)}
                        className={`nocturne-queue-item ${
                          isDraggingThis ? 'nocturne-queue-item--dragging' : ''
                        } ${isDropTargetThis ? 'nocturne-queue-item--drop-target' : ''}`}
                        style={{
                          background: isCurrent
                            ? 'rgba(157, 114, 255, 0.08)'
                            : undefined,
                          borderColor: isCurrent
                            ? 'var(--accent-primary)'
                            : undefined,
                        }}
                        onClick={() => playQueueIndex(idx)}
                      >
                        {/* Drag Handle */}
                        <div
                          className="nocturne-queue-item__handle"
                          title="Drag to reorder sequence"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GripVertical size={13} />
                        </div>

                        {/* Position Indicator */}
                        <span
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: isCurrent ? 'var(--accent-secondary)' : 'var(--text-low)',
                            width: 16,
                            textAlign: 'center',
                          }}
                        >
                          {isCurrent && isPlaying ? '▶' : idx + 1}
                        </span>

                        {/* Thumbnail */}
                        <img
                          src={itemCover}
                          alt={item.title}
                          className="nocturne-queue-item__thumb"
                        />

                        {/* Title & Artist */}
                        <div className="nocturne-queue-item__info">
                          <span
                            className="nocturne-queue-item__title"
                            style={{ color: isCurrent ? 'var(--accent-secondary)' : undefined }}
                          >
                            {item.title}
                          </span>
                          <span className="nocturne-queue-item__artist">{item.artist}</span>
                        </div>

                        {/* Duration */}
                        <span
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-low)',
                            marginRight: 4,
                          }}
                        >
                          {formatDuration(item.duration)}
                        </span>

                        {/* Actions */}
                        <div
                          className="nocturne-queue-item__actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Move Up */}
                          {idx > 0 && (
                            <button
                              type="button"
                              className="nocturne-queue-reorder-btn"
                              onClick={() => handleMoveUp(idx)}
                              title="Move up"
                            >
                              <ChevronUp size={12} />
                            </button>
                          )}

                          {/* Move Down */}
                          {idx < queue.length - 1 && (
                            <button
                              type="button"
                              className="nocturne-queue-reorder-btn"
                              onClick={() => handleMoveDown(idx)}
                              title="Move down"
                            >
                              <ChevronDown size={12} />
                            </button>
                          )}

                          {/* Play Next (if not right next already) */}
                          {!isCurrent && idx !== queueIndex + 1 && (
                            <button
                              type="button"
                              className="nocturne-queue-reorder-btn"
                              onClick={() => {
                                playNext(item);
                                showToast('Queued Next', item.title, 'atmosphere');
                              }}
                              title="Play next in sequence"
                            >
                              <CornerDownRight size={12} />
                            </button>
                          )}

                          {/* Remove button */}
                          {queue.length > 1 && (
                            <button
                              type="button"
                              className="nocturne-queue-reorder-btn"
                              onClick={() => removeFromQueue(idx)}
                              title="Remove from queue"
                              style={{ color: 'var(--indicator-error)' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add Tracks Modal */}
            <AddTracksModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAddTracks={handleAddTracks}
              title="Add Tracks to Queue"
            />
          </div>
        )}

        {/* ==================== TAB 2: LYRICS ==================== */}
        {rightPanelTab === 'lyrics' && currentTrack && (
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {currentTrack.syncedLyrics ? 'SYNCED INSCRIPTION' : 'LYRICS & POETRY'}
              </span>

              <button
                type="button"
                onClick={() => openLyrics('lyrics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-high)',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                title="Open cinematic full-screen lyrics"
              >
                <Maximize2 size={11} />
                <span>Immersive</span>
              </button>
            </div>

            {!currentTrack.lyrics && (!currentTrack.syncedLyrics || currentTrack.syncedLyrics.length === 0) ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Music size={32} color="var(--text-low)" />
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--text-high)',
                  }}
                >
                  Lyrics aren't available for this track yet.
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-low)', lineHeight: 1.5 }}>
                  Transcriptions for this instrumental composition have not yet been recorded.
                </p>
              </div>
            ) : currentTrack.syncedLyrics && currentTrack.syncedLyrics.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {currentTrack.syncedLyrics.map((line, idx) => {
                  const isPastOrCurrent = currentTime >= line.time;
                  const nextLine = currentTrack.syncedLyrics![idx + 1];
                  const isCurrent =
                    isPastOrCurrent && (!nextLine || currentTime < nextLine.time);

                  return (
                    <div
                      key={idx}
                      onClick={() => seek(line.time)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: isCurrent ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        borderLeft: isCurrent ? '2px solid var(--accent-primary)' : '2px solid transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: isCurrent ? '15px' : '13px',
                          fontWeight: isCurrent ? 600 : 400,
                          color: isCurrent
                            ? 'var(--accent-secondary)'
                            : isPastOrCurrent
                            ? 'var(--text-high)'
                            : 'var(--text-low)',
                          lineHeight: 1.4,
                        }}
                      >
                        {line.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <pre
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--text-medium)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {currentTrack.lyrics}
              </pre>
            )}
          </div>
        )}

        {/* ==================== TAB 3: INFO ==================== */}
        {rightPanelTab === 'info' && currentTrack && (
          <>
            {/* Large Cinematic Artwork */}
            <div className="nocturne-right-panel__art-wrap">
              {!imgError && coverSrc ? (
                <img
                  src={coverSrc}
                  alt={currentTrack.title}
                  className="nocturne-right-panel__art"
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
                  <Music size={48} color="var(--accent-primary)" />
                </div>
              )}
            </div>

            <div className="nocturne-right-panel__track-info">
              <span className="nocturne-right-panel__track-title">{currentTrack.title}</span>
              <span className="nocturne-right-panel__artist-name">{currentTrack.artist}</span>
              <span className="nocturne-right-panel__album-name">{currentTrack.album}</span>
            </div>

            {/* Audio Signal Matrix */}
            <div className="nocturne-right-panel__signal">
              <div className="nocturne-right-panel__signal-header">
                <span>Signal Precision</span>
                <Activity size={12} />
              </div>
              <div className="nocturne-right-panel__signal-grid">
                <div className="nocturne-right-panel__signal-item">
                  <span className="nocturne-right-panel__signal-label">ENCODING</span>
                  <span className="nocturne-right-panel__signal-val">
                    {currentTrack.bitrate || '24-bit FLAC'}
                  </span>
                </div>
                <div className="nocturne-right-panel__signal-item">
                  <span className="nocturne-right-panel__signal-label">SAMPLE RATE</span>
                  <span className="nocturne-right-panel__signal-val">96.0 kHz</span>
                </div>
                <div className="nocturne-right-panel__signal-item">
                  <span className="nocturne-right-panel__signal-label">DYNAMIC RANGE</span>
                  <span className="nocturne-right-panel__signal-val">14.2 LUFS</span>
                </div>
                <div className="nocturne-right-panel__signal-item">
                  <span className="nocturne-right-panel__signal-label">GENRE</span>
                  <span className="nocturne-right-panel__signal-val">{currentTrack.genre}</span>
                </div>
              </div>
            </div>

            {/* Liner Notes / Lore */}
            <div className="nocturne-right-panel__lore">
              "Mastered without brickwall limiting to preserve natural room decay and subterranean
              harmonic resonance. Optimal listening: headphones in darkened chamber."
            </div>
          </>
        )}

        {/* ==================== TAB 4: CREDITS ==================== */}
        {rightPanelTab === 'credits' && currentTrack && (
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                ARCHIVAL LINEAGE
              </span>

              <button
                type="button"
                onClick={() => openLyrics('credits')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-high)',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                title="Open detailed credits modal"
              >
                <Maximize2 size={11} />
                <span>Full Details</span>
              </button>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                PERFORMERS
              </span>
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentTrack.credits?.performers ? (
                  currentTrack.credits.performers.map((p, idx) => (
                    <p key={idx} style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                      • {p}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                    • {currentTrack.artist} (Lead Performance)
                  </p>
                )}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                SONGWRITING
              </span>
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentTrack.credits?.composers ? (
                  currentTrack.credits.composers.map((c, idx) => (
                    <p key={idx} style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                      • Composer: {c}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                    • Composer: {currentTrack.artist}
                  </p>
                )}
                {currentTrack.credits?.lyricists &&
                  currentTrack.credits.lyricists.map((l, idx) => (
                    <p key={`lyr-${idx}`} style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                      • Lyricist: {l}
                    </p>
                  ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                PRODUCTION & ENGINEERING
              </span>
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                  • Producer: {currentTrack.credits?.producers?.[0] || 'Nocturne Sonic Guild'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                  • Mix: {currentTrack.credits?.mixedBy?.[0] || 'Julian Mercer at Obsidian Labs'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-high)' }}>
                  • Master: {currentTrack.credits?.masteredBy?.[0] || 'Evelyn Thorne'}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.5 }}>
                {currentTrack.credits?.copyrightNotice || '© 2024-2025 Nocturne Sanctuary Records.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
