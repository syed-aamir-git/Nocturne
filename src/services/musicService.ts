import type { Album, Artist, Playlist, Track } from '../types';
import { MOCK_ALBUMS, MOCK_ARTISTS, MOCK_TRACKS } from '../data/mockData';
import { storageService } from './storageService';
import { catalogService } from './catalogService';

export interface MoodCategory {
  id: string;
  name: string;
  desc: string;
  genre: string;
}

export interface SearchResult {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  genres: string[];
}

export interface MusicServiceInterface {
  getAllTracks(): Promise<Track[]>;
  getFeaturedTracks(): Promise<Track[]>;
  getAllAlbums(): Promise<Album[]>;
  getFeaturedAlbums(): Promise<Album[]>;
  getAlbumById(id: string): Promise<Album | null>;
  getAllPlaylists(): Promise<Playlist[]>;
  getFeaturedPlaylists(): Promise<Playlist[]>;
  getPlaylistById(id: string): Promise<Playlist | null>;
  getAllArtists(): Promise<Artist[]>;
  getFeaturedArtists(): Promise<Artist[]>;
  getArtistById(id: string): Promise<Artist | null>;
  getSimilarArtists(artistId: string): Promise<Artist[]>;
  getTracksByArtist(artistId: string): Promise<Track[]>;
  getTracksByAlbum(albumId: string): Promise<Track[]>;
  getTracksByGenre(genre: string): Promise<Track[]>;
  getGenres(): Promise<string[]>;
  getMoods(): Promise<MoodCategory[]>;
  search(query: string): Promise<SearchResult>;
}

/**
 * Backend-ready Mock Implementation of MusicService.
 * Can be effortlessly swapped with a REST API / GraphQL backend in production.
 */
class MusicService implements MusicServiceInterface {
  private simulateDelay<T>(data: T, ms: number = 30): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
  }

  public async getAllTracks(): Promise<Track[]> {
    return this.simulateDelay([...MOCK_TRACKS]);
  }

  public async getFeaturedTracks(): Promise<Track[]> {
    return this.simulateDelay(MOCK_TRACKS.slice(0, 10));
  }

  public async getAllAlbums(): Promise<Album[]> {
    return this.simulateDelay([...MOCK_ALBUMS]);
  }

  public async getFeaturedAlbums(): Promise<Album[]> {
    return this.simulateDelay(MOCK_ALBUMS.filter((a) => !a.isSingle));
  }

  public async getAlbumById(id: string): Promise<Album | null> {
    const album = MOCK_ALBUMS.find((a) => a.id === id) || null;
    return this.simulateDelay(album);
  }

  public async getAllPlaylists(): Promise<Playlist[]> {
    return this.simulateDelay(storageService.getPlaylists());
  }

  public async getFeaturedPlaylists(): Promise<Playlist[]> {
    return this.simulateDelay(storageService.getPlaylists());
  }

  public async getPlaylistById(id: string): Promise<Playlist | null> {
    const playlists = storageService.getPlaylists();
    const playlist = playlists.find((p) => p.id === id) || null;
    return this.simulateDelay(playlist);
  }

  public async getAllArtists(): Promise<Artist[]> {
    return this.simulateDelay([...MOCK_ARTISTS]);
  }

  public async getFeaturedArtists(): Promise<Artist[]> {
    return this.simulateDelay([...MOCK_ARTISTS]);
  }

  public async getArtistById(id: string): Promise<Artist | null> {
    const artist = MOCK_ARTISTS.find((a) => a.id === id) || null;
    return this.simulateDelay(artist);
  }

  public async getSimilarArtists(artistId: string): Promise<Artist[]> {
    const current = MOCK_ARTISTS.find((a) => a.id === artistId);
    if (!current) {
      return this.simulateDelay(MOCK_ARTISTS.filter((a) => a.id !== artistId).slice(0, 4));
    }
    const currentGenres = new Set(current.genres.map((g) => g.toLowerCase()));
    const others = MOCK_ARTISTS.filter((a) => a.id !== artistId);

    const scored = others.map((other) => {
      let score = 0;
      other.genres.forEach((g) => {
        if (currentGenres.has(g.toLowerCase())) score += 2;
      });
      return { artist: other, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const result = scored.slice(0, 4).map((s) => s.artist);
    return this.simulateDelay(result);
  }

  public async getTracksByArtist(artistId: string): Promise<Track[]> {
    const tracks = MOCK_TRACKS.filter((t) => t.artistId === artistId);
    return this.simulateDelay(tracks);
  }

  public async getTracksByAlbum(albumId: string): Promise<Track[]> {
    const album = MOCK_ALBUMS.find((a) => a.id === albumId);
    if (album && album.tracks && album.tracks.length > 0) {
      return this.simulateDelay(album.tracks);
    }
    const tracks = MOCK_TRACKS.filter((t) => t.albumId === albumId);
    return this.simulateDelay(tracks);
  }

  public async getTracksByGenre(genre: string): Promise<Track[]> {
    const normalized = genre.toLowerCase();
    const tracks = MOCK_TRACKS.filter((t) => t.genre.toLowerCase().includes(normalized));
    return this.simulateDelay(tracks);
  }

  public async getGenres(): Promise<string[]> {
    const set = new Set<string>();
    MOCK_TRACKS.forEach((t) => set.add(t.genre));
    MOCK_ALBUMS.forEach((a) => set.add(a.genre));
    return this.simulateDelay(Array.from(set));
  }

  public async getMoods(): Promise<MoodCategory[]> {
    return this.simulateDelay([
      {
        id: 'abyssal-solitude',
        name: 'Abyssal Solitude',
        desc: 'Sub-bass drones and deep space reverberations for lone contemplation',
        genre: 'Dark Ambient Drone',
      },
      {
        id: 'rain-stained-glass',
        name: 'Rain on Stained Glass',
        desc: 'Gentle slowcore melodies meeting crepuscular rain',
        genre: 'Midnight Slowcore',
      },
      {
        id: '3am-drift',
        name: 'The 3 AM Drift',
        desc: 'Minimal cello passages and slow-decay acoustics',
        genre: 'Gothic Neoclassical',
      },
      {
        id: 'witching-chamber',
        name: 'Witching Hour Chamber',
        desc: 'Liturgical strings and cathedral choir echoes',
        genre: 'Gothic Neoclassical',
      },
      {
        id: 'iron-crypt',
        name: 'Iron Crypt Reverie',
        desc: 'Medieval synthesis and archaic dungeon acoustics',
        genre: 'Dungeon Synth',
      },
      {
        id: 'cyber-nocturne',
        name: 'Cybernetic Isolation',
        desc: 'Hypnotic dark electronic pulses for insomnia and deep focus',
        genre: 'Coldwave / EBM',
      },
    ]);
  }

  public async search(query: string): Promise<SearchResult> {
    const q = query.toLowerCase().trim();
    if (!q) {
      return this.simulateDelay({ tracks: [], albums: [], artists: [], playlists: [], genres: [] });
    }

    // 1. Instant local sanctuary matches
    const localTracks = MOCK_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        (t.vibe && t.vibe.toLowerCase().includes(q)) ||
        t.genre.toLowerCase().includes(q)
    );

    const localAlbums = MOCK_ALBUMS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q)
    );

    const localArtists = MOCK_ARTISTS.filter(
      (ar) =>
        ar.name.toLowerCase().includes(q) ||
        ar.genres.some((g) => g.toLowerCase().includes(q))
    );

    const allPlaylists = storageService.getPlaylists();
    const playlists = allPlaylists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.creator.toLowerCase().includes(q)
    );

    const allGenres = Array.from(
      new Set([...MOCK_TRACKS.map((t) => t.genre), ...MOCK_ALBUMS.map((a) => a.genre)])
    );
    const genres = allGenres.filter((g) => g.toLowerCase().includes(q));

    // 2. Fetch from 100M+ global music catalog & live Spotify
    try {
      const globalResults = await catalogService.searchGlobal(q);

      // Deduplicate tracks (local take precedence)
      const existingTrackKeys = new Set(localTracks.map((t) => `${t.title.toLowerCase()}:${t.artist.toLowerCase()}`));
      const additionalTracks = globalResults.tracks.filter(
        (t) => !existingTrackKeys.has(`${t.title.toLowerCase()}:${t.artist.toLowerCase()}`)
      );

      // Deduplicate albums
      const existingAlbKeys = new Set(localAlbums.map((a) => a.title.toLowerCase()));
      const additionalAlbums = globalResults.albums.filter(
        (a) => !existingAlbKeys.has(a.title.toLowerCase())
      );

      // Deduplicate artists
      const existingArtKeys = new Set(localArtists.map((a) => a.name.toLowerCase()));
      const additionalArtists = globalResults.artists.filter(
        (a) => !existingArtKeys.has(a.name.toLowerCase())
      );

      return {
        tracks: [...localTracks, ...additionalTracks],
        albums: [...localAlbums, ...additionalAlbums],
        artists: [...localArtists, ...additionalArtists],
        playlists,
        genres,
      };
    } catch (err) {
      console.warn('[MusicService] Global search fallback to local:', err);
      return { tracks: localTracks, albums: localAlbums, artists: localArtists, playlists, genres };
    }
  }
}

export const musicService = new MusicService();
