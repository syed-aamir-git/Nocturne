export type ThemeId =
  | 'nocturne'
  | 'obsidian'
  | 'crimson'
  | 'midnight'
  | 'violet'
  | 'monochrome'
  | 'amber'
  | 'mist';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  accent: string;
  secondaryAccent: string;
  glow: string;
  bgDark: string;
  bgCanvas: string;
  bgSurface: string;
  ambientGradient: string;
}

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';
export type SidebarMode = 'expanded' | 'compact' | 'hidden';
export type PlayerSize = 'minimal' | 'standard' | 'large';
export type BackgroundMode = 'solid' | 'gradient' | 'album_art' | 'ambient';
export type AnimationMode = 'full' | 'reduced' | 'off';

export interface AppearanceSettings {
  themeId: ThemeId;
  accentColor: string;
  isCustomAccent: boolean;
  layoutDensity: LayoutDensity;
  sidebarMode: SidebarMode;
  playerSize: PlayerSize;
  backgroundMode: BackgroundMode;
  backgroundBlur: number; // in pixels (0 - 40)
  interfaceOpacity: number; // in percentage (50 - 100)
  animationMode: AnimationMode;
}

export interface AccentColorPreset {
  id: string;
  name: string;
  color: string;
  glow: string;
}
