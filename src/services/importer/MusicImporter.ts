import type { ImportProviderId, ExternalPlaylist, ExternalTrack, UserImportProfile } from './types';

export interface MusicImporter {
  readonly providerId: ImportProviderId;
  readonly providerName: string;

  /** Check if the provider is currently connected and authenticated */
  isAuthenticated(): boolean;

  /** Fetch authenticated user profile details */
  getUserProfile(): Promise<UserImportProfile | null>;

  /** Fetch user's playlists from the external service */
  getUserPlaylists(): Promise<ExternalPlaylist[]>;

  /** Fetch all tracks for a specific playlist from the external service */
  getPlaylistTracks(playlistId: string): Promise<ExternalTrack[]>;

  /** Terminate session and disconnect the service */
  disconnect(): Promise<void>;
}
