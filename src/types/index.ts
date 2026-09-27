export type ThemeId = 'obsidian' | 'amber' | 'crimson' | 'mist';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  accent: string;
  glow: string;
  bgDark: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string;
  genres: string[];
  monthlyListeners: number;
  verified?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  coverUrl: string;
  duration: number; // in seconds
  audioUrl?: string;
  explicit?: boolean;
  bitrate?: string; // e.g. "24-bit / 96kHz FLAC"
  vibe?: string; // e.g. "Deep Melancholy", "Midnight Ambient", "Gothic Neoclassical"
  plays?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  releaseYear: number;
  coverUrl: string;
  tracksCount: number;
  totalDuration: number; // in seconds
  genre: string;
  description?: string;
  tracks?: Track[];
}

export interface Playlist {
  id: string;
  title: string;
  curator: string;
  description: string;
  coverUrl: string;
  tracksCount: number;
  followersCount: number;
  curatedHour?: string; // e.g., "02:00 - 05:00 AM"
  tracks?: Track[];
}

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'loading';

export interface PlayerState {
  currentTrack: Track | null;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  history: Track[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'atmosphere';
  duration?: number;
}
