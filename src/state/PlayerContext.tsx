import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import type { Track, Album, Playlist, PlayerState, PlaybackStatus } from '../types';
import type { CrossfadeDuration } from '../types/audio';
import { audioEngine } from '../audio/AudioEngine';
import { useAudioSettings } from './AudioSettingsContext';
import { useAnalytics } from './AnalyticsContext';
import { MOCK_TRACKS } from '../data/mockData';

const QUEUE_STORAGE_KEY = 'nocturne_queue_state_v1';
const PLAYBACK_SESSION_KEY = 'nocturne_playback_session_v1';

export interface PlayerContextType extends PlayerState {
  isCrossfading: boolean;
  autoplay: boolean;
  toggleAutoplay: () => void;
  crossfadeDuration: CrossfadeDuration;
  setCrossfadeDuration: (duration: CrossfadeDuration) => void;
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
  setShuffle: (shuffle: boolean) => void;
  cycleRepeatMode: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  addToQueue: (track: Track) => void;
  addTracksToQueue: (tracks: Track[]) => void;
  playNext: (track: Track) => void;
  playQueueIndex: (index: number) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface StoredPlaybackSession {
  trackId: string;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
}

function loadInitialQueue(): { queue: Track[]; queueIndex: number } {
  if (typeof window === 'undefined') return { queue: MOCK_TRACKS, queueIndex: 0 };
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.queue) && parsed.queue.length > 0) {
        const safeIdx = Math.max(0, Math.min(parsed.queueIndex || 0, parsed.queue.length - 1));
        return { queue: parsed.queue, queueIndex: safeIdx };
      }
    }
  } catch (e) {
    console.warn('[PlayerContext] Failed to load stored queue:', e);
  }
  return { queue: MOCK_TRACKS, queueIndex: 0 };
}

function loadInitialPlaybackSession(): StoredPlaybackSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PLAYBACK_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[PlayerContext] Failed to load stored playback session:', e);
  }
  return null;
}

function pickAutoplayTrack(currentQueue: Track[]): Track | null {
  const currentTrack = currentQueue[currentQueue.length - 1];
  const queueIds = new Set(currentQueue.map((t) => t.id));

  // Try to find a track with matching vibe/genre not in queue
  const matched = MOCK_TRACKS.find(
    (t) => !queueIds.has(t.id) && t.genre === currentTrack?.genre && !t.isUnavailable && t.audioUrl
  );
  if (matched) return matched;

  // Otherwise, find any track not currently in queue
  const anyUnused = MOCK_TRACKS.find((t) => !queueIds.has(t.id) && !t.isUnavailable && t.audioUrl);
  if (anyUnused) return anyUnused;

  // If all tracks are already in queue, pick random from MOCK_TRACKS
  const playable = MOCK_TRACKS.filter((t) => !t.isUnavailable && t.audioUrl);
  return playable[Math.floor(Math.random() * playable.length)] || null;
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { crossfadeDuration, setCrossfadeDuration, autoplay, toggleAutoplay } =
    useAudioSettings();
  const { recordSession } = useAnalytics();

  // Active listening session tracker
  const sessionTrackRef = useRef<Track | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const sessionListenedSecondsRef = useRef<number>(0);
  const sessionLastTickTimeRef = useRef<number>(0);

  const commitListeningSession = useCallback(() => {
    const track = sessionTrackRef.current;
    const listenedSec = Math.round(sessionListenedSecondsRef.current);
    if (track && listenedSec >= 5) {
      const startMs = sessionStartTimeRef.current;
      const endMs = Date.now();
      const trackDur = track.duration || listenedSec;
      const compPct = Math.min(100, Math.max(1, Math.round((listenedSec / trackDur) * 100)));

      recordSession({
        trackId: track.id,
        trackTitle: track.title,
        artist: track.artist,
        artistId: track.artistId,
        album: track.album,
        albumId: track.albumId,
        artwork: track.artwork || track.coverUrl || '',
        audioUrl: track.audioUrl,
        genre: track.genre || 'Gothic Darkwave',
        duration: trackDur,
        startTime: startMs,
        endTime: endMs,
        date: new Date(startMs).toISOString().split('T')[0],
        durationListened: listenedSec,
        completionPercentage: compPct,
        vibe: track.vibe,
      });
    }

    sessionTrackRef.current = null;
    sessionListenedSecondsRef.current = 0;
  }, [recordSession]);

  const [queue, setQueue] = useState<Track[]>(() => loadInitialQueue().queue);
  const [queueIndex, setQueueIndex] = useState<number>(() => loadInitialQueue().queueIndex);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => {
    const session = loadInitialPlaybackSession();
    const initialQ = loadInitialQueue();
    if (session?.trackId) {
      const match = initialQ.queue.find((t) => t.id === session.trackId);
      if (match) return match;
    }
    return initialQ.queue[initialQ.queueIndex] || MOCK_TRACKS[0];
  });

  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState<number>(() => loadInitialPlaybackSession()?.position || 0);
  const [duration, setDuration] = useState<number>(() => {
    const session = loadInitialPlaybackSession();
    if (session?.duration) return session.duration;
    return MOCK_TRACKS[0]?.duration || 0;
  });
  const [volume, setVolumeState] = useState<number>(() => {
    const session = loadInitialPlaybackSession();
    return session?.volume !== undefined ? session.volume : 0.8;
  });
  const [muted, setMutedState] = useState<boolean>(() => {
    const session = loadInitialPlaybackSession();
    return session?.muted !== undefined ? session.muted : false;
  });
  const [shuffle, setShuffleState] = useState<boolean>(() => {
    const session = loadInitialPlaybackSession();
    return session?.shuffle !== undefined ? session.shuffle : false;
  });
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>(() => {
    const session = loadInitialPlaybackSession();
    return session?.repeatMode || 'off';
  });
  const [history, setHistory] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);

  // References for up-to-date state inside event callbacks
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
    crossfadeDuration,
    autoplay,
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
      crossfadeDuration,
      autoplay,
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
    crossfadeDuration,
    autoplay,
  ]);

  // Preload remembered track position on mount without autoplay
  useEffect(() => {
    const session = loadInitialPlaybackSession();
    const initialQ = loadInitialQueue();
    const track =
      (session?.trackId && initialQ.queue.find((t) => t.id === session.trackId)) ||
      initialQ.queue[initialQ.queueIndex] ||
      MOCK_TRACKS[0];

    if (track && track.audioUrl) {
      const initialVol = session?.volume !== undefined ? session.volume : 0.8;
      const initialMuted = session?.muted !== undefined ? session.muted : false;
      audioEngine.setVolume(initialVol);
      audioEngine.setMuted(initialMuted);
      audioEngine.loadTrack(track.audioUrl, false, session?.position || 0);
    }
  }, []);

  // Persist queue and queueIndex
  useEffect(() => {
    try {
      localStorage.setItem(
        QUEUE_STORAGE_KEY,
        JSON.stringify({ queue, queueIndex })
      );
    } catch (e) {
      console.warn('[PlayerContext] Failed to persist queue:', e);
    }
  }, [queue, queueIndex]);

  // Persist playback session (throttled)
  const lastSavedPositionRef = useRef<number>(0);
  useEffect(() => {
    if (!currentTrack) return;
    if (Math.abs(currentTime - lastSavedPositionRef.current) < 2) return;
    lastSavedPositionRef.current = currentTime;

    try {
      localStorage.setItem(
        PLAYBACK_SESSION_KEY,
        JSON.stringify({
          trackId: currentTrack.id,
          position: Math.floor(currentTime),
          duration: Math.floor(duration),
          volume,
          muted,
          shuffle,
          repeatMode,
        })
      );
    } catch (e) {
      console.warn('[PlayerContext] Failed to persist playback session:', e);
    }
  }, [currentTrack, currentTime, duration, volume, muted, shuffle, repeatMode]);

  // Calculates the next track in queue with shuffle, repeat, and autoplay support
  const getNextPlayableTrack = useCallback((): { track: Track; index: number; isAutoplay?: boolean } | null => {
    const { queue: currQ, queueIndex: currIdx, shuffle: isShuff, repeatMode: repMode, autoplay: isAuto } =
      stateRef.current;
    if (currQ.length === 0) return null;

    if (isShuff && currQ.length > 1) {
      const candidates = currQ
        .map((t, idx) => (!t.isUnavailable && Boolean(t.audioUrl) && idx !== currIdx ? idx : -1))
        .filter((i) => i !== -1);
      if (candidates.length > 0) {
        const randIdx = candidates[Math.floor(Math.random() * candidates.length)];
        return { track: currQ[randIdx], index: randIdx };
      }
    }

    let nextIdx = currIdx + 1;
    while (nextIdx < currQ.length && (currQ[nextIdx].isUnavailable || !currQ[nextIdx].audioUrl)) {
      nextIdx++;
    }

    if (nextIdx < currQ.length) {
      return { track: currQ[nextIdx], index: nextIdx };
    }

    if (repMode === 'all') {
      const firstPlayable = currQ.findIndex((t) => !t.isUnavailable && Boolean(t.audioUrl));
      if (firstPlayable !== -1) {
        return { track: currQ[firstPlayable], index: firstPlayable };
      }
    }

    if (isAuto) {
      const autoTrack = pickAutoplayTrack(currQ);
      if (autoTrack) {
        return { track: autoTrack, index: currQ.length, isAutoplay: true };
      }
    }

    return null;
  }, []);

  // Load and play a specific track
  const playTrack = useCallback(
    (track: Track, newQueue?: Track[], startIndex?: number) => {
      setPlaybackError(null);
      setIsLoading(true);
      crossfadeTriggeredTrackId.current = null;

      commitListeningSession();
      sessionTrackRef.current = track;
      sessionStartTimeRef.current = Date.now();
      sessionListenedSecondsRef.current = 0;
      sessionLastTickTimeRef.current = Date.now();

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
    [commitListeningSession]
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

  // Transition to next track in queue
  const nextTrack = useCallback(() => {
    const nextItem = getNextPlayableTrack();
    if (nextItem) {
      if (nextItem.isAutoplay) {
        const updatedQ = [...stateRef.current.queue, nextItem.track];
        playTrack(nextItem.track, updatedQ, updatedQ.length - 1);
      } else {
        playTrack(nextItem.track, undefined, nextItem.index);
      }
    } else {
      audioEngine.pause();
      setStatus('idle');
      setCurrentTime(0);
      if (stateRef.current.currentTrack) {
        audioEngine.seek(0);
      }
    }
  }, [getNextPlayableTrack, playTrack]);

  // Transition to previous track
  const previousTrack = useCallback(() => {
    const { queue: currentQ, queueIndex: currentIdx, currentTime: currTime, history: hist } = stateRef.current;

    if (currTime > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }

    if (hist.length > 0) {
      const lastPlayed = hist[hist.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      const idxInQueue = currentQ.findIndex((t) => t.id === lastPlayed.id);
      playTrack(lastPlayed, undefined, idxInQueue !== -1 ? idxInQueue : currentIdx);
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
    const { currentTrack: currTrk, currentTime: currTime, status: currStatus } = stateRef.current;
    if (!currTrk) return;
    setStatus('playing');
    setPlaybackError(null);

    if (currTrk.audioUrl) {
      if (currStatus === 'idle' && currTime > 0) {
        audioEngine.loadTrack(currTrk.audioUrl, true, currTime).catch((err) => {
          console.warn('[PlayerContext] Audio playback could not be resumed:', err);
          setIsLoading(false);
          setStatus('paused');
        });
      } else {
        audioEngine.play().catch(() => {
          audioEngine.loadTrack(currTrk.audioUrl, true, currTime).catch((err) => {
            console.warn('[PlayerContext] Playback error:', err);
            setIsLoading(false);
            setStatus('paused');
          });
        });
      }
    }
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
    audioEngine.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    const { status: currStatus, currentTrack: currTrk, queue: currQ } = stateRef.current;

    if (currStatus === 'playing') {
      pause();
    } else if (currTrk) {
      play();
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

  // Track ID guard to avoid triggering crossfade multiple times on the same ending track
  const crossfadeTriggeredTrackId = useRef<string | null>(null);

  // Subscribe to persistent AudioEngine events
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe({
      onPlay: () => {
        setStatus('playing');
        setIsLoading(false);
        if (!sessionTrackRef.current && stateRef.current.currentTrack) {
          sessionTrackRef.current = stateRef.current.currentTrack;
          sessionStartTimeRef.current = Date.now();
          sessionListenedSecondsRef.current = 0;
        }
        sessionLastTickTimeRef.current = Date.now();
      },
      onPause: () => {
        setStatus('paused');
      },
      onTimeUpdate: (curr, dur) => {
        setCurrentTime(curr);
        if (dur && dur > 0) {
          setDuration(dur);
        }

        const now = Date.now();
        const deltaSec = (now - sessionLastTickTimeRef.current) / 1000;
        if (deltaSec > 0 && deltaSec < 2.0 && stateRef.current.status === 'playing') {
          sessionListenedSecondsRef.current += deltaSec;
        }
        sessionLastTickTimeRef.current = now;

        // Automatic Acoustic Crossfade detection
        const xfadeSec = stateRef.current.crossfadeDuration;
        const currentTrk = stateRef.current.currentTrack;

        if (
          xfadeSec > 0 &&
          dur > xfadeSec * 1.5 &&
          dur - curr <= xfadeSec &&
          !audioEngine.isCrossfading() &&
          stateRef.current.repeatMode !== 'one' &&
          currentTrk &&
          crossfadeTriggeredTrackId.current !== currentTrk.id
        ) {
          const upcoming = getNextPlayableTrack();
          if (upcoming && upcoming.track.audioUrl) {
            crossfadeTriggeredTrackId.current = currentTrk.id;
            setIsCrossfading(true);

            if (upcoming.isAutoplay) {
              setQueue((prev) => [...prev, upcoming.track]);
            }

            audioEngine.startCrossfade(upcoming.track.audioUrl, xfadeSec, () => {
              commitListeningSession();
              sessionTrackRef.current = upcoming.track;
              sessionStartTimeRef.current = Date.now();
              sessionListenedSecondsRef.current = 0;
              sessionLastTickTimeRef.current = Date.now();

              setCurrentTrack(upcoming.track);
              setQueueIndex(upcoming.index);
              setCurrentTime(0);
              setDuration(upcoming.track.duration);
              setIsCrossfading(false);
              crossfadeTriggeredTrackId.current = null;
            });
          }
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
        commitListeningSession();
        handleTrackEnded();
      },
      onCrossfadeStart: () => {
        setIsCrossfading(true);
      },
      onCrossfadeEnd: () => {
        setIsCrossfading(false);
        crossfadeTriggeredTrackId.current = null;
      },
      onError: (err) => {
        console.warn('[PlayerContext] Audio playback warning:', err.message);
        setIsLoading(false);
        setStatus('error');
        setPlaybackError(err.message);
      },
    });

    return () => {
      commitListeningSession();
      unsubscribe();
    };
  }, [handleTrackEnded, getNextPlayableTrack, commitListeningSession]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        (target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.getAttribute('role') === 'slider' ||
            target.isContentEditable))
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
        isCrossfading,
        autoplay,
        toggleAutoplay,
        crossfadeDuration,
        setCrossfadeDuration,
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
        setShuffle: setShuffleState,
        cycleRepeatMode,
        setRepeatMode,
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
