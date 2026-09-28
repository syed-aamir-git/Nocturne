import type { AudioEngineInterface, AudioEventListener } from './types';
import { EQ_BANDS } from '../types/audio';

interface AudioChannelSlot {
  index: number;
  audio: HTMLAudioElement;
  sourceNode: MediaElementAudioSourceNode | null;
  gainNode: GainNode | null;
  src: string;
}

/**
 * NocturneAudioEngine
 * Dual-channel Web Audio manager enabling true acoustic crossfade, 7-band parametric EQ,
 * dynamics compression leveling, FFT spectrum analysis, and robust fallback playback.
 */
export class NocturneAudioEngine implements AudioEngineInterface {
  private channels: [AudioChannelSlot, AudioChannelSlot];
  private activeIndex: number = 0;
  private isCrossfadingState: boolean = false;
  private crossfadeTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private fallbackCrossfadeInterval: ReturnType<typeof setInterval> | null = null;
  private pendingCrossfadeOnComplete: (() => void) | null = null;
  private operationId: number = 0;

  private listeners: Set<AudioEventListener> = new Set();
  private masterVolume: number = 0.8;
  private isMutedState: boolean = false;
  private isBuffering: boolean = false;
  private currentPlaybackRate: number = 1.0;

  // Web Audio API graph
  private audioContext: AudioContext | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private compressorNode: DynamicsCompressorNode | null = null;
  private masterGainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isWebAudioReady: boolean = false;
  private currentGains: number[] = [0, 0, 0, 0, 0, 0, 0];
  private isNormalizationActive: boolean = false;

  constructor() {
    this.channels = [
      this.createChannelSlot(0),
      this.createChannelSlot(1),
    ];
  }

  private createChannelSlot(index: number): AudioChannelSlot {
    let audio: HTMLAudioElement;

    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      audio = new Audio();
      audio.preload = 'auto';
      audio.volume = index === 0 ? this.masterVolume : 0;
    } else {
      // Non-DOM / SSR / Unit test environment mock
      audio = {
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
        load: () => {},
      } as unknown as HTMLAudioElement;
    }

    const slot: AudioChannelSlot = {
      index,
      audio,
      sourceNode: null,
      gainNode: null,
      src: '',
    };

    this.setupChannelListeners(slot);
    return slot;
  }

  private setupChannelListeners(slot: AudioChannelSlot): void {
    const { audio, index } = slot;

    audio.addEventListener('play', () => {
      if (this.activeIndex === index) {
        this.isBuffering = false;
        this.ensureWebAudioResumed();
        this.notifyListeners((l) => l.onPlay?.());
      }
    });

    audio.addEventListener('pause', () => {
      if (this.activeIndex === index && !this.isCrossfadingState) {
        this.notifyListeners((l) => l.onPause?.());
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (this.activeIndex === index) {
        const curr = audio.currentTime || 0;
        const dur = audio.duration && !isNaN(audio.duration) ? audio.duration : 0;
        this.notifyListeners((l) => l.onTimeUpdate?.(curr, dur));
      }
    });

    audio.addEventListener('durationchange', () => {
      if (this.activeIndex === index) {
        const curr = audio.currentTime || 0;
        const dur = audio.duration && !isNaN(audio.duration) ? audio.duration : 0;
        this.notifyListeners((l) => l.onTimeUpdate?.(curr, dur));
      }
    });

    audio.addEventListener('ended', () => {
      if (this.activeIndex === index) {
        if (this.isCrossfadingState) {
          // Outgoing track finished before crossfade timeout: finalize immediately
          const incomingIndex = 1 - this.activeIndex;
          this.finalizeCrossfade(incomingIndex, this.pendingCrossfadeOnComplete || undefined);
        } else {
          this.notifyListeners((l) => l.onEnded?.());
        }
      }
    });

    audio.addEventListener('waiting', () => {
      if (this.activeIndex === index) {
        this.isBuffering = true;
        this.notifyListeners((l) => l.onLoading?.(true));
      }
    });

    audio.addEventListener('canplay', () => {
      if (this.activeIndex === index) {
        this.isBuffering = false;
        this.notifyListeners((l) => {
          l.onLoading?.(false);
          l.onCanPlay?.();
        });
      }
    });

    audio.addEventListener('playing', () => {
      if (this.activeIndex === index) {
        this.isBuffering = false;
        this.ensureWebAudioResumed();
        this.notifyListeners((l) => {
          l.onLoading?.(false);
          l.onPlay?.();
        });
      }
    });

    audio.addEventListener('error', () => {
      if (this.activeIndex === index) {
        this.isBuffering = false;
        let errorMsg = 'Unknown audio streaming error';
        if (audio.error) {
          switch (audio.error.code) {
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
      } else if (this.isCrossfadingState) {
        // Incoming channel encountered an error while crossfading: abort crossfade gracefully
        console.warn('[NocturneAudioEngine] Incoming channel stream error during crossfade; cancelling crossfade.');
        this.cancelCrossfade();
      }
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
   * Initializes the dual-channel Web Audio processing graph.
   * If the browser or environment does not support Web Audio, gracefully falls back to native dual audio.
   */
  public initWebAudio(): boolean {
    if (this.isWebAudioReady) return true;
    if (typeof window === 'undefined') return false;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtx) {
        console.info('[NocturneAudioEngine] Web Audio API not supported; using standard dual audio pipeline.');
        return false;
      }

      this.audioContext = new AudioCtx();

      // Create 7 BiquadFilterNodes for each equalizer band
      this.eqFilters = EQ_BANDS.map((band) => {
        const filter = this.audioContext!.createBiquadFilter();
        filter.type = band.type;
        filter.frequency.setValueAtTime(band.frequency, this.audioContext!.currentTime);
        filter.gain.setValueAtTime(0, this.audioContext!.currentTime);
        filter.Q.setValueAtTime(1.0, this.audioContext!.currentTime);
        return filter;
      });

      // Apply initial gains
      this.currentGains.forEach((gain, idx) => {
        if (this.eqFilters[idx]) {
          this.eqFilters[idx].gain.setValueAtTime(gain, this.audioContext!.currentTime);
        }
      });

      // Create DynamicsCompressorNode for Volume Normalization
      this.compressorNode = this.audioContext.createDynamicsCompressor();
      this.updateCompressorSettings();

      // Create Master GainNode
      this.masterGainNode = this.audioContext.createGain();
      const initialVol = this.isMutedState ? 0 : this.masterVolume;
      this.masterGainNode.gain.setValueAtTime(initialVol, this.audioContext.currentTime);

      // Create AnalyserNode for audio visualization
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 128;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Connect EQ chain: eq[0] -> ... -> eq[6] -> compressor -> masterGain -> analyser -> destination
      for (let i = 0; i < this.eqFilters.length - 1; i++) {
        this.eqFilters[i].connect(this.eqFilters[i + 1]);
      }
      const lastFilter = this.eqFilters[this.eqFilters.length - 1];
      lastFilter.connect(this.compressorNode);
      this.compressorNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);

      // Create MediaElementSource and Channel Gain for both channels
      for (const slot of this.channels) {
        slot.sourceNode = this.audioContext.createMediaElementSource(slot.audio);
        slot.gainNode = this.audioContext.createGain();

        // Active slot starts at 1.0, secondary slot starts at 0.0
        const gainVal = slot.index === this.activeIndex ? 1.0 : 0.0;
        slot.gainNode.gain.setValueAtTime(gainVal, this.audioContext.currentTime);

        slot.sourceNode.connect(slot.gainNode);
        slot.gainNode.connect(this.eqFilters[0]); // Both mix into the EQ input!
      }

      this.isWebAudioReady = true;
      return true;
    } catch (err) {
      console.warn('[NocturneAudioEngine] Web Audio graph could not be established; audio elements play directly:', err);
      this.isWebAudioReady = false;
      return false;
    }
  }

  private ensureWebAudioResumed(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch((err) => {
        console.warn('[NocturneAudioEngine] Could not resume audioContext:', err);
      });
    }
  }

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

  public setEQBandGain(bandIndex: number, gainDb: number): void {
    if (bandIndex < 0 || bandIndex >= this.currentGains.length) return;
    this.currentGains[bandIndex] = gainDb;
    this.setEQGains(this.currentGains);
  }

  public getEQGains(): number[] {
    return [...this.currentGains];
  }

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
      this.compressorNode.threshold.setTargetAtTime(-24, now, 0.05);
      this.compressorNode.knee.setTargetAtTime(30, now, 0.05);
      this.compressorNode.ratio.setTargetAtTime(8, now, 0.05);
      this.compressorNode.attack.setTargetAtTime(0.003, now, 0.05);
      this.compressorNode.release.setTargetAtTime(0.25, now, 0.05);
    } else {
      this.compressorNode.threshold.setTargetAtTime(0, now, 0.05);
      this.compressorNode.ratio.setTargetAtTime(1, now, 0.05);
    }
  }

  public setPlaybackRate(rate: number): void {
    const clamped = Math.max(0.25, Math.min(3.0, rate));
    this.currentPlaybackRate = clamped;
    this.channels.forEach((slot) => {
      slot.audio.playbackRate = clamped;
    });
  }

  public getPlaybackRate(): number {
    return this.currentPlaybackRate;
  }

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

  public async loadTrack(src: string, autoPlay: boolean = false, initialTime: number = 0): Promise<void> {
    const opId = ++this.operationId;
    this.cancelCrossfade();

    if (!src) {
      console.warn('[NocturneAudioEngine] Empty audio source passed to loadTrack');
      return;
    }

    const primarySlot = this.channels[this.activeIndex];
    if (primarySlot.src === src && this.isPlaying()) {
      if (autoPlay) return;
    }

    primarySlot.src = src;
    this.isBuffering = true;
    this.notifyListeners((l) => l.onLoading?.(true));

    try {
      primarySlot.audio.src = src;
      primarySlot.audio.playbackRate = this.currentPlaybackRate;
      primarySlot.audio.load();

      if (initialTime > 0) {
        primarySlot.audio.currentTime = initialTime;
      }

      if (autoPlay) {
        await this.play();
      }
    } catch (err) {
      if (this.operationId !== opId) return;
      this.isBuffering = false;
      this.notifyListeners((l) => {
        l.onLoading?.(false);
        l.onError?.(err instanceof Error ? err : new Error(String(err)));
      });
    }
  }

  public async play(): Promise<void> {
    const primarySlot = this.channels[this.activeIndex];
    if (!primarySlot.audio.src) return;

    if (!this.isWebAudioReady) {
      this.initWebAudio();
    }
    this.ensureWebAudioResumed();

    try {
      await primarySlot.audio.play();
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError') {
        console.info('[NocturneAudioEngine] Autoplay requires user interaction first.');
      } else if (error.name === 'AbortError') {
        console.info('[NocturneAudioEngine] Play request was interrupted.');
      } else {
        console.warn('[NocturneAudioEngine] Play error:', error.message);
        this.notifyListeners((l) => l.onError?.(error));
      }
    }
  }

  public pause(): void {
    if (this.isCrossfadingState) {
      this.cancelCrossfade();
    }
    try {
      this.channels[0].audio.pause();
      this.channels[1].audio.pause();
    } catch (err) {
      console.warn('[NocturneAudioEngine] Pause error:', err);
    }
  }

  public seek(timeInSeconds: number): void {
    if (isFinite(timeInSeconds)) {
      if (this.isCrossfadingState) {
        this.cancelCrossfade();
      }
      const primaryAudio = this.channels[this.activeIndex].audio;
      const target = Math.max(0, Math.min(timeInSeconds, primaryAudio.duration || timeInSeconds));
      primaryAudio.currentTime = target;
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterVolume = clamped;
    const targetGain = this.isMutedState ? 0 : clamped;

    if (this.masterGainNode && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGainNode.gain.setTargetAtTime(targetGain, now, 0.03);
    } else {
      // Fallback
      const primary = this.channels[this.activeIndex];
      primary.audio.volume = targetGain;
    }

    this.notifyListeners((l) => l.onVolumeChange?.(this.masterVolume, this.isMutedState));
  }

  public setMuted(muted: boolean): void {
    this.isMutedState = muted;
    this.setVolume(this.masterVolume);
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public getCurrentTime(): number {
    return this.channels[this.activeIndex].audio.currentTime || 0;
  }

  public getDuration(): number {
    const audio = this.channels[this.activeIndex].audio;
    return audio.duration && !isNaN(audio.duration) ? audio.duration : 0;
  }

  public isPlaying(): boolean {
    const audio = this.channels[this.activeIndex].audio;
    return !audio.paused && !audio.ended;
  }

  public isBufferingState(): boolean {
    return this.isBuffering;
  }

  /**
   * Starts a smooth acoustic crossfade to nextSrc over durationSec.
   * Both tracks play concurrently with opposing volume ramps.
   */
  public async startCrossfade(nextSrc: string, durationSec: number, onComplete?: () => void): Promise<boolean> {
    const opId = ++this.operationId;

    if (durationSec <= 0 || !nextSrc) {
      await this.loadTrack(nextSrc, true);
      onComplete?.();
      return false;
    }

    if (this.isCrossfadingState) {
      return false;
    }

    this.isCrossfadingState = true;
    this.pendingCrossfadeOnComplete = onComplete || null;
    const currentChannel = this.channels[this.activeIndex];
    const incomingIndex = 1 - this.activeIndex;
    const incomingChannel = this.channels[incomingIndex];

    this.notifyListeners((l) => l.onCrossfadeStart?.(nextSrc, durationSec));

    if (!this.isWebAudioReady) {
      this.initWebAudio();
    }
    this.ensureWebAudioResumed();

    try {
      incomingChannel.src = nextSrc;
      incomingChannel.audio.src = nextSrc;
      incomingChannel.audio.currentTime = 0;
      incomingChannel.audio.playbackRate = this.currentPlaybackRate;
      incomingChannel.audio.load();

      if (this.isWebAudioReady && this.audioContext && currentChannel.gainNode && incomingChannel.gainNode) {
        const now = this.audioContext.currentTime;

        // Schedule opposing ramps
        currentChannel.gainNode.gain.cancelScheduledValues(now);
        currentChannel.gainNode.gain.setValueAtTime(currentChannel.gainNode.gain.value, now);
        currentChannel.gainNode.gain.linearRampToValueAtTime(0, now + durationSec);

        incomingChannel.gainNode.gain.cancelScheduledValues(now);
        incomingChannel.gainNode.gain.setValueAtTime(0, now);
        incomingChannel.gainNode.gain.linearRampToValueAtTime(1, now + durationSec);

        await incomingChannel.audio.play();

        this.crossfadeTimeoutId = setTimeout(() => {
          if (this.operationId !== opId) return;
          this.finalizeCrossfade(incomingIndex, onComplete);
        }, durationSec * 1000);
      } else {
        // Fallback smooth software volume crossfade for environments without Web Audio
        const currentVol = this.isMutedState ? 0 : this.masterVolume;
        incomingChannel.audio.volume = 0;
        await incomingChannel.audio.play();

        const steps = 25;
        const intervalMs = (durationSec * 1000) / steps;
        let step = 0;

        this.fallbackCrossfadeInterval = setInterval(() => {
          if (this.operationId !== opId) {
            if (this.fallbackCrossfadeInterval) clearInterval(this.fallbackCrossfadeInterval);
            return;
          }
          step++;
          const progress = Math.min(1, step / steps);
          currentChannel.audio.volume = Math.max(0, currentVol * (1 - progress));
          incomingChannel.audio.volume = Math.min(currentVol, currentVol * progress);

          if (step >= steps) {
            if (this.fallbackCrossfadeInterval) clearInterval(this.fallbackCrossfadeInterval);
            this.fallbackCrossfadeInterval = null;
            this.finalizeCrossfade(incomingIndex, onComplete);
          }
        }, intervalMs);
      }

      return true;
    } catch (err) {
      console.warn('[NocturneAudioEngine] Crossfade playback error:', err);
      this.cancelCrossfade();
      await this.loadTrack(nextSrc, true);
      onComplete?.();
      return false;
    }
  }

  private finalizeCrossfade(incomingIndex: number, onComplete?: () => void): void {
    if (this.crossfadeTimeoutId) {
      clearTimeout(this.crossfadeTimeoutId);
      this.crossfadeTimeoutId = null;
    }
    if (this.fallbackCrossfadeInterval) {
      clearInterval(this.fallbackCrossfadeInterval);
      this.fallbackCrossfadeInterval = null;
    }

    const callback = onComplete || this.pendingCrossfadeOnComplete;
    this.pendingCrossfadeOnComplete = null;

    const outgoingIndex = this.activeIndex;
    const outgoingChannel = this.channels[outgoingIndex];
    const incomingChannel = this.channels[incomingIndex];

    try {
      outgoingChannel.audio.pause();
      outgoingChannel.audio.currentTime = 0;
      outgoingChannel.src = '';
      if (outgoingChannel.gainNode && this.audioContext) {
        outgoingChannel.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      }
    } catch (e) {
      console.warn('[NocturneAudioEngine] Outgoing channel cleanup error:', e);
    }

    if (incomingChannel.gainNode && this.audioContext) {
      incomingChannel.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
    }

    this.activeIndex = incomingIndex;
    this.isCrossfadingState = false;

    this.notifyListeners((l) => l.onCrossfadeEnd?.());
    callback?.();
  }

  public cancelCrossfade(): void {
    this.operationId++;
    if (this.crossfadeTimeoutId) {
      clearTimeout(this.crossfadeTimeoutId);
      this.crossfadeTimeoutId = null;
    }
    if (this.fallbackCrossfadeInterval) {
      clearInterval(this.fallbackCrossfadeInterval);
      this.fallbackCrossfadeInterval = null;
    }
    this.pendingCrossfadeOnComplete = null;

    const currentChannel = this.channels[this.activeIndex];
    const secondaryChannel = this.channels[1 - this.activeIndex];

    if (this.isWebAudioReady && this.audioContext) {
      const now = this.audioContext.currentTime;
      if (currentChannel.gainNode) {
        currentChannel.gainNode.gain.cancelScheduledValues(now);
        currentChannel.gainNode.gain.setValueAtTime(1, now);
      }
      if (secondaryChannel.gainNode) {
        secondaryChannel.gainNode.gain.cancelScheduledValues(now);
        secondaryChannel.gainNode.gain.setValueAtTime(0, now);
      }
    }

    try {
      secondaryChannel.audio.pause();
      secondaryChannel.audio.currentTime = 0;
      secondaryChannel.src = '';
      const targetVol = this.isMutedState ? 0 : this.masterVolume;
      currentChannel.audio.volume = targetVol;
      secondaryChannel.audio.volume = 0;
    } catch {}

    const wasCrossfading = this.isCrossfadingState;
    this.isCrossfadingState = false;
    if (wasCrossfading) {
      this.notifyListeners((l) => l.onCrossfadeEnd?.());
    }
  }

  public isCrossfading(): boolean {
    return this.isCrossfadingState;
  }

  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public cleanup(): void {
    this.cancelCrossfade();
    this.channels.forEach((slot) => {
      slot.audio.pause();
      slot.audio.src = '';
      slot.src = '';
    });
    this.listeners.clear();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
    }
  }
}

// Global audio singleton for the application lifetime
export const audioEngine = new NocturneAudioEngine();
