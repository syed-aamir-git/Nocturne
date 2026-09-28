import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Radio,
  Volume2,
  HardDrive,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Sliders,
  Palette,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../components/primitives/Card';
import { Button } from '../components/primitives/Button';
import { useTheme } from '../state/ThemeContext';
import { useToast } from '../state/ToastContext';
import { useSpotify } from '../state/SpotifyContext';
import { useAudioSettings } from '../state/AudioSettingsContext';
import { BUILTIN_EQ_PRESETS, CROSSFADE_OPTIONS } from '../types/audio';
import type { AudioQuality } from '../types/audio';
import { ACCENT_COLOR_PRESETS } from '../utilities/constants';

export const SettingsPage: React.FC = () => {
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
  const { showToast } = useToast();
  const navigate = useNavigate();
  const {
    isConnected,
    isConnecting,
    userProfile,
    isDemoMode,
    connect,
    connectDemo,
    disconnect,
    clientId,
    setCustomClientId,
  } = useSpotify();

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
    savedPresets,
    openEqualizer,
  } = useAudioSettings();

  const [showConfig, setShowConfig] = useState(false);
  const [tempId, setTempId] = useState(clientId);

  const qualityOptions: { id: AudioQuality; title: string; spec: string }[] = [
    {
      id: 'lossless',
      title: 'Lossless Hi-Res (Recommended)',
      spec: '24-bit / 96kHz FLAC • Bit-perfect master reproduction without dynamic compression',
    },
    {
      id: 'high',
      title: 'Studio High Fidelity (320 kbps)',
      spec: '320 kbps AAC / Vorbis • Studio monitoring acoustic fidelity',
    },
    {
      id: 'standard',
      title: 'Standard Broadcast (192 kbps)',
      spec: '192 kbps MP3 / AAC • Balanced bandwidth usage and pristine acoustics',
    },
    {
      id: 'saver',
      title: 'Data Saver (96 kbps)',
      spec: '96 kbps AAC+ • Optimized for low-bandwidth cellular connections',
    },
  ];

  const currentPresetName =
    currentPresetId === 'custom'
      ? 'Custom EQ'
      : [...BUILTIN_EQ_PRESETS, ...savedPresets].find((p) => p.id === currentPresetId)?.name || 'Custom';

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <SettingsIcon size={22} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Preferences</h1>
        </div>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Calibrate audio fidelity, acoustic buffers, connected services, and the nocturnal atmosphere
        </p>
      </div>

      {/* 1. Connected Services */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Radio size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Connected Services</h3>
          </div>
          <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
            OAUTH 2.0 PKCE
          </span>
        </div>

        {/* Spotify Service Item */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: isConnected ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isConnected ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Radio size={22} color={isConnected ? 'var(--indicator-success)' : 'var(--text-medium)'} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-pure)' }}>
                  Spotify
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    background: isConnected ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    color: isConnected ? 'var(--indicator-success)' : 'var(--text-low)',
                    border: `1px solid ${isConnected ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {isConnected ? (
                    <>
                      <CheckCircle size={10} />
                      Connected
                    </>
                  ) : (
                    <>
                      <XCircle size={10} />
                      Not Connected
                    </>
                  )}
                </span>
              </div>

              {isConnected ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12.5px', color: 'var(--text-medium)' }}>
                  <span style={{ color: 'var(--text-pure)', fontWeight: 500 }}>
                    Connected to Spotify
                  </span>
                  <span>•</span>
                  <span>{userProfile?.name || 'Account Linked'}</span>
                  {isDemoMode && <span>(Sandbox Mode)</span>}
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-low)' }}>
                  Link your account to import playlists and sync library references
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isConnected ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => navigate('/import')}
                >
                  Import Music
                </Button>
                <Button variant="ghost" size="sm" onClick={disconnect}>
                  Disconnect Spotify
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Radio size={14} />}
                  onClick={connect}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Spotify'}
                </Button>
                <Button variant="secondary" size="sm" onClick={connectDemo}>
                  Demo Mode
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowConfig(!showConfig)}>
                  Config
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Client ID Configuration Drawer */}
        {showConfig && !isConnected && (
          <div
            style={{
              padding: 14,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-pure)' }}>
              Spotify OAuth Client ID
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-medium)' }}>
              Configure in <code>.env</code> as <code>VITE_SPOTIFY_CLIENT_ID</code> or enter below (Callback:{' '}
              <code>{window.location.origin}/callback</code>):
            </span>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                type="text"
                value={tempId}
                onChange={(e) => setTempId(e.target.value)}
                placeholder="Paste Spotify Client ID..."
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-pure)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCustomClientId(tempId);
                  showToast('Client ID Saved', 'Credentials updated in session.', 'default');
                  setShowConfig(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 2. Audio Fidelity */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Radio size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Audio Pipeline Fidelity</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {qualityOptions.map((opt) => {
            const isSelected = audioQuality === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  setAudioQuality(opt.id);
                  showToast('Pipeline Calibrated', opt.title, 'atmosphere');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-snappy)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontWeight: 600, color: isSelected ? 'var(--text-pure)' : 'var(--text-high)' }}>
                    {opt.title}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
                    {opt.spec}
                  </span>
                </div>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 2.5. Equalizer & Acoustic Sculpting */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sliders size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>7-Band Parametric Equalizer</h3>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: equalizerEnabled ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              color: equalizerEnabled ? 'var(--indicator-success)' : 'var(--text-low)',
              border: `1px solid ${equalizerEnabled ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)'}`,
            }}
          >
            {equalizerEnabled ? 'DSP ACTIVE' : 'BYPASS'}
          </span>
        </div>

        <p style={{ color: 'var(--text-medium)', fontSize: '12.5px', margin: 0, lineHeight: 1.5 }}>
          Shape the acoustic frequency response from 60 Hz sub-bass to 15 kHz crystalline air.
          Equipped with 10 master presets, custom user profiles, and real-time Web Audio biquad filtering.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '13px', color: 'var(--text-medium)' }}>Active Acoustic Preset:</span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '13.5px',
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {currentPresetName}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-low)' }}>
              Press <kbd style={{ padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-subtle)' }}>E</kbd> anywhere to summon the live visualizer console
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button
              variant={equalizerEnabled ? 'primary' : 'secondary'}
              size="sm"
              onClick={toggleEqualizerEnabled}
            >
              {equalizerEnabled ? 'Enabled' : 'Bypass'}
            </Button>
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
      </Card>

      {/* 3. Deep Interface Customization & Aesthetics */}
      <Card variant="flat" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Palette size={20} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Interface Customization & Aesthetics</h3>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-medium)' }}>
                Sculpt the nocturnal visual identity, geometry, luminescence, and atmospheric textures
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw size={13} />}
            onClick={() => {
              resetToDefaults();
              showToast('Aesthetics Reset', 'Restored default Nocturne visual identity', 'atmosphere');
            }}
          >
            Reset to Defaults
          </Button>
        </div>

        {/* 3.1. Primary Atmospheric Themes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
              Atmospheric Theme
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
              6 SIGNATURE NOIRS
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
            {availableThemes.map((thm) => {
              const isSelected = thm.id === currentTheme.id;
              return (
                <div
                  key={thm.id}
                  onClick={() => {
                    setThemeId(thm.id);
                    showToast('Atmosphere Altered', `Activated ${thm.name}`, 'atmosphere');
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${isSelected ? thm.accent : 'var(--border-subtle)'}`,
                    boxShadow: isSelected ? `0 0 18px ${thm.glow}` : 'none',
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
                      <span style={{ fontWeight: 600, color: 'var(--text-pure)', fontSize: '13.5px' }}>
                        {thm.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          color: thm.accent,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.45 }}>
                    {thm.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3.2. Accent Color Luminescence */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
                Accent Color Luminescence
              </span>
              <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-medium)' }}>
                Pervades play controls, illuminated borders, equalizer bars, and glowing interactive states
              </p>
            </div>
            {isCustomAccent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetAccentColor();
                  showToast('Accent Reset', `Restored ${currentTheme.name} default`, 'default');
                }}
              >
                Use Theme Accent ({currentTheme.accent})
              </Button>
            )}
          </div>

          {/* Preset Swatches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {ACCENT_COLOR_PRESETS.map((preset) => {
              const isSelected = accentColor.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.name}
                  onClick={() => {
                    setAccentColor(preset.color, true);
                    showToast('Accent Calibrated', preset.name, 'atmosphere');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1.5px solid ${isSelected ? preset.color : 'var(--border-subtle)'}`,
                    boxShadow: isSelected ? `0 0 12px ${preset.color}66` : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-snappy)',
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: preset.color,
                      boxShadow: `0 0 6px ${preset.color}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11.5px',
                      color: isSelected ? 'var(--text-pure)' : 'var(--text-medium)',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {preset.name}
                  </span>
                </button>
              );
            })}

            {/* Custom Color Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value, true)}
                title="Choose custom accent color"
                style={{
                  width: 22,
                  height: 22,
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: 'none',
                  padding: 0,
                }}
              />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                {accentColor.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* 3.3. Spatial Layout Density */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
              Layout Density
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Controls vertical compactness across track listings, card spacing, and viewport margins
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {(
              [
                {
                  id: 'compact',
                  name: 'Compact',
                  desc: 'Tight information density with condensed rows and reduced padding',
                },
                {
                  id: 'comfortable',
                  name: 'Comfortable',
                  desc: 'Balanced late-night acoustics & legibility (Default standard)',
                },
                {
                  id: 'spacious',
                  name: 'Spacious',
                  desc: 'Generous margins, roomier track rows, and expansive breathing room',
                },
              ] as const
            ).map((item) => {
              const isSelected = layoutDensity === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setLayoutDensity(item.id);
                    showToast('Layout Density Adjusted', item.name, 'default');
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-snappy)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: isSelected ? 'var(--text-pure)' : 'var(--text-high)', fontSize: '13px' }}>
                      {item.name}
                    </span>
                    {isSelected && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3.4. Sidebar Navigation Geometry */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
              Sidebar Navigation Mode
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Calibrate the primary navigation rail geometry or hide it for full-screen immersion
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {(
              [
                {
                  id: 'expanded',
                  name: 'Expanded',
                  desc: 'Full navigation panel with category titles, labels & dynamic badges',
                },
                {
                  id: 'compact',
                  name: 'Compact',
                  desc: '72px icon rail maximizing horizontal browsing width for content',
                },
                {
                  id: 'hidden',
                  name: 'Hidden',
                  desc: 'Distraction-free canvas with floating drawer menu in the top bar',
                },
              ] as const
            ).map((item) => {
              const isSelected = sidebarMode === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSidebarMode(item.id);
                    showToast('Sidebar Mode Changed', item.name, 'default');
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-snappy)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: isSelected ? 'var(--text-pure)' : 'var(--text-high)', fontSize: '13px' }}>
                      {item.name}
                    </span>
                    {isSelected && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3.5. Player Bar Size */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
              Audio Player Scale
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Adjust bottom transport bar height, artwork resolution, and control presence
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {(
              [
                {
                  id: 'minimal',
                  name: 'Minimal',
                  desc: 'Slim 60px transport bar with condensed essential controls',
                },
                {
                  id: 'standard',
                  name: 'Standard',
                  desc: '90px balanced master bar with waveform metrics & scrubber (Default)',
                },
                {
                  id: 'large',
                  name: 'Large',
                  desc: '124px expansive showcase bar with high-res artwork & roomier controls',
                },
              ] as const
            ).map((item) => {
              const isSelected = playerSize === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setPlayerSize(item.id);
                    showToast('Player Scale Adjusted', item.name, 'default');
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-snappy)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: isSelected ? 'var(--text-pure)' : 'var(--text-high)', fontSize: '13px' }}>
                      {item.name}
                    </span>
                    {isSelected && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3.6. Background Mode */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
              Atmospheric Background Mode
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Choose the foundational canvas texture and acoustic luminescence backdrop
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {(
              [
                {
                  id: 'solid',
                  name: 'Solid',
                  desc: 'Pure opaque dark canvas with zero ambient lighting for minimalist focus',
                },
                {
                  id: 'gradient',
                  name: 'Gradient',
                  desc: 'Deep nocturnal radial gradients harmonic to the active theme palette',
                },
                {
                  id: 'album_art',
                  name: 'Album Artwork',
                  desc: 'Dynamic frosted artwork extracted from the currently playing hymn',
                },
                {
                  id: 'ambient',
                  name: 'Ambient',
                  desc: 'Living nocturnal energy auras with drifting celestial glow',
                },
              ] as const
            ).map((item) => {
              const isSelected = backgroundMode === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setBackgroundMode(item.id);
                    showToast('Background Altered', item.name, 'atmosphere');
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-snappy)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: isSelected ? 'var(--text-pure)' : 'var(--text-high)', fontSize: '13px' }}>
                      {item.name}
                    </span>
                    {isSelected && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3.7. Adjustable Blur & Opacity Sliders */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Background Blur */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-pure)', fontSize: '13px' }}>
                  Atmospheric Blur Depth
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-medium)' }}>
                  Diffuses backdrop layers and album art reflections
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--accent-primary)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                {backgroundBlur}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={2}
              value={backgroundBlur}
              onChange={(e) => setBackgroundBlur(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-primary)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Interface Opacity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-pure)', fontSize: '13px' }}>
                  Interface Surface Opacity
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-medium)' }}>
                  Calibrates glass density across sidebars, cards & panels
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--accent-primary)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                {interfaceOpacity}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={interfaceOpacity}
              onChange={(e) => setInterfaceOpacity(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-primary)',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* 3.8. Animation Intensity Modes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-pure)' }}>
              Motion & Animation Intensity
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Control kinetic responsiveness, pulsing glows, and page transitions
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {(
              [
                {
                  id: 'full',
                  name: 'Full',
                  desc: 'Fluid kinetic micro-animations, glowing pulses & liquid transitions',
                },
                {
                  id: 'reduced',
                  name: 'Reduced',
                  desc: 'Subdued snappy transitions with minimal motion for battery saving',
                },
                {
                  id: 'off',
                  name: 'Off',
                  desc: 'Zero transition motion; immediate instantaneous state switching',
                },
              ] as const
            ).map((item) => {
              const isSelected = animationMode === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setAnimationMode(item.id);
                    showToast('Motion Intensity Altered', `${item.name} animations active`, 'default');
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-snappy)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: isSelected ? 'var(--text-pure)' : 'var(--text-high)', fontSize: '13px' }}>
                      {item.name}
                    </span>
                    {isSelected && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 4. Audio Dynamics & Playback Engine */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Volume2 size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Playback Dynamics & Speed</h3>
        </div>

        {/* Playback Speed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text-pure)', fontSize: '13.5px' }}>
                Playback Speed Velocity
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-medium)' }}>
                Time-stretch acoustic tempo with pitch-correction preservation
              </div>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent-primary)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {playbackRate}x
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => {
              const isSelected = playbackRate === rate;
              return (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setPlaybackRate(rate);
                    showToast('Playback Velocity Updated', `${rate}x speed active`, 'default');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#000000' : 'var(--text-high)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
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
        </div>

        {/* Volume Normalization */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-pure)' }}>Volume Normalization (Compressor)</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Studio dynamics leveling prevents abrupt acoustic volume spikes across differing masters
            </div>
          </div>
          <Button
            variant={volumeNormalization ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              const next = !volumeNormalization;
              setVolumeNormalization(next);
              showToast(
                next ? 'Volume Normalization Engaged' : 'Volume Normalization Bypassed',
                next ? 'Studio dynamics compressor active' : 'Raw track mastering output',
                'default'
              );
            }}
          >
            {volumeNormalization ? 'Active' : 'Disabled'}
          </Button>
        </div>

        {/* Crossfade Transitions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            paddingTop: 14,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text-pure)', fontSize: '13.5px' }}>
                Acoustic Crossfade Duration
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-medium)' }}>
                Smoothly blends fading tracks into upcoming sequences via dual-channel Web Audio volume ramps
              </div>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent-primary)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {crossfadeDuration === 0 ? 'Off' : `${crossfadeDuration}s`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CROSSFADE_OPTIONS.map((opt) => {
              const isSelected = crossfadeDuration === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setCrossfadeDuration(opt.value);
                    showToast(
                      'Crossfade Updated',
                      opt.value === 0 ? 'Crossfade disabled' : `${opt.label} acoustic crossfade active`,
                      'default'
                    );
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#000000' : 'var(--text-high)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all var(--transition-snappy)',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Autoplay Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-pure)' }}>Continuous Autoplay</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Automatically discovers and queues matching nocturnal tracks when your queue finishes
            </div>
          </div>
          <Button
            variant={autoplay ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              const next = !autoplay;
              setAutoplay(next);
              showToast(
                next ? 'Autoplay Active' : 'Autoplay Disabled',
                next ? 'Continuous listening session enabled' : 'Playback stops when queue ends',
                'default'
              );
            }}
          >
            {autoplay ? 'Active' : 'Disabled'}
          </Button>
        </div>
      </Card>

      {/* 5. Cache & Memory */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <HardDrive size={22} color="var(--text-medium)" />
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-pure)' }}>Nocturnal Stream Cache</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-medium)' }}>
              428 MB of FLAC audio cached for offline night playback
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Trash2 size={15} />}
          onClick={() => showToast('Cache Cleansed', '428 MB released', 'default')}
        >
          Purge Cache
        </Button>
      </Card>
    </div>
  );
};
