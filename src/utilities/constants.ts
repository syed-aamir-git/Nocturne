import type { AccentColorPreset, ThemeConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'nocturne',
    name: 'Nocturne',
    description: 'Signature deep obsidian charcoal with amethyst violet glow',
    accent: '#a855f7',
    secondaryAccent: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.35)',
    bgDark: '#07060b',
    bgCanvas: '#09080e',
    bgSurface: '#121118',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(120, 50, 180, 0.12) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(70, 30, 120, 0.1) 0%, transparent 55%)',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'True pitch-black abyss with moonlight silver and deep purple whispers',
    accent: '#9d72ff',
    secondaryAccent: '#b590ff',
    glow: 'rgba(157, 114, 255, 0.35)',
    bgDark: '#030305',
    bgCanvas: '#050508',
    bgSurface: '#0b0b10',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(75, 35, 130, 0.09) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(35, 25, 75, 0.07) 0%, transparent 55%)',
  },
  {
    id: 'crimson',
    name: 'Crimson Night',
    description: 'Velvet noir laced with blood ruby and dark wine reverberations',
    accent: '#f43f5e',
    secondaryAccent: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.35)',
    bgDark: '#080304',
    bgCanvas: '#0c0507',
    bgSurface: '#160c0f',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(180, 20, 50, 0.12) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(100, 15, 35, 0.09) 0%, transparent 55%)',
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    description: 'Oceanic deep navy abyss bathed in celestial sapphire luminescence',
    accent: '#3b82f6',
    secondaryAccent: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.35)',
    bgDark: '#030712',
    bgCanvas: '#050b18',
    bgSurface: '#0c1527',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(30, 90, 200, 0.12) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(20, 50, 140, 0.09) 0%, transparent 55%)',
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Luminous royal twilight purple with vibrant neon lavender',
    accent: '#8b5cf6',
    secondaryAccent: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.35)',
    bgDark: '#07040d',
    bgCanvas: '#0b0614',
    bgSurface: '#140c24',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(140, 60, 220, 0.13) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(90, 40, 160, 0.1) 0%, transparent 55%)',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Stark high-contrast grayscale, pure noir and titanium white',
    accent: '#ffffff',
    secondaryAccent: '#e4e4e7',
    glow: 'rgba(255, 255, 255, 0.25)',
    bgDark: '#050505',
    bgCanvas: '#09090b',
    bgSurface: '#131316',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(255, 255, 255, 0.05) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(200, 200, 200, 0.03) 0%, transparent 55%)',
  },
  // Backwards compatibility
  {
    id: 'amber',
    name: 'Gothic Amber',
    description: 'Antique dark charcoal warmed by incandescent candlelight',
    accent: '#f59e0b',
    secondaryAccent: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.35)',
    bgDark: '#070604',
    bgCanvas: '#0c0a07',
    bgSurface: '#16130d',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(180, 100, 10, 0.12) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(120, 60, 10, 0.09) 0%, transparent 55%)',
  },
  {
    id: 'mist',
    name: 'Ethereal Mist',
    description: 'Nocturnal slate enveloped in auroral cyan vapor',
    accent: '#06b6d4',
    secondaryAccent: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.35)',
    bgDark: '#040809',
    bgCanvas: '#060c0e',
    bgSurface: '#0c1619',
    ambientGradient:
      'radial-gradient(circle at 14% 18%, rgba(10, 140, 170, 0.12) 0%, transparent 60%), radial-gradient(circle at 86% 82%, rgba(10, 90, 120, 0.09) 0%, transparent 55%)',
  },
];

export const ACCENT_COLOR_PRESETS: AccentColorPreset[] = [
  { id: 'amethyst', name: 'Amethyst', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.35)' },
  { id: 'violet', name: 'Violet', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.35)' },
  { id: 'crimson', name: 'Crimson', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.35)' },
  { id: 'midnight', name: 'Midnight Blue', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.35)' },
  { id: 'cyan', name: 'Cyan Mist', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)' },
  { id: 'amber', name: 'Amber Gold', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)' },
  { id: 'emerald', name: 'Emerald', color: '#10b981', glow: 'rgba(16, 185, 129, 0.35)' },
  { id: 'monochrome', name: 'Monochrome', color: '#ffffff', glow: 'rgba(255, 255, 255, 0.3)' },
];

export const AUDIO_QUALITIES = [
  { label: 'Lossless Hi-Res', spec: '24-bit / 96kHz FLAC', badge: 'HI-RES' },
  { label: 'Studio Master', spec: '24-bit / 192kHz MQA', badge: 'MASTER' },
  { label: 'CD Audio', spec: '16-bit / 44.1kHz WAV', badge: 'LOSSLESS' },
];
