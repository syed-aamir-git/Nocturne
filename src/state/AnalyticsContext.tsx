import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  AnalyticsOverview,
  AnalyticsTimeRange,
  DayListeningStat,
  GroupedHistory,
  HourlyListeningStat,
  ListeningHistoryEntry,
  MonthlyListeningStat,
  MusicPersonality,
  TopRankedItem,
  WeekdayListeningStat,
} from '../types/analytics';
import { storageService } from '../services/storageService';
import {
  calculateDailyListening,
  calculateHourlyListening,
  calculateMonthlyListening,
  calculateMusicPersonality,
  calculateOverview,
  calculateTopArtists,
  calculateTopGenres,
  calculateTopSongs,
  calculateWeekdayListening,
  filterHistoryByRange,
  groupHistoryEntries,
} from '../services/analyticsEngine';

const HISTORY_STORAGE_KEY = 'nocturne_listening_history_v1';

export interface AnalyticsContextType {
  history: ListeningHistoryEntry[];
  groupedHistory: GroupedHistory[];
  timeRange: AnalyticsTimeRange;
  setTimeRange: (range: AnalyticsTimeRange) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  recordSession: (entry: Omit<ListeningHistoryEntry, 'id'>) => void;
  // Computed analytics for the active timeRange
  overview: AnalyticsOverview;
  dailyStats: DayListeningStat[];
  hourlyStats: HourlyListeningStat[];
  weekdayStats: WeekdayListeningStat[];
  monthlyStats: MonthlyListeningStat[];
  topArtists: TopRankedItem[];
  topGenres: TopRankedItem[];
  topSongs: TopRankedItem[];
  personality: MusicPersonality;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

function sanitizeHistoryEntry(entry: any): ListeningHistoryEntry | null {
  if (!entry || typeof entry !== 'object') return null;
  const id = typeof entry.id === 'string' ? entry.id : `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const trackId = typeof entry.trackId === 'string' ? entry.trackId : 'unknown-track';
  const trackTitle = typeof entry.trackTitle === 'string' ? entry.trackTitle : 'Untitled Composition';
  const artist = typeof entry.artist === 'string' ? entry.artist : 'Unknown Resonance';
  const album = typeof entry.album === 'string' ? entry.album : 'Nocturne Archive';
  const artwork = typeof entry.artwork === 'string' ? entry.artwork : '';
  const startTime = typeof entry.startTime === 'number' && !isNaN(entry.startTime) ? entry.startTime : Date.now();
  const duration = typeof entry.duration === 'number' && !isNaN(entry.duration) ? Math.max(0, entry.duration) : 180;
  const durationListened = typeof entry.durationListened === 'number' && !isNaN(entry.durationListened) ? Math.max(0, entry.durationListened) : duration;
  const completionPercentage = typeof entry.completionPercentage === 'number' && !isNaN(entry.completionPercentage) ? Math.min(100, Math.max(0, entry.completionPercentage)) : 100;
  const date = typeof entry.date === 'string' ? entry.date : new Date(startTime).toISOString().split('T')[0];
  const genre = typeof entry.genre === 'string' ? entry.genre : 'Darkwave';

  const endTime = typeof entry.endTime === 'number' && !isNaN(entry.endTime) ? entry.endTime : startTime + durationListened * 1000;

  return {
    id,
    trackId,
    trackTitle,
    artist,
    artistId: typeof entry.artistId === 'string' ? entry.artistId : undefined,
    album,
    albumId: typeof entry.albumId === 'string' ? entry.albumId : undefined,
    artwork,
    startTime,
    endTime,
    duration,
    durationListened,
    completionPercentage,
    date,
    genre,
    audioUrl: typeof entry.audioUrl === 'string' ? entry.audioUrl : undefined,
  };
}

function loadInitialHistory(): ListeningHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const sanitized = parsed
          .map(sanitizeHistoryEntry)
          .filter((e): e is ListeningHistoryEntry => e !== null);
        return sanitized;
      }
    }
  } catch (e) {
    console.warn('[AnalyticsContext] Failed to load listening history:', e);
  }
  return [];
}

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ListeningHistoryEntry[]>(() => loadInitialHistory());
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('30d');

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('[AnalyticsContext] Failed to persist history:', e);
    }
  }, [history]);

  const removeHistoryEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const recordSession = useCallback((entryData: Omit<ListeningHistoryEntry, 'id'>) => {
    const privacy = storageService.getPrivacySettings();
    if (!privacy.listeningHistoryEnabled) {
      return;
    }
    const newEntry: ListeningHistoryEntry = {
      ...entryData,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

  // Chronologically grouped history (Today, Yesterday, This Week, Last Week, Earlier)
  const groupedHistory = useMemo(() => {
    return groupHistoryEntries(history);
  }, [history]);

  // History filtered by active timeRange
  const filteredHistory = useMemo(() => {
    return filterHistoryByRange(history, timeRange);
  }, [history, timeRange]);

  // Computed metrics for active timeRange
  const overview = useMemo(() => calculateOverview(filteredHistory), [filteredHistory]);
  const dailyStats = useMemo(() => calculateDailyListening(filteredHistory, timeRange), [filteredHistory, timeRange]);
  const hourlyStats = useMemo(() => calculateHourlyListening(filteredHistory), [filteredHistory]);
  const weekdayStats = useMemo(() => calculateWeekdayListening(filteredHistory), [filteredHistory]);
  const monthlyStats = useMemo(() => calculateMonthlyListening(filteredHistory), [filteredHistory]);
  const topArtists = useMemo(() => calculateTopArtists(filteredHistory, 8), [filteredHistory]);
  const topGenres = useMemo(() => calculateTopGenres(filteredHistory, 6), [filteredHistory]);
  const topSongs = useMemo(() => calculateTopSongs(filteredHistory, 10), [filteredHistory]);
  const personality = useMemo(() => calculateMusicPersonality(filteredHistory), [filteredHistory]);

  return (
    <AnalyticsContext.Provider
      value={{
        history,
        groupedHistory,
        timeRange,
        setTimeRange,
        removeHistoryEntry,
        clearHistory,
        recordSession,
        overview,
        dailyStats,
        hourlyStats,
        weekdayStats,
        monthlyStats,
        topArtists,
        topGenres,
        topSongs,
        personality,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
