import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  Calendar,
  Play,
  Pause,
  AlertTriangle,
  Music,
  CheckCircle2,
} from 'lucide-react';
import { useAnalytics } from '../state/AnalyticsContext';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { Button } from '../components/primitives/Button';
import { Modal } from '../components/primitives/Modal';
import { MOCK_TRACKS } from '../data/mockData';
import type { ListeningHistoryEntry } from '../types/analytics';
import './HistoryPage.css';

export const HistoryPage: React.FC = () => {
  const { groupedHistory, history, removeHistoryEntry, clearHistory } = useAnalytics();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const { showToast } = useToast();

  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handlePlayHistoryEntry = (entry: ListeningHistoryEntry) => {
    if (currentTrack?.id === entry.trackId) {
      togglePlayPause();
      return;
    }

    const fullTrack = MOCK_TRACKS.find((t) => t.id === entry.trackId);
    if (fullTrack) {
      playTrack(fullTrack);
      showToast('Commencing Hymn', `Playing "${entry.trackTitle}"`, 'default');
    } else {
      // Fallback synthetic track representation
      playTrack({
        id: entry.trackId,
        title: entry.trackTitle,
        artist: entry.artist,
        artistId: entry.artistId || 'unknown',
        album: entry.album,
        albumId: entry.albumId || 'unknown',
        artwork: entry.artwork,
        audioUrl: entry.audioUrl || '/audio/nocturne-darkwave-1.wav',
        duration: entry.duration,
        genre: entry.genre,
        releaseDate: entry.date,
        trackNumber: 1,
        explicit: false,
        playCount: 1,
      });
      showToast('Commencing Hymn', `Playing "${entry.trackTitle}"`, 'default');
    }
  };

  const handleRemoveEntry = (e: React.MouseEvent, entry: ListeningHistoryEntry) => {
    e.stopPropagation();
    removeHistoryEntry(entry.id);
    showToast('Entry Expunged', `Removed "${entry.trackTitle}" from chronicles`, 'default');
  };

  const handleConfirmClear = () => {
    clearHistory();
    setClearModalOpen(false);
    showToast('Chronicles Purged', 'All listening history has been permanently cleared', 'warning');
  };

  const formatListenedTime = (sec: number): string => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    if (mins === 0) return `${remainder}s`;
    return remainder > 0 ? `${mins}m ${remainder}s` : `${mins}m`;
  };

  const formatTimeOfDay = (ms: number): string => {
    return new Date(ms).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="nocturne-history-page">
      {/* Header */}
      <div className="nocturne-history-header">
        <div className="nocturne-history-header__left">
          <div className="nocturne-history-header__title-row">
            <Clock size={24} className="nocturne-history-icon" />
            <h1 className="nocturne-history-title">Listening History</h1>
          </div>
          <p className="nocturne-history-subtitle">
            An unalterable scroll of frequencies, listening duration, and nocturnal hours observed
          </p>
        </div>

        {history.length > 0 && (
          <div className="nocturne-history-header__actions">
            <span className="nocturne-history-count-badge">
              {history.length} {history.length === 1 ? 'record' : 'records'}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClearModalOpen(true)}
            >
              <Trash2 size={14} style={{ marginRight: 6 }} />
              Clear History
            </Button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="nocturne-history-empty">
          <div className="nocturne-history-empty__icon-wrap">
            <Clock size={40} />
          </div>
          <h2 className="nocturne-history-empty__title">The nocturnal chronicle is silent</h2>
          <p className="nocturne-history-empty__desc">
            No playback records currently reside in your archive. Immerse yourself in hymns across
            the Sanctuary and your listening history will emerge here.
          </p>
        </div>
      ) : (
        /* Grouped History List */
        <div className="nocturne-history-groups">
          {groupedHistory.map((group) => (
            <section key={group.group} className="nocturne-history-group">
              <div className="nocturne-history-group__header">
                <Calendar size={14} className="nocturne-history-group__icon" />
                <h3 className="nocturne-history-group__title">{group.label}</h3>
                <span className="nocturne-history-group__count">
                  ({group.entries.length})
                </span>
              </div>

              <div className="nocturne-history-table">
                <div className="nocturne-history-row nocturne-history-row--header">
                  <div className="nocturne-history-col nocturne-history-col--track">Track & Artist</div>
                  <div className="nocturne-history-col nocturne-history-col--album">Album</div>
                  <div className="nocturne-history-col nocturne-history-col--time">Time of Day</div>
                  <div className="nocturne-history-col nocturne-history-col--duration">Duration Listened</div>
                  <div className="nocturne-history-col nocturne-history-col--completion">Completion</div>
                  <div className="nocturne-history-col nocturne-history-col--actions"></div>
                </div>

                {group.entries.map((entry) => {
                  const isCurrent = currentTrack?.id === entry.trackId;
                  const isCurrentPlaying = isCurrent && isPlaying;

                  return (
                    <div
                      key={entry.id}
                      className={`nocturne-history-row ${isCurrent ? 'nocturne-history-row--active' : ''}`}
                      onClick={() => handlePlayHistoryEntry(entry)}
                    >
                      {/* Track info & Artwork */}
                      <div className="nocturne-history-col nocturne-history-col--track">
                        <div className="nocturne-history-thumb-wrap">
                          {entry.artwork ? (
                            <img
                              src={entry.artwork}
                              alt={entry.trackTitle}
                              className="nocturne-history-thumb"
                            />
                          ) : (
                            <div className="nocturne-history-thumb-fallback">
                              <Music size={16} />
                            </div>
                          )}
                          <div className="nocturne-history-play-overlay">
                            {isCurrentPlaying ? (
                              <Pause size={13} fill="white" />
                            ) : (
                              <Play size={13} fill="white" />
                            )}
                          </div>
                        </div>

                        <div className="nocturne-history-meta">
                          <span className={`nocturne-history-track-title ${isCurrent ? 'nocturne-history-track-title--active' : ''}`}>
                            {entry.trackTitle}
                          </span>
                          <span className="nocturne-history-artist-name">{entry.artist}</span>
                        </div>
                      </div>

                      {/* Album */}
                      <div className="nocturne-history-col nocturne-history-col--album">
                        <span className="nocturne-history-album-title">{entry.album}</span>
                      </div>

                      {/* Time */}
                      <div className="nocturne-history-col nocturne-history-col--time">
                        <span className="nocturne-history-timestamp">
                          {formatTimeOfDay(entry.startTime)}
                        </span>
                      </div>

                      {/* Duration Listened */}
                      <div className="nocturne-history-col nocturne-history-col--duration">
                        <span className="nocturne-history-duration-text">
                          {formatListenedTime(entry.durationListened)}
                        </span>
                      </div>

                      {/* Completion Percentage */}
                      <div className="nocturne-history-col nocturne-history-col--completion">
                        <div className="nocturne-history-completion-wrap">
                          <div className="nocturne-history-comp-bar">
                            <div
                              className="nocturne-history-comp-fill"
                              style={{ width: `${entry.completionPercentage}%` }}
                            />
                          </div>
                          <span className="nocturne-history-comp-badge">
                            {entry.completionPercentage === 100 && (
                              <CheckCircle2 size={11} className="nocturne-comp-complete-icon" />
                            )}
                            {entry.completionPercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Individual Deletion Action */}
                      <div className="nocturne-history-col nocturne-history-col--actions">
                        <button
                          type="button"
                          className="nocturne-history-delete-btn"
                          title="Remove from history"
                          onClick={(e) => handleRemoveEntry(e, entry)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f43f5e' }}>
            <AlertTriangle size={18} />
            <span>Purge Listening Chronicles</span>
          </div>
        }
        maxWidth="460px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" size="md" onClick={() => setClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              style={{ background: '#e11d48', borderColor: '#e11d48', color: '#fff' }}
              onClick={handleConfirmClear}
            >
              Clear Entire History
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: '13.5px', color: 'var(--text-medium)', lineHeight: 1.6, margin: 0 }}>
          Are you certain you wish to expunge all recorded listening history?
          This will reset your listening chronicle, although new listening sessions will continue
          to be logged as you stream.
        </p>
      </Modal>
    </div>
  );
};
