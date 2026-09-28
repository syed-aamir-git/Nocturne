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

  getFollowedArtistIds(): string[] {
    try {
      const stored = localStorage.getItem('nocturne_followed_artist_ids_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return ['art-1', 'art-2'];
    } catch {
      return ['art-1', 'art-2'];
    }
  },

  saveFollowedArtistIds(ids: string[]): void {
    try {
      localStorage.setItem('nocturne_followed_artist_ids_v1', JSON.stringify(ids));
    } catch (e) {
      console.warn('[StorageService] Error saving followed artists:', e);
    }
  },

  getSavedAlbumIds(): string[] {
    try {
      const stored = localStorage.getItem('nocturne_saved_album_ids_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return ['alb-1', 'alb-2'];
    } catch {
      return ['alb-1', 'alb-2'];
    }
  },

  saveSavedAlbumIds(ids: string[]): void {
    try {
      localStorage.setItem('nocturne_saved_album_ids_v1', JSON.stringify(ids));
    } catch (e) {
      console.warn('[StorageService] Error saving saved albums:', e);
    }
  },

  /**
   * Helper to look up track details by ID from MOCK_TRACKS
   */
  getTrackById(id: string): Track | undefined {
    return MOCK_TRACKS.find((t) => t.id === id);
  },

  /**
   * Search history persistence
   */
  getSearchHistory(): string[] {
    try {
      const stored = localStorage.getItem('nocturne_search_history_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return ['Gothic Darkwave', 'Vespera', 'Abyssal Solitude', 'Tape Hiss'];
    } catch {
      return ['Gothic Darkwave', 'Vespera', 'Abyssal Solitude', 'Tape Hiss'];
    }
  },

  addSearchHistory(query: string): string[] {
    const trimmed = query.trim();
    if (!trimmed) return this.getSearchHistory();
    try {
      const current = this.getSearchHistory().filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...current].slice(0, 10);
      localStorage.setItem('nocturne_search_history_v1', JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('[StorageService] Error saving search history:', e);
      return [];
    }
  },

  removeSearchHistoryItem(query: string): string[] {
    try {
      const current = this.getSearchHistory().filter(
        (item) => item.toLowerCase() !== query.toLowerCase()
      );
      localStorage.setItem('nocturne_search_history_v1', JSON.stringify(current));
      return current;
    } catch {
      return [];
    }
  },

  clearSearchHistory(): void {
    try {
      localStorage.removeItem('nocturne_search_history_v1');
    } catch (e) {
      console.warn('[StorageService] Error clearing search history:', e);
    }
  },
};
