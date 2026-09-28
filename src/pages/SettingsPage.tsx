import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Radio,
  Sparkles,
  Volume2,
  HardDrive,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Sliders,
} from 'lucide-react';
import { Card } from '../components/primitives/Card';
import { Button } from '../components/primitives/Button';
import { useTheme } from '../state/ThemeContext';
import { useToast } from '../state/ToastContext';
import { useSpotify } from '../state/SpotifyContext';
import { useAudioSettings } from '../state/AudioSettingsContext';
import { BUILTIN_EQ_PRESETS, CROSSFADE_OPTIONS } from '../types/audio';
import type { AudioQuality } from '../types/audio';

export const SettingsPage: React.FC = () => {
  const { currentTheme, availableThemes, setThemeId } = useTheme();
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

      {/* 3. Nocturnal Theme Palette */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Atmospheric Theme Matrix</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
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
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--bg-surface-elevated)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1.5px solid ${isSelected ? thm.accent : 'var(--border-subtle)'}`,
                  boxShadow: isSelected ? `0 0 16px ${thm.glow}` : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-snappy)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: thm.accent }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-pure)' }}>{thm.name}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                  {thm.description}
                </div>
              </div>
            );
          })}
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
