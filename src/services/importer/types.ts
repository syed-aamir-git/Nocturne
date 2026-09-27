import type { Track } from '../../types';

export type ImportProviderId = 'spotify' | 'apple' | 'youtube';

export interface ExternalTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  artwork?: string;
  isrc?: string;
  originalUri?: string;
  previewUrl?: string;
  explicit?: boolean;
}

export interface ExternalPlaylist {
  id: string;
  provider: ImportProviderId;
  title: string;
  description?: string;
  artwork?: string;
  trackCount: number;
  owner: string;
  isPublic: boolean;
  tracks?: ExternalTrack[];
}

export interface TrackMatchResult {
  original: ExternalTrack;
  matchedTrack?: Track;
  status: 'matched' | 'unmatched' | 'possible';
  confidence: number; // 0.0 to 1.0
  reason?: string;
}

export interface PlaylistImportPreview {
  playlist: ExternalPlaylist;
  totalTracks: number;
  matchedCount: number;
  unmatchedCount: number;
  possibleCount: number;
  matches: TrackMatchResult[];
}

export interface UserImportProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  provider: ImportProviderId;
  product?: string;
}
