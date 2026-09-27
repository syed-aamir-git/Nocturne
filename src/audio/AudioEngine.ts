import type { AudioEngineInterface, AudioEventListener } from './types';

/**
 * NocturneAudioEngine
 * Centralized, production-grade audio manager controlling ONE persistent HTMLAudioElement instance.
 * Preserves playback uninterrupted across all page and route transitions.
 */
export class NocturneAudioEngine implements AudioEngineInterface {
  private audio: HTMLAudioElement;
  private listeners: Set<AudioEventListener> = new Set();
  private currentSrc: string = '';
  private isBuffering: boolean = false;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.volume = 0.8;
    this.setupListeners();
  }

  private setupListeners(): void {
    this.audio.addEventListener('play', () => {
      this.isBuffering = false;
      this.notifyListeners((l) => l.onPlay?.());
    });

    this.audio.addEventListener('pause', () => {
      this.notifyListeners((l) => l.onPause?.());
    });

    this.audio.addEventListener('timeupdate', () => {
      const curr = this.audio.currentTime || 0;
      const dur = this.audio.duration && !isNaN(this.audio.duration) ? this.audio.duration : 0;
      this.notifyListeners((l) => l.onTimeUpdate?.(curr, dur));
    });

    this.audio.addEventListener('durationchange', () => {
      const curr = this.audio.currentTime || 0;
      const dur = this.audio.duration && !isNaN(this.audio.duration) ? this.audio.duration : 0;
      this.notifyListeners((l) => l.onTimeUpdate?.(curr, dur));
    });

    this.audio.addEventListener('ended', () => {
      this.notifyListeners((l) => l.onEnded?.());
    });

    this.audio.addEventListener('waiting', () => {
      this.isBuffering = true;
      this.notifyListeners((l) => l.onLoading?.(true));
    });

    this.audio.addEventListener('canplay', () => {
      this.isBuffering = false;
      this.notifyListeners((l) => {
        l.onLoading?.(false);
        l.onCanPlay?.();
      });
    });

    this.audio.addEventListener('playing', () => {
      this.isBuffering = false;
      this.notifyListeners((l) => {
        l.onLoading?.(false);
        l.onPlay?.();
      });
    });

    this.audio.addEventListener('volumechange', () => {
      this.notifyListeners((l) => l.onVolumeChange?.(this.audio.volume, this.audio.muted));
    });

    this.audio.addEventListener('error', () => {
      this.isBuffering = false;
      let errorMsg = 'Unknown audio streaming error';
      if (this.audio.error) {
        switch (this.audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Audio playback was aborted by user or network';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error disrupted audio stream transmission';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Audio stream corruption or unsupported audio codec';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Audio source could not be resolved or is currently offline';
            break;
        }
      }
      const err = new Error(errorMsg);
      this.notifyListeners((l) => {
        l.onLoading?.(false);
        l.onError?.(err);
      });
    });
  }

  private notifyListeners(callback: (listener: AudioEventListener) => void): void {
    this.listeners.forEach((listener) => {
      try {
        callback(listener);
      } catch (err) {
        console.error('[NocturneAudioEngine] Listener callback error:', err);
      }
    });
  }

  public async loadTrack(src: string, autoPlay: boolean = false): Promise<void> {
    if (!src) {
      console.warn('[NocturneAudioEngine] Empty audio source passed to loadTrack');
      return;
    }

    if (this.currentSrc === src && this.isPlaying()) {
      if (autoPlay) {
        return;
      }
    }

    this.currentSrc = src;
    this.isBuffering = true;
    this.notifyListeners((l) => l.onLoading?.(true));

    try {
      this.audio.src = src;
      this.audio.load();

      if (autoPlay) {
        await this.play();
      }
    } catch (err) {
      this.isBuffering = false;
      this.notifyListeners((l) => {
        l.onLoading?.(false);
        l.onError?.(err instanceof Error ? err : new Error(String(err)));
      });
    }
  }

  public async play(): Promise<void> {
    if (!this.audio.src) {
      return;
    }

    try {
      await this.audio.play();
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError') {
        console.info('[NocturneAudioEngine] Autoplay requires user interaction first.');
      } else if (error.name === 'AbortError') {
        console.info('[NocturneAudioEngine] Play request was interrupted by a new load request.');
      } else {
        console.warn('[NocturneAudioEngine] Play error:', error.message);
        this.notifyListeners((l) => l.onError?.(error));
      }
    }
  }

  public pause(): void {
    try {
      this.audio.pause();
    } catch (err) {
      console.warn('[NocturneAudioEngine] Pause error:', err);
    }
  }

  public seek(timeInSeconds: number): void {
    if (isFinite(timeInSeconds)) {
      const target = Math.max(0, Math.min(timeInSeconds, this.audio.duration || timeInSeconds));
      this.audio.currentTime = target;
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.audio.volume = clamped;
  }

  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  public isMuted(): boolean {
    return this.audio.muted;
  }

  public getVolume(): number {
    return this.audio.volume;
  }

  public getCurrentTime(): number {
    return this.audio.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio.duration && !isNaN(this.audio.duration) ? this.audio.duration : 0;
  }

  public isPlaying(): boolean {
    return !this.audio.paused && !this.audio.ended && this.audio.readyState > 2;
  }

  public isBufferingState(): boolean {
    return this.isBuffering;
  }

  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public cleanup(): void {
    this.pause();
    this.audio.src = '';
    this.currentSrc = '';
    this.listeners.clear();
  }
}

// Global persistent Audio Engine Singleton instance
export const audioEngine = new NocturneAudioEngine();
