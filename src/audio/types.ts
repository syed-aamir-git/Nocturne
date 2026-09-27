export interface AudioEventListener {
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (err: Error) => void;
  onLoading?: (isLoading: boolean) => void;
  onCanPlay?: () => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
}

export interface AudioEngineInterface {
  loadTrack(src: string, autoPlay?: boolean): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(timeInSeconds: number): void;
  setVolume(volume: number): void; // 0.0 - 1.0
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  getVolume(): number;
  getCurrentTime(): number;
  getDuration(): number;
  isPlaying(): boolean;
  subscribe(listener: AudioEventListener): () => void;
  cleanup(): void;
}
