import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Track, PlayerState, PlaybackStatus } from '../types';
import { audioEngine } from '../audio/AudioEngine';
import { MOCK_TRACKS } from '../data/mockData';

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(MOCK_TRACKS[0]?.duration || 0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Track[]>(MOCK_TRACKS.slice(1));
  const [history, setHistory] = useState<Track[]>([]);

  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      if (currentTrack) {
        setHistory((prev) => [...prev, currentTrack]);
      }
      setCurrentTrack(track);
      setDuration(track.duration);
      setCurrentTime(0);
      setStatus('playing');

      if (newQueue) {
        setQueue(newQueue.filter((t) => t.id !== track.id));
      }

      if (track.audioUrl) {
        audioEngine.loadTrack(track.audioUrl, true);
      }
    },
    [currentTrack]
  );

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    const next = queue[0];
    const remaining = queue.slice(1);
    playTrack(next, remaining);
  }, [queue, playTrack]);

  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'one' && currentTrack) {
      audioEngine.seek(0);
      audioEngine.play();
    } else if (queue.length > 0) {
      nextTrack();
    } else if (repeatMode === 'all' && history.length > 0) {
      const allTracks = [...history, ...(currentTrack ? [currentTrack] : [])];
      if (allTracks.length > 0) {
        playTrack(allTracks[0], allTracks.slice(1));
      }
    } else {
      setStatus('idle');
      setCurrentTime(0);
    }
  }, [repeatMode, currentTrack, queue, history, nextTrack, playTrack]);

  // Subscribe to audio engine events
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe({
      onPlay: () => setStatus('playing'),
      onPause: () => setStatus('paused'),
      onTimeUpdate: (curr, dur) => {
        setCurrentTime(curr);
        if (dur) setDuration(dur);
      },
      onLoading: (isLoading) => {
        if (isLoading) setStatus('loading');
      },
      onEnded: () => {
        handleTrackEnded();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [handleTrackEnded]);

  const togglePlayPause = useCallback(() => {
    if (status === 'playing') {
      setStatus('paused');
      audioEngine.pause();
    } else {
      if (!currentTrack && queue.length > 0) {
        playTrack(queue[0]);
      } else {
        setStatus('playing');
        audioEngine.play();
      }
    }
  }, [status, currentTrack, queue, playTrack]);

  const previousTrack = useCallback(() => {
    if (currentTime > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }
    if (history.length > 0) {
      const prev = history[history.length - 1];
      const remainingHistory = history.slice(0, -1);
      setHistory(remainingHistory);
      if (currentTrack) {
        setQueue((q) => [currentTrack, ...q]);
      }
      setCurrentTrack(prev);
      setDuration(prev.duration);
      setCurrentTime(0);
      setStatus('playing');
    } else {
      audioEngine.seek(0);
      setCurrentTime(0);
    }
  }, [currentTime, history, currentTrack]);

  const seek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
    audioEngine.setVolume(clamped);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        status,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        history,
        playTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
