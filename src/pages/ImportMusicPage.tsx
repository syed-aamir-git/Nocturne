import React, { useState, useEffect } from 'react';
import {
  Radio,
  Download,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Layers,
  Lock,
  Globe,
  Settings,
} from 'lucide-react';
import { useSpotify } from '../state/SpotifyContext';
import { useLibrary } from '../state/LibraryContext';
import { useToast } from '../state/ToastContext';
import { MOCK_TRACKS } from '../data/mockData';
import {
  matchPlaylistTracks,
  convertToNocturneTrack,
} from '../services/importer/trackMatcher';
import { spotifyApi } from '../services/spotify/spotifyApi';
import type { ExternalPlaylist, PlaylistImportPreview } from '../services/importer/types';
import { Button } from '../components/primitives/Button';
import { Card } from '../components/primitives/Card';
import { Skeleton } from '../components/primitives/Skeleton';
import { ImportPreviewModal } from '../components/modals/ImportPreviewModal';
import './ImportMusicPage.css';

export const ImportMusicPage: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    userProfile,
    isDemoMode,
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
  } = useSpotify();

  const { createPlaylist } = useLibrary();
  const { showToast } = useToast();

  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<Set<string>>(new Set());
  const [previewData, setPreviewData] = useState<PlaylistImportPreview | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatusMessage, setImportStatusMessage] = useState<string>('');
  const [showConfigInput, setShowConfigInput] = useState(false);
  const [tempClientId, setTempClientId] = useState(clientId);

  // Auto-load playlists when connected
  useEffect(() => {
    if (isConnected && playlists.length === 0) {
      loadPlaylists();
    }
  }, [isConnected, playlists.length, loadPlaylists]);

  const toggleSelectPlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlaylistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedPlaylistIds.size === playlists.length) {
      setSelectedPlaylistIds(new Set());
    } else {
      setSelectedPlaylistIds(new Set(playlists.map((p) => p.id)));
    }
  };

  // Open Preview Modal for a single playlist
  const handleOpenPreview = async (playlist: ExternalPlaylist) => {
    clearError();
    setImportStatusMessage('Fetching tracks...');
    setIsImporting(true);

    try {
      const extTracks = await spotifyApi.getPlaylistTracks(playlist.id);
      setImportStatusMessage('Matching tracks...');
      const preview = matchPlaylistTracks(playlist, extTracks, MOCK_TRACKS);
      setPreviewData(preview);
      setIsPreviewOpen(true);
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to fetch playlist tracks', 'error');
    } finally {
      setIsImporting(false);
      setImportStatusMessage('');
    }
  };

  // Perform actual single playlist creation
  const handleConfirmSingleImport = async () => {
    if (!previewData) return;

    setIsImporting(true);
    setImportStatusMessage('Importing playlist...');

    try {
      const { playlist, matches, matchedCount, unmatchedCount, possibleCount, totalTracks } = previewData;

      // Convert matched results into internal Nocturne tracks
      const internalTracks = matches.map((m, idx) =>
        convertToNocturneTrack(m, playlist.title, idx)
      );

      const created = createPlaylist({
        title: playlist.title,
        description: playlist.description || `Imported from Spotify (${matchedCount}/${totalTracks} tracks available)`,
        artwork: playlist.artwork,
        initialTracks: internalTracks,
        source: 'spotify_import',
        sourceMetadata: {
          provider: 'spotify',
          originalPlaylistId: playlist.id,
          importedAt: new Date().toISOString(),
          totalSpotifyTracks: totalTracks,
          matchedTracksCount: matchedCount,
          unmatchedTracksCount: unmatchedCount,
          possibleMatchCount: possibleCount,
        },
      });

      setImportStatusMessage('Import complete.');
      showToast(
        'Playlist Imported',
        `"${created.title}" added to your Nocturne Archive (${matchedCount} available tracks).`,
        'atmosphere'
      );

      setIsPreviewOpen(false);
      setPreviewData(null);
    } catch (err: any) {
      showToast('Import Error', err.message || 'Failed to create playlist in Nocturne', 'error');
    } finally {
      setIsImporting(false);
      setImportStatusMessage('');
    }
  };

  // Batch import selected or all playlists
  const handleBatchImport = async (targetPlaylists: ExternalPlaylist[]) => {
    if (targetPlaylists.length === 0) return;

    setIsImporting(true);
    let importedTotal = 0;

    for (let i = 0; i < targetPlaylists.length; i++) {
      const pl = targetPlaylists[i];
      setImportStatusMessage(`Fetching tracks (${i + 1}/${targetPlaylists.length}): "${pl.title}"...`);

      try {
        const extTracks = await spotifyApi.getPlaylistTracks(pl.id);
        setImportStatusMessage(`Matching tracks: "${pl.title}"...`);
        const preview = matchPlaylistTracks(pl, extTracks, MOCK_TRACKS);

        const internalTracks = preview.matches.map((m, idx) =>
          convertToNocturneTrack(m, pl.title, idx)
        );

        createPlaylist({
          title: pl.title,
          description: pl.description || `Imported from Spotify (${preview.matchedCount}/${preview.totalTracks} available)`,
          artwork: pl.artwork,
          initialTracks: internalTracks,
          source: 'spotify_import',
          sourceMetadata: {
            provider: 'spotify',
            originalPlaylistId: pl.id,
            importedAt: new Date().toISOString(),
            totalSpotifyTracks: preview.totalTracks,
            matchedTracksCount: preview.matchedCount,
            unmatchedTracksCount: preview.unmatchedCount,
            possibleMatchCount: preview.possibleCount,
          },
        });

        importedTotal++;
      } catch (err) {
        console.warn(`[ImportMusicPage] Failed to batch import ${pl.title}:`, err);
      }
    }

    setImportStatusMessage('Import complete.');
    setIsImporting(false);
    setSelectedPlaylistIds(new Set());
    showToast(
      'Batch Import Complete',
      `Successfully inscribed ${importedTotal} playlists into your Nocturne Archive.`,
      'atmosphere'
    );
  };

  return (
    <div className="nocturne-import-page">
      {/* Page Title & Subtitle */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Radio size={24} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2.2rem', margin: 0, letterSpacing: '-0.02em' }}>
            Bring your music with you.
          </h1>
        </div>
        <p style={{ color: 'var(--text-medium)', fontSize: '14.5px', margin: 0 }}>
          Import your Spotify playlists into Nocturne. Metadata mapped directly to our lossless nocturnal soundscape.
        </p>
      </div>

      {/* Extensible Provider Tabs */}
      <div className="nocturne-import-page__provider-tabs">
        <button
          type="button"
          className="nocturne-import-page__provider-pill nocturne-import-page__provider-pill--active"
        >
          <Radio size={14} color="var(--accent-primary)" />
          <span>Import from Spotify</span>
        </button>

        <button
          type="button"
          className="nocturne-import-page__provider-pill nocturne-import-page__provider-pill--disabled"
          title="Apple Music Importer coming in future updates"
        >
          <span>Apple Music (Upcoming)</span>
        </button>

        <button
          type="button"
          className="nocturne-import-page__provider-pill nocturne-import-page__provider-pill--disabled"
          title="YouTube Music Importer coming in future updates"
        >
          <span>YouTube Music (Upcoming)</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} color="var(--indicator-error)" />
            <span style={{ fontSize: '13px', color: 'var(--text-pure)' }}>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-low)', cursor: 'pointer' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STATE 1: NOT CONNECTED HERO */}
      {!isConnected ? (
        <div className="nocturne-import-page__hero">
          <div className="nocturne-import-page__hero-glow" />

          <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(157, 114, 255, 0.1)',
                border: '1px solid var(--accent-primary)',
                width: 'fit-content',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-secondary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={12} />
              <span>Official Spotify API Integration</span>
            </div>

            <h2 style={{ fontSize: '1.9rem', margin: 0, color: 'var(--text-pure)', lineHeight: 1.25 }}>
              Migrate your nocturnal playlists without losing a single sequence.
            </h2>

            <p style={{ color: 'var(--text-medium)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              Connect your Spotify account via secure OAuth 2.0 PKCE. Nocturne reads your playlist structures,
              matches recordings against our royalty-free darkwave and ambient FLAC master library, and preserves your
              curated track order.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '13px', color: 'var(--text-high)' }}>
                <ShieldCheck size={16} color="var(--indicator-success)" />
                <span>Zero audio piracy: Only metadata is imported; music streams via Nocturne's legal library</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '13px', color: 'var(--text-high)' }}>
                <Layers size={16} color="var(--indicator-success)" />
                <span>Unavailable Spotify songs are preserved as clear reference items, never silently erased</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Radio size={18} />}
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting to Spotify...' : 'Connect Spotify'}
              </Button>

              <Button
                variant="gothic"
                size="lg"
                onClick={connectDemo}
              >
                Enter Sandbox / Demo Mode
              </Button>

              <Button
                variant="ghost"
                size="md"
                leftIcon={<Settings size={15} />}
                onClick={() => setShowConfigInput(!showConfigInput)}
              >
                {showConfigInput ? 'Hide Client ID Settings' : 'Configure Spotify Client ID'}
              </Button>
            </div>

            {/* Custom Client ID Configuration Dropdown */}
            {showConfigInput && (
              <Card
                variant="flat"
                style={{
                  marginTop: 12,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: 'rgba(0, 0, 0, 0.4)',
                }}
              >
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-pure)' }}>
                    Spotify Developer Client ID
                  </span>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-medium)', margin: '2px 0 0 0' }}>
                    Set in <code>.env</code> or paste your Spotify App Client ID below (Redirect URI:{' '}
                    <code>{window.location.origin}/callback</code>):
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    value={tempClientId}
                    onChange={(e) => setTempClientId(e.target.value)}
                    placeholder="Enter Spotify Client ID..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-pure)',
                      fontSize: '12.5px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setCustomClientId(tempClientId);
                      showToast('Client ID Saved', 'Ready to connect to Spotify.', 'default');
                      setShowConfigInput(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* STATE 2: CONNECTED - PLAYLIST BROWSER & ACTIONS */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Connection Profile Bar */}
          <div className="nocturne-import-page__toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Radio size={18} color="var(--indicator-success)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-pure)' }}>
                    Connected to Spotify
                  </span>
                  {isDemoMode && (
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(157, 114, 255, 0.15)',
                        border: '1px solid var(--accent-primary)',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-secondary)',
                      }}
                    >
                      SANDBOX MODE
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                  User: {userProfile?.name || 'Nocturne Listener'} • {playlists.length} playlists found
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw size={13} className={isLoadingPlaylists ? 'spin' : ''} />}
                onClick={loadPlaylists}
                disabled={isLoadingPlaylists}
              >
                {isLoadingPlaylists ? 'Loading playlists...' : 'Refresh'}
              </Button>

              <Button variant="ghost" size="sm" onClick={disconnect}>
                Disconnect Spotify
              </Button>
            </div>
          </div>

          {/* Selection & Batch Action Toolbar */}
          {playlists.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                padding: '0 4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-secondary)',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      border: '1.5px solid var(--border-medium)',
                      background:
                        selectedPlaylistIds.size === playlists.length && playlists.length > 0
                          ? 'var(--accent-primary)'
                          : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedPlaylistIds.size === playlists.length && playlists.length > 0 && (
                      <Check size={11} color="white" />
                    )}
                  </div>
                  <span>
                    {selectedPlaylistIds.size === playlists.length
                      ? 'Deselect All'
                      : 'Select All Playlists'}
                  </span>
                </button>

                {selectedPlaylistIds.size > 0 && (
                  <span style={{ fontSize: '12px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                    ({selectedPlaylistIds.size} of {playlists.length} selected)
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {selectedPlaylistIds.size > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    onClick={() => {
                      const targets = playlists.filter((p) => selectedPlaylistIds.has(p.id));
                      handleBatchImport(targets);
                    }}
                    disabled={isImporting}
                  >
                    Import Selected ({selectedPlaylistIds.size})
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => handleBatchImport(playlists)}
                  disabled={isImporting}
                >
                  Import All Playlists ({playlists.length})
                </Button>
              </div>
            </div>
          )}

          {/* Active Status Banner during Batch Import */}
          {isImporting && !isPreviewOpen && (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(157, 114, 255, 0.08)',
                border: '1px solid var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: '2px solid var(--accent-primary)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-pure)' }}>
                {importStatusMessage || 'Importing playlists...'}
              </span>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoadingPlaylists && playlists.length === 0 && (
            <div className="nocturne-import-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Skeleton height={220} variant="rounded" />
                  <Skeleton height={18} width="70%" />
                  <Skeleton height={14} width="40%" />
                </div>
              ))}
            </div>
          )}

          {/* Playlists Grid */}
          {!isLoadingPlaylists && playlists.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Radio size={36} color="var(--text-low)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 6px 0', color: 'var(--text-pure)' }}>
                No Playlists Detected
              </h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '13px', margin: '0 0 16px 0' }}>
                Your Spotify account currently has no public or private playlists available to import.
              </p>
              <Button variant="secondary" onClick={loadPlaylists}>
                Re-check Spotify
              </Button>
            </div>
          ) : (
            <div className="nocturne-import-grid">
              {playlists.map((playlist) => {
                const isSelected = selectedPlaylistIds.has(playlist.id);
                return (
                  <div
                    key={playlist.id}
                    className={`nocturne-import-card ${isSelected ? 'nocturne-import-card--selected' : ''}`}
                    onClick={() => handleOpenPreview(playlist)}
                  >
                    <div className="nocturne-import-card__cover-wrap">
                      <div
                        className={`nocturne-import-card__checkbox ${
                          isSelected ? 'nocturne-import-card__checkbox--checked' : ''
                        }`}
                        onClick={(e) => toggleSelectPlaylist(playlist.id, e)}
                        title={isSelected ? 'Deselect' : 'Select for batch import'}
                      >
                        {isSelected && <Check size={14} />}
                      </div>

                      <img
                        src={playlist.artwork || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'}
                        alt={playlist.title}
                        className="nocturne-import-card__cover"
                        loading="lazy"
                      />

                      <div className="nocturne-import-card__track-count">
                        {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
                      </div>
                    </div>

                    <h3 className="nocturne-import-card__title" title={playlist.title}>
                      {playlist.title}
                    </h3>

                    <p className="nocturne-import-card__desc">
                      {playlist.description || `Curated by ${playlist.owner}`}
                    </p>

                    <div className="nocturne-import-card__footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {playlist.isPublic ? <Globe size={11} /> : <Lock size={11} />}
                        <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPreview(playlist);
                        }}
                      >
                        Preview & Import
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Track Matching Verification & Preview Modal */}
      <ImportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        preview={previewData}
        isImporting={isImporting}
        importStep={importStatusMessage}
        onConfirmImport={handleConfirmSingleImport}
      />
    </div>
  );
};
