import type { Album, Artist, Playlist, Track } from '../types';
import { MOCK_ALBUMS, MOCK_ARTISTS, MOCK_PLAYLISTS, MOCK_TRACKS } from '../data/mockData';

export interface MusicServiceInterface {
  getFeaturedTracks(): Promise<Track[]>;
  getFeaturedAlbums(): Promise<Album[]>;
  getFeaturedPlaylists(): Promise<Playlist[]>;
  getFeaturedArtists(): Promise<Artist[]>;
  getAlbumById(id: string): Promise<Album | null>;
  getArtistById(id: string): Promise<Artist | null>;
  getPlaylistById(id: string): Promise<Playlist | null>;
  search(query: string): Promise<{ tracks: Track[]; albums: Album[]; artists: Artist[] }>;
}

/**
 * Backend-ready Mock Implementation of MusicService.
 * Can be replaced or configured to point to a REST API / GraphQL backend in production.
 */
class MusicService implements MusicServiceInterface {
  private simulateDelay<T>(data: T, ms: number = 50): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
  }

  public async getFeaturedTracks(): Promise<Track[]> {
    return this.simulateDelay([...MOCK_TRACKS]);
  }

  public async getFeaturedAlbums(): Promise<Album[]> {
    return this.simulateDelay([...MOCK_ALBUMS]);
  }

  public async getFeaturedPlaylists(): Promise<Playlist[]> {
    return this.simulateDelay([...MOCK_PLAYLISTS]);
  }

  public async getFeaturedArtists(): Promise<Artist[]> {
    return this.simulateDelay([...MOCK_ARTISTS]);
  }

  public async getAlbumById(id: string): Promise<Album | null> {
    const album = MOCK_ALBUMS.find((a) => a.id === id) || null;
    return this.simulateDelay(album);
  }

  public async getArtistById(id: string): Promise<Artist | null> {
    const artist = MOCK_ARTISTS.find((a) => a.id === id) || null;
    return this.simulateDelay(artist);
  }

  public async getPlaylistById(id: string): Promise<Playlist | null> {
    const playlist = MOCK_PLAYLISTS.find((p) => p.id === id) || null;
    return this.simulateDelay(playlist);
  }

  public async search(query: string): Promise<{ tracks: Track[]; albums: Album[]; artists: Artist[] }> {
    const q = query.toLowerCase().trim();
    if (!q) {
      return this.simulateDelay({ tracks: [], albums: [], artists: [] });
    }

    const tracks = MOCK_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        (t.vibe && t.vibe.toLowerCase().includes(q))
    );

    const albums = MOCK_ALBUMS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q)
    );

    const artists = MOCK_ARTISTS.filter(
      (ar) =>
        ar.name.toLowerCase().includes(q) ||
        ar.genres.some((g) => g.toLowerCase().includes(q))
    );

    return this.simulateDelay({ tracks, albums, artists });
  }
}

export const musicService = new MusicService();
