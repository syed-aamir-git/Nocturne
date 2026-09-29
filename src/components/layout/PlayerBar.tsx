import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  PanelRight,
  ListMusic,
  Music,
  Loader2,
  AlertCircle,
  Mic2,
  Sliders,
  Maximize2,
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
import './PlayerBar.css';

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeatMode,
    queue,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    isCrossfading,
  } = usePlayer();

  const {
    rightPanelOpen,
    toggleRightPanel,
    openRightPanel,
    isLyricsOpen,
    toggleLyrics,
    openNowPlaying,
  } = useUI();
  const { isEqualizerOpen, toggleEqualizer } = useAudioSettings();
  const { isLiked, toggleLike } = useLibrary();
  const { showToast } = useToast();
  const [imgError, setImgError] = useState(false);
  const [displayTime, setDisplayTime] = useState<number | null>(null);

  const handlePlayerBarClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('.nocturne-slider')
    ) {
      return;
    }
    // On mobile viewports, tapping anywhere on the player bar including track title opens Now Playing
    if (window.innerWidth <= 768 && target.closest('a')) {
      e.preventDefault();
      openNowPlaying('artwork');
      return;
    }
    if (target.closest('a')) {
      return;
    }
    openNowPlaying('artwork');
  };

  const handleScrubChange = (value: number) => {
    setDisplayTime(value);
  };

  const handleScrubEnd = (value: number) => {
    setDisplayTime(null);
    seek(value);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val / 100);
  };

  const handleQueueClick = () => {
    openRightPanel('queue');
  };

  if (!currentTrack) {
    return (
      <div className="nocturne-player-bar">
        <div className="nocturne-player__track">
          <span style={{ color: 'var(--text-low)', fontSize: '13px', fontStyle: 'italic' }}>
            No tracks in the nocturnal chamber
          </span>
        </div>
      </div>
    );
  }

  const effectiveTime = displayTime !== null ? displayTime : currentTime;
  const coverSrc = currentTrack.artwork || currentTrack.coverUrl || '';
  const progressPercentage = duration > 0 ? (effectiveTime / duration) * 100 : 0;

  return (
    <div
      className="nocturne-player-bar"
      role="region"
      aria-label="Audio Player"
      onClick={handlePlayerBarClick}
    >
      {/* Mobile Top Slim Progress Indicator */}
      <div className="nocturne-player__mini-progress-bar" aria-hidden="true">
        <div
          className="nocturne-player__mini-progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Left: Track Information */}
      <div className="nocturne-player__track">
        <div
          className="nocturne-player__cover-wrap"
          onClick={() => openNowPlaying('artwork')}
          style={{ cursor: 'pointer' }}
          title="Open Now Playing"
        >
          {!imgError && coverSrc ? (
            <img
              src={coverSrc}
              alt={currentTrack.title}
              className="nocturne-player__cover"
              onError={() => setImgError(true)}
              loading="lazy"
              decoding="async"
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
              <Music size={20} color="var(--accent-secondary)" />
            </div>
          )}
        </div>

        <div className="nocturne-player__meta">
          <Link
            to={`/album/${currentTrack.albumId}`}
            className="nocturne-player__title"
            title={currentTrack.title}
            style={{ textDecoration: 'none' }}
          >
            {currentTrack.title}
          </Link>
          <Link
            to={`/artist/${currentTrack.artistId}`}
            className="nocturne-player__artist"
            title={currentTrack.artist}
            style={{ textDecoration: 'none' }}
          >
            {currentTrack.artist}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="nocturne-player__badge">
              {currentTrack.bitrate || '24-bit / 96kHz FLAC'}
            </span>
            {isCrossfading && (
              <span
                className="nocturne-player__badge"
                style={{
                  background: 'rgba(147, 51, 234, 0.25)',
                  color: 'var(--accent-secondary)',
                  border: '1px solid var(--accent-primary)',
                }}
              >
                Crossfading
              </span>
            )}
            {error && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: '9.5px',
                  color: 'var(--indicator-error, #ff6b6b)',
                }}
                title={error}
              >
                <AlertCircle size={10} /> Stream Warning
              </span>
            )}
          </div>
        </div>

        <Tooltip
          content={isLiked(currentTrack.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          position="top"
        >
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={isLiked(currentTrack.id) ? 'Remove from favorites' : 'Add to favorites'}
            style={isLiked(currentTrack.id) ? { color: 'var(--accent-primary)' } : undefined}
            onClick={(e) => {
              e.stopPropagation();
              const next = toggleLike(currentTrack);
              showToast(
                next ? 'Anchored to Liked Songs' : 'Removed from Liked Songs',
                currentTrack.title,
                'default'
              );
            }}
          >
            <Heart
              size={15}
              fill={isLiked(currentTrack.id) ? 'var(--accent-primary)' : 'none'}
            />
          </IconButton>
        </Tooltip>
      </div>

      {/* Center: Controls & Scrubber */}
      <div className="nocturne-player__center">
        <div className="nocturne-player__controls">
          <Tooltip content={shuffle ? 'Shuffle Active' : 'Shuffle Inactive (Press S)'} position="top">
            <IconButton
              variant="ghost"
              size="sm"
              active={shuffle}
              onClick={(e) => {
                e.stopPropagation();
                toggleShuffle();
              }}
              aria-label="Toggle shuffle"
              className="nocturne-player__btn-shuffle"
            >
              <Shuffle size={15} />
            </IconButton>
          </Tooltip>

          <Tooltip content="Previous track" position="top">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                previousTrack();
              }}
              aria-label="Previous track"
              className="nocturne-player__btn-prev"
            >
              <SkipBack size={17} />
            </IconButton>
          </Tooltip>

          <button
            type="button"
            className={`nocturne-player__play-btn ${isLoading ? 'nocturne-player__play-btn--loading' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" style={{ marginLeft: 2 }} />
            )}
          </button>

          <Tooltip content="Next track" position="top">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                nextTrack();
              }}
              aria-label="Next track"
              className="nocturne-player__btn-next"
            >
              <SkipForward size={17} />
            </IconButton>
          </Tooltip>

          <Tooltip content={`Repeat: ${repeatMode} (Press R)`} position="top">
            <IconButton
              variant="ghost"
              size="sm"
              active={repeatMode !== 'off'}
              onClick={(e) => {
                e.stopPropagation();
                cycleRepeatMode();
              }}
              aria-label="Cycle repeat mode"
              className="nocturne-player__btn-repeat"
            >
              {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
            </IconButton>
          </Tooltip>
        </div>

        {/* Scrubber slider */}
        <div className="nocturne-player__scrubber">
          <span className="nocturne-player__time">{formatDuration(effectiveTime)}</span>
          <Slider
            value={effectiveTime}
            min={0}
            max={duration || 100}
            step={1}
            onChange={handleScrubChange}
            onChangeEnd={handleScrubEnd}
            aria-label="Track progress (Arrow keys to seek)"
          />
          <span className="nocturne-player__time">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Right: Volume, Lyrics, Queue, & Details Panel */}
      <div className="nocturne-player__right">
        {/* Lyrics Button */}
        <Tooltip
          content={
            !currentTrack
              ? 'Select a track to view lyrics & lore'
              : isLyricsOpen
              ? 'Close Lyrics (Press L)'
              : 'Lyrics & Lore (Press L)'
          }
          position="top"
        >
          <IconButton
            variant="ghost"
            size="sm"
            active={isLyricsOpen}
            onClick={toggleLyrics}
            aria-label="Toggle Lyrics & Lore"
            disabled={!currentTrack}
          >
            <Mic2 size={16} />
          </IconButton>
        </Tooltip>

        {/* Equalizer & Audio Processing Button */}
        <Tooltip
          content={isEqualizerOpen ? 'Close Equalizer (Press E)' : 'Equalizer & DSP (Press E)'}
          position="top"
        >
          <IconButton
            variant="ghost"
            size="sm"
            active={isEqualizerOpen}
            onClick={toggleEqualizer}
            aria-label="Toggle Equalizer"
          >
            <Sliders size={16} />
          </IconButton>
        </Tooltip>

        {/* Queue Button */}
        <Tooltip content={`Playback Queue (${queue.length} tracks)`} position="top">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={handleQueueClick}
            aria-label="Open playback queue"
          >
            <ListMusic size={16} />
          </IconButton>
        </Tooltip>

        {/* Volume controls */}
        <div className="nocturne-player__volume">
          <Tooltip content={muted ? 'Unmute (Press M)' : 'Mute (Press M)'} position="top">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </IconButton>
          </Tooltip>
          <Slider
            value={muted ? 0 : Math.round(volume * 100)}
            min={0}
            max={100}
            step={1}
            onChange={handleVolumeChange}
            aria-label="Audio Volume"
          />
        </div>

        {/* Inspector Panel Toggle */}
        <Tooltip content="Now Playing Sanctum Details" position="top">
          <IconButton
            variant="ghost"
            size="sm"
            active={rightPanelOpen}
            onClick={toggleRightPanel}
            aria-label="Toggle details panel"
          >
            <PanelRight size={16} />
          </IconButton>
        </Tooltip>

        {/* Full-Screen Now Playing Centerpiece */}
        <Tooltip content="Open Full-Screen Now Playing (Press N)" position="top">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => openNowPlaying('artwork')}
            aria-label="Open Full-Screen Now Playing"
          >
            <Maximize2 size={16} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
