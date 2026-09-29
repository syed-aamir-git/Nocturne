import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Mic2,
  Info,
  ScrollText,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  AlertCircle,
  Sparkles,
  AlignLeft,
} from 'lucide-react';
import { usePlayer } from '../../state/PlayerContext';
import { useUI } from '../../state/UIContext';
import { formatDuration } from '../../utilities/formatters';
import { Slider } from '../primitives/Slider';
import { IconButton } from '../primitives/IconButton';
import type { SyncedLyricLine, LyricsState } from '../../types';
import { sanitizeSyncedLyrics, sanitizePlainLyrics } from '../../utilities/lyrics';
import './LyricsModal.css';

export const LyricsModal: React.FC = () => {
  const { isLyricsOpen, closeLyrics, lyricsTab, setLyricsTab } = useUI();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seek,
    nextTrack,
    previousTrack,
    volume,
    muted,
    setVolume,
    toggleMute,
  } = usePlayer();

  // Lyrics display options
  const [lyricsMode, setLyricsMode] = useState<'synced' | 'plain'>('synced');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Manual scroll tracking
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const userScrollTimeoutRef = useRef<any>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Simulated lyrics network / deciphering state
  const [simulatedState, setSimulatedState] = useState<LyricsState>('loading');
  const [artFailedTrackId, setArtFailedTrackId] = useState<string | null>(null);
  const artLoadFailed = Boolean(currentTrack && artFailedTrackId === currentTrack.id);

  // Determine current active lyric line for synced mode safely
  const syncedLyrics: SyncedLyricLine[] = useMemo(() => {
    return sanitizeSyncedLyrics(currentTrack?.syncedLyrics);
  }, [currentTrack?.syncedLyrics]);

  const plainLyrics: string = useMemo(() => {
    return sanitizePlainLyrics(currentTrack?.lyrics);
  }, [currentTrack?.lyrics]);

  const activeLineIndex = useMemo(() => {
    if (!syncedLyrics || syncedLyrics.length === 0) return -1;
    let index = -1;
    for (let i = 0; i < syncedLyrics.length; i++) {
      if (currentTime >= syncedLyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [syncedLyrics, currentTime]);

  // Determine overall lyrics state
  const lyricsState: LyricsState = useMemo(() => {
    if (!currentTrack) return 'not_available';
    if (simulatedState === 'loading') return 'loading';
    if (simulatedState === 'error') return 'error';

    const hasLyrics = Boolean(plainLyrics);
    const hasSynced = syncedLyrics.length > 0;

    if (hasLyrics || hasSynced) {
      return 'available';
    }
    return 'not_available';
  }, [currentTrack, simulatedState, plainLyrics, syncedLyrics]);

  // Quick initial loading state simulation when switching tracks
  useEffect(() => {
    if (!currentTrack) {
      return;
    }

    const loadTimer = setTimeout(() => {
      setSimulatedState('loading');
    }, 0);

    const resolveTimer = setTimeout(() => {
      const hasLyrics = Boolean(sanitizePlainLyrics(currentTrack.lyrics));
      const hasSynced = sanitizeSyncedLyrics(currentTrack.syncedLyrics).length > 0;
      setSimulatedState(hasLyrics || hasSynced ? 'available' : 'not_available');
    }, 240);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(resolveTimer);
    };
  }, [currentTrack]);

  // Default to synced mode if synced lyrics exist
  useEffect(() => {
    if (!currentTrack) return;
    const hasSynced = sanitizeSyncedLyrics(currentTrack.syncedLyrics).length > 0;
    const modeTimer = setTimeout(() => {
      setLyricsMode(hasSynced ? 'synced' : 'plain');
      setIsUserScrolling(false);
    }, 0);

    return () => clearTimeout(modeTimer);
  }, [currentTrack]);

  // Auto-scroll to active line if not user scrolling
  useEffect(() => {
    if (lyricsTab !== 'lyrics' || lyricsMode !== 'synced' || isUserScrolling) return;

    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, lyricsTab, lyricsMode, isUserScrolling]);

  // Handle user scroll detection
  const handleContainerScroll = () => {
    // If the scroll happened because of user interaction
    // We mark user scrolling
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
  };

  const handleUserWheelOrTouch = () => {
    setIsUserScrolling(true);

    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // Auto-resume sync after 5 seconds of idle without user scrolling
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 5000);
  };

  const handleReturnToCurrentLine = () => {
    setIsUserScrolling(false);
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLyricsOpen) {
        closeLyrics();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLyricsOpen, closeLyrics]);

  if (!isLyricsOpen) return null;

  if (!currentTrack) {
    return (
      <div className="nocturne-lyrics-modal" role="dialog" aria-modal="true" aria-label="Lyrics and Lore">
        <div className="nocturne-lyrics-modal__container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <header className="nocturne-lyrics-modal__header" style={{ width: '100%' }}>
            <span className="nocturne-lyrics-modal__title">Lyrics & Lore</span>
            <IconButton variant="ghost" size="md" onClick={closeLyrics} aria-label="Close lyrics">
              <X size={20} />
            </IconButton>
          </header>
          <div className="nocturne-lyrics-state--not-available" style={{ flex: 1 }}>
            <div className="nocturne-lyrics-state__icon-wrap">
              <Music size={36} />
            </div>
            <h3 className="nocturne-lyrics-state__title">No Composition Currently Playing</h3>
            <p className="nocturne-lyrics-state__desc">
              Initiate playback on any piece in the sanctuary library to view its poetic inscriptions, acoustic metrics, and creator credits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const artworkUrl = currentTrack.artwork || currentTrack.coverUrl || '';

  return (
    <div className="nocturne-lyrics-modal" role="dialog" aria-modal="true" aria-label="Lyrics and Lore">
      {/* Blurred Ambient Artwork Backdrop */}
      {artworkUrl && !artLoadFailed && (
        <div
          className="nocturne-lyrics-modal__backdrop"
          style={{ backgroundImage: `url(${artworkUrl})` }}
        />
      )}
      <div className="nocturne-lyrics-modal__vignette" />

      <div className="nocturne-lyrics-modal__container">
        {/* ==================== HEADER ==================== */}
        <header className="nocturne-lyrics-modal__header">
          {/* Left: Track summary */}
          <div className="nocturne-lyrics-modal__track-summary">
            {artworkUrl ? (
              <img
                src={artworkUrl}
                alt={currentTrack.title}
                className="nocturne-lyrics-modal__art-thumb"
              />
            ) : (
              <div className="nocturne-lyrics-modal__art-thumb-fallback">
                <Music size={20} color="var(--accent-secondary)" />
              </div>
            )}
            <div className="nocturne-lyrics-modal__meta">
              <span className="nocturne-lyrics-modal__title">{currentTrack.title}</span>
              <span className="nocturne-lyrics-modal__artist">{currentTrack.artist}</span>
            </div>
          </div>

          {/* Center: Three Main Tabs */}
          <nav className="nocturne-lyrics-modal__tabs" aria-label="Lyrics Navigation Tabs">
            <button
              type="button"
              className={`nocturne-lyrics-modal__tab-btn ${
                lyricsTab === 'lyrics' ? 'nocturne-lyrics-modal__tab-btn--active' : ''
              }`}
              onClick={() => setLyricsTab('lyrics')}
            >
              <Mic2 size={14} />
              <span>Lyrics</span>
            </button>

            <button
              type="button"
              className={`nocturne-lyrics-modal__tab-btn ${
                lyricsTab === 'info' ? 'nocturne-lyrics-modal__tab-btn--active' : ''
              }`}
              onClick={() => setLyricsTab('info')}
            >
              <Info size={14} />
              <span>Song Info</span>
            </button>

            <button
              type="button"
              className={`nocturne-lyrics-modal__tab-btn ${
                lyricsTab === 'credits' ? 'nocturne-lyrics-modal__tab-btn--active' : ''
              }`}
              onClick={() => setLyricsTab('credits')}
            >
              <ScrollText size={14} />
              <span>Credits</span>
            </button>
          </nav>

          {/* Right: Actions (Synced/Plain toggle & Close) */}
          <div className="nocturne-lyrics-modal__actions">
            {lyricsTab === 'lyrics' && lyricsState === 'available' && (
              <>
                {currentTrack.syncedLyrics && currentTrack.syncedLyrics.length > 0 && (
                  <button
                    type="button"
                    className={`nocturne-lyrics-modal__pill-btn ${
                      lyricsMode === 'synced' ? 'nocturne-lyrics-modal__pill-btn--active' : ''
                    }`}
                    onClick={() => {
                      setLyricsMode((prev) => (prev === 'synced' ? 'plain' : 'synced'));
                      setIsUserScrolling(false);
                    }}
                    title="Toggle Synchronized / Plain display"
                  >
                    <Sparkles size={12} />
                    <span>{lyricsMode === 'synced' ? 'Synced' : 'Plain'}</span>
                  </button>
                )}

                <button
                  type="button"
                  className="nocturne-lyrics-modal__pill-btn"
                  onClick={() => setFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'))}
                  title="Toggle typography size"
                >
                  <AlignLeft size={12} />
                  <span>{fontSize === 'normal' ? 'Standard' : 'Large'}</span>
                </button>
              </>
            )}

            <IconButton
              variant="ghost"
              size="md"
              onClick={closeLyrics}
              aria-label="Close lyrics screen"
            >
              <X size={20} />
            </IconButton>
          </div>
        </header>

        {/* ==================== CONTENT BODY ==================== */}
        <main className="nocturne-lyrics-modal__content">
          {/* TAB 1: LYRICS */}
          {lyricsTab === 'lyrics' && (
            <>
              {lyricsState === 'loading' && (
                <div className="nocturne-lyrics-state--loading">
                  <div className="nocturne-lyrics-state__pulse-spinner" />
                  <span className="nocturne-lyrics-state__loading-text">
                    Deciphering lyrical resonance...
                  </span>
                </div>
              )}

              {lyricsState === 'error' && (
                <div className="nocturne-lyrics-state--error">
                  <AlertCircle size={40} color="var(--indicator-error)" />
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-high)' }}>
                    Unable to Retrieve Lyrics
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-medium)' }}>
                    A celestial disruption prevented lyric decoding for this composition.
                  </p>
                  <button
                    type="button"
                    className="nocturne-lyrics-modal__pill-btn"
                    onClick={() => setSimulatedState('available')}
                    style={{ marginTop: 8 }}
                  >
                    Retry Analysis
                  </button>
                </div>
              )}

              {lyricsState === 'not_available' && (
                <div className="nocturne-lyrics-state--not-available">
                  <div className="nocturne-lyrics-state__icon-wrap">
                    <Music size={36} />
                  </div>
                  <h3 className="nocturne-lyrics-state__title">
                    Lyrics aren't available for this track yet.
                  </h3>
                  <p className="nocturne-lyrics-state__desc">
                    Immerse in the instrumental passage of "{currentTrack.title}" by {currentTrack.artist}.
                    Sanctuary scribes have not yet transcribed this ritual sequence.
                  </p>
                </div>
              )}

              {lyricsState === 'available' && (
                <div
                  className="nocturne-lyrics-scroll-container"
                  ref={scrollContainerRef}
                  onScroll={handleContainerScroll}
                  onWheel={handleUserWheelOrTouch}
                  onTouchMove={handleUserWheelOrTouch}
                >
                  {lyricsMode === 'synced' && syncedLyrics.length > 0 ? (
                    <div className="nocturne-lyrics-list">
                      {syncedLyrics.map((line, idx) => {
                        const isCurrent = idx === activeLineIndex;
                        const isPast = activeLineIndex !== -1 && idx < activeLineIndex;

                        return (
                          <div
                            key={idx}
                            ref={isCurrent ? activeLineRef : null}
                            className={`nocturne-lyrics__line ${
                              isCurrent
                                ? 'nocturne-lyrics__line--active'
                                : isPast
                                ? 'nocturne-lyrics__line--past'
                                : 'nocturne-lyrics__line--future'
                            }`}
                            style={{
                              fontSize: fontSize === 'large' ? (isCurrent ? 36 : 28) : (isCurrent ? 30 : 23),
                            }}
                            onClick={() => {
                              seek(line.time);
                              if (!isPlaying) {
                                togglePlayPause();
                              }
                              setIsUserScrolling(false);
                            }}
                          >
                            <span>{line.text}</span>
                            <span className="nocturne-lyrics__line-time">
                              {formatDuration(line.time)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className="nocturne-lyrics-plain-container"
                      style={{ fontSize: fontSize === 'large' ? '24px' : '19px' }}
                    >
                      {plainLyrics || 'No plain lyrics text recorded for this track.'}
                    </div>
                  )}

                  {/* Floating 'Return to current line' button */}
                  {isUserScrolling && lyricsMode === 'synced' && (
                    <button
                      type="button"
                      className="nocturne-lyrics-modal__sync-pill"
                      onClick={handleReturnToCurrentLine}
                    >
                      <RotateCcw size={14} />
                      <span>Return to current line</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* TAB 2: SONG INFO */}
          {lyricsTab === 'info' && (
            <div className="nocturne-song-info-container">
              <div className="nocturne-song-info__hero">
                {artworkUrl && !artLoadFailed ? (
                  <img
                    src={artworkUrl}
                    alt={currentTrack.title || 'Composition artwork'}
                    className="nocturne-song-info__art-large"
                    onError={() => setArtFailedTrackId(currentTrack.id)}
                  />
                ) : (
                  <div
                    className="nocturne-song-info__art-large"
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Music size={64} color="var(--accent-secondary)" />
                  </div>
                )}

                <div className="nocturne-song-info__details">
                  <span className="nocturne-song-info__badge">{currentTrack.genre || 'Sanctuary Frequency'}</span>
                  <h2 className="nocturne-song-info__track-name">{currentTrack.title || 'Untitled Composition'}</h2>
                  <span className="nocturne-song-info__artist-link">{currentTrack.artist || 'Unknown Resonance'}</span>
                  <span className="nocturne-song-info__album-name">
                    Album: {currentTrack.album || 'Nocturne Archive'} {currentTrack.trackNumber ? `• Track #${currentTrack.trackNumber}` : ''}
                  </span>
                </div>
              </div>

              {/* Audio Signal Fidelity Grid */}
              <div className="nocturne-song-info__grid">
                <div className="nocturne-song-info__card">
                  <span className="nocturne-song-info__card-label">Encoding Fidelity</span>
                  <span className="nocturne-song-info__card-val">
                    {currentTrack.bitrate || '24-bit / 96kHz Lossless FLAC'}
                  </span>
                </div>

                <div className="nocturne-song-info__card">
                  <span className="nocturne-song-info__card-label">Duration</span>
                  <span className="nocturne-song-info__card-val">
                    {formatDuration(currentTrack.duration)}
                  </span>
                </div>

                <div className="nocturne-song-info__card">
                  <span className="nocturne-song-info__card-label">Sanctuary Plays</span>
                  <span className="nocturne-song-info__card-val">
                    {currentTrack.playCount ? currentTrack.playCount.toLocaleString() : '842,100'}
                  </span>
                </div>

                <div className="nocturne-song-info__card">
                  <span className="nocturne-song-info__card-label">Release Date</span>
                  <span className="nocturne-song-info__card-val">{currentTrack.releaseDate}</span>
                </div>

                <div className="nocturne-song-info__card">
                  <span className="nocturne-song-info__card-label">Atmosphere / Vibe</span>
                  <span className="nocturne-song-info__card-val">
                    {currentTrack.vibe || 'Midnight Gothic Darkwave'}
                  </span>
                </div>

                <div className="nocturne-song-info__card">
                  <span className="nocturne-song-info__card-label">Dynamic Headroom</span>
                  <span className="nocturne-song-info__card-val">14.2 LUFS (Uncompressed)</span>
                </div>
              </div>

              <div className="nocturne-song-info__lore">
                "Preserved in the Nocturne Sanctuary archives. Engineered with uncompressed analog harmonic
                presence to induce subterranean meditative reverie without perceptual fatigue."
              </div>
            </div>
          )}

          {/* TAB 3: CREDITS */}
          {lyricsTab === 'credits' && (
            <div className="nocturne-credits-container">
              <div className="nocturne-credits__header">
                <h2 className="nocturne-credits__title">{currentTrack.title}</h2>
                <span className="nocturne-credits__subtitle">
                  Composition and production lineage recorded in Nocturne Archive Registry
                </span>
              </div>

              {/* Performers */}
              <div className="nocturne-credits__section">
                <div className="nocturne-credits__section-title">Performers & Musicians</div>
                <div className="nocturne-credits__list">
                  {currentTrack.credits?.performers ? (
                    currentTrack.credits.performers.map((p, idx) => (
                      <div key={idx} className="nocturne-credits__item">
                        <span className="nocturne-credits__name">{p}</span>
                        <span className="nocturne-credits__role">Performer</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="nocturne-credits__item">
                        <span className="nocturne-credits__name">{currentTrack.artist}</span>
                        <span className="nocturne-credits__role">Lead Artist & Instrumentation</span>
                      </div>
                      <div className="nocturne-credits__item">
                        <span className="nocturne-credits__name">Nocturne Sanctuary Chamber Players</span>
                        <span className="nocturne-credits__role">Strings & Ambient Texture</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Writers & Composers */}
              <div className="nocturne-credits__section">
                <div className="nocturne-credits__section-title">Songwriting & Composition</div>
                <div className="nocturne-credits__list">
                  {currentTrack.credits?.composers ? (
                    currentTrack.credits.composers.map((c, idx) => (
                      <div key={idx} className="nocturne-credits__item">
                        <span className="nocturne-credits__name">{c}</span>
                        <span className="nocturne-credits__role">Composer</span>
                      </div>
                    ))
                  ) : (
                    <div className="nocturne-credits__item">
                      <span className="nocturne-credits__name">{currentTrack.artist}</span>
                      <span className="nocturne-credits__role">Original Composer</span>
                    </div>
                  )}

                  {currentTrack.credits?.lyricists &&
                    currentTrack.credits.lyricists.map((l, idx) => (
                      <div key={`lyr-${idx}`} className="nocturne-credits__item">
                        <span className="nocturne-credits__name">{l}</span>
                        <span className="nocturne-credits__role">Lyricist</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Production & Engineering */}
              <div className="nocturne-credits__section">
                <div className="nocturne-credits__section-title">Production & Sound Engineering</div>
                <div className="nocturne-credits__list">
                  <div className="nocturne-credits__item">
                    <span className="nocturne-credits__name">
                      {currentTrack.credits?.producers?.[0] || 'Nocturne Sonic Guild'}
                    </span>
                    <span className="nocturne-credits__role">Producer</span>
                  </div>
                  <div className="nocturne-credits__item">
                    <span className="nocturne-credits__name">
                      {currentTrack.credits?.mixedBy?.[0] || 'Julian Mercer at Obsidian Labs'}
                    </span>
                    <span className="nocturne-credits__role">Mix Engineer</span>
                  </div>
                  <div className="nocturne-credits__item">
                    <span className="nocturne-credits__name">
                      {currentTrack.credits?.masteredBy?.[0] || 'Evelyn Thorne at Abbey Dark Studios'}
                    </span>
                    <span className="nocturne-credits__role">Mastering Engineer</span>
                  </div>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="nocturne-credits__legal">
                <p style={{ margin: '0 0 6px 0' }}>
                  {currentTrack.credits?.copyrightNotice ||
                    `© 2024-2025 Nocturne Sanctuary Records. Original fictional demo music composition.`}
                </p>
                <p style={{ margin: 0 }}>
                  Catalog Record: NOC-{currentTrack.id.toUpperCase()} • ISRC: QM-NOC-25-00
                  {currentTrack.trackNumber}
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ==================== BOTTOM PLAYBACK CONTROLS ==================== */}
        <footer className="nocturne-lyrics-modal__player-bar">
          <div className="nocturne-lyrics-modal__player-controls">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={previousTrack}
              aria-label="Previous track"
            >
              <SkipBack size={18} />
            </IconButton>

            <button
              type="button"
              className="nocturne-player__btn-play"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#ffffff',
                border: 'none',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>

            <IconButton
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </IconButton>
          </div>

          <div className="nocturne-lyrics-modal__progress-wrap">
            <span className="nocturne-lyrics-modal__time">{formatDuration(currentTime)}</span>
            <Slider
              value={currentTime}
              min={0}
              max={duration || 1}
              step={0.1}
              onChange={(newVal) => seek(newVal)}
              aria-label="Playback track scrubber"
            />
            <span className="nocturne-lyrics-modal__time">{formatDuration(duration)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 140 }}>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </IconButton>
            <Slider
              value={muted ? 0 : Math.round(volume * 100)}
              min={0}
              max={100}
              step={1}
              onChange={(val) => setVolume(val / 100)}
              aria-label="Volume level"
            />
          </div>
        </footer>
      </div>
    </div>
  );
};
