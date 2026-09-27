import { spotifyAuth } from './spotifyAuth';
import type { ExternalPlaylist, ExternalTrack } from '../importer/types';
import { SPOTIFY_DEMO_PLAYLISTS } from './spotifyDemoData';

export class SpotifyApiService {
  /**
   * Fetches all playlists owned or followed by the authenticated user.
   */
  public async getUserPlaylists(): Promise<ExternalPlaylist[]> {
    if (spotifyAuth.isDemoMode()) {
      return SPOTIFY_DEMO_PLAYLISTS;
    }

    const token = await spotifyAuth.getValidAccessToken();
    if (!token) {
      throw new Error('Spotify session has expired. Please reconnect your account.');
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error('Spotify token expired. Re-authenticating required.');
      }

      if (response.status === 429) {
        throw new Error('Spotify API rate limit exceeded. Please wait a moment and try again.');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch Spotify playlists (${response.status}: ${response.statusText})`);
      }

      const data = await response.json();
      const items: any[] = data.items || [];

      return items
        .filter((item) => item !== null)
        .map((item) => ({
          id: item.id,
          provider: 'spotify' as const,
          title: item.name || 'Untitled Spotify Playlist',
          description: item.description || '',
          artwork: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
          trackCount: item.tracks?.total || 0,
          owner: item.owner?.display_name || item.owner?.id || 'Spotify User',
          isPublic: Boolean(item.public),
        }));
    } catch (err: any) {
      console.warn('[SpotifyApi] Live fetch failed, falling back to demo playlists if in demo mode:', err);
      if (spotifyAuth.isDemoMode() || !spotifyAuth.getClientId()) {
        return SPOTIFY_DEMO_PLAYLISTS;
      }
      throw err;
    }
  }

  /**
   * Fetches tracks for a specific Spotify playlist.
   */
  public async getPlaylistTracks(playlistId: string): Promise<ExternalTrack[]> {
    if (spotifyAuth.isDemoMode()) {
      const found = SPOTIFY_DEMO_PLAYLISTS.find((p) => p.id === playlistId);
      return found?.tracks || [];
    }

    const token = await spotifyAuth.getValidAccessToken();
    if (!token) {
      throw new Error('Spotify session has expired. Please reconnect your account.');
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(id,name,artists,album,duration_ms,explicit,uri,is_playable,preview_url))`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        throw new Error('Spotify token expired. Please reconnect your account.');
      }

      if (response.status === 429) {
        throw new Error('Spotify rate limit encountered. Please try again shortly.');
      }

      if (!response.ok) {
        throw new Error(`Could not load tracks for Spotify playlist (${response.status})`);
      }

      const data = await response.json();
      const items: any[] = data.items || [];

      return items
        .filter((i) => i && i.track && i.track.id)
        .map((i) => {
          const t = i.track;
          const artistName = (t.artists || []).map((a: any) => a.name).join(', ') || 'Unknown Artist';
          const albumName = t.album?.name || 'Single';
          const artworkUrl = t.album?.images?.[0]?.url;

          return {
            id: t.id,
            title: t.name,
            artist: artistName,
            album: albumName,
            duration: Math.round((t.duration_ms || 0) / 1000),
            artwork: artworkUrl,
            originalUri: t.uri,
            previewUrl: t.preview_url || undefined,
            explicit: Boolean(t.explicit),
          };
        });
    } catch (err: any) {
      console.warn(`[SpotifyApi] Live tracks fetch failed for playlist ${playlistId}:`, err);
      const demo = SPOTIFY_DEMO_PLAYLISTS.find((p) => p.id === playlistId);
      if (demo) return demo.tracks || [];
      throw err;
    }
  }
}

export const spotifyApi = new SpotifyApiService();
