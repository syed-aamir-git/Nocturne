export * from './appearance';

export interface SyncedLyricLine {
  time: number; // in seconds
  text: string;
}

export type LyricsState = 'available' | 'not_available' | 'loading' | 'error';
export type LyricsTab = 'lyrics' | 'info' | 'credits';

export interface TrackCredits {
  performers?: string[];
  composers?: string[];
  lyricists?: string[];
  producers?: string[];
  mixedBy?: string[];
  masteredBy?: string[];
  recordLabel?: string;
  releaseYear?: number;
  copyrightNotice?: string;
  studio?: string;
}

export type TrackMatchStatus = 'matched' | 'unmatched' | 'possible';

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  artwork: string;
  coverUrl?: string; // alias for compatibility
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
  releaseDate: string;
  trackNumber: number;
  lyrics?: string;
  syncedLyrics?: SyncedLyricLine[];
  explicit: boolean;
  playCount: number;
  bitrate?: string; // e.g. "24-bit / 96kHz FLAC"
  vibe?: string; // e.g. "Gothic Darkwave", "Midnight Ambient"
  credits?: TrackCredits;
  isUnavailable?: boolean; // True if Spotify imported track is not available in Nocturne library
  originalSpotifyUri?: string;
  originalSpotifyId?: string;
  matchStatus?: TrackMatchStatus;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  artwork: string;
  coverUrl?: string; // alias for compatibility
  releaseDate: string;
  releaseYear?: number;
  genre: string;
  tracks: Track[];
  isSingle?: boolean;
  description?: string;
  tracksCount?: number;
  totalDuration?: number; // in seconds
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  avatarUrl?: string; // alias for compatibility
  bannerUrl?: string;
  biography: string;
  bio?: string; // alias for compatibility
  genres: string[];
  albums: string[]; // album IDs
  monthlyListeners?: number;
  verified?: boolean;
}

export type PlaylistSource = 'nocturne' | 'spotify_import' | 'apple_import' | 'youtube_import';

export interface PlaylistSourceMetadata {
  provider: 'spotify' | 'apple' | 'youtube' | 'nocturne';
  originalPlaylistId: string;
  importedAt: string;
  totalSpotifyTracks?: number;
  matchedTracksCount?: number;
  unmatchedTracksCount?: number;
  possibleMatchCount?: number;
  lastSyncedAt?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  artwork: string;
  coverUrl?: string; // alias for compatibility
  tracks: Track[];
  creator: string;
  createdAt: string;
  curatedHour?: string; // e.g., "02:00 - 05:00 AM"
  followersCount?: number;
  tracksCount?: number;
  source?: PlaylistSource;
  sourceMetadata?: PlaylistSourceMetadata;
}

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'loading' | 'error';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  isMuted: boolean; // alias for backwards compatibility
  queue: Track[];
  queueIndex: number;
  shuffle: boolean;
  isShuffle: boolean; // alias for backwards compatibility
  repeatMode: 'off' | 'all' | 'one';
  history: Track[];
  isLoading: boolean;
  error?: string | null;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'atmosphere';
  duration?: number;
}
