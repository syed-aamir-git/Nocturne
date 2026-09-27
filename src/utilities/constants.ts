import type { ThemeConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Abyss',
    description: 'Deep midnight indigo with ethereal moonlight amethyst',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.35)',
    bgDark: '#06070a',
  },
  {
    id: 'amber',
    name: 'Gothic Amber',
    description: 'Antique dark charcoal warmed by incandescent candlelight',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    bgDark: '#070604',
  },
  {
    id: 'crimson',
    name: 'Crimson Veil',
    description: 'Velvet noir laced with blood ruby and dark wine',
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.4)',
    bgDark: '#080304',
  },
  {
    id: 'mist',
    name: 'Ethereal Mist',
    description: 'Nocturnal slate enveloped in auroral cyan vapor',
    accent: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    bgDark: '#040809',
  },
];

export const AUDIO_QUALITIES = [
  { label: 'Lossless Hi-Res', spec: '24-bit / 96kHz FLAC', badge: 'HI-RES' },
  { label: 'Studio Master', spec: '24-bit / 192kHz MQA', badge: 'MASTER' },
  { label: 'CD Audio', spec: '16-bit / 44.1kHz WAV', badge: 'LOSSLESS' },
];
