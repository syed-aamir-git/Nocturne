import React, { useRef, useEffect } from 'react';
import { audioEngine } from '../../audio/AudioEngine';
import { usePlayer } from '../../state/PlayerContext';
import { useAudioSettings } from '../../state/AudioSettingsContext';
import './AudioVisualizer.css';

interface AudioVisualizerProps {
  height?: number;
  barsCount?: number;
  showLabels?: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  height = 90,
  barsCount = 36,
  showLabels = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { isPlaying, status } = usePlayer();
  const { gains, equalizerEnabled } = useAudioSettings();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling and dynamic responsive dimensions
    const dpr = window.devicePixelRatio || 1;
    let currentWidth = canvas.getBoundingClientRect().width || 400;

    const updateDimensions = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      currentWidth = rect.width || 400;
      canvas.width = currentWidth * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(canvas);

    const freqData = new Uint8Array(64);
    const peaks = new Float32Array(barsCount).fill(0);
    let simPhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, currentWidth, height);

      const hasRealAudio = audioEngine.getFrequencyData(freqData);
      const active = isPlaying && status === 'playing';

      simPhase += 0.08;

      const barWidth = Math.max(2, (currentWidth - (barsCount - 1) * 3) / barsCount);
      const gap = 3;

      for (let i = 0; i < barsCount; i++) {
        let normalizedVal = 0;

        if (active) {
          if (hasRealAudio) {
            // Map freqData bins to bar index
            const binIdx = Math.floor((i / barsCount) * freqData.length);
            normalizedVal = freqData[binIdx] / 255;
          } else {
            // Organic simulated frequency response shaped by EQ bands
            // Map bar to closest EQ band (0 to 6)
            const eqIdx = Math.min(6, Math.floor((i / barsCount) * 7));
            const eqBoost = equalizerEnabled ? 1 + gains[eqIdx] / 24 : 1;

            const wave1 = Math.sin(simPhase + i * 0.35);
            const wave2 = Math.cos(simPhase * 1.5 - i * 0.2);
            const wave3 = Math.sin(simPhase * 0.5 + i * 0.6);

            const composite = (wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25 + 1) / 2;
            normalizedVal = Math.min(1, Math.max(0.12, composite * 0.85 * eqBoost));
          }
        } else {
          // Idle breathing baseline
          normalizedVal = 0.06 + Math.sin(simPhase * 0.25 + i * 0.2) * 0.03;
        }

        // Apply smooth decay to peaks
        if (normalizedVal > peaks[i]) {
          peaks[i] = normalizedVal;
        } else {
          peaks[i] = Math.max(0, peaks[i] - 0.02);
        }

        const barHeight = Math.max(3, normalizedVal * (height - 10));
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Gradient color: violet to electric cyan to white
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(147, 51, 234, 0.45)');
        grad.addColorStop(0.65, 'rgba(168, 85, 247, 0.85)');
        grad.addColorStop(1, '#ffffff');

        // Draw bar
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();

        // Draw peak hold dot
        const peakY = height - Math.max(3, peaks[i] * (height - 10)) - 3;
        ctx.fillStyle = active ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x, Math.max(0, peakY), barWidth, 1.5);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [barsCount, height, isPlaying, status, gains, equalizerEnabled]);

  return (
    <div className={`nocturne-visualizer ${className}`}>
      {showLabels && (
        <div className="nocturne-visualizer__header">
          <div className="nocturne-visualizer__status">
            <span
              className={`nocturne-visualizer__led ${
                isPlaying && status === 'playing' ? 'nocturne-visualizer__led--active' : ''
              }`}
            />
            <span>SPECTRUM ANALYZER (60 Hz — 15 kHz)</span>
          </div>
          <span>
            {equalizerEnabled
              ? 'DSP ENGINE ACTIVE'
              : 'DIRECT PASSTHROUGH'}
          </span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="nocturne-visualizer__canvas"
        style={{ height }}
      />
    </div>
  );
};
