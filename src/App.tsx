import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './state';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ErrorBoundary } from './components/primitives/ErrorBoundary';
import './styles/index.css';

// Route Code Splitting: Lazy-load secondary pages to dramatically optimize initial page load bundle
const LandingPage = React.lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const DiscoverPage = React.lazy(() => import('./pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage })));
const SearchPage = React.lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const LibraryPage = React.lazy(() => import('./pages/LibraryPage').then((m) => ({ default: m.LibraryPage })));
const ImportMusicPage = React.lazy(() => import('./pages/ImportMusicPage').then((m) => ({ default: m.ImportMusicPage })));
const CallbackPage = React.lazy(() => import('./pages/CallbackPage').then((m) => ({ default: m.CallbackPage })));
const PlaylistsPage = React.lazy(() => import('./pages/PlaylistsPage').then((m) => ({ default: m.PlaylistsPage })));
const PlaylistViewPage = React.lazy(() => import('./pages/PlaylistViewPage').then((m) => ({ default: m.PlaylistViewPage })));
const AlbumsPage = React.lazy(() => import('./pages/AlbumsPage').then((m) => ({ default: m.AlbumsPage })));
const AlbumDetailPage = React.lazy(() => import('./pages/AlbumDetailPage').then((m) => ({ default: m.AlbumDetailPage })));
const ArtistsPage = React.lazy(() => import('./pages/ArtistsPage').then((m) => ({ default: m.ArtistsPage })));
const ArtistDetailPage = React.lazy(() => import('./pages/ArtistDetailPage').then((m) => ({ default: m.ArtistDetailPage })));
const LikedSongsPage = React.lazy(() => import('./pages/LikedSongsPage').then((m) => ({ default: m.LikedSongsPage })));
const RecentlyPlayedPage = React.lazy(() => import('./pages/RecentlyPlayedPage').then((m) => ({ default: m.RecentlyPlayedPage })));
const HistoryPage = React.lazy(() => import('./pages/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const StatisticsPage = React.lazy(() => import('./pages/StatisticsPage').then((m) => ({ default: m.StatisticsPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const DesignSystemPage = React.lazy(() => import('./pages/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage })));

const RouteLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-label="Loading page content"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      width: '100%',
      color: 'var(--text-low)',
      fontSize: '13px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.12)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>Summoning Sanctuary...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing page portal (Flow step 1: Landing Page -> step 2: Enter Nocturne) */}
            <Route
              path="/"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <LandingPage />
                </Suspense>
              }
            />
            <Route
              path="/landing"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <LandingPage />
                </Suspense>
              }
            />
            <Route
              path="/welcome"
              element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <LandingPage />
                </Suspense>
              }
            />

            {/* Main Application Sanctuary Shell */}
            <Route element={<MainLayout />}>
              <Route path="home" element={<HomePage />} />
              <Route
                path="discover"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <DiscoverPage />
                  </Suspense>
                }
              />
              <Route
                path="search"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <SearchPage />
                  </Suspense>
                }
              />
              <Route
                path="library"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LibraryPage />
                  </Suspense>
                }
              />
              <Route
                path="import"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <ImportMusicPage />
                  </Suspense>
                }
              />
              <Route
                path="callback"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <CallbackPage />
                  </Suspense>
                }
              />
              <Route
                path="playlists"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <PlaylistsPage />
                  </Suspense>
                }
              />
              <Route
                path="playlist/:id"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <PlaylistViewPage />
                  </Suspense>
                }
              />
              <Route
                path="albums"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <AlbumsPage />
                  </Suspense>
                }
              />
              <Route
                path="album/:id"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <AlbumDetailPage />
                  </Suspense>
                }
              />
              <Route
                path="artists"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <ArtistsPage />
                  </Suspense>
                }
              />
              <Route
                path="artist/:id"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <ArtistDetailPage />
                  </Suspense>
                }
              />
              <Route
                path="liked"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <LikedSongsPage />
                  </Suspense>
                }
              />
              <Route
                path="recently-played"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <RecentlyPlayedPage />
                  </Suspense>
                }
              />
              <Route
                path="history"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <HistoryPage />
                  </Suspense>
                }
              />
              <Route
                path="statistics"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <StatisticsPage />
                  </Suspense>
                }
              />
              <Route path="stats" element={<Navigate to="/statistics" replace />} />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <SettingsPage />
                  </Suspense>
                }
              />
              <Route
                path="design-system"
                element={
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <DesignSystemPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;

