import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import type { Track, Album, Playlist, PlayerState, PlaybackStatus } from '../types';
import { audioEngine } from '../audio/AudioEngine';
import { MOCK_TRACKS } from '../data/mockData';

export interface PlayerContextType extends PlayerState {
  playTrack: (track: Track, newQueue?: Track[], startIndex?: number) => void;
  playAlbum: (album: Album) => void;
  playPlaylist: (playlist: Playlist) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (seconds: number) => void;
  seekRelative: (deltaSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  addToQueue: (track: Track) => void;
  addTracksToQueue: (tracks: Track[]) => void;
  playNext: (track: Track) => void;
  playQueueIndex: (index: number) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(MOCK_TRACKS[0]?.duration || 0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [muted, setMutedState] = useState<boolean>(false);
  const [shuffle, setShuffleState] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Track[]>(MOCK_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [history, setHistory] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // References for up-to-date values inside event listeners and keyboard shortcuts
  const stateRef = useRef({
    currentTrack,
    status,
    currentTime,
    duration,
    queue,
    queueIndex,
    shuffle,
    repeatMode,
    history,
  });

  useEffect(() => {
    stateRef.current = {
      currentTrack,
      status,
      currentTime,
      duration,
      queue,
      queueIndex,
      shuffle,
      repeatMode,
      history,
    };
  }, [
    currentTrack,
    status,
    currentTime,
    duration,
    queue,
    queueIndex,
    shuffle,
    repeatMode,
    history,
  ]);

  // Load and play a specific track
  const playTrack = useCallback(
    (track: Track, newQueue?: Track[], startIndex?: number) => {
      setPlaybackError(null);
      setIsLoading(true);

      if (stateRef.current.currentTrack && stateRef.current.currentTrack.id !== track.id) {
        setHistory((prev) => [...prev, stateRef.current.currentTrack!]);
      }

      setCurrentTrack(track);
      setDuration(track.duration);
      setCurrentTime(0);

      if (newQueue) {
        setQueue(newQueue);
        const idx =
          startIndex !== undefined
            ? startIndex
            : newQueue.findIndex((t) => t.id === track.id);
        setQueueIndex(idx !== -1 ? idx : 0);
      } else {
        const existingIdx = stateRef.current.queue.findIndex((t) => t.id === track.id);
        if (existingIdx !== -1) {
          setQueueIndex(existingIdx);
        } else {
          setQueue((prev) => [...prev, track]);
          setQueueIndex(stateRef.current.queue.length);
        }
      }

      if (track.audioUrl && !track.isUnavailable) {
        audioEngine.loadTrack(track.audioUrl, true).catch((err) => {
          console.warn('[PlayerContext] Audio playback could not be initiated:', err);
          setIsLoading(false);
          setStatus('paused');
        });
      } else {
        setIsLoading(false);
        setStatus('paused');
      }
    },
    []
  );

  const playAlbum = useCallback(
    (album: Album) => {
      if (album.tracks && album.tracks.length > 0) {
        playTrack(album.tracks[0], album.tracks, 0);
      }
    },
    [playTrack]
  );

  const playPlaylist = useCallback(
    (playlist: Playlist) => {
      if (playlist.tracks && playlist.tracks.length > 0) {
        const firstPlayableIdx = playlist.tracks.findIndex((t) => !t.isUnavailable && Boolean(t.audioUrl));
        const targetIdx = firstPlayableIdx !== -1 ? firstPlayableIdx : 0;
        playTrack(playlist.tracks[targetIdx], playlist.tracks, targetIdx);
      }
    },
    [playTrack]
  );

  // Transition to next track in queue with shuffle / repeat support
  const nextTrack = useCallback(() => {
    const { queue: currentQ, queueIndex: currentIdx, shuffle: isShuff, repeatMode: currentRep, currentTrack: currTrk } =
      stateRef.current;

    if (currentQ.length === 0) return;

    if (isShuff && currentQ.length > 1) {
      const playableIndices = currentQ
        .map((t, idx) => (!t.isUnavailable && Boolean(t.audioUrl) ? idx : -1))
        .filter((idx) => idx !== -1);

      if (playableIndices.length > 0) {
        let randomIdx = playableIndices[Math.floor(Math.random() * playableIndices.length)];
        if (randomIdx === currentIdx && playableIndices.length > 1) {
          const others = playableIndices.filter((i) => i !== currentIdx);
          randomIdx = others[Math.floor(Math.random() * others.length)];
        }
        playTrack(currentQ[randomIdx], currentQ, randomIdx);
        return;
      }
    }

    let nextIdx = currentIdx + 1;
    while (nextIdx < currentQ.length && (currentQ[nextIdx].isUnavailable || !currentQ[nextIdx].audioUrl)) {
      nextIdx++;
    }

    if (nextIdx < currentQ.length) {
      playTrack(currentQ[nextIdx], currentQ, nextIdx);
    } else if (currentRep === 'all') {
      const firstPlayableIdx = currentQ.findIndex((t) => !t.isUnavailable && Boolean(t.audioUrl));
      if (firstPlayableIdx !== -1) {
        playTrack(currentQ[firstPlayableIdx], currentQ, firstPlayableIdx);
      }
    } else {
      audioEngine.pause();
      setStatus('idle');
      setCurrentTime(0);
      if (currTrk) {
        audioEngine.seek(0);
      }
    }
  }, [playTrack]);

  // Transition to previous track
  const previousTrack = useCallback(() => {
    const { queue: currentQ, queueIndex: currentIdx, currentTime: currTime } = stateRef.current;

    if (currTime > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }

    let prevIdx = currentIdx - 1;
    while (prevIdx >= 0 && (currentQ[prevIdx].isUnavailable || !currentQ[prevIdx].audioUrl)) {
      prevIdx--;
    }

    if (prevIdx >= 0 && prevIdx < currentQ.length) {
      playTrack(currentQ[prevIdx], currentQ, prevIdx);
    } else {
      audioEngine.seek(0);
      setCurrentTime(0);
    }
  }, [playTrack]);

  const handleTrackEnded = useCallback(() => {
    const { repeatMode: currentRep } = stateRef.current;

    if (currentRep === 'one') {
      audioEngine.seek(0);
      audioEngine.play();
    } else {
      nextTrack();
    }
  }, [nextTrack]);

  // Play / Pause toggles
  const play = useCallback(() => {
    const { currentTrack: currTrk, queue: currQ, queueIndex: currIdx, status: currStatus } = stateRef.current;
    if (currStatus === 'idle' && currTrk) {
      playTrack(currTrk, currQ, currIdx);
      return;
    }
    setStatus('playing');
    setPlaybackError(null);
    audioEngine.play();
  }, [playTrack]);

  const pause = useCallback(() => {
    setStatus('paused');
    audioEngine.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    const { status: currStatus, currentTrack: currTrk, queue: currQ, queueIndex: currIdx } = stateRef.current;

    if (currStatus === 'playing') {
      pause();
    } else if (currTrk) {
      if (currStatus === 'idle') {
        playTrack(currTrk, currQ, currIdx);
      } else {
        play();
      }
    } else if (currQ.length > 0) {
      playTrack(currQ[0], currQ, 0);
    }
  }, [pause, play, playTrack]);

  const seek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  }, []);

  const seekRelative = useCallback((deltaSeconds: number) => {
    const { currentTime: curr, duration: dur } = stateRef.current;
    const target = Math.max(0, Math.min(curr + deltaSeconds, dur || curr + deltaSeconds));
    setCurrentTime(target);
    audioEngine.seek(target);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (clamped > 0 && audioEngine.isMuted()) {
      setMutedState(false);
      audioEngine.setMuted(false);
    }
    audioEngine.setVolume(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffleState((prev) => !prev);
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

  const addTracksToQueue = useCallback((tracks: Track[]) => {
    setQueue((prev) => [...prev, ...tracks]);
  }, []);

  const playNext = useCallback(
    (track: Track) => {
      const { queue: currQ, queueIndex: currIdx, currentTrack: currTrk } = stateRef.current;
      if (!currTrk || currQ.length === 0) {
        playTrack(track, [track], 0);
        return;
      }
      const nextQueue = [...currQ];
      nextQueue.splice(currIdx + 1, 0, track);
      setQueue(nextQueue);
    },
    [playTrack]
  );

  const playQueueIndex = useCallback(
    (index: number) => {
      const { queue: currQ } = stateRef.current;
      if (index >= 0 && index < currQ.length) {
        playTrack(currQ[index], currQ, index);
      }
    },
    [playTrack]
  );

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
    setQueueIndex((currIdx) => {
      if (index < currIdx) {
        return currIdx - 1;
      }
      return currIdx;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue(() => {
      const { currentTrack: currTrk } = stateRef.current;
      return currTrk ? [currTrk] : [];
    });
    setQueueIndex(0);
  }, []);

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    setQueue((prev) => {
      if (
        startIndex < 0 ||
        startIndex >= prev.length ||
        endIndex < 0 ||
        endIndex >= prev.length
      ) {
        return prev;
      }
      const updated = [...prev];
      const [moved] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, moved);
      return updated;
    });

    setQueueIndex((currIdx) => {
      if (startIndex === currIdx) {
        return endIndex;
      }
      if (startIndex < currIdx && endIndex >= currIdx) {
        return currIdx - 1;
      }
      if (startIndex > currIdx && endIndex <= currIdx) {
        return currIdx + 1;
      }
      return currIdx;
    });
  }, []);

  // Subscribe to persistent AudioEngine events
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe({
      onPlay: () => {
        setStatus('playing');
        setIsLoading(false);
      },
      onPause: () => {
        setStatus('paused');
      },
      onTimeUpdate: (curr, dur) => {
        setCurrentTime(curr);
        if (dur && dur > 0) {
          setDuration(dur);
        }
      },
      onLoading: (loading) => {
        setIsLoading(loading);
        if (loading) {
          setStatus('loading');
        }
      },
      onCanPlay: () => {
        setIsLoading(false);
      },
      onEnded: () => {
        handleTrackEnded();
      },
      onError: (err) => {
        console.warn('[PlayerContext] Audio playback warning:', err.message);
        setIsLoading(false);
        setStatus('error');
        setPlaybackError(err.message);
      },
    });

    return () => {
      unsubscribe();
    };
  }, [handleTrackEnded]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when user is interacting with text inputs or controls
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.getAttribute('role') === 'slider' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Space = play/pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      // Arrow Left = seek backward (5 seconds)
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-5);
        return;
      }

      // Arrow Right = seek forward (5 seconds)
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekRelative(5);
        return;
      }

      // M = mute toggle
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // S = shuffle toggle
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleShuffle();
        return;
      }

      // R = repeat toggle
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        cycleRepeatMode();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause, seekRelative, toggleMute, toggleShuffle, cycleRepeatMode]);

  const isPlaying = status === 'playing';

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        status,
        currentTime,
        duration,
        volume,
        muted,
        isMuted: muted,
        queue,
        queueIndex,
        shuffle,
        isShuffle: shuffle,
        repeatMode,
        history,
        isLoading,
        error: playbackError,
        playTrack,
        playAlbum,
        playPlaylist,
        togglePlayPause,
        play,
        pause,
        nextTrack,
        previousTrack,
        seek,
        seekRelative,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        addToQueue,
        addTracksToQueue,
        playNext,
        playQueueIndex,
        removeFromQueue,
        clearQueue,
        reorderQueue,
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
