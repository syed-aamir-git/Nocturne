import React, { useState } from 'react';
import { X, Activity, Music } from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { usePlayer } from '../../state/PlayerContext';
import { IconButton } from '../primitives/IconButton';
import './RightPanel.css';

export const RightPanel: React.FC = () => {
  const { rightPanelOpen, toggleRightPanel } = useUI();
  const { currentTrack, queue } = usePlayer();
  const [imgError, setImgError] = useState(false);

  if (!rightPanelOpen) return null;

  return (
    <aside className="nocturne-right-panel" aria-label="Now Playing Sanctuary Details">
      <div className="nocturne-right-panel__header">
        <span className="nocturne-right-panel__title">Sanctum Inspector</span>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={toggleRightPanel}
          aria-label="Close details panel"
        >
          <X size={16} />
        </IconButton>
      </div>

      <div className="nocturne-right-panel__content">
        {/* Large Cinematic Artwork */}
        {currentTrack && (
          <>
            <div className="nocturne-right-panel__art-wrap">
              {!imgError ? (
                <img
                  src={currentTrack.coverUrl}
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

            {/* Audio Signal Matrix */}
            <div className="nocturne-right-panel__signal">
              <div className="nocturne-right-panel__signal-header">
                <span>Signal Precision</span>
                <Activity size={12} />
              </div>
              <div className="nocturne-right-panel__signal-grid">
                <div className="nocturne-right-panel__signal-item">
                  <span className="nocturne-right-panel__signal-label">ENCODING</span>
                  <span className="nocturne-right-panel__signal-val">24-bit FLAC</span>
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
                  <span className="nocturne-right-panel__signal-label">BITRATE</span>
                  <span className="nocturne-right-panel__signal-val">4608 kbps</span>
                </div>
              </div>
            </div>

            {/* Liner Notes / Lore */}
            <div className="nocturne-right-panel__lore">
              "Mastered without brickwall limiting to preserve natural room decay and subterranean harmonic resonance. Optimal listening: headphones in darkened chamber."
            </div>

            {/* Up Next Queue */}
            {queue.length > 0 && (
              <div>
                <div className="nocturne-right-panel__queue-title">Up Next in Sequence</div>
                {queue.slice(0, 2).map((item) => (
                  <div key={item.id} className="nocturne-right-panel__queue-item">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="nocturne-right-panel__queue-thumb"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-pure)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-low)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.artist}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
