import type { AudioEngineInterface, AudioEventListener } from './types';

export class NocturneAudioEngine implements AudioEngineInterface {
  private audio: HTMLAudioElement;
  private listeners: Set<AudioEventListener> = new Set();

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('play', () => {
      this.listeners.forEach((l) => l.onPlay?.());
    });

    this.audio.addEventListener('pause', () => {
      this.listeners.forEach((l) => l.onPause?.());
    });

    this.audio.addEventListener('timeupdate', () => {
      this.listeners.forEach((l) =>
        l.onTimeUpdate?.(this.audio.currentTime, this.audio.duration || 0)
      );
    });

    this.audio.addEventListener('ended', () => {
      this.listeners.forEach((l) => l.onEnded?.());
    });

    this.audio.addEventListener('waiting', () => {
      this.listeners.forEach((l) => l.onLoading?.(true));
    });

    this.audio.addEventListener('playing', () => {
      this.listeners.forEach((l) => l.onLoading?.(false));
    });

    this.audio.addEventListener('error', () => {
      const err = new Error(this.audio.error?.message || 'Audio playback error');
      this.listeners.forEach((l) => l.onError?.(err));
    });
  }

  public async loadTrack(src: string, autoPlay: boolean = false): Promise<void> {
    this.audio.src = src;
    this.audio.load();

    if (autoPlay) {
      await this.play();
    }
  }

  public async play(): Promise<void> {
    try {
      await this.audio.play();
    } catch (err) {
      console.warn('[NocturneAudioEngine] Playback interrupted or requires user interaction:', err);
    }
  }

  public pause(): void {
    this.audio.pause();
  }

  public seek(timeInSeconds: number): void {
    if (isFinite(timeInSeconds)) {
      this.audio.currentTime = Math.max(0, Math.min(timeInSeconds, this.audio.duration || 0));
    }
  }

  public setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  public getCurrentTime(): number {
    return this.audio.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio.duration || 0;
  }

  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public cleanup(): void {
    this.audio.pause();
    this.audio.src = '';
    this.listeners.clear();
  }
}

export const audioEngine = new NocturneAudioEngine();
