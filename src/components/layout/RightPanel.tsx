import React, { useState } from 'react';
import { X, Activity, Music, AlignLeft, Info } from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { usePlayer } from '../../state/PlayerContext';
import { IconButton } from '../primitives/IconButton';
import './RightPanel.css';

export const RightPanel: React.FC = () => {
  const { rightPanelOpen, toggleRightPanel } = useUI();
  const { currentTrack, queue, currentTime } = usePlayer();
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'lyrics'>('info');

  if (!rightPanelOpen) return null;

  const coverSrc = currentTrack?.artwork || currentTrack?.coverUrl || '';

  return (
    <aside className="nocturne-right-panel" aria-label="Now Playing Sanctuary Details">
      <div className="nocturne-right-panel__header">
        <span className="nocturne-right-panel__title">Sanctum Inspector</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {currentTrack && (currentTrack.lyrics || currentTrack.syncedLyrics) && (
            <div style={{ display: 'flex', gap: 2, background: 'rgba(255, 255, 255, 0.05)', padding: 2, borderRadius: 4 }}>
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                style={{
                  background: activeTab === 'info' ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'info' ? 'var(--accent-secondary)' : 'var(--text-low)',
                  padding: '3px 6px',
                  borderRadius: 3,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Info size={11} />
                <span>Info</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lyrics')}
                style={{
                  background: activeTab === 'lyrics' ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'lyrics' ? 'var(--accent-secondary)' : 'var(--text-low)',
                  padding: '3px 6px',
                  borderRadius: 3,
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <AlignLeft size={11} />
                <span>Lyrics</span>
              </button>
            </div>
          )}
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
        {/* Large Cinematic Artwork */}
        {currentTrack && (
          <>
            <div className="nocturne-right-panel__art-wrap">
              {!imgError && coverSrc ? (
                <img
                  src={coverSrc}
                  alt={currentTrack.title}
                  className="nocturne-right-panel__art"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Music size={48} color="var(--accent-primary)" />
                </div>
              )}
            </div>

            <div className="nocturne-right-panel__track-info">
              <span className="nocturne-right-panel__track-title">{currentTrack.title}</span>
              <span className="nocturne-right-panel__artist-name">{currentTrack.artist}</span>
              <span className="nocturne-right-panel__album-name">{currentTrack.album}</span>
            </div>

            {activeTab === 'lyrics' && (currentTrack.lyrics || currentTrack.syncedLyrics) ? (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-secondary)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {currentTrack.syncedLyrics ? 'SYNCED INSCRIPTIONS' : 'LYRICS & POETRY'}
                </span>

                {currentTrack.syncedLyrics ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {currentTrack.syncedLyrics.map((line, idx) => {
                      const isPastOrCurrent = currentTime >= line.time;
                      const nextLine = currentTrack.syncedLyrics![idx + 1];
                      const isCurrent = isPastOrCurrent && (!nextLine || currentTime < nextLine.time);

                      return (
                        <p
                          key={idx}
                          style={{
                            margin: 0,
                            fontSize: isCurrent ? '14px' : '13px',
                            fontWeight: isCurrent ? 600 : 400,
                            color: isCurrent
                              ? 'var(--accent-secondary)'
                              : isPastOrCurrent
                              ? 'var(--text-high)'
                              : 'var(--text-low)',
                            transition: 'all 0.3s ease',
                            lineHeight: 1.4,
                          }}
                        >
                          {line.text}
                        </p>
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
            ) : (
              <>
                {/* Audio Signal Matrix */}
                <div className="nocturne-right-panel__signal">
                  <div className="nocturne-right-panel__signal-header">
                    <span>Signal Precision</span>
                    <Activity size={12} />
                  </div>
                  <div className="nocturne-right-panel__signal-grid">
                    <div className="nocturne-right-panel__signal-item">
                      <span className="nocturne-right-panel__signal-label">ENCODING</span>
                      <span className="nocturne-right-panel__signal-val">{currentTrack.bitrate || '24-bit FLAC'}</span>
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
                  "Mastered without brickwall limiting to preserve natural room decay and subterranean harmonic resonance. Optimal listening: headphones in darkened chamber."
                </div>
              </>
            )}

            {/* Up Next Queue */}
            {queue.length > 0 && (
              <div>
                <div className="nocturne-right-panel__queue-title">Up Next in Sequence</div>
                {queue.slice(0, 3).map((item) => {
                  const itemCover = item.artwork || item.coverUrl || '';
                  return (
                    <div key={item.id} className="nocturne-right-panel__queue-item">
                      {itemCover && (
                        <img
                          src={itemCover}
                          alt={item.title}
                          className="nocturne-right-panel__queue-thumb"
                        />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-pure)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-low)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.artist}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
