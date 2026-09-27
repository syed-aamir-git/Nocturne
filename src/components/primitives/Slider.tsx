import React, { useRef, useState, useCallback } from 'react';
import './Slider.css';

export interface SliderProps {
  value: number; // min to max
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
  const [dragValue, setDragValue] = useState<number | null>(null);

  // When dragging, use the active dragValue; otherwise use the external value prop
  const activeValue = isDragging && dragValue !== null ? dragValue : value;
  const safeRange = max > min ? max - min : 1;
  const percentage = Math.max(0, Math.min(100, ((activeValue - min) / safeRange) * 100));

  const calculateValueFromPointer = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return value;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return value;
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
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
    const newValue = calculateValueFromPointer(e.clientX);
    setDragValue(newValue);
    onChange(newValue);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newValue = calculateValueFromPointer(e.clientX);
    setDragValue(newValue);
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
    setDragValue(null);
    onChangeEnd?.(finalVal);
  };

  const handlePointerCancel = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragValue(null);
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
      onPointerCancel={handlePointerCancel}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(activeValue)}
      onKeyDown={handleKeyDown}
    >
      <div className="nocturne-slider-track">
        <div className="nocturne-slider-fill" style={{ width: `${percentage}%` }} />
        <div className="nocturne-slider-thumb" style={{ left: `${percentage}%` }} />
      </div>
    </div>
  );
};
