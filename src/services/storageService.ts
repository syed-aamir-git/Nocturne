import type { Playlist, Track } from '../types';
import { MOCK_PLAYLISTS, MOCK_TRACKS } from '../data/mockData';

const LIKED_TRACKS_KEY = 'nocturne_liked_track_ids_v1';
const PLAYLISTS_KEY = 'nocturne_playlists_v1';

// Initial default favorites to give the platform an immediate atmospheric feel
const DEFAULT_LIKED_TRACK_IDS = [
  'tr-1',  // Hymn to the Violet Hour
  'tr-2',  // Cremation of the Moon
  'tr-10', // Abyssal Drift
  'tr-18', // Tape Hiss & Broken Strings
  'tr-22', // Neon Sepulchre
  'tr-25', // Crypt of the Forgotten Sovereign
];

export const storageService = {
  getLikedTrackIds(): string[] {
    try {
      const stored = localStorage.getItem(LIKED_TRACKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      // Initialize with default liked tracks
      localStorage.setItem(LIKED_TRACKS_KEY, JSON.stringify(DEFAULT_LIKED_TRACK_IDS));
      return DEFAULT_LIKED_TRACK_IDS;
    } catch (e) {
      console.warn('[StorageService] Error reading liked tracks from localStorage:', e);
      return DEFAULT_LIKED_TRACK_IDS;
    }
  },

  saveLikedTrackIds(ids: string[]): void {
    try {
      localStorage.setItem(LIKED_TRACKS_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('[StorageService] Error saving liked tracks to localStorage:', e);
    }
  },

  getPlaylists(): Playlist[] {
    try {
      const stored = localStorage.getItem(PLAYLISTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Initialize with default mock playlists
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(MOCK_PLAYLISTS));
      return MOCK_PLAYLISTS;
    } catch (e) {
      console.warn('[StorageService] Error reading playlists from localStorage:', e);
      return MOCK_PLAYLISTS;
    }
  },

  savePlaylists(playlists: Playlist[]): void {
    try {
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch (e) {
      console.warn('[StorageService] Error saving playlists to localStorage:', e);
    }
  },

  /**
   * Helper to look up track details by ID from MOCK_TRACKS
   */
  getTrackById(id: string): Track | undefined {
    return MOCK_TRACKS.find((t) => t.id === id);
  },

  /**
   * Helper to get full Track objects for a list of track IDs
   */
  getTracksByIds(ids: string[]): Track[] {
    const map = new Map<string, Track>();
    MOCK_TRACKS.forEach((t) => map.set(t.id, t));
    return ids.map((id) => map.get(id)).filter((t): t is Track => t !== undefined);
  },
};
