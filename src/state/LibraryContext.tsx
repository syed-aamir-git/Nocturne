import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { Playlist, Track } from '../types';
import { storageService } from '../services/storageService';
import { MOCK_TRACKS } from '../data/mockData';

export interface CreatePlaylistInput {
  title: string;
  description?: string;
  artwork?: string;
  initialTracks?: Track[];
  source?: Playlist['source'];
  sourceMetadata?: Playlist['sourceMetadata'];
  creator?: string;
}

export interface LibraryContextType {
  likedTrackIds: Set<string>;
  followedArtistIds: Set<string>;
  savedAlbumIds: Set<string>;
  playlists: Playlist[];
  isLiked: (trackId: string) => boolean;
  toggleLike: (track: Track) => boolean;
  likeTrack: (track: Track) => void;
  unlikeTrack: (trackId: string) => void;
  isArtistFollowed: (artistId: string) => boolean;
  toggleFollowArtist: (artistId: string) => boolean;
  isAlbumSaved: (albumId: string) => boolean;
  toggleSaveAlbum: (albumId: string) => boolean;
  getLikedTracks: () => Track[];
  createPlaylist: (input: CreatePlaylistInput) => Playlist;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  duplicatePlaylist: (id: string) => Playlist | null;
  addTrackToPlaylist: (playlistId: string, track: Track) => boolean;
  addTracksToPlaylist: (playlistId: string, tracks: Track[]) => number;
  removeTrackFromPlaylist: (playlistId: string, trackIndex: number) => void;
  reorderPlaylistTracks: (playlistId: string, fromIndex: number, toIndex: number) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(() => {
    return new Set(storageService.getLikedTrackIds());
  });

  const [followedArtistIds, setFollowedArtistIds] = useState<Set<string>>(() => {
    return new Set(storageService.getFollowedArtistIds());
  });

  const [savedAlbumIds, setSavedAlbumIds] = useState<Set<string>>(() => {
    return new Set(storageService.getSavedAlbumIds());
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    return storageService.getPlaylists();
  });

  // Persist liked tracks whenever changed
  useEffect(() => {
    storageService.saveLikedTrackIds(Array.from(likedTrackIds));
  }, [likedTrackIds]);

  // Persist followed artists
  useEffect(() => {
    storageService.saveFollowedArtistIds(Array.from(followedArtistIds));
  }, [followedArtistIds]);

  // Persist saved albums
  useEffect(() => {
    storageService.saveSavedAlbumIds(Array.from(savedAlbumIds));
  }, [savedAlbumIds]);

  // Persist playlists whenever changed
  useEffect(() => {
    storageService.savePlaylists(playlists);
  }, [playlists]);

  const isLiked = useCallback(
    (trackId: string): boolean => {
      return likedTrackIds.has(trackId);
    },
    [likedTrackIds]
  );

  const toggleLike = useCallback((track: Track): boolean => {
    let nextLiked = false;
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(track.id)) {
        next.delete(track.id);
        nextLiked = false;
      } else {
        next.add(track.id);
        nextLiked = true;
      }
      return next;
    });
    return nextLiked;
  }, []);

  const isArtistFollowed = useCallback(
    (artistId: string): boolean => {
      return followedArtistIds.has(artistId);
    },
    [followedArtistIds]
  );

  const toggleFollowArtist = useCallback((artistId: string): boolean => {
    let nextFollowed = false;
    setFollowedArtistIds((prev) => {
      const next = new Set(prev);
      if (next.has(artistId)) {
        next.delete(artistId);
        nextFollowed = false;
      } else {
        next.add(artistId);
        nextFollowed = true;
      }
      return next;
    });
    return nextFollowed;
  }, []);

  const isAlbumSaved = useCallback(
    (albumId: string): boolean => {
      return savedAlbumIds.has(albumId);
    },
    [savedAlbumIds]
  );

  const toggleSaveAlbum = useCallback((albumId: string): boolean => {
    let nextSaved = false;
    setSavedAlbumIds((prev) => {
      const next = new Set(prev);
      if (next.has(albumId)) {
        next.delete(albumId);
        nextSaved = false;
      } else {
        next.add(albumId);
        nextSaved = true;
      }
      return next;
    });
    return nextSaved;
  }, []);

  const likeTrack = useCallback((track: Track) => {
    setLikedTrackIds((prev) => {
      if (prev.has(track.id)) return prev;
      const next = new Set(prev);
      next.add(track.id);
      return next;
    });
  }, []);

  const unlikeTrack = useCallback((trackId: string) => {
    setLikedTrackIds((prev) => {
      if (!prev.has(trackId)) return prev;
      const next = new Set(prev);
      next.delete(trackId);
      return next;
    });
  }, []);

  const getLikedTracks = useCallback((): Track[] => {
    const list: Track[] = [];
    // Maintain deterministic ordering based on mock tracks
    MOCK_TRACKS.forEach((track) => {
      if (likedTrackIds.has(track.id)) {
        list.push(track);
      }
    });
    return list;
  }, [likedTrackIds]);

  const createPlaylist = useCallback((input: CreatePlaylistInput): Playlist => {
    const newId = `pl-user-${Date.now()}`;
    const newPlaylist: Playlist = {
      id: newId,
      title: input.title.trim() || 'Untitled Nocturne Ritual',
      description:
        input.description?.trim() ||
        'A sequence of midnight frequencies woven for solitary listening.',
      artwork:
        input.artwork?.trim() ||
        input.initialTracks?.[0]?.artwork ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      coverUrl:
        input.artwork?.trim() ||
        input.initialTracks?.[0]?.artwork ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      tracks: input.initialTracks ? [...input.initialTracks] : [],
      creator: input.creator || 'You',
      createdAt: new Date().toISOString().split('T')[0],
      curatedHour: input.source === 'spotify_import' ? 'Spotify Import' : 'Midnight Sanctuary',
      tracksCount: input.initialTracks?.length || 0,
      followersCount: 1,
      source: input.source || 'nocturne',
      sourceMetadata: input.sourceMetadata,
    };

    setPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  }, []);

  const updatePlaylist = useCallback((id: string, updates: Partial<Playlist>) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== id) return pl;
        const updated = { ...pl, ...updates };
        if (updates.tracks) {
          updated.tracksCount = updates.tracks.length;
        }
        if (updates.artwork) {
          updated.coverUrl = updates.artwork;
        }
        return updated;
      })
    );
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
  }, []);

  const duplicatePlaylist = useCallback(
    (id: string): Playlist | null => {
      const target = playlists.find((p) => p.id === id);
      if (!target) return null;

      const duplicatedId = `pl-dup-${Date.now()}`;
      const duplicated: Playlist = {
        ...target,
        id: duplicatedId,
        title: `${target.title} (Echo)`,
        creator: 'You',
        createdAt: new Date().toISOString().split('T')[0],
        tracks: [...target.tracks],
        tracksCount: target.tracks.length,
      };

      setPlaylists((prev) => [duplicated, ...prev]);
      return duplicated;
    },
    [playlists]
  );

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track): boolean => {
    let added = false;
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        // Don't add duplicate if track is already in the playlist
        const exists = pl.tracks.some((t) => t.id === track.id);
        if (exists) return pl;
        added = true;
        const newTracks = [...pl.tracks, track];
        return {
          ...pl,
          tracks: newTracks,
          tracksCount: newTracks.length,
        };
      })
    );
    return added;
  }, []);

  const addTracksToPlaylist = useCallback((playlistId: string, newTracks: Track[]): number => {
    let countAdded = 0;
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const existingIds = new Set(pl.tracks.map((t) => t.id));
        const filteredNew = newTracks.filter((t) => !existingIds.has(t.id));
        countAdded = filteredNew.length;
        const merged = [...pl.tracks, ...filteredNew];
        return {
          ...pl,
          tracks: merged,
          tracksCount: merged.length,
        };
      })
    );
    return countAdded;
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackIndex: number) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const newTracks = pl.tracks.filter((_, idx) => idx !== trackIndex);
        return {
          ...pl,
          tracks: newTracks,
          tracksCount: newTracks.length,
        };
      })
    );
  }, []);

  const reorderPlaylistTracks = useCallback(
    (playlistId: string, fromIndex: number, toIndex: number) => {
      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id !== playlistId) return pl;
          if (
            fromIndex < 0 ||
            fromIndex >= pl.tracks.length ||
            toIndex < 0 ||
            toIndex >= pl.tracks.length
          ) {
            return pl;
          }
          const updated = [...pl.tracks];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          return {
            ...pl,
            tracks: updated,
          };
        })
      );
    },
    []
  );

  const getPlaylistById = useCallback(
    (id: string): Playlist | undefined => {
      return playlists.find((p) => p.id === id);
    },
    [playlists]
  );

  const contextValue = useMemo(
    () => ({
      likedTrackIds,
      followedArtistIds,
      savedAlbumIds,
      playlists,
      isLiked,
      toggleLike,
      likeTrack,
      unlikeTrack,
      isArtistFollowed,
      toggleFollowArtist,
      isAlbumSaved,
      toggleSaveAlbum,
      getLikedTracks,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      duplicatePlaylist,
      addTrackToPlaylist,
      addTracksToPlaylist,
      removeTrackFromPlaylist,
      reorderPlaylistTracks,
      getPlaylistById,
    }),
    [
      likedTrackIds,
      followedArtistIds,
      savedAlbumIds,
      playlists,
      isLiked,
      toggleLike,
      likeTrack,
      unlikeTrack,
      isArtistFollowed,
      toggleFollowArtist,
      isAlbumSaved,
      toggleSaveAlbum,
      getLikedTracks,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      duplicatePlaylist,
      addTrackToPlaylist,
      addTracksToPlaylist,
      removeTrackFromPlaylist,
      reorderPlaylistTracks,
      getPlaylistById,
    ]
  );

  return <LibraryContext.Provider value={contextValue}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
