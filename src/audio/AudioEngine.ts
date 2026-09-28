import type { AudioEngineInterface, AudioEventListener } from './types';
import { EQ_BANDS } from '../types/audio';

/**
 * NocturneAudioEngine
 * Centralized, production-grade audio manager controlling ONE persistent HTMLAudioElement instance.
 * Integrated with the Web Audio API for a 7-band parametric Equalizer, Dynamics Compressor,
 * and high-resolution AnalyserNode for audio visualization.
 * Preserves uninterrupted playback across all route navigations with graceful degradation.
 */
export class NocturneAudioEngine implements AudioEngineInterface {
  private audio: HTMLAudioElement;
  private listeners: Set<AudioEventListener> = new Set();
  private currentSrc: string = '';
  private isBuffering: boolean = false;

  // Web Audio API members
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private compressorNode: DynamicsCompressorNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isWebAudioReady: boolean = false;
  private currentGains: number[] = [0, 0, 0, 0, 0, 0, 0];
  private isNormalizationActive: boolean = false;
  private currentPlaybackRate: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.volume = 0.8;
      this.setupListeners();
    } else {
      // Graceful fallback for non-DOM/SSR or unit test environments
      this.audio = {
        preload: 'auto',
        volume: 0.8,
        playbackRate: 1.0,
        currentTime: 0,
        duration: 0,
        paused: true,
        src: '',
        addEventListener: () => {},
        removeEventListener: () => {},
        play: async () => {},
        pause: () => {},
      } as unknown as HTMLAudioElement;
    }
  }

  private setupListeners(): void {
    this.audio.addEventListener('play', () => {
      this.isBuffering = false;
      this.ensureWebAudioResumed();
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
      this.ensureWebAudioResumed();
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

  /**
   * Initializes the Web Audio processing graph lazily upon user interaction.
   * If the browser or environment does not support Web Audio, gracefully degrades to standard HTML5 audio.
   */
  public initWebAudio(): boolean {
    if (this.isWebAudioReady) return true;
    if (typeof window === 'undefined') return false;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        console.info('[NocturneAudioEngine] Web Audio API not supported in this browser, using native audio.');
        return false;
      }

      this.audioContext = new AudioCtx();

      // Create 7 BiquadFilterNodes for each frequency band
      this.eqFilters = EQ_BANDS.map((band) => {
        const filter = this.audioContext!.createBiquadFilter();
        filter.type = band.type;
        filter.frequency.setValueAtTime(band.frequency, this.audioContext!.currentTime);
        filter.gain.setValueAtTime(0, this.audioContext!.currentTime);
        filter.Q.setValueAtTime(1.0, this.audioContext!.currentTime);
        return filter;
      });

      // Apply any preset gains that were loaded prior to audio context initialization
      this.currentGains.forEach((gain, idx) => {
        if (this.eqFilters[idx]) {
          this.eqFilters[idx].gain.setValueAtTime(gain, this.audioContext!.currentTime);
        }
      });

      // Create DynamicsCompressorNode for Volume Normalization
      this.compressorNode = this.audioContext.createDynamicsCompressor();
      this.updateCompressorSettings();

      // Create Master GainNode
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);

      // Create AnalyserNode for audio visualizer
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 128;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Connect MediaElementSource through the audio graph
      this.sourceNode = this.audioContext.createMediaElementSource(this.audio);

      let lastNode: AudioNode = this.sourceNode;
      for (const filter of this.eqFilters) {
        lastNode.connect(filter);
        lastNode = filter;
      }

      lastNode.connect(this.compressorNode);
      this.compressorNode.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);

      this.isWebAudioReady = true;
      return true;
    } catch (err) {
      console.warn('[NocturneAudioEngine] Web Audio graph could not be established; audio element continues playing directly:', err);
      this.isWebAudioReady = false;
      return false;
    }
  }

  /**
   * Resumes the AudioContext if it was suspended by browser autoplay policy.
   */
  private ensureWebAudioResumed(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch((err) => {
        console.warn('[NocturneAudioEngine] Could not resume audioContext:', err);
      });
    }
  }

  /**
   * Updates the 7 equalizer band gains in real time.
   * @param gains Array of 7 numbers in decibels (-12 to +12 dB)
   */
  public setEQGains(gains: number[]): void {
    this.currentGains = [...gains];

    if (!this.isWebAudioReady) {
      this.initWebAudio();
    }

    if (!this.audioContext || this.eqFilters.length === 0) return;

    const now = this.audioContext.currentTime;
    gains.forEach((gain, index) => {
      const filter = this.eqFilters[index];
      if (filter) {
        const clamped = Math.max(-15, Math.min(15, gain));
        filter.gain.setTargetAtTime(clamped, now, 0.05);
      }
    });
  }

  /**
   * Updates a single equalizer band gain in real time.
   */
  public setEQBandGain(bandIndex: number, gainDb: number): void {
    if (bandIndex < 0 || bandIndex >= this.currentGains.length) return;
    this.currentGains[bandIndex] = gainDb;
    this.setEQGains(this.currentGains);
  }

  /**
   * Returns current active EQ gains.
   */
  public getEQGains(): number[] {
    return [...this.currentGains];
  }

  /**
   * Enables or disables volume normalization via the dynamics compressor.
   */
  public setVolumeNormalization(enabled: boolean): void {
    this.isNormalizationActive = enabled;
    this.updateCompressorSettings();
  }

  public isVolumeNormalizationEnabled(): boolean {
    return this.isNormalizationActive;
  }

  private updateCompressorSettings(): void {
    if (!this.audioContext || !this.compressorNode) return;
    const now = this.audioContext.currentTime;

    if (this.isNormalizationActive) {
      // Gentle compression to equalize perceived track loudness
      this.compressorNode.threshold.setTargetAtTime(-24, now, 0.05);
      this.compressorNode.knee.setTargetAtTime(30, now, 0.05);
      this.compressorNode.ratio.setTargetAtTime(8, now, 0.05);
      this.compressorNode.attack.setTargetAtTime(0.003, now, 0.05);
      this.compressorNode.release.setTargetAtTime(0.25, now, 0.05);
    } else {
      // Linear transparent pass-through
      this.compressorNode.threshold.setTargetAtTime(0, now, 0.05);
      this.compressorNode.ratio.setTargetAtTime(1, now, 0.05);
    }
  }

  /**
   * Sets playback speed multiplier.
   * @param rate Speed between 0.5 and 2.0
   */
  public setPlaybackRate(rate: number): void {
    const clamped = Math.max(0.25, Math.min(3.0, rate));
    this.currentPlaybackRate = clamped;
    this.audio.playbackRate = clamped;
  }

  public getPlaybackRate(): number {
    return this.currentPlaybackRate;
  }

  /**
   * Populates frequency data for the real-time animated equalizer visualizer.
   * Returns true if non-zero real-time audio data was populated.
   */
  public getFrequencyData(array: Uint8Array): boolean {
    if (!this.analyserNode || !this.isWebAudioReady) {
      return false;
    }

    try {
      this.analyserNode.getByteFrequencyData(array as any);
      let sum = 0;
      for (let i = 0; i < array.length; i++) {
        sum += array[i];
      }
      return sum > 0;
    } catch {
      return false;
    }
  }

  public isWebAudioActive(): boolean {
    return this.isWebAudioReady && this.audioContext !== null;
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
      this.audio.playbackRate = this.currentPlaybackRate;
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

    // Lazy init Web Audio on first play attempt
    if (!this.isWebAudioReady) {
      this.initWebAudio();
    }
    this.ensureWebAudioResumed();

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
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
    }
  }
}

// Global persistent Audio Engine Singleton instance
export const audioEngine = new NocturneAudioEngine();
