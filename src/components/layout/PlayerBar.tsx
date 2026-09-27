import React from 'react';
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
  ListMusic,
  Maximize2,
} from 'lucide-react';
import { usePlayer } from '../../state/PlayerContext';
import { useToast } from '../../state/ToastContext';
import { formatDuration } from '../../utilities/formatters';
import { Slider } from '../primitives/Slider';
import { IconButton } from '../primitives/IconButton';
import { Tooltip } from '../primitives/Tooltip';
import './PlayerBar.css';

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    status,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
  } = usePlayer();

  const { showToast } = useToast();

  const isPlaying = status === 'playing';

  const handleScrub = (value: number) => {
    seek(value);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val / 100);
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

  return (
    <div className="nocturne-player-bar" role="region" aria-label="Audio Player">
      {/* Left: Track Information */}
      <div className="nocturne-player__track">
        <div className="nocturne-player__cover-wrap">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="nocturne-player__cover"
          />
        </div>

        <div className="nocturne-player__meta">
          <span className="nocturne-player__title" title={currentTrack.title}>
            {currentTrack.title}
          </span>
          <span className="nocturne-player__artist" title={currentTrack.artist}>
            {currentTrack.artist}
          </span>
          <span className="nocturne-player__badge">
            {currentTrack.bitrate || '24-bit / 96kHz FLAC'}
          </span>
        </div>

        <Tooltip content="Preserve in Midnight Collection" position="top">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Add to favorites"
            onClick={() => showToast('Preserved', `Added "${currentTrack.title}" to Midnight Sanctuary`, 'atmosphere')}
          >
            <Heart size={16} />
          </IconButton>
        </Tooltip>
      </div>

      {/* Center: Controls & Scrubber */}
      <div className="nocturne-player__center">
        <div className="nocturne-player__controls">
          <Tooltip content={isShuffle ? 'Shuffle Enabled' : 'Shuffle Disabled'} position="top">
            <IconButton
              variant="ghost"
              size="sm"
              active={isShuffle}
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
            >
              <Shuffle size={16} />
            </IconButton>
          </Tooltip>

          <Tooltip content="Previous track" position="top">
            <IconButton
              variant="ghost"
              size="md"
              onClick={previousTrack}
              aria-label="Previous track"
            >
              <SkipBack size={18} />
            </IconButton>
          </Tooltip>

          <button
            type="button"
            className="nocturne-player__play-btn"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" style={{ marginLeft: 2 }} />
            )}
          </button>

          <Tooltip content="Next track" position="top">
            <IconButton
              variant="ghost"
              size="md"
              onClick={nextTrack}
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip content={`Repeat: ${repeatMode}`} position="top">
            <IconButton
              variant="ghost"
              size="sm"
              active={repeatMode !== 'off'}
              onClick={cycleRepeatMode}
              aria-label="Cycle repeat mode"
            >
              {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </IconButton>
          </Tooltip>
        </div>

        {/* Scrubber slider */}
        <div className="nocturne-player__scrubber">
          <span className="nocturne-player__time">{formatDuration(currentTime)}</span>
          <Slider
            value={currentTime}
            min={0}
            max={duration || 100}
            step={1}
            onChange={handleScrub}
            aria-label="Track progress"
          />
          <span className="nocturne-player__time">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Queue */}
      <div className="nocturne-player__right">
        <div className="nocturne-player__volume">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </IconButton>
          <Slider
            value={isMuted ? 0 : Math.round(volume * 100)}
            min={0}
            max={100}
            step={1}
            onChange={handleVolumeChange}
            aria-label="Audio Volume"
          />
        </div>

        <Tooltip content="Queue & Upcoming Tracks" position="top">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => showToast('Queue Active', 'Next up: Prague at 03:45 AM', 'default')}
            aria-label="Open queue"
          >
            <ListMusic size={17} />
          </IconButton>
        </Tooltip>

        <Tooltip content="Atmospheric Visualizer" position="top">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => showToast('Atmospheric Focus', 'Visualizer placeholder active', 'atmosphere')}
            aria-label="Fullscreen atmospheric view"
          >
            <Maximize2 size={16} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
