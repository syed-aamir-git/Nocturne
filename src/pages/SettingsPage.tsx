import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  PlayCircle,
  Volume2,
  Palette,
  Shield,
  Database,
  Sliders,
  Download,
  Trash2,
  RotateCcw,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  HardDrive,
  Cpu,
  Upload,
} from 'lucide-react';
import { Button } from '../components/primitives/Button';
import { Slider } from '../components/primitives/Slider';
import { Toggle } from '../components/primitives/Toggle';
import { SelectDropdown } from '../components/primitives/SelectDropdown';
import type { SelectOption } from '../components/primitives/SelectDropdown';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import { useTheme } from '../state/ThemeContext';
import { useToast } from '../state/ToastContext';
import { usePlayer } from '../state/PlayerContext';
import { useSpotify } from '../state/SpotifyContext';
import { useAudioSettings } from '../state/AudioSettingsContext';
import { useAnalytics } from '../state/AnalyticsContext';
import { storageService } from '../services/storageService';
import { BUILTIN_EQ_PRESETS, CROSSFADE_OPTIONS, EQ_BANDS } from '../types/audio';
import type { AudioQuality, CrossfadeDuration } from '../types/audio';
import type { UserAccountProfile, PrivacySettings } from '../types';
import { ACCENT_COLOR_PRESETS } from '../utilities/constants';
import './SettingsPage.css';

type SettingsCategory = 'account' | 'playback' | 'audio' | 'appearance' | 'privacy' | 'data';

const AVATAR_PRESETS = [
  {
    id: 'wanderer',
    name: 'Wanderer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'acolyte',
    name: 'Acolyte',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'poet',
    name: 'Poet',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'archon',
    name: 'Archon',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
  },
];

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get('tab') as SettingsCategory | null;
  const validTabs: SettingsCategory[] = ['account', 'playback', 'audio', 'appearance', 'privacy', 'data'];
  const activeCategory: SettingsCategory = (rawTab && validTabs.includes(rawTab)) ? rawTab : 'account';

  const handleSelectCategory = (category: SettingsCategory) => {
    setSearchParams({ tab: category });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contexts
  const {
    currentTheme,
    availableThemes,
    setThemeId,
    accentColor,
    isCustomAccent,
    setAccentColor,
    resetAccentColor,
    layoutDensity,
    setLayoutDensity,
    sidebarMode,
    setSidebarMode,
    playerSize,
    setPlayerSize,
    backgroundMode,
    setBackgroundMode,
    backgroundBlur,
    setBackgroundBlur,
    interfaceOpacity,
    setInterfaceOpacity,
    animationMode,
    setAnimationMode,
    resetToDefaults,
  } = useTheme();

  const {
    shuffle,
    setShuffle,
    repeatMode,
    setRepeatMode,
  } = usePlayer();

  const {
    audioQuality,
    setAudioQuality,
    volumeNormalization,
    setVolumeNormalization,
    playbackRate,
    setPlaybackRate,
    crossfadeDuration,
    setCrossfadeDuration,
    autoplay,
    setAutoplay,
    equalizerEnabled,
    toggleEqualizerEnabled,
    currentPresetId,
    selectPreset,
    savedPresets,
    openEqualizer,
    gains,
    setBandGain,
    resetEQ,
  } = useAudioSettings();

  const { history, clearHistory } = useAnalytics();

  const {
    isConnected,
    isConnecting,
    userProfile: spotifyUser,
    isDemoMode,
    connect,
    connectDemo,
    disconnect,
  } = useSpotify();

  // State: Account Profile
  const [profile, setProfile] = useState<UserAccountProfile>(() => storageService.getUserProfile());

  // State: Privacy Settings
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => storageService.getPrivacySettings());

  // State: Spatial Virtualizer (Audio Processing)
  const [spatialStereo, setSpatialStereo] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nocturne_spatial_stereo_v1') === 'true';
    } catch {
      return false;
    }
  });

  // Storage Footprint Metrics
  let storageBytes = 0;
  let storageKeysCount = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('nocturne')) {
        storageKeysCount++;
        const val = localStorage.getItem(key) || '';
        storageBytes += (key.length + val.length) * 2;
      }
    }
  } catch {
    // ignore
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  // State: Confirmation Modals
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showResetPreferencesConfirm, setShowResetPreferencesConfirm] = useState(false);

  // Handlers: Account
  const handleSaveProfile = () => {
    storageService.saveUserProfile(profile);
    showToast('Sanctuary Profile Saved', `Updated identity for ${profile.name}`, 'default');
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image Too Large', 'Please select an image smaller than 2MB', 'atmosphere');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProfile((prev) => ({ ...prev, avatarUrl: result }));
          showToast('Sanctuary Portrait Staged', 'Click "Save Profile Changes" to persist', 'default');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers: Privacy
  const updatePrivacy = (partial: Partial<PrivacySettings>) => {
    const updated = { ...privacy, ...partial };
    setPrivacy(updated);
    storageService.savePrivacySettings(updated);
    showToast('Privacy Preserved', 'Updated sanctuary privacy protocols', 'default');
  };

  // Handlers: Audio Processing
  const handleToggleSpatialStereo = (checked: boolean) => {
    setSpatialStereo(checked);
    try {
      localStorage.setItem('nocturne_spatial_stereo_v1', String(checked));
    } catch {
      // ignore
    }
    showToast(
      checked ? 'Spatial Acoustic Stage Active' : 'Direct Stereo Bypass',
      checked ? 'Expanded binaural headphone soundstage' : 'Standard binaural field',
      'atmosphere'
    );
  };

  // Handlers: Data Export (Real JSON & CSV Blob downloads)
  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: profile.name,
      username: profile.username,
      totalListeningSessions: history.length,
      history: history,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nocturne-listening-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archive Exported', 'Listening history JSON downloaded successfully', 'default');
  };

  const handleExportCSV = () => {
    const headers = ['Track Title', 'Artist', 'Album', 'Date', 'Time', 'Duration Listened (Sec)', 'Completion %'];
    const rows = history.map((entry) => [
      `"${(entry.trackTitle || '').replace(/"/g, '""')}"`,
      `"${(entry.artist || '').replace(/"/g, '""')}"`,
      `"${(entry.album || '').replace(/"/g, '""')}"`,
      entry.date || (entry.startTime ? new Date(entry.startTime).toISOString().slice(0, 10) : ''),
      entry.startTime ? new Date(entry.startTime).toTimeString().slice(0, 8) : '',
      entry.durationListened || 0,
      entry.completionPercentage || 0,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nocturne-listening-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Archive Exported', 'Listening history CSV downloaded successfully', 'default');
  };

  // Handlers: Destructive Confirmation Executions
  const handleExecuteClearHistory = () => {
    clearHistory();
    setShowClearHistoryConfirm(false);
    showToast('History Cleansed', 'All chronological listening records and clock stats erased', 'default');
  };

  const handleExecuteResetPreferences = () => {
    resetToDefaults();
    resetEQ();
    setAudioQuality('lossless');
    setVolumeNormalization(true);
    setPlaybackRate(1.0);
    setCrossfadeDuration(4);
    setAutoplay(true);
    setShuffle(false);
    setRepeatMode('off');
    setSpatialStereo(false);
    try {
      localStorage.removeItem('nocturne_spatial_stereo_v1');
    } catch {
      // ignore
    }
    const defaultPrivacy: PrivacySettings = {
      listeningHistoryEnabled: true,
      activityVisibility: false,
      personalizedRecommendations: true,
    };
    setPrivacy(defaultPrivacy);
    storageService.savePrivacySettings(defaultPrivacy);
    setShowResetPreferencesConfirm(false);
    showToast('Preferences Reset', 'All settings restored to factory Nocturne defaults', 'atmosphere');
  };

  // Options for Dropdowns
  const crossfadeSelectOptions: SelectOption[] = CROSSFADE_OPTIONS.map((opt) => ({
    value: String(opt.value),
    label: opt.label,
    description: opt.value === 0 ? 'Instantaneous switch' : `${opt.value}s dual-channel volume ramp`,
  }));

  const qualitySelectOptions: SelectOption[] = [
    {
      value: 'lossless',
      label: 'Lossless Master (24-bit / 96kHz FLAC)',
      description: 'Bit-perfect master reproduction without dynamic compression',
    },
    {
      value: 'high',
      label: 'Studio High Fidelity (320 kbps AAC)',
      description: 'Studio monitoring acoustic clarity',
    },
    {
      value: 'standard',
      label: 'Standard Broadcast (192 kbps)',
      description: 'Balanced bandwidth and pristine acoustics',
    },
    {
      value: 'saver',
      label: 'Data Saver (96 kbps)',
      description: 'Low-bandwidth cellular streaming mode',
    },
  ];

  const repeatSelectOptions: SelectOption[] = [
    { value: 'off', label: 'Off', description: 'Sequence plays once to completion' },
    { value: 'all', label: 'Repeat Sequence', description: 'Continuously loops active queue' },
    { value: 'one', label: 'Repeat Current Hymn', description: 'Infinite solitary loop of current track' },
  ];

  const eqPresetsCombined = [...BUILTIN_EQ_PRESETS, ...savedPresets];
  const eqPresetOptions: SelectOption[] = eqPresetsCombined.map((p) => ({
    value: p.id,
    label: p.name,
    description: p.isCustom ? 'User customized acoustic curve' : 'Standard 7-band parametric curve',
  }));
  if (currentPresetId === 'custom') {
    eqPresetOptions.unshift({
      value: 'custom',
      label: 'Custom User EQ',
      description: 'Hand-sculpted parametric curve',
    });
  }

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="nocturne-settings-page">
      {/* Page Header */}
      <div className="nocturne-settings-header">
        <div className="nocturne-settings-header__title-row">
          <h1 className="nocturne-settings-header__title">Sanctum Preferences</h1>
        </div>
        <p className="nocturne-settings-header__desc">
          Configure personal identity, audio pipeline, acoustic behaviors, nocturnal aesthetics, and data privacy.
        </p>
      </div>

      {/* Category Navigation Bar */}
      <nav className="nocturne-settings-nav" aria-label="Settings Categories">
        <button
          type="button"
          className={`nocturne-settings-nav__btn ${activeCategory === 'account' ? 'nocturne-settings-nav__btn--active' : ''}`}
          onClick={() => handleSelectCategory('account')}
        >
          <User size={15} />
          <span>Account</span>
        </button>

        <button
          type="button"
          className={`nocturne-settings-nav__btn ${activeCategory === 'playback' ? 'nocturne-settings-nav__btn--active' : ''}`}
          onClick={() => handleSelectCategory('playback')}
        >
          <PlayCircle size={15} />
          <span>Playback</span>
        </button>

        <button
          type="button"
          className={`nocturne-settings-nav__btn ${activeCategory === 'audio' ? 'nocturne-settings-nav__btn--active' : ''}`}
          onClick={() => handleSelectCategory('audio')}
        >
          <Volume2 size={15} />
          <span>Audio</span>
        </button>

        <button
          type="button"
          className={`nocturne-settings-nav__btn ${activeCategory === 'appearance' ? 'nocturne-settings-nav__btn--active' : ''}`}
          onClick={() => handleSelectCategory('appearance')}
        >
          <Palette size={15} />
          <span>Appearance</span>
        </button>

        <button
          type="button"
          className={`nocturne-settings-nav__btn ${activeCategory === 'privacy' ? 'nocturne-settings-nav__btn--active' : ''}`}
          onClick={() => handleSelectCategory('privacy')}
        >
          <Shield size={15} />
          <span>Privacy</span>
        </button>

        <button
          type="button"
          className={`nocturne-settings-nav__btn ${activeCategory === 'data' ? 'nocturne-settings-nav__btn--active' : ''}`}
          onClick={() => handleSelectCategory('data')}
        >
          <Database size={15} />
          <span>Data & Storage</span>
        </button>
      </nav>

      {/* 1. ACCOUNT CATEGORY */}
      {activeCategory === 'account' && (
        <section className="nocturne-settings-section">
          {/* Profile Card */}
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <User size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Profile & Identity</h2>
              </div>
              <span className="nocturne-settings-card__badge">SANCTUM CITIZEN</span>
            </div>

            <div className="nocturne-profile-grid">
              {/* Avatar Selector */}
              <div className="nocturne-profile-avatar-col">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="nocturne-profile-avatar-preview"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  AVATAR PRESETS
                </span>
                <div className="nocturne-profile-avatar-presets">
                  {AVATAR_PRESETS.map((preset) => (
                    <img
                      key={preset.id}
                      src={preset.url}
                      alt={preset.name}
                      title={preset.name}
                      className={`nocturne-profile-avatar-thumb ${
                        profile.avatarUrl === preset.url ? 'nocturne-profile-avatar-thumb--active' : ''
                      }`}
                      onClick={() => setProfile((prev) => ({ ...prev, avatarUrl: preset.url }))}
                    />
                  ))}
                </div>

                {/* Local Photo Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarFileUpload}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Upload size={13} />}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100%', fontSize: '11.5px', marginTop: 4 }}
                >
                  Upload Photo
                </Button>
              </div>

              {/* Text Fields */}
              <div className="nocturne-profile-fields">
                <div className="nocturne-field-group">
                  <label className="nocturne-field-label">Display Name</label>
                  <input
                    type="text"
                    className="nocturne-input"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter display name..."
                  />
                </div>

                <div className="nocturne-field-group">
                  <label className="nocturne-field-label">Sanctum Handle / Username</label>
                  <input
                    type="text"
                    className="nocturne-input"
                    value={profile.username}
                    onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value.replace(/^@/, '') }))}
                    placeholder="username"
                  />
                </div>

                <div className="nocturne-field-group">
                  <label className="nocturne-field-label">Custom Avatar Image URL</label>
                  <input
                    type="url"
                    className="nocturne-input"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="nocturne-field-group">
                  <label className="nocturne-field-label">Acoustic Bio</label>
                  <textarea
                    className="nocturne-input nocturne-textarea"
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your late-night atmosphere..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setProfile(storageService.getUserProfile());
                      showToast('Profile Reverted', 'Reloaded saved identity', 'default');
                    }}
                  >
                    Revert
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                    Save Profile Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <Shield size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Account Credentials & Membership</h2>
              </div>
              <span className="nocturne-settings-card__badge">AUTHENTICATED</span>
            </div>

            <div className="nocturne-account-info-list">
              <div className="nocturne-account-info-item">
                <span className="nocturne-account-info-label">Account Email</span>
                <span className="nocturne-account-info-value">{profile.email}</span>
              </div>

              <div className="nocturne-account-info-item">
                <span className="nocturne-account-info-label">Sanctum Membership Tier</span>
                <span className="nocturne-account-info-value" style={{ color: 'var(--accent-primary)' }}>
                  {profile.membershipTier}
                </span>
              </div>

              <div className="nocturne-account-info-item">
                <span className="nocturne-account-info-label">Solitude Member Since</span>
                <span className="nocturne-account-info-value">{profile.memberSince}</span>
              </div>

              <div className="nocturne-account-info-item">
                <span className="nocturne-account-info-label">Connected Spotify Account</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '11px',
                      color: isConnected ? 'var(--indicator-success)' : 'var(--text-low)',
                    }}
                  >
                    {isConnected ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {isConnected ? (spotifyUser?.name || 'Linked') : 'Not Connected'}
                    {isDemoMode && ' (Sandbox)'}
                  </span>
                  {isConnected ? (
                    <Button variant="ghost" size="sm" onClick={disconnect}>
                      Disconnect
                    </Button>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button variant="secondary" size="sm" onClick={connect} disabled={isConnecting}>
                        Connect
                      </Button>
                      <Button variant="ghost" size="sm" onClick={connectDemo}>
                        Demo Mode
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. PLAYBACK CATEGORY */}
      {activeCategory === 'playback' && (
        <section className="nocturne-settings-section">
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <PlayCircle size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Playback Dynamics & Sequencing</h2>
              </div>
              <span className="nocturne-settings-card__badge">WEB AUDIO BUFFER</span>
            </div>

            {/* Crossfade */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Acoustic Crossfade</span>
                <span className="nocturne-setting-row__desc">
                  Seamlessly overlaps fading track into the incoming song via dual-channel Web Audio gain nodes.
                </span>
              </div>
              <div className="nocturne-setting-row__control" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <SelectDropdown
                  value={String(crossfadeDuration)}
                  options={crossfadeSelectOptions}
                  onChange={(val) => {
                    const num = Number(val) as CrossfadeDuration;
                    setCrossfadeDuration(num);
                    showToast('Crossfade Updated', num === 0 ? 'Crossfade disabled' : `${num}s duration active`, 'default');
                  }}
                  width={210}
                />
                <div className="nocturne-settings-chip-row">
                  {CROSSFADE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`nocturne-settings-chip ${crossfadeDuration === opt.value ? 'nocturne-settings-chip--active' : ''}`}
                      onClick={() => {
                        setCrossfadeDuration(opt.value);
                        showToast('Crossfade Duration', opt.label, 'default');
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Autoplay */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Continuous Autoplay</span>
                <span className="nocturne-setting-row__desc">
                  Automatically queries and queues kindred recordings when the current sequence reaches its conclusion.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={autoplay}
                  onChange={(checked) => {
                    setAutoplay(checked);
                    showToast(checked ? 'Autoplay Active' : 'Autoplay Disabled', 'Playback finishes when queue ends', 'default');
                  }}
                  aria-label="Toggle Continuous Autoplay"
                />
              </div>
            </div>

            {/* Repeat Mode */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Repeat Mode</span>
                <span className="nocturne-setting-row__desc">
                  Choose between repeating the entire queue, infinitely looping the current hymn, or playing once.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={repeatMode}
                  options={repeatSelectOptions}
                  onChange={(val) => {
                    const mode = val as 'off' | 'all' | 'one';
                    setRepeatMode(mode);
                    showToast('Repeat Mode', mode === 'one' ? 'Looping current track' : mode === 'all' ? 'Looping queue' : 'Repeat off', 'default');
                  }}
                  width={210}
                />
              </div>
            </div>

            {/* Shuffle */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Sequence Shuffle</span>
                <span className="nocturne-setting-row__desc">
                  Randomize the playing sequence across the active playlist or album queue without destructive ordering.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={shuffle}
                  onChange={(checked) => {
                    setShuffle(checked);
                    showToast(checked ? 'Shuffle Active' : 'Shuffle Disabled', 'Playing in sequence order', 'default');
                  }}
                  aria-label="Toggle Shuffle"
                />
              </div>
            </div>

            {/* Volume Normalization */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Volume Normalization (Compressor)</span>
                <span className="nocturne-setting-row__desc">
                  Dynamically balances perceived loudness across varying master mixes using real-time Web Audio compression.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={volumeNormalization}
                  onChange={(checked) => {
                    setVolumeNormalization(checked);
                    showToast(checked ? 'Normalization Engaged' : 'Normalization Bypassed', 'Dynamics leveled', 'default');
                  }}
                  aria-label="Toggle Volume Normalization"
                />
              </div>
            </div>

            {/* Playback Quality */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Playback Stream Quality</span>
                <span className="nocturne-setting-row__desc">
                  Direct master streaming format. Lossless delivers uncompressed 24-bit / 96kHz FLAC audio.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={audioQuality}
                  options={qualitySelectOptions}
                  onChange={(val) => {
                    setAudioQuality(val as AudioQuality);
                    showToast('Stream Quality Calibrated', val.toUpperCase(), 'atmosphere');
                  }}
                  width={260}
                />
              </div>
            </div>

            {/* Playback Speed */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Playback Velocity (Speed)</span>
                <span className="nocturne-setting-row__desc">
                  Time-stretch track tempo with automatic harmonic pitch preservation ({playbackRate}x speed).
                </span>
              </div>
              <div className="nocturne-setting-row__control" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {speedOptions.map((rate) => {
                    const isSelected = playbackRate === rate;
                    return (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => {
                          setPlaybackRate(rate);
                          showToast('Playback Velocity Updated', `${rate}x speed`, 'default');
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-xs)',
                          background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          color: isSelected ? '#000000' : 'var(--text-medium)',
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all var(--transition-snappy)',
                        }}
                      >
                        {rate}x
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 220 }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>FINE:</span>
                  <Slider
                    min={0.5}
                    max={2.0}
                    step={0.05}
                    value={playbackRate}
                    onChange={(val) => setPlaybackRate(Number(val.toFixed(2)))}
                    aria-label="Playback Velocity Fine Tuning"
                  />
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', minWidth: '38px', color: 'var(--accent-primary)', textAlign: 'right' }}>
                    {playbackRate.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. AUDIO CATEGORY */}
      {activeCategory === 'audio' && (
        <section className="nocturne-settings-section">
          {/* Equalizer */}
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <Sliders size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Parametric Equalizer</h2>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: equalizerEnabled ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                  color: equalizerEnabled ? 'var(--indicator-success)' : 'var(--text-low)',
                  border: `1px solid ${equalizerEnabled ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)'}`,
                }}
              >
                {equalizerEnabled ? 'DSP ACTIVE' : 'BYPASS'}
              </span>
            </div>

            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Equalizer DSP State</span>
                <span className="nocturne-setting-row__desc">
                  Toggle the 7-band biquad filter chain (60Hz, 150Hz, 400Hz, 1kHz, 2.4kHz, 6kHz, 15kHz).
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={equalizerEnabled}
                  onChange={toggleEqualizerEnabled}
                  aria-label="Toggle Equalizer"
                />
              </div>
            </div>

            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Acoustic Preset</span>
                <span className="nocturne-setting-row__desc">
                  Select an acoustic curve optimized for genres, late-night listening, or vocal presence.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={currentPresetId}
                  options={eqPresetOptions}
                  onChange={(val) => {
                    selectPreset(val);
                    showToast('Equalizer Preset', val, 'atmosphere');
                  }}
                  width={240}
                />
              </div>
            </div>

            {/* 7-Band Parametric Frequency Response Deck */}
            <div className="nocturne-settings-eq-deck">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-pure)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Direct Frequency Response Sculptor
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                  -12 dB to +12 dB
                </span>
              </div>
              <div className="nocturne-settings-eq-grid">
                {EQ_BANDS.map((band, idx) => {
                  const gainVal = gains[idx] ?? 0;
                  return (
                    <div key={band.frequency} className="nocturne-settings-eq-col">
                      <span className="nocturne-settings-eq-val">
                        {gainVal > 0 ? `+${gainVal.toFixed(1)}` : gainVal.toFixed(1)} dB
                      </span>
                      <div className="nocturne-settings-eq-slider-wrap">
                        <input
                          type="range"
                          className="nocturne-settings-eq-slider"
                          min={-12}
                          max={12}
                          step={0.5}
                          value={gainVal}
                          onChange={(e) => setBandGain(idx, parseFloat(e.target.value))}
                          aria-label={`${band.label} Gain`}
                          disabled={!equalizerEnabled}
                        />
                      </div>
                      <span className="nocturne-settings-eq-label">{band.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
              <span style={{ fontSize: '12px', color: 'var(--text-low)' }}>
                Press <kbd style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>E</kbd> anywhere to summon the visualizer console.
              </span>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Sliders size={14} />}
                onClick={openEqualizer}
              >
                Open Equalizer Console
              </Button>
            </div>
          </div>

          {/* Audio Processing Architecture */}
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <Cpu size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Audio Processing Engine</h2>
              </div>
              <span className="nocturne-settings-card__badge">HARDWARE ACCELERATED</span>
            </div>

            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Spatial Stereo Field Expansion</span>
                <span className="nocturne-setting-row__desc">
                  Binaural acoustic virtualization for expanded headphone soundstage and ambient imaging.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={spatialStereo}
                  onChange={handleToggleSpatialStereo}
                  aria-label="Toggle Spatial Stereo"
                />
              </div>
            </div>

            <div className="nocturne-account-info-list" style={{ marginTop: 8 }}>
              <div className="nocturne-account-info-item">
                <span className="nocturne-account-info-label">Web Audio Engine Pipeline</span>
                <span className="nocturne-account-info-value" style={{ color: 'var(--indicator-success)' }}>
                  Active (Low Latency Interactive Mode)
                </span>
              </div>
              <div className="nocturne-account-info-item">
                <span className="nocturne-account-info-label">Output Sample Rate</span>
                <span className="nocturne-account-info-value">96,000 Hz Master Direct</span>
              </div>
              <div className="nocturne-account-info-item">
                <span className="nocturne-account-info-label">Bit-Depth Precision</span>
                <span className="nocturne-account-info-value">32-Bit IEEE Floating Point DSP</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. APPEARANCE CATEGORY */}
      {activeCategory === 'appearance' && (
        <section className="nocturne-settings-section">
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <Palette size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Interface Atmosphere & Theming</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw size={13} />}
                onClick={() => {
                  resetToDefaults();
                  showToast('Aesthetics Reset', 'Default visual theme restored', 'atmosphere');
                }}
              >
                Reset Aesthetics
              </Button>
            </div>

            {/* Themes Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="nocturne-setting-row__label">Atmospheric Themes (6 Signature Noirs)</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
                {availableThemes.map((thm) => {
                  const isSelected = thm.id === currentTheme.id;
                  return (
                    <div
                      key={thm.id}
                      onClick={() => {
                        setThemeId(thm.id);
                        showToast('Atmosphere Activated', thm.name, 'atmosphere');
                      }}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1.5px solid ${isSelected ? thm.accent : 'var(--border-subtle)'}`,
                        boxShadow: isSelected ? `0 0 16px ${thm.glow}` : 'none',
                        cursor: 'pointer',
                        transition: 'all var(--transition-snappy)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              background: thm.accent,
                              boxShadow: `0 0 8px ${thm.accent}`,
                            }}
                          />
                          <span style={{ fontWeight: 600, color: 'var(--text-pure)', fontSize: '13px' }}>
                            {thm.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: thm.accent }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                        {thm.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="nocturne-setting-row" style={{ paddingTop: 16 }}>
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Accent Color Luminescence</span>
                <span className="nocturne-setting-row__desc">
                  Illuminates play buttons, interactive borders, equalizer bars, and glowing aura states.
                </span>
              </div>
              <div className="nocturne-setting-row__control" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {ACCENT_COLOR_PRESETS.map((preset) => {
                  const isSelected = accentColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      title={preset.name}
                      onClick={() => setAccentColor(preset.color, true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1.5px solid ${isSelected ? preset.color : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        fontSize: '11.5px',
                        color: isSelected ? 'var(--text-pure)' : 'var(--text-medium)',
                      }}
                    >
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: preset.color }} />
                      {preset.name}
                    </button>
                  );
                })}
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value, true)}
                  title="Custom accent hex"
                  style={{ width: 24, height: 24, border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'none' }}
                />
                {isCustomAccent && (
                  <button
                    type="button"
                    onClick={() => {
                      resetAccentColor();
                      showToast('Accent Reset', `Restored ${currentTheme.name} default`, 'default');
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-medium)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Reset Accent
                  </button>
                )}
              </div>
            </div>

            {/* Spatial Layout Density */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Layout Density</span>
                <span className="nocturne-setting-row__desc">
                  Controls vertical padding and row spacing across track listings and page grids.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={layoutDensity}
                  options={[
                    { value: 'compact', label: 'Compact', description: 'Condensed rows with reduced margins' },
                    { value: 'comfortable', label: 'Comfortable', description: 'Balanced late-night acoustics (Default)' },
                    { value: 'spacious', label: 'Spacious', description: 'Expansive margins and roomier rows' },
                  ]}
                  onChange={(val) => setLayoutDensity(val as 'compact' | 'comfortable' | 'spacious')}
                  width={200}
                />
              </div>
            </div>

            {/* Sidebar Mode */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Sidebar Navigation Geometry</span>
                <span className="nocturne-setting-row__desc">
                  Choose between expanded drawer labels, 72px icon rail, or hidden immersive view.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={sidebarMode}
                  options={[
                    { value: 'expanded', label: 'Expanded Panel', description: 'Full titles and count badges' },
                    { value: 'compact', label: 'Compact Rail', description: '72px icon rail maximizing width' },
                    { value: 'hidden', label: 'Hidden (Immersive)', description: 'Minimalist canvas with top toggle' },
                  ]}
                  onChange={(val) => setSidebarMode(val as 'expanded' | 'compact' | 'hidden')}
                  width={200}
                />
              </div>
            </div>

            {/* Player Size */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Player Transport Bar Scale</span>
                <span className="nocturne-setting-row__desc">
                  Adjust bottom transport bar height: Minimal (60px), Standard (90px), or Large (124px).
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={playerSize}
                  options={[
                    { value: 'minimal', label: 'Minimal (60px)' },
                    { value: 'standard', label: 'Standard (90px)' },
                    { value: 'large', label: 'Large (124px)' },
                  ]}
                  onChange={(val) => setPlayerSize(val as 'minimal' | 'standard' | 'large')}
                  width={200}
                />
              </div>
            </div>

            {/* Background Mode */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Background Texture Mode</span>
                <span className="nocturne-setting-row__desc">
                  Canvas style: Solid, Theme Gradient, Album Artwork reflection, or Living Ambient Aura.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={backgroundMode}
                  options={[
                    { value: 'solid', label: 'Solid Noir' },
                    { value: 'gradient', label: 'Radial Gradient' },
                    { value: 'album_art', label: 'Album Artwork Reflection' },
                    { value: 'ambient', label: 'Living Ambient Glow' },
                  ]}
                  onChange={(val) => setBackgroundMode(val as 'solid' | 'gradient' | 'album_art' | 'ambient')}
                  width={200}
                />
              </div>
            </div>

            {/* Blur & Opacity Sliders */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Atmospheric Blur Depth</span>
                <span className="nocturne-setting-row__desc">
                  Diffuses backdrop layers and album art reflections ({backgroundBlur}px).
                </span>
              </div>
              <div className="nocturne-setting-row__control" style={{ width: 200 }}>
                <Slider
                  min={0}
                  max={40}
                  step={2}
                  value={backgroundBlur}
                  onChange={setBackgroundBlur}
                  aria-label="Background Blur"
                />
              </div>
            </div>

            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Interface Glass Opacity</span>
                <span className="nocturne-setting-row__desc">
                  Calibrates surface density across panels, sidebars, and cards ({interfaceOpacity}%).
                </span>
              </div>
              <div className="nocturne-setting-row__control" style={{ width: 200 }}>
                <Slider
                  min={50}
                  max={100}
                  step={5}
                  value={interfaceOpacity}
                  onChange={setInterfaceOpacity}
                  aria-label="Interface Opacity"
                />
              </div>
            </div>

            {/* Animations */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Motion & Animation Intensity</span>
                <span className="nocturne-setting-row__desc">
                  Control kinetic responsiveness, pulsing glows, and page transitions.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <SelectDropdown
                  value={animationMode}
                  options={[
                    { value: 'full', label: 'Full Kinetic Motion' },
                    { value: 'reduced', label: 'Reduced Transitions' },
                    { value: 'off', label: 'Instantaneous (Off)' },
                  ]}
                  onChange={(val) => setAnimationMode(val as 'full' | 'reduced' | 'off')}
                  width={200}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. PRIVACY CATEGORY */}
      {activeCategory === 'privacy' && (
        <section className="nocturne-settings-section">
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <Shield size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Privacy & Solitude Protocols</h2>
              </div>
              <span className="nocturne-settings-card__badge">END-TO-END LOCAL</span>
            </div>

            {/* Listening History Toggle */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Track Listening History</span>
                <span className="nocturne-setting-row__desc">
                  Record hymns, timestamps, and acoustic durations into chronological milestones and statistics.
                  When disabled, your playback enters Private Sanctuary mode.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={privacy.listeningHistoryEnabled}
                  onChange={(checked) => updatePrivacy({ listeningHistoryEnabled: checked })}
                  aria-label="Toggle Listening History"
                />
              </div>
            </div>

            {/* Activity Visibility Toggle */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Sanctuary Activity Visibility</span>
                <span className="nocturne-setting-row__desc">
                  Allow kindred spirits in your network to observe your currently playing hymn and top artists.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={privacy.activityVisibility}
                  onChange={(checked) => updatePrivacy({ activityVisibility: checked })}
                  aria-label="Toggle Activity Visibility"
                />
              </div>
            </div>

            {/* Personalized Recommendations Toggle */}
            <div className="nocturne-setting-row">
              <div className="nocturne-setting-row__info">
                <span className="nocturne-setting-row__label">Personalized Acoustic Discovery</span>
                <span className="nocturne-setting-row__desc">
                  Tailor Discover and Home recommendations based on your listening patterns, top genres, and midnight moods.
                </span>
              </div>
              <div className="nocturne-setting-row__control">
                <Toggle
                  checked={privacy.personalizedRecommendations}
                  onChange={(checked) => updatePrivacy({ personalizedRecommendations: checked })}
                  aria-label="Toggle Recommendations"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. DATA & STORAGE CATEGORY */}
      {activeCategory === 'data' && (
        <section className="nocturne-settings-section">
          {/* Data Export & Backup */}
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <Download size={18} color="var(--accent-primary)" />
                <h2 className="nocturne-settings-card__title">Export Listening History Archive</h2>
              </div>
              <span className="nocturne-settings-card__badge">{history.length} RECORDED SESSIONS</span>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>
              Export your complete chronological listening archive, track play counts, acoustic durations,
              and timestamps for external archiving or data migration.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Download size={14} />}
                onClick={handleExportJSON}
                disabled={history.length === 0}
              >
                Export JSON Archive
              </Button>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<FileSpreadsheet size={14} />}
                onClick={handleExportCSV}
                disabled={history.length === 0}
              >
                Export CSV Spreadsheet
              </Button>
            </div>
          </div>

          {/* Destructive Actions with Confirmation */}
          <div className="nocturne-settings-card">
            <div className="nocturne-settings-card__header">
              <div className="nocturne-settings-card__header-left">
                <Trash2 size={18} color="var(--indicator-error)" />
                <h2 className="nocturne-settings-card__title">Destructive Actions & Resets</h2>
              </div>
              <span className="nocturne-settings-card__badge" style={{ color: 'var(--indicator-error)' }}>
                CONFIRMATION REQUIRED
              </span>
            </div>

            {/* Clear History */}
            <div className="nocturne-danger-box">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-pure)', fontSize: '13.5px' }}>
                  Clear Listening History
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: 2 }}>
                  Permanently deletes all {history.length} recorded listening sessions, milestones, and clock charts.
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowClearHistoryConfirm(true)}
                disabled={history.length === 0}
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--indicator-error)' }}
              >
                Clear History...
              </Button>
            </div>

            {/* Reset Preferences */}
            <div className="nocturne-danger-box">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-pure)', fontSize: '13.5px' }}>
                  Reset Preferences to Defaults
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: 2 }}>
                  Restores theme, accent colors, audio playback rates, equalizer, and layout to factory standards.
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowResetPreferencesConfirm(true)}
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--indicator-error)' }}
              >
                Reset Preferences...
              </Button>
            </div>
          </div>

          {/* Local State & Sanctuary Storage Footprint */}
          <div className="nocturne-settings-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <HardDrive size={22} color="var(--accent-primary)" />
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-pure)', fontSize: '13.5px' }}>
                  Client Sanctuary Local Storage
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-medium)', marginTop: 2 }}>
                  {formatBytes(storageBytes)} utilized across {storageKeysCount} persistent state stores (Profiles, Audio, Themes, Listening History)
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                showToast('Storage Inspected', `Active footprint: ${formatBytes(storageBytes)} across ${storageKeysCount} keys`, 'default');
              }}
            >
              Analyze Footprint
            </Button>
          </div>

          {/* Stream Cache */}
          <div className="nocturne-settings-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Cpu size={22} color="var(--text-medium)" />
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-pure)', fontSize: '13.5px' }}>Nocturnal Stream Buffer Cache</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-medium)', marginTop: 2 }}>
                  Audio segment buffer and transient Web Audio node state
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => showToast('Buffer Flushed', 'Audio memory buffer purged successfully', 'default')}
            >
              Purge Audio Buffer
            </Button>
          </div>
        </section>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showClearHistoryConfirm}
        onClose={() => setShowClearHistoryConfirm(false)}
        onConfirm={handleExecuteClearHistory}
        title="Clear Listening History?"
        description={`This will permanently erase all ${history.length} recorded listening sessions, historical milestones, and your 24-hour listening clock data. This action cannot be reversed.`}
        confirmLabel="Erase All History"
        cancelLabel="Keep History"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={showResetPreferencesConfirm}
        onClose={() => setShowResetPreferencesConfirm(false)}
        onConfirm={handleExecuteResetPreferences}
        title="Reset All Preferences?"
        description="This will restore all visual theme choices, accent luminescence, layout density, equalizer presets, audio quality, and privacy configurations back to Nocturne factory defaults."
        confirmLabel="Reset All Preferences"
        cancelLabel="Cancel"
        variant="warning"
      />
    </div>
  );
};

export default SettingsPage;
