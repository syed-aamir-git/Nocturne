import React, { useRef, useState, useCallback } from 'react';
import './Slider.css';

export interface SliderProps {
  value: number; // 0 to max
  max?: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  'aria-label'?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  'aria-label': ariaLabel = 'Slider',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const calculateValueFromPointer = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return value;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, relativeX / rect.width));
      const rawValue = min + ratio * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    },
    [min, max, step, value]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const newValue = calculateValueFromPointer(e.clientX);
    onChange(newValue);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newValue = calculateValueFromPointer(e.clientX);
    onChange(newValue);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture release fails
    }
    const finalVal = calculateValueFromPointer(e.clientX);
    onChangeEnd?.(finalVal);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let nextValue = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      nextValue = Math.min(max, value + step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      nextValue = Math.max(min, value - step);
    } else if (e.key === 'Home') {
      nextValue = min;
    } else if (e.key === 'End') {
      nextValue = max;
    } else {
      return;
    }
    e.preventDefault();
    onChange(nextValue);
    onChangeEnd?.(nextValue);
  };

  return (
    <div
      ref={containerRef}
      className={`nocturne-slider-container ${isDragging ? 'nocturne-slider-container--dragging' : ''} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onKeyDown={handleKeyDown}
    >
      <div className="nocturne-slider-track">
        <div className="nocturne-slider-fill" style={{ width: `${percentage}%` }} />
        <div className="nocturne-slider-thumb" style={{ left: `${percentage}%` }} />
      </div>
    </div>
  );
};
