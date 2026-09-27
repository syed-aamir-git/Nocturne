import type { MusicImporter } from '../importer/MusicImporter';
import type { ImportProviderId, ExternalPlaylist, ExternalTrack, UserImportProfile } from '../importer/types';
import { spotifyAuth } from './spotifyAuth';
import { spotifyApi } from './spotifyApi';
import { ImporterRegistry } from '../importer/ImporterRegistry';

export class SpotifyImporter implements MusicImporter {
  public readonly providerId: ImportProviderId = 'spotify';
  public readonly providerName = 'Spotify';

  public isAuthenticated(): boolean {
    return spotifyAuth.isAuthenticated();
  }

  public async getUserProfile(): Promise<UserImportProfile | null> {
    return spotifyAuth.getUserProfile();
  }

  public async getUserPlaylists(): Promise<ExternalPlaylist[]> {
    return spotifyApi.getUserPlaylists();
  }

  public async getPlaylistTracks(playlistId: string): Promise<ExternalTrack[]> {
    return spotifyApi.getPlaylistTracks(playlistId);
  }

  public async disconnect(): Promise<void> {
    spotifyAuth.disconnect();
  }
}

export const spotifyImporter = new SpotifyImporter();
ImporterRegistry.register(spotifyImporter);
