import type { Playlist, Track, UserAccountProfile, PrivacySettings } from '../types';
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

  getUserProfile(): UserAccountProfile {
    try {
      const stored = localStorage.getItem('nocturne_account_profile_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            name: parsed.name || 'Nocturne Wanderer',
            username: parsed.username || 'nocturne_wanderer',
            avatarUrl:
              parsed.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
            email: parsed.email || 'wanderer@nocturne.sanctum',
            bio:
              parsed.bio ||
              'Dweller in midnight ambience, listening to darkwave acoustics and crystalline frequencies.',
            membershipTier: parsed.membershipTier || 'Archon (24-bit / 96kHz Master FLAC)',
            memberSince: parsed.memberSince || 'October 2024',
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      name: 'Nocturne Wanderer',
      username: 'nocturne_wanderer',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      email: 'wanderer@nocturne.sanctum',
      bio: 'Dweller in midnight ambience, listening to darkwave acoustics and crystalline frequencies.',
      membershipTier: 'Archon (24-bit / 96kHz Master FLAC)',
      memberSince: 'October 2024',
    };
  },

  saveUserProfile(profile: UserAccountProfile): void {
    try {
      localStorage.setItem('nocturne_account_profile_v1', JSON.stringify(profile));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nocturne:profile-updated', { detail: profile }));
      }
    } catch (e) {
      console.warn('[StorageService] Error saving user profile:', e);
    }
  },

  getPrivacySettings(): PrivacySettings {
    try {
      const stored = localStorage.getItem('nocturne_privacy_settings_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            listeningHistoryEnabled: parsed.listeningHistoryEnabled ?? true,
            activityVisibility: parsed.activityVisibility ?? false,
            personalizedRecommendations: parsed.personalizedRecommendations ?? true,
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      listeningHistoryEnabled: true,
      activityVisibility: false,
      personalizedRecommendations: true,
    };
  },

  savePrivacySettings(settings: PrivacySettings): void {
    try {
      localStorage.setItem('nocturne_privacy_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.warn('[StorageService] Error saving privacy settings:', e);
    }
  },
};
