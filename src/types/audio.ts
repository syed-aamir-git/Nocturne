export type AudioQuality = 'lossless' | 'high' | 'standard' | 'saver';

export interface EQBandInfo {
  frequency: number; // in Hz
  label: string;
  type: BiquadFilterType;
  defaultGain: number; // in dB
}

export const EQ_BANDS: readonly EQBandInfo[] = [
  { frequency: 60, label: '60 Hz', type: 'lowshelf', defaultGain: 0 },
  { frequency: 150, label: '150 Hz', type: 'peaking', defaultGain: 0 },
  { frequency: 400, label: '400 Hz', type: 'peaking', defaultGain: 0 },
  { frequency: 1000, label: '1 kHz', type: 'peaking', defaultGain: 0 },
  { frequency: 2400, label: '2.4 kHz', type: 'peaking', defaultGain: 0 },
  { frequency: 6000, label: '6 kHz', type: 'peaking', defaultGain: 0 },
  { frequency: 15000, label: '15 kHz', type: 'highshelf', defaultGain: 0 },
] as const;

export interface EQPreset {
  id: string;
  name: string;
  gains: number[]; // 7 numbers for the 7 bands (-12 to +12 dB)
  isCustom?: boolean;
}

export const BUILTIN_EQ_PRESETS: readonly EQPreset[] = [
  {
    id: 'flat',
    name: 'Flat',
    gains: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'rock',
    name: 'Rock',
    gains: [4.5, 3.0, -1.0, 1.0, 2.5, 4.0, 5.0],
  },
  {
    id: 'pop',
    name: 'Pop',
    gains: [-1.0, 2.0, 4.0, 3.0, 0.5, -1.0, -2.0],
  },
  {
    id: 'classical',
    name: 'Classical',
    gains: [5.0, 3.5, -1.5, -1.0, 0.5, 2.5, 3.5],
  },
  {
    id: 'jazz',
    name: 'Jazz',
    gains: [3.5, 2.0, 0.0, 1.5, 1.0, 2.0, 3.0],
  },
  {
    id: 'electronic',
    name: 'Electronic',
    gains: [5.5, 4.5, 1.0, -1.0, 2.0, 4.0, 5.0],
  },
  {
    id: 'vocal',
    name: 'Vocal',
    gains: [-2.5, -1.0, 1.5, 4.5, 3.5, 1.0, -1.5],
  },
  {
    id: 'bass_boost',
    name: 'Bass Boost',
    gains: [6.0, 5.0, 3.0, 0.5, 0.0, 0.0, 0.0],
  },
  {
    id: 'treble_boost',
    name: 'Treble Boost',
    gains: [0.0, 0.0, 0.0, 0.5, 2.5, 5.0, 6.0],
  },
  {
    id: 'night',
    name: 'Night',
    gains: [-2.5, -1.5, 0.0, 1.0, 1.0, -1.5, -3.5],
  },
] as const;

export interface AudioSettings {
  equalizerEnabled: boolean;
  currentPresetId: string;
  gains: number[]; // 7 gains
  savedPresets: EQPreset[];
  volumeNormalization: boolean;
  audioQuality: AudioQuality;
  playbackRate: number; // 0.5 to 2.0
}
