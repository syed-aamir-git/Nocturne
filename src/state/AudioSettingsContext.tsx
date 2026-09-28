import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BUILTIN_EQ_PRESETS } from '../types/audio';
import type { AudioQuality, EQPreset, AudioSettings, CrossfadeDuration } from '../types/audio';
import { audioEngine } from '../audio/AudioEngine';

const STORAGE_KEY = 'nocturne_audio_settings_v1';

const DEFAULT_SETTINGS: AudioSettings = {
  equalizerEnabled: true,
  currentPresetId: 'flat',
  gains: [0, 0, 0, 0, 0, 0, 0],
  savedPresets: [],
  volumeNormalization: true,
  audioQuality: 'lossless',
  playbackRate: 1.0,
  crossfadeDuration: 4,
  autoplay: true,
};

function loadStoredSettings(): AudioSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      gains: Array.isArray(parsed.gains) && parsed.gains.length === 7 ? parsed.gains : DEFAULT_SETTINGS.gains,
      savedPresets: Array.isArray(parsed.savedPresets) ? parsed.savedPresets : [],
    };
  } catch (err) {
    console.warn('[AudioSettings] Could not load stored audio settings:', err);
    return DEFAULT_SETTINGS;
  }
}

function persistSettings(settings: AudioSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('[AudioSettings] Could not persist audio settings:', err);
  }
}

export interface AudioSettingsContextType {
  equalizerEnabled: boolean;
  setEqualizerEnabled: (enabled: boolean) => void;
  toggleEqualizerEnabled: () => void;
  currentPresetId: string;
  selectPreset: (presetId: string) => void;
  gains: number[];
  setBandGain: (bandIndex: number, gainDb: number) => void;
  setGains: (gains: number[]) => void;
  savedPresets: EQPreset[];
  saveCustomPreset: (name: string) => EQPreset | null;
  deleteCustomPreset: (presetId: string) => void;
  resetEQ: () => void;
  volumeNormalization: boolean;
  setVolumeNormalization: (enabled: boolean) => void;
  audioQuality: AudioQuality;
  setAudioQuality: (quality: AudioQuality) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  crossfadeDuration: CrossfadeDuration;
  setCrossfadeDuration: (duration: CrossfadeDuration) => void;
  autoplay: boolean;
  setAutoplay: (enabled: boolean) => void;
  toggleAutoplay: () => void;
  isEqualizerOpen: boolean;
  openEqualizer: () => void;
  closeEqualizer: () => void;
  toggleEqualizer: () => void;
}

const AudioSettingsContext = createContext<AudioSettingsContextType | undefined>(undefined);

export const AudioSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AudioSettings>(loadStoredSettings);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);

  // Synchronize audio engine with settings
  useEffect(() => {
    if (settings.equalizerEnabled) {
      audioEngine.setEQGains(settings.gains);
    } else {
      audioEngine.setEQGains([0, 0, 0, 0, 0, 0, 0]);
    }
    audioEngine.setVolumeNormalization(settings.volumeNormalization);
    audioEngine.setPlaybackRate(settings.playbackRate);
  }, [settings.equalizerEnabled, settings.gains, settings.volumeNormalization, settings.playbackRate]);

  // Update storage whenever settings change
  const updateSettings = useCallback((updater: (prev: AudioSettings) => AudioSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      persistSettings(next);
      return next;
    });
  }, []);

  const setEqualizerEnabled = useCallback(
    (enabled: boolean) => {
      updateSettings((prev) => ({ ...prev, equalizerEnabled: enabled }));
      if (enabled) {
        audioEngine.setEQGains(settings.gains);
      } else {
        audioEngine.setEQGains([0, 0, 0, 0, 0, 0, 0]);
      }
    },
    [updateSettings, settings.gains]
  );

  const toggleEqualizerEnabled = useCallback(() => {
    setEqualizerEnabled(!settings.equalizerEnabled);
  }, [setEqualizerEnabled, settings.equalizerEnabled]);

  const selectPreset = useCallback(
    (presetId: string) => {
      const allPresets = [...BUILTIN_EQ_PRESETS, ...settings.savedPresets];
      const match = allPresets.find((p) => p.id === presetId);
      if (!match) return;

      const newGains = [...match.gains];
      updateSettings((prev) => ({
        ...prev,
        currentPresetId: presetId,
        gains: newGains,
      }));

      if (settings.equalizerEnabled) {
        audioEngine.setEQGains(newGains);
      }
    },
    [updateSettings, settings.savedPresets, settings.equalizerEnabled]
  );

  const setBandGain = useCallback(
    (bandIndex: number, gainDb: number) => {
      if (bandIndex < 0 || bandIndex >= 7) return;

      updateSettings((prev) => {
        const nextGains = [...prev.gains];
        nextGains[bandIndex] = Math.round(gainDb * 10) / 10;
        return {
          ...prev,
          gains: nextGains,
          currentPresetId: 'custom',
        };
      });

      if (settings.equalizerEnabled) {
        audioEngine.setEQBandGain(bandIndex, gainDb);
      }
    },
    [updateSettings, settings.equalizerEnabled]
  );

  const setGains = useCallback(
    (newGains: number[]) => {
      if (newGains.length !== 7) return;
      updateSettings((prev) => ({
        ...prev,
        gains: [...newGains],
        currentPresetId: 'custom',
      }));

      if (settings.equalizerEnabled) {
        audioEngine.setEQGains(newGains);
      }
    },
    [updateSettings, settings.equalizerEnabled]
  );

  const saveCustomPreset = useCallback(
    (name: string): EQPreset | null => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      const newPreset: EQPreset = {
        id: `custom_${Date.now()}`,
        name: trimmed,
        gains: [...settings.gains],
        isCustom: true,
      };

      updateSettings((prev) => ({
        ...prev,
        currentPresetId: newPreset.id,
        savedPresets: [...prev.savedPresets, newPreset],
      }));

      return newPreset;
    },
    [updateSettings, settings.gains]
  );

  const deleteCustomPreset = useCallback(
    (presetId: string) => {
      updateSettings((prev) => {
        const filtered = prev.savedPresets.filter((p) => p.id !== presetId);
        const nextPreset = prev.currentPresetId === presetId ? 'flat' : prev.currentPresetId;
        const flatPreset = BUILTIN_EQ_PRESETS.find((p) => p.id === 'flat')!;
        const nextGains = prev.currentPresetId === presetId ? [...flatPreset.gains] : prev.gains;

        if (prev.currentPresetId === presetId && prev.equalizerEnabled) {
          audioEngine.setEQGains(nextGains);
        }

        return {
          ...prev,
          savedPresets: filtered,
          currentPresetId: nextPreset,
          gains: nextGains,
        };
      });
    },
    [updateSettings]
  );

  const resetEQ = useCallback(() => {
    const flatGains = [0, 0, 0, 0, 0, 0, 0];
    updateSettings((prev) => ({
      ...prev,
      currentPresetId: 'flat',
      gains: flatGains,
    }));

    if (settings.equalizerEnabled) {
      audioEngine.setEQGains(flatGains);
    }
  }, [updateSettings, settings.equalizerEnabled]);

  const setVolumeNormalization = useCallback(
    (enabled: boolean) => {
      updateSettings((prev) => ({ ...prev, volumeNormalization: enabled }));
      audioEngine.setVolumeNormalization(enabled);
    },
    [updateSettings]
  );

  const setAudioQuality = useCallback(
    (quality: AudioQuality) => {
      updateSettings((prev) => ({ ...prev, audioQuality: quality }));
    },
    [updateSettings]
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      updateSettings((prev) => ({ ...prev, playbackRate: rate }));
      audioEngine.setPlaybackRate(rate);
    },
    [updateSettings]
  );

  const setCrossfadeDuration = useCallback(
    (duration: CrossfadeDuration) => {
      updateSettings((prev) => ({ ...prev, crossfadeDuration: duration }));
    },
    [updateSettings]
  );

  const setAutoplay = useCallback(
    (enabled: boolean) => {
      updateSettings((prev) => ({ ...prev, autoplay: enabled }));
    },
    [updateSettings]
  );

  const toggleAutoplay = useCallback(() => {
    updateSettings((prev) => ({ ...prev, autoplay: !prev.autoplay }));
  }, [updateSettings]);

  const openEqualizer = useCallback(() => setIsEqualizerOpen(true), []);
  const closeEqualizer = useCallback(() => setIsEqualizerOpen(false), []);
  const toggleEqualizer = useCallback(() => setIsEqualizerOpen((prev) => !prev), []);

  return (
    <AudioSettingsContext.Provider
      value={{
        equalizerEnabled: settings.equalizerEnabled,
        setEqualizerEnabled,
        toggleEqualizerEnabled,
        currentPresetId: settings.currentPresetId,
        selectPreset,
        gains: settings.gains,
        setBandGain,
        setGains,
        savedPresets: settings.savedPresets,
        saveCustomPreset,
        deleteCustomPreset,
        resetEQ,
        volumeNormalization: settings.volumeNormalization,
        setVolumeNormalization,
        audioQuality: settings.audioQuality,
        setAudioQuality,
        playbackRate: settings.playbackRate,
        setPlaybackRate,
        crossfadeDuration: settings.crossfadeDuration,
        setCrossfadeDuration,
        autoplay: settings.autoplay,
        setAutoplay,
        toggleAutoplay,
        isEqualizerOpen,
        openEqualizer,
        closeEqualizer,
        toggleEqualizer,
      }}
    >
      {children}
    </AudioSettingsContext.Provider>
  );
};

export const useAudioSettings = (): AudioSettingsContextType => {
  const context = useContext(AudioSettingsContext);
  if (!context) {
    throw new Error('useAudioSettings must be used within an AudioSettingsProvider');
  }
  return context;
};
