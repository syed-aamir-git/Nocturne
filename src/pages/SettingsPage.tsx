import React, { useState } from 'react';
import { Settings as SettingsIcon, Radio, Sparkles, Volume2, HardDrive, Trash2 } from 'lucide-react';
import { Card } from '../components/primitives/Card';
import { Button } from '../components/primitives/Button';
import { Slider } from '../components/primitives/Slider';
import { useTheme } from '../state/ThemeContext';
import { useToast } from '../state/ToastContext';

export const SettingsPage: React.FC = () => {
  const { currentTheme, availableThemes, setThemeId } = useTheme();
  const { showToast } = useToast();

  const [streamQuality, setStreamQuality] = useState('flac-96');
  const [crossfade, setCrossfade] = useState(4);
  const [normalizeAudio, setNormalizeAudio] = useState(true);

  const qualityOptions = [
    {
      id: 'flac-96',
      title: 'Lossless Hi-Res (Recommended)',
      spec: '24-bit / 96kHz FLAC • Bit-perfect master reproduction',
    },
    {
      id: 'mqa-192',
      title: 'Studio Master MQA',
      spec: '24-bit / 192kHz • Uncompressed analog transfer',
    },
    {
      id: 'wav-44',
      title: 'Standard CD Quality',
      spec: '16-bit / 44.1kHz WAV • Reduced bandwidth usage',
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <SettingsIcon size={22} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Preferences</h1>
        </div>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Calibrate audio fidelity, acoustic buffers, and the nocturnal atmosphere
        </p>
      </div>

      {/* 1. Audio Fidelity */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Radio size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Audio Pipeline Fidelity</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {qualityOptions.map((opt) => {
            const isSelected = streamQuality === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  setStreamQuality(opt.id);
                  showToast('Stream Pipeline Adjusted', opt.title, 'atmosphere');
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

      {/* 2. Nocturnal Theme Palette */}
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

      {/* 3. Audio Dynamics & Crossfade */}
      <Card variant="flat" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Volume2 size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Playback & Crossfade</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
            <span>Acoustic Crossfade Decay</span>
            <span className="font-mono">{crossfade}s</span>
          </div>
          <Slider
            value={crossfade}
            min={0}
            max={12}
            step={1}
            onChange={setCrossfade}
            aria-label="Crossfade slider"
          />
          <span style={{ fontSize: '11px', color: 'var(--text-low)' }}>
            Gradually dissolves fading tracks into upcoming sequences
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-pure)' }}>Dynamic Volume Preservation</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-medium)' }}>
              Prevents sudden volume spikes across different master tapes
            </div>
          </div>
          <Button
            variant={normalizeAudio ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setNormalizeAudio(!normalizeAudio)}
          >
            {normalizeAudio ? 'Active' : 'Disabled'}
          </Button>
        </div>
      </Card>

      {/* 4. Cache & Memory */}
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
