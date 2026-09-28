import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Sliders,
  Settings as SettingsIcon,
  Mic2,
  ListMusic,
  Info,
  ScrollText,
  Music,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import { usePlayer } from '../../state/PlayerContext';
import { useLibrary } from '../../state/LibraryContext';
import { useUI } from '../../state/UIContext';
import { useAudioSettings } from '../../state/AudioSettingsContext';
import { useToast } from '../../state/ToastContext';
import { formatDuration } from '../../utilities/formatters';
import { Slider } from '../primitives/Slider';
import { IconButton } from '../primitives/IconButton';
import { Tooltip } from '../primitives/Tooltip';
import type { SyncedLyricLine } from '../../types';
import type { AudioQuality } from '../../types/audio';
import { CROSSFADE_OPTIONS } from '../../types/audio';
import './NowPlayingModal.css';

export const NowPlayingModal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    volume,
    setVolume,
    muted,
    toggleMute,
    shuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    queue,
    queueIndex,
    playQueueIndex,
    removeFromQueue,
    clearQueue,
    isCrossfading,
  } = usePlayer();

  const { isLiked, toggleLike } = useLibrary();
  const { isNowPlayingOpen, closeNowPlaying, nowPlayingTab, setNowPlayingTab } = useUI();
  const {
    openEqualizer,
    isEqualizerOpen,
    audioQuality,
    setAudioQuality,
    volumeNormalization,
    setVolumeNormalization,
    playbackRate,
    setPlaybackRate,
    crossfadeDuration,
    setCrossfadeDuration,
    autoplay,
    setAutoplay,
  } = useAudioSettings();
  const { showToast } = useToast();

  const [displayTime, setDisplayTime] = useState<number | null>(null);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isUserScrollingLyrics, setIsUserScrollingLyrics] = useState(false);
  const [imgErrorTrackId, setImgErrorTrackId] = useState<string | null>(null);
  const imgError = Boolean(currentTrack && imgErrorTrackId === currentTrack.id);

  const coverSrc = currentTrack?.artwork || currentTrack?.coverUrl || '';
  const [bgCurrent, setBgCurrent] = useState<string>(coverSrc);
  const [bgPrevious, setBgPrevious] = useState<string | null>(null);
  const [isCrossfadingBg, setIsCrossfadingBg] = useState(false);

  const activeLyricRef = useRef<HTMLDivElement | null>(null);
  const userScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const headerTouchStartY = useRef<number | null>(null);
  const audioDrawerRef = useRef<HTMLDivElement | null>(null);
  const settingsBtnRef = useRef<HTMLDivElement | null>(null);

  // Smooth atmospheric background crossfade when song changes
  useEffect(() => {
    if (coverSrc && coverSrc !== bgCurrent) {
      const raf = requestAnimationFrame(() => {
        setBgPrevious(bgCurrent);
        setBgCurrent(coverSrc);
        setIsCrossfadingBg(true);
      });
      const timer = setTimeout(() => {
        setIsCrossfadingBg(false);
        setBgPrevious(null);
      }, 700);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    } else if (!bgCurrent && coverSrc) {
      const raf = requestAnimationFrame(() => setBgCurrent(coverSrc));
      return () => cancelAnimationFrame(raf);
    }
  }, [coverSrc, bgCurrent]);

  // Click outside to dismiss audio settings popover
  useEffect(() => {
    if (!showAudioSettings) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        audioDrawerRef.current &&
        !audioDrawerRef.current.contains(target) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(target)
      ) {
        setShowAudioSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAudioSettings]);

  // Synced lyrics extraction & active line calculation
  const syncedLyrics: SyncedLyricLine[] = useMemo(() => {
    return currentTrack?.syncedLyrics || [];
  }, [currentTrack]);

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

  // Auto-scroll lyrics to active line
  useEffect(() => {
    if (nowPlayingTab !== 'lyrics' || isUserScrollingLyrics) return;
    if (activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, nowPlayingTab, isUserScrollingLyrics]);

  // Global key bindings when Now Playing is open
  useEffect(() => {
    if (!isNowPlayingOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'Escape') {
        if (isEqualizerOpen) {
          // Let EqualizerModal close itself
          return;
        }
        if (showAudioSettings) {
          e.preventDefault();
          setShowAudioSettings(false);
          return;
        }
        e.preventDefault();
        closeNowPlaying();
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        nextTrack();
      } else if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        previousTrack();
      } else if (e.key === 'ArrowRight' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        seek(Math.min(duration, currentTime + 5));
      } else if (e.key === 'ArrowLeft' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.key === 'ArrowUp' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.05));
      } else if (e.key === 'ArrowDown' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.05));
      } else if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          setNowPlayingTab(nowPlayingTab === 'lyrics' ? 'artwork' : 'lyrics');
        } else if (e.key === 'q' || e.key === 'Q') {
          e.preventDefault();
          setNowPlayingTab(nowPlayingTab === 'queue' ? 'artwork' : 'queue');
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          setNowPlayingTab(nowPlayingTab === 'info' ? 'artwork' : 'info');
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          setNowPlayingTab(nowPlayingTab === 'credits' ? 'artwork' : 'credits');
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setNowPlayingTab('artwork');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isNowPlayingOpen,
    isEqualizerOpen,
    showAudioSettings,
    closeNowPlaying,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    currentTime,
    duration,
    volume,
    setVolume,
    nowPlayingTab,
    setNowPlayingTab,
  ]);

  // Mobile swipe gestures
  const handleArtworkTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleArtworkTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe on artwork to skip tracks
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        nextTrack();
        showToast('Next Track', '', 'default');
      } else {
        previousTrack();
        showToast('Previous Track', '', 'default');
      }
    } else if (deltaY > 60 && Math.abs(deltaY) > Math.abs(deltaX) * 1.4) {
      // Vertical swipe down on artwork to dismiss Now Playing
      closeNowPlaying();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    headerTouchStartY.current = e.touches[0].clientY;
  };

  const handleHeaderTouchEnd = (e: React.TouchEvent) => {
    if (headerTouchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - headerTouchStartY.current;
    if (deltaY > 50) {
      closeNowPlaying();
    }
    headerTouchStartY.current = null;
  };

  if (!isNowPlayingOpen || !currentTrack) return null;

  const effectiveTime = displayTime !== null ? displayTime : currentTime;
  const currentLyricSnippet =
    activeLineIndex >= 0 && syncedLyrics[activeLineIndex]
      ? syncedLyrics[activeLineIndex].text
      : currentTrack.lyrics?.split('\n').filter(Boolean)[0] || null;

  return (
    <div
      className="nocturne-nowplaying"
      role="dialog"
      aria-modal="true"
      aria-label="Now Playing Centerpiece"
    >
      {/* Subtle Visual Atmosphere Backdrop Layer (Dual layer crossfade) */}
      {bgPrevious && !imgError && (
        <div
          className="nocturne-nowplaying__backdrop"
          style={{ backgroundImage: `url(${bgPrevious})` }}
        />
      )}
      <div
        className={`nocturne-nowplaying__backdrop ${
          isCrossfadingBg ? 'nocturne-nowplaying__backdrop--crossfade' : ''
        }`}
        style={{
          backgroundImage: !imgError && bgCurrent ? `url(${bgCurrent})` : undefined,
        }}
      />
      <div className="nocturne-nowplaying__vignette" />

      {/* Main Container */}
      <div className="nocturne-nowplaying__container">
        {/* Top Header */}
        <header
          className="nocturne-nowplaying__header"
          onTouchStart={handleHeaderTouchStart}
          onTouchEnd={handleHeaderTouchEnd}
        >
          <IconButton
            variant="ghost"
            size="md"
            onClick={closeNowPlaying}
            aria-label="Collapse Now Playing"
            title="Collapse (Esc)"
          >
            <ChevronDown size={24} />
          </IconButton>

          <div className="nocturne-nowplaying__context">
            <span className="nocturne-nowplaying__swipe-handle" />
            <span className="nocturne-nowplaying__context-eyebrow">
              {currentTrack.album ? `PLAYING FROM ${currentTrack.album.toUpperCase()}` : 'NOW PLAYING'}
            </span>
            <span className="nocturne-nowplaying__context-title">
              {currentTrack.title}
            </span>
          </div>

          <div className="nocturne-nowplaying__header-actions">
            <Tooltip content="Equalizer & DSP" position="bottom">
              <IconButton
                variant="ghost"
                size="md"
                onClick={openEqualizer}
                aria-label="Open Equalizer"
              >
                <Sliders size={18} />
              </IconButton>
            </Tooltip>

            <div ref={settingsBtnRef}>
              <Tooltip content="Audio Pipeline Settings" position="bottom">
                <IconButton
                  variant="ghost"
                  size="md"
                  active={showAudioSettings}
                  onClick={() => setShowAudioSettings(!showAudioSettings)}
                  aria-label="Toggle Audio Settings"
                >
                  <SettingsIcon size={18} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* Audio Settings Popover/Drawer */}
        {showAudioSettings && (
          <div ref={audioDrawerRef} className="nocturne-nowplaying__audio-drawer">
            <div className="nocturne-nowplaying__audio-drawer-header">
              <span>Audio Pipeline Controls</span>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setShowAudioSettings(false)}
                aria-label="Close settings"
              >
                <X size={15} />
              </IconButton>
            </div>

            {/* Quality Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                STREAM RESOLUTION
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {(['lossless', 'high', 'standard', 'saver'] as AudioQuality[]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setAudioQuality(q);
                      showToast('Resolution Set', q.toUpperCase(), 'atmosphere');
                    }}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-xs)',
                      background: audioQuality === q ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                      color: audioQuality === q ? 'var(--accent-contrast)' : 'var(--text-medium)',
                      border: 'none',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                      fontWeight: audioQuality === q ? 600 : 400,
                    }}
                  >
                    {q.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Crossfade */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                CROSSFADE: {crossfadeDuration === 0 ? 'OFF' : `${crossfadeDuration}S`}
              </span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {CROSSFADE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCrossfadeDuration(opt.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: crossfadeDuration === opt.value ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
                      color: crossfadeDuration === opt.value ? 'var(--accent-contrast)' : 'var(--text-medium)',
                      border: 'none',
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Normalization & Autoplay */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-medium)' }}>Dynamics Compressor</span>
              <button
                type="button"
                onClick={() => setVolumeNormalization(!volumeNormalization)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: volumeNormalization ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: volumeNormalization ? 'var(--indicator-success)' : 'var(--text-low)',
                  border: `1px solid ${volumeNormalization ? 'rgba(52, 211, 153, 0.4)' : 'var(--border-subtle)'}`,
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                {volumeNormalization ? 'ACTIVE' : 'BYPASS'}
              </button>
            </div>

            {/* Continuous Autoplay */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-medium)' }}>Continuous Autoplay</span>
              <button
                type="button"
                onClick={() => setAutoplay(!autoplay)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: autoplay ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: autoplay ? 'var(--accent-secondary)' : 'var(--text-low)',
                  border: `1px solid ${autoplay ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                {autoplay ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Playback Velocity */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-medium)' }}>Velocity Tempo</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0.8, 1.0, 1.2].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPlaybackRate(r)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: playbackRate === r ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                      color: playbackRate === r ? 'var(--accent-contrast)' : 'var(--text-medium)',
                      border: 'none',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Viewport Navigation Tabs */}
        <div className="nocturne-nowplaying__tabs">
          <button
            type="button"
            className={`nocturne-nowplaying__tab-btn ${
              nowPlayingTab === 'artwork' ? 'nocturne-nowplaying__tab-btn--active' : ''
            }`}
            onClick={() => setNowPlayingTab('artwork')}
          >
            <Music size={14} />
            <span>Artwork</span>
          </button>

          <button
            type="button"
            className={`nocturne-nowplaying__tab-btn ${
              nowPlayingTab === 'lyrics' ? 'nocturne-nowplaying__tab-btn--active' : ''
            }`}
            onClick={() => setNowPlayingTab('lyrics')}
          >
            <Mic2 size={14} />
            <span>Lyrics</span>
            {syncedLyrics.length > 0 && <span className="nocturne-nowplaying__tab-badge">SYNC</span>}
          </button>

          <button
            type="button"
            className={`nocturne-nowplaying__tab-btn ${
              nowPlayingTab === 'queue' ? 'nocturne-nowplaying__tab-btn--active' : ''
            }`}
            onClick={() => setNowPlayingTab('queue')}
          >
            <ListMusic size={14} />
            <span>Queue</span>
            <span className="nocturne-nowplaying__tab-badge">{queue.length}</span>
          </button>

          <button
            type="button"
            className={`nocturne-nowplaying__tab-btn ${
              nowPlayingTab === 'info' ? 'nocturne-nowplaying__tab-btn--active' : ''
            }`}
            onClick={() => setNowPlayingTab('info')}
          >
            <Info size={14} />
            <span>Info</span>
          </button>

          <button
            type="button"
            className={`nocturne-nowplaying__tab-btn ${
              nowPlayingTab === 'credits' ? 'nocturne-nowplaying__tab-btn--active' : ''
            }`}
            onClick={() => setNowPlayingTab('credits')}
          >
            <ScrollText size={14} />
            <span>Credits</span>
          </button>
        </div>

        {/* Central Viewport Content */}
        <div className="nocturne-nowplaying__viewport">
          {/* TAB 1: ARTWORK CENTERPIECE */}
          {nowPlayingTab === 'artwork' && (
            <div
              className="nocturne-nowplaying__artwork-panel"
              onTouchStart={handleArtworkTouchStart}
              onTouchEnd={handleArtworkTouchEnd}
            >
              <div className="nocturne-nowplaying__hero-art-wrap">
                {!imgError && coverSrc ? (
                  <img
                    key={currentTrack.id}
                    src={coverSrc}
                    alt={currentTrack.title}
                    className="nocturne-nowplaying__hero-art"
                    onError={() => setImgErrorTrackId(currentTrack.id)}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--bg-surface-elevated)',
                    }}
                  >
                    <Music size={64} color="var(--accent-primary)" />
                  </div>
                )}
              </div>

              {/* Synchronized Lyrics Live Teaser Pill */}
              {currentLyricSnippet && (
                <div
                  className="nocturne-nowplaying__lyrics-teaser"
                  onClick={() => setNowPlayingTab('lyrics')}
                  title="Expand full lyrics"
                >
                  <Sparkles size={16} className="nocturne-nowplaying__lyrics-teaser-icon" />
                  <span className="nocturne-nowplaying__lyrics-teaser-text">
                    "{currentLyricSnippet}"
                  </span>
                  <span className="nocturne-nowplaying__lyrics-teaser-action">View Lyrics →</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SYNCHRONIZED LYRICS */}
          {nowPlayingTab === 'lyrics' && (
            <div
              className="nocturne-nowplaying__panel nocturne-nowplaying__lyrics-panel"
              onScroll={() => {
                setIsUserScrollingLyrics(true);
                if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
                userScrollTimeoutRef.current = setTimeout(() => {
                  setIsUserScrollingLyrics(false);
                }, 3000);
              }}
            >
              <div className="nocturne-nowplaying__lyrics-toolbar">
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                  {syncedLyrics.length > 0 ? 'SYNCHRONIZED TIMING • TAP LINE TO JUMP' : 'PLAIN LYRICS'}
                </span>
                {isUserScrollingLyrics && syncedLyrics.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserScrollingLyrics(false);
                      if (activeLyricRef.current) {
                        activeLyricRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--accent-primary)',
                      color: 'var(--accent-contrast)',
                      border: 'none',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                  >
                    Return to Current Line
                  </button>
                )}
              </div>

              {syncedLyrics.length > 0 ? (
                <div className="nocturne-nowplaying__lyrics-list">
                  {syncedLyrics.map((line, idx) => {
                    const isActive = idx === activeLineIndex;
                    return (
                      <div
                        key={`${line.time}-${idx}`}
                        ref={isActive ? activeLyricRef : undefined}
                        onClick={() => seek(line.time)}
                        className={`nocturne-nowplaying__lyric-line ${
                          isActive ? 'nocturne-nowplaying__lyric-line--active' : ''
                        }`}
                      >
                        {line.text}
                      </div>
                    );
                  })}
                </div>
              ) : currentTrack.lyrics ? (
                <div className="nocturne-nowplaying__plain-lyrics">
                  {currentTrack.lyrics}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-low)' }}>
                  <Mic2 size={36} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', margin: 0 }}>
                    Lyrics aren't available for this track yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLAYBACK QUEUE */}
          {nowPlayingTab === 'queue' && (
            <div className="nocturne-nowplaying__panel nocturne-nowplaying__queue-panel">
              <div className="nocturne-nowplaying__queue-header">
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
                    Upcoming in Sanctum
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-medium)', marginLeft: 8 }}>
                    ({queue.length} hymns)
                  </span>
                </div>
                {queue.length > 1 && (
                  <button
                    type="button"
                    onClick={clearQueue}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-low)',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Clear Queue</span>
                  </button>
                )}
              </div>

              <div className="nocturne-nowplaying__queue-list">
                {queue.map((track, idx) => {
                  const isCur = idx === queueIndex;
                  return (
                    <div
                      key={`${track.id}-${idx}`}
                      onClick={() => playQueueIndex(idx)}
                      className={`nocturne-nowplaying__queue-item ${
                        isCur ? 'nocturne-nowplaying__queue-item--active' : ''
                      }`}
                    >
                      <img
                        src={track.artwork || track.coverUrl || ''}
                        alt={track.title}
                        className="nocturne-nowplaying__queue-thumb"
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div
                          style={{
                            fontWeight: isCur ? 700 : 500,
                            fontSize: '13.5px',
                            color: isCur ? 'var(--accent-secondary)' : 'var(--text-pure)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {track.title}
                        </div>
                        <div
                          style={{
                            fontSize: '11.5px',
                            color: 'var(--text-medium)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {track.artist}
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                        {formatDuration(track.duration)}
                      </span>
                      {queue.length > 1 && (
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(idx);
                          }}
                          aria-label="Remove from queue"
                        >
                          <X size={14} />
                        </IconButton>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SONG INFORMATION */}
          {nowPlayingTab === 'info' && (
            <div className="nocturne-nowplaying__panel nocturne-nowplaying__info-panel">
              <div className="nocturne-nowplaying__info-card">
                <span className="nocturne-nowplaying__info-label">Audio Fidelity</span>
                <span className="nocturne-nowplaying__info-val">
                  {currentTrack.bitrate || '24-bit / 96kHz FLAC Master'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--indicator-lossless)' }}>
                  Bit-perfect lossless stream
                </span>
              </div>

              <div className="nocturne-nowplaying__info-card">
                <span className="nocturne-nowplaying__info-label">Album Release</span>
                <span className="nocturne-nowplaying__info-val">{currentTrack.album}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-low)' }}>
                  Released: {currentTrack.releaseDate || '2024'}
                </span>
              </div>

              <div className="nocturne-nowplaying__info-card">
                <span className="nocturne-nowplaying__info-label">Genre Atmosphere</span>
                <span className="nocturne-nowplaying__info-val">
                  {currentTrack.genre || 'Atmospheric Drone / Dark Ambient'}
                </span>
              </div>

              <div className="nocturne-nowplaying__info-card">
                <span className="nocturne-nowplaying__info-label">Total Duration</span>
                <span className="nocturne-nowplaying__info-val">
                  {formatDuration(currentTrack.duration)}
                </span>
              </div>

              <div className="nocturne-nowplaying__info-card">
                <span className="nocturne-nowplaying__info-label">Acoustic Tuning</span>
                <span className="nocturne-nowplaying__info-val">D Minor • 72 BPM</span>
                <span style={{ fontSize: '11px', color: 'var(--text-low)' }}>Dynamic Range: DR14</span>
              </div>

              <div className="nocturne-nowplaying__info-card">
                <span className="nocturne-nowplaying__info-label">DSP Equalization</span>
                <span className="nocturne-nowplaying__info-val">Active 7-Band Biquad Filter</span>
                <span style={{ fontSize: '11px', color: 'var(--indicator-success)' }}>
                  Real-time Web Audio curve applied
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: CREDITS */}
          {nowPlayingTab === 'credits' && (
            <div className="nocturne-nowplaying__panel nocturne-nowplaying__credits-panel">
              <div className="nocturne-nowplaying__credit-row">
                <span className="nocturne-nowplaying__credit-role">Primary Performer</span>
                <span className="nocturne-nowplaying__credit-name">{currentTrack.artist}</span>
              </div>

              <div className="nocturne-nowplaying__credit-row">
                <span className="nocturne-nowplaying__credit-role">Composition & Arrangement</span>
                <span className="nocturne-nowplaying__credit-name">Nocturne Acoustic Ensemble</span>
              </div>

              <div className="nocturne-nowplaying__credit-row">
                <span className="nocturne-nowplaying__credit-role">Sound Design & Production</span>
                <span className="nocturne-nowplaying__credit-name">{currentTrack.artist}</span>
              </div>

              <div className="nocturne-nowplaying__credit-row">
                <span className="nocturne-nowplaying__credit-role">Mastering Engineering</span>
                <span className="nocturne-nowplaying__credit-name">Nocturne High-Resolution Labs</span>
              </div>

              <div className="nocturne-nowplaying__credit-row">
                <span className="nocturne-nowplaying__credit-role">Record Label & Publishing</span>
                <span className="nocturne-nowplaying__credit-name">Dark Sanctum Recordings / 24-Bit</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Metadata, Scrubber & Controls */}
        <div className="nocturne-nowplaying__bottom">
          {/* Metadata Row */}
          <div className="nocturne-nowplaying__meta-row">
            <div className="nocturne-nowplaying__title-wrap">
              <h2 className="nocturne-nowplaying__song-title" title={currentTrack.title}>
                {currentTrack.title}
              </h2>
              <div className="nocturne-nowplaying__song-artist">
                <Link
                  to={`/artist/${currentTrack.artistId}`}
                  onClick={closeNowPlaying}
                  style={{ color: 'var(--text-medium)', textDecoration: 'none' }}
                >
                  {currentTrack.artist}
                </Link>
                {currentTrack.album && (
                  <>
                    <span style={{ margin: '0 6px', color: 'var(--text-low)' }}>•</span>
                    <Link
                      to={`/album/${currentTrack.albumId}`}
                      onClick={closeNowPlaying}
                      style={{ color: 'var(--text-low)', textDecoration: 'none' }}
                    >
                      {currentTrack.album}
                    </Link>
                  </>
                )}
              </div>
            </div>

            <Tooltip content={isLiked(currentTrack.id) ? 'Remove Favorite' : 'Save to Favorites'} position="top">
              <IconButton
                variant="ghost"
                size="md"
                style={isLiked(currentTrack.id) ? { color: 'var(--accent-primary)' } : undefined}
                onClick={() => {
                  const next = toggleLike(currentTrack);
                  showToast(
                    next ? 'Anchored to Liked Songs' : 'Removed from Liked Songs',
                    currentTrack.title,
                    'default'
                  );
                }}
                aria-label="Like"
              >
                <Heart size={20} fill={isLiked(currentTrack.id) ? 'var(--accent-primary)' : 'none'} />
              </IconButton>
            </Tooltip>
          </div>

          {/* Progress Scrubber */}
          <div className="nocturne-nowplaying__scrubber-wrap">
            <Slider
              value={effectiveTime}
              min={0}
              max={duration || 100}
              step={1}
              onChange={(val) => setDisplayTime(val)}
              onChangeEnd={(val) => {
                setDisplayTime(null);
                seek(val);
              }}
              aria-label="Track progress slider"
            />
            <div className="nocturne-nowplaying__time-row">
              <span>{formatDuration(effectiveTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Master Playback Controls */}
          <div className="nocturne-nowplaying__controls-row">
            <Tooltip content={shuffle ? 'Shuffle Active' : 'Shuffle Inactive'} position="top">
              <IconButton
                variant="ghost"
                size="md"
                active={shuffle}
                onClick={toggleShuffle}
                aria-label="Shuffle"
              >
                <Shuffle size={18} />
              </IconButton>
            </Tooltip>

            <Tooltip content="Previous Track" position="top">
              <IconButton
                variant="ghost"
                size="lg"
                onClick={previousTrack}
                aria-label="Previous Track"
              >
                <SkipBack size={22} />
              </IconButton>
            </Tooltip>

            <button
              type="button"
              className="nocturne-nowplaying__play-btn"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" style={{ marginLeft: 3 }} />
              )}
            </button>

            <Tooltip content="Next Track" position="top">
              <IconButton
                variant="ghost"
                size="lg"
                onClick={nextTrack}
                aria-label="Next Track"
              >
                <SkipForward size={22} />
              </IconButton>
            </Tooltip>

            <Tooltip content={`Repeat: ${repeatMode}`} position="top">
              <IconButton
                variant="ghost"
                size="md"
                active={repeatMode !== 'off'}
                onClick={cycleRepeatMode}
                aria-label="Repeat"
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </IconButton>
            </Tooltip>
          </div>

          {/* Utility Row: Volume & Quick Controls */}
          <div className="nocturne-nowplaying__util-row">
            <div className="nocturne-nowplaying__volume-bar">
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
                aria-label="Volume slider"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isCrossfading && (
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-secondary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid var(--accent-primary)',
                  }}
                >
                  CROSSFADING
                </span>
              )}
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--indicator-lossless)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                24/96 FLAC
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
