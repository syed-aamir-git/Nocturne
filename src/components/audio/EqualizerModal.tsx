import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  Volume2,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { useAudioSettings } from '../../state/AudioSettingsContext';
import { useToast } from '../../state/ToastContext';
import { EQ_BANDS, BUILTIN_EQ_PRESETS } from '../../types/audio';
import type { AudioQuality } from '../../types/audio';
import { AudioVisualizer } from './AudioVisualizer';
import { IconButton } from '../primitives/IconButton';
import { Button } from '../primitives/Button';
import './EqualizerModal.css';

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerOpen,
    closeEqualizer,
    equalizerEnabled,
    setEqualizerEnabled,
    currentPresetId,
    selectPreset,
    gains,
    setBandGain,
    savedPresets,
    saveCustomPreset,
    deleteCustomPreset,
    resetEQ,
    volumeNormalization,
    setVolumeNormalization,
    audioQuality,
    setAudioQuality,
    playbackRate,
    setPlaybackRate,
  } = useAudioSettings();

  const { showToast } = useToast();
  const [newPresetName, setNewPresetName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEqualizerOpen) {
        closeEqualizer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEqualizerOpen, closeEqualizer]);

  if (!isEqualizerOpen) return null;

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const created = saveCustomPreset(newPresetName);
    if (created) {
      showToast('Acoustic Preset Saved', `"${created.name}" registered to sanctuary calibration`, 'atmosphere');
      setNewPresetName('');
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetEQ();
    showToast('Equalizer Reset', 'All bands returned to flat 0.0 dB response', 'default');
  };

  const allPresets = [...BUILTIN_EQ_PRESETS, ...savedPresets];

  const qualityOptions: { id: AudioQuality; label: string; desc: string }[] = [
    { id: 'lossless', label: '24-bit / 96kHz Lossless FLAC', desc: 'Direct studio master reproduction' },
    { id: 'high', label: '320 kbps High Definition', desc: 'Optimal fidelity for high-end audio' },
    { id: 'standard', label: '192 kbps Balanced Stream', desc: 'Standard sanctuary streaming profile' },
    { id: 'saver', label: '96 kbps Data Conservation', desc: 'Bandwidth saver for low latency' },
  ];

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div
      className="nocturne-eq-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Equalizer and Audio Processing"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEqualizer();
      }}
    >
      <div className="nocturne-eq-modal__window">
        {/* Header */}
        <header className="nocturne-eq-modal__header">
          <div className="nocturne-eq-modal__title-wrap">
            <div className="nocturne-eq-modal__icon-badge">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="nocturne-eq-modal__title">Acoustic Signal Processing</h2>
              <p className="nocturne-eq-modal__subtitle">
                Web Audio 7-band parametric equalizer & dynamic loudness calibration
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: equalizerEnabled ? 'var(--accent-secondary)' : 'var(--text-low)',
                cursor: 'pointer',
              }}
            >
              <span>{equalizerEnabled ? 'DSP ACTIVE' : 'BYPASS'}</span>
              <div className="nocturne-toggle-switch">
                <input
                  type="checkbox"
                  checked={equalizerEnabled}
                  onChange={(e) => setEqualizerEnabled(e.target.checked)}
                />
                <span className="nocturne-toggle-switch__slider" />
              </div>
            </label>

            <IconButton
              variant="ghost"
              size="md"
              onClick={closeEqualizer}
              aria-label="Close equalizer window"
            >
              <X size={20} />
            </IconButton>
          </div>
        </header>

        {/* Body */}
        <div className="nocturne-eq-modal__body">
          {/* Animated Real-time Spectrum Visualizer */}
          <AudioVisualizer height={100} barsCount={36} showLabels={true} />

          {/* Presets Selection */}
          <div className="nocturne-eq-modal__presets-section">
            <div className="nocturne-eq-modal__section-header">
              <span className="nocturne-eq-modal__section-title">CALIBRATION PRESETS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!isSaving ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Plus size={13} />}
                    onClick={() => setIsSaving(true)}
                  >
                    Save As Preset
                  </Button>
                ) : (
                  <form onSubmit={handleSavePreset} className="nocturne-eq-modal__save-form">
                    <input
                      type="text"
                      className="nocturne-eq-modal__save-input"
                      placeholder="Preset name..."
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      autoFocus
                    />
                    <Button variant="primary" size="sm" type="submit">
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => setIsSaving(false)}
                    >
                      Cancel
                    </Button>
                  </form>
                )}
              </div>
            </div>

            <div className="nocturne-eq-modal__presets-grid">
              {allPresets.map((preset) => {
                const isActive = currentPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`nocturne-eq-modal__preset-pill ${
                      isActive ? 'nocturne-eq-modal__preset-pill--active' : ''
                    }`}
                    onClick={() => selectPreset(preset.id)}
                  >
                    <span>{preset.name}</span>
                    {preset.isCustom && (
                      <span
                        className="nocturne-eq-modal__preset-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomPreset(preset.id);
                        }}
                        title="Delete custom preset"
                      >
                        <Trash2 size={11} />
                      </span>
                    )}
                  </button>
                );
              })}

              {currentPresetId === 'custom' && (
                <div className="nocturne-eq-modal__preset-pill nocturne-eq-modal__preset-pill--active">
                  <span>Custom Settings</span>
                </div>
              )}
            </div>
          </div>

          {/* 7-Band Equalizer Sliders */}
          <div className="nocturne-eq-modal__bands-container">
            {EQ_BANDS.map((band, idx) => {
              const currentGain = gains[idx] ?? 0;
              return (
                <div key={band.frequency} className="nocturne-eq-band-col">
                  <span className="nocturne-eq-band__gain-badge">
                    {currentGain > 0 ? `+${currentGain.toFixed(1)}` : currentGain.toFixed(1)} dB
                  </span>

                  <div className="nocturne-eq-band__slider-track">
                    <div className="nocturne-eq-band__center-mark" />
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={0.5}
                      value={currentGain}
                      disabled={!equalizerEnabled}
                      onChange={(e) => setBandGain(idx, parseFloat(e.target.value))}
                      className="nocturne-eq-band__slider-input"
                      aria-label={`${band.label} frequency gain slider`}
                    />
                  </div>

                  <span className="nocturne-eq-band__label">{band.label}</span>
                </div>
              );
            })}
          </div>

          {/* Secondary Audio Processing Settings Grid */}
          <div className="nocturne-eq-modal__settings-grid">
            {/* Volume Normalization */}
            <div className="nocturne-eq-setting-card">
              <div className="nocturne-eq-setting-card__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Volume2 size={16} color="var(--accent-secondary)" />
                  <span className="nocturne-eq-setting-card__title">Volume Normalization</span>
                </div>
                <div className="nocturne-toggle-switch">
                  <input
                    type="checkbox"
                    checked={volumeNormalization}
                    onChange={(e) => setVolumeNormalization(e.target.checked)}
                  />
                  <span className="nocturne-toggle-switch__slider" />
                </div>
              </div>
              <span className="nocturne-eq-setting-card__desc">
                Balances perceived loudness across contrasting masters with studio dynamic compression.
              </span>
            </div>

            {/* Playback Speed */}
            <div className="nocturne-eq-setting-card">
              <div className="nocturne-eq-setting-card__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Gauge size={16} color="var(--accent-secondary)" />
                  <span className="nocturne-eq-setting-card__title">Playback Speed</span>
                </div>
                <select
                  className="nocturne-eq-select"
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                >
                  {speedOptions.map((spd) => (
                    <option key={spd} value={spd}>
                      {spd === 1.0 ? '1.0x (Normal)' : `${spd}x`}
                    </option>
                  ))}
                </select>
              </div>
              <span className="nocturne-eq-setting-card__desc">
                Alters playback tempo without shifting harmonic pitch resolution.
              </span>
            </div>

            {/* Audio Stream Quality */}
            <div className="nocturne-eq-setting-card">
              <div className="nocturne-eq-setting-card__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} color="var(--accent-secondary)" />
                  <span className="nocturne-eq-setting-card__title">Streaming Quality</span>
                </div>
                <select
                  className="nocturne-eq-select"
                  value={audioQuality}
                  onChange={(e) => setAudioQuality(e.target.value as AudioQuality)}
                >
                  {qualityOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label.split(' ')[0]} ({opt.label.split(' ')[2] || 'FLAC'})
                    </option>
                  ))}
                </select>
              </div>
              <span className="nocturne-eq-setting-card__desc">
                {qualityOptions.find((o) => o.id === audioQuality)?.desc || 'Lossless stream'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="nocturne-eq-modal__footer">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
            onClick={handleReset}
          >
            Reset Equalizer
          </Button>

          <Button variant="primary" size="sm" onClick={closeEqualizer}>
            Done
          </Button>
        </footer>
      </div>
    </div>
  );
};
