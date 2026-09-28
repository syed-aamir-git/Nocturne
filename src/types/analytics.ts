import type { Track } from './index';

export interface ListeningHistoryEntry {
  id: string;
  trackId: string;
  trackTitle: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  artwork: string;
  audioUrl?: string;
  genre: string;
  duration: number; // track total duration in seconds
  startTime: number; // epoch ms (Date.now())
  endTime: number; // epoch ms
  date: string; // "YYYY-MM-DD"
  durationListened: number; // seconds actually listened
  completionPercentage: number; // 0 - 100
  vibe?: string;
}

export type HistoryGrouping = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'earlier';

export interface GroupedHistory {
  group: HistoryGrouping;
  label: string;
  entries: ListeningHistoryEntry[];
}

export type AnalyticsTimeRange = 'today' | '7d' | '30d' | '3m' | '6m' | '1y' | 'all';

export interface MusicPersonality {
  archetype: string;
  atmosphere: string;
  tagline: string;
  summary: string;
  peakHourDescription: string;
  topVibe: string;
  nocturnalRatio: number; // percentage of listening between 10PM - 5AM (0 - 100)
  traits: { label: string; value: string; detail: string }[];
  soundSignature: string[];
}

export interface DayListeningStat {
  date: string; // "YYYY-MM-DD"
  label: string; // "Mon", "Sep 28"
  minutes: number;
  songCount: number;
}

export interface HourlyListeningStat {
  hour: number; // 0..23
  label: string; // "12 AM", "1 AM", ...
  minutes: number;
  songCount: number;
  percentage: number;
  isPeak?: boolean;
}

export interface WeekdayListeningStat {
  dayIndex: number; // 0 (Sun) to 6 (Sat)
  name: string; // "Sunday", "Monday", ...
  shortName: string; // "Sun", "Mon", ...
  minutes: number;
  songCount: number;
}

export interface MonthlyListeningStat {
  monthKey: string; // "2026-09"
  label: string; // "Sep 2026"
  minutes: number;
  songCount: number;
}

export interface TopRankedItem {
  id: string;
  title: string;
  subtitle: string;
  artwork?: string;
  count: number;
  minutes: number;
  percentage: number;
  track?: Track;
}

export interface AnalyticsOverview {
  totalListeningSeconds: number;
  totalListeningMinutes: number;
  totalListeningHours: number;
  totalSongsPlayed: number;
  uniqueArtistsCount: number;
  uniqueAlbumsCount: number;
  mostPlayedSong: TopRankedItem | null;
  mostPlayedArtist: TopRankedItem | null;
  mostPlayedAlbum: TopRankedItem | null;
  completionRateAverage: number;
}
