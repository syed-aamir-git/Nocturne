import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ExternalPlaylist, UserImportProfile } from '../services/importer/types';
import { spotifyAuth } from '../services/spotify/spotifyAuth';
import { spotifyApi } from '../services/spotify/spotifyApi';
import { useToast } from './ToastContext';

export interface SpotifyContextType {
  isConnected: boolean;
  isConnecting: boolean;
  userProfile: UserImportProfile | null;
  isDemoMode: boolean;
  hasClientId: boolean;
  clientId: string;
  setCustomClientId: (id: string) => void;
  connect: () => Promise<void>;
  connectDemo: () => void;
  disconnect: () => void;
  playlists: ExternalPlaylist[];
  isLoadingPlaylists: boolean;
  loadPlaylists: () => Promise<ExternalPlaylist[]>;
  error: string | null;
  clearError: () => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [isConnected, setIsConnected] = useState(() => spotifyAuth.isAuthenticated());
  const [isConnecting, setIsConnecting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserImportProfile | null>(() => spotifyAuth.getUserProfile());
  const [isDemoMode, setIsDemoMode] = useState(() => spotifyAuth.isDemoMode());
  const [clientId, setClientIdState] = useState(() => spotifyAuth.getClientId());
  const [playlists, setPlaylists] = useState<ExternalPlaylist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasClientId = Boolean(clientId.trim());

  const setCustomClientId = useCallback((id: string) => {
    spotifyAuth.setCustomClientId(id);
    setClientIdState(spotifyAuth.getClientId());
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const disconnect = useCallback(() => {
    spotifyAuth.disconnect();
    setIsConnected(false);
    setUserProfile(null);
    setIsDemoMode(false);
    setPlaylists([]);
    showToast('Spotify Disconnected', 'External account access revoked.', 'default');
  }, [showToast]);

  const connectDemo = useCallback(() => {
    spotifyAuth.enableDemoMode();
    setIsConnected(true);
    setIsDemoMode(true);
    const profile = spotifyAuth.getUserProfile();
    setUserProfile(profile);
    setError(null);
    showToast('Spotify Sandbox Connected', 'Demo playlists loaded for preview & import.', 'atmosphere');
  }, [showToast]);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    const currentId = spotifyAuth.getClientId();
    if (!currentId) {
      setIsConnecting(false);
      // If no client id is set yet, notify user
      setError('Please provide a Spotify Client ID or enter Sandbox mode.');
      return;
    }

    try {
      await spotifyAuth.initiateOAuth();
    } catch (err: any) {
      setIsConnecting(false);
      const msg = err.message || 'Failed to initiate Spotify authorization';
      setError(msg);
      showToast('Spotify Connection Failed', msg, 'error');
    }
  }, [showToast]);

  const loadPlaylists = useCallback(async (): Promise<ExternalPlaylist[]> => {
    if (!spotifyAuth.isAuthenticated()) {
      return [];
    }

    setIsLoadingPlaylists(true);
    setError(null);

    try {
      const items = await spotifyApi.getUserPlaylists();
      setPlaylists(items);
      return items;
    } catch (err: any) {
      const msg = err.message || 'Failed to load Spotify playlists';
      setError(msg);
      showToast('Playlist Fetch Warning', msg, 'warning');
      return [];
    } finally {
      setIsLoadingPlaylists(false);
    }
  }, [showToast]);

  // Synchronize authentication status across tabs / updates
  useEffect(() => {
    const handleStorageChange = () => {
      setIsConnected(spotifyAuth.isAuthenticated());
      setIsDemoMode(spotifyAuth.isDemoMode());
      setUserProfile(spotifyAuth.getUserProfile());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        isConnected,
        isConnecting,
        userProfile,
        isDemoMode,
        hasClientId,
        clientId,
        setCustomClientId,
        connect,
        connectDemo,
        disconnect,
        playlists,
        isLoadingPlaylists,
        loadPlaylists,
        error,
        clearError,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = (): SpotifyContextType => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};
