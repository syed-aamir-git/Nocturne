import type { UserImportProfile } from '../importer/types';

const TOKEN_KEY = 'nocturne_spotify_access_token';
const REFRESH_KEY = 'nocturne_spotify_refresh_token';
const EXPIRES_AT_KEY = 'nocturne_spotify_expires_at';
const USER_KEY = 'nocturne_spotify_user_profile';
const DEMO_MODE_KEY = 'nocturne_spotify_demo_mode';
const CUSTOM_CLIENT_ID_KEY = 'nocturne_spotify_custom_client_id';

const SPOTIFY_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-private',
  'user-read-email',
].join(' ');

/**
 * Generates a cryptographically random string for PKCE code_verifier.
 */
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

/**
 * Computes base64url(SHA256(codeVerifier)) for PKCE code_challenge.
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // ignore
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  },
};

export class SpotifyAuthService {
  /**
   * Retrieves the configured Spotify Client ID from:
   * 1. Environment variable (VITE_SPOTIFY_CLIENT_ID)
   * 2. User-configured custom client ID in localStorage
   */
  public getClientId(): string {
    const envId =
      typeof import.meta !== 'undefined' && import.meta.env
        ? import.meta.env.VITE_SPOTIFY_CLIENT_ID
        : undefined;
    if (envId && envId.trim() && envId !== 'your_spotify_client_id_here') {
      return envId.trim();
    }
    const saved = safeStorage.getItem(CUSTOM_CLIENT_ID_KEY);
    return saved ? saved.trim() : '';
  }

  public setCustomClientId(clientId: string) {
    if (clientId.trim()) {
      safeStorage.setItem(CUSTOM_CLIENT_ID_KEY, clientId.trim());
    } else {
      safeStorage.removeItem(CUSTOM_CLIENT_ID_KEY);
    }
  }

  public getRedirectUri(): string {
    const envUri =
      typeof import.meta !== 'undefined' && import.meta.env
        ? import.meta.env.VITE_SPOTIFY_REDIRECT_URI
        : undefined;
    if (envUri && envUri.trim()) {
      return envUri.trim();
    }
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.origin}/callback`;
    }
    return 'http://localhost:5173/callback';
  }

  public isDemoMode(): boolean {
    return safeStorage.getItem(DEMO_MODE_KEY) === 'true';
  }

  public enableDemoMode(profile?: UserImportProfile) {
    safeStorage.setItem(DEMO_MODE_KEY, 'true');
    const demoUser: UserImportProfile = profile || {
      id: 'spotify-demo-nocturne',
      name: 'Nocturne Pilgrim',
      email: 'pilgrim@nocturne.sanctuary',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      provider: 'spotify',
      product: 'Premium',
    };
    safeStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    safeStorage.setItem(TOKEN_KEY, 'demo_access_token_' + Date.now());
    safeStorage.setItem(EXPIRES_AT_KEY, String(Date.now() + 3600 * 1000));
  }

  /**
   * Begins Spotify OAuth 2.0 PKCE Authorization flow.
   * Redirects user to Spotify Accounts.
   */
  public async initiateOAuth(): Promise<void> {
    const clientId = this.getClientId();
    if (!clientId) {
      throw new Error('NO_CLIENT_ID');
    }

    const redirectUri = this.getRedirectUri();
    const state = generateRandomString(16);
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('spotify_auth_state', state);
    sessionStorage.setItem('spotify_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: SPOTIFY_SCOPES,
      redirect_uri: redirectUri,
      state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Handles returning OAuth redirect callback:
   * Validates state, exchanges code for tokens, and fetches user profile.
   */
  public async handleCallback(code: string, state: string): Promise<UserImportProfile> {
    const savedState = sessionStorage.getItem('spotify_auth_state');
    const codeVerifier = sessionStorage.getItem('spotify_code_verifier');

    sessionStorage.removeItem('spotify_auth_state');
    sessionStorage.removeItem('spotify_code_verifier');

    if (!state || state !== savedState) {
      throw new Error('State mismatch. Authorization attempt expired or was tampered with.');
    }

    if (!codeVerifier) {
      throw new Error('Code verifier missing. Authorization session expired.');
    }

    const clientId = this.getClientId();
    const redirectUri = this.getRedirectUri();

    // Exchange code for tokens via PKCE
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errJson = await tokenResponse.json().catch(() => ({}));
      throw new Error(errJson.error_description || errJson.error || 'Failed to exchange authorization code');
    }

    const tokenData = await tokenResponse.json();
    this.saveTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);

    // Fetch user profile
    const profile = await this.fetchUserProfile(tokenData.access_token);
    safeStorage.setItem(USER_KEY, JSON.stringify(profile));
    safeStorage.removeItem(DEMO_MODE_KEY);

    return profile;
  }

  private saveTokens(accessToken: string, refreshToken?: string, expiresIn = 3600) {
    safeStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      safeStorage.setItem(REFRESH_KEY, refreshToken);
    }
    const expiresAt = Date.now() + (expiresIn - 60) * 1000;
    safeStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }

  /**
   * Returns a valid access token, auto-refreshing if expired.
   */
  public async getValidAccessToken(): Promise<string | null> {
    if (this.isDemoMode()) {
      return safeStorage.getItem(TOKEN_KEY) || 'demo_token';
    }

    const token = safeStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const expiresAt = Number(safeStorage.getItem(EXPIRES_AT_KEY) || 0);
    if (Date.now() < expiresAt) {
      return token;
    }

    // Attempt token refresh
    const refreshToken = safeStorage.getItem(REFRESH_KEY);
    const clientId = this.getClientId();
    if (!refreshToken || !clientId) {
      this.disconnect();
      return null;
    }

    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!res.ok) {
        throw new Error('Refresh failed');
      }

      const data = await res.json();
      this.saveTokens(data.access_token, data.refresh_token, data.expires_in);
      return data.access_token;
    } catch (err) {
      console.warn('[SpotifyAuth] Token refresh failed:', err);
      this.disconnect();
      return null;
    }
  }

  public async fetchUserProfile(accessToken: string): Promise<UserImportProfile> {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user profile (${res.status})`);
    }

    const json = await res.json();
    return {
      id: json.id,
      name: json.display_name || json.id,
      email: json.email,
      avatarUrl: json.images?.[0]?.url,
      provider: 'spotify',
      product: json.product,
    };
  }

  public getUserProfile(): UserImportProfile | null {
    const raw = safeStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    if (this.isDemoMode()) {
      return Boolean(safeStorage.getItem(TOKEN_KEY));
    }
    const token = safeStorage.getItem(TOKEN_KEY);
    const expiresAt = Number(safeStorage.getItem(EXPIRES_AT_KEY) || 0);
    const refreshToken = safeStorage.getItem(REFRESH_KEY);
    return Boolean(token && (Date.now() < expiresAt || refreshToken));
  }

  public disconnect(): void {
    safeStorage.removeItem(TOKEN_KEY);
    safeStorage.removeItem(REFRESH_KEY);
    safeStorage.removeItem(EXPIRES_AT_KEY);
    safeStorage.removeItem(USER_KEY);
    safeStorage.removeItem(DEMO_MODE_KEY);
  }
}

export const spotifyAuth = new SpotifyAuthService();
