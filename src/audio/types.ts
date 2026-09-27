export interface AudioEventListener {
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (err: Error) => void;
  onLoading?: (isLoading: boolean) => void;
}

export interface AudioEngineInterface {
  loadTrack(src: string, autoPlay?: boolean): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(timeInSeconds: number): void;
  setVolume(volume: number): void; // 0.0 - 1.0
  setMuted(muted: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  subscribe(listener: AudioEventListener): () => void;
  cleanup(): void;
}
