import React, { useState } from 'react';
import { Moon, Sun, Sunrise, Sunset, Clock } from 'lucide-react';
import type { HourlyListeningStat } from '../../types/analytics';
import './ListeningClock.css';

interface ListeningClockProps {
  hourlyStats: HourlyListeningStat[];
  nocturnalRatio: number;
}

export const ListeningClock: React.FC<ListeningClockProps> = ({ hourlyStats, nocturnalRatio }) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // Find max minutes to scale wedge heights
  const maxMinutes = Math.max(1, ...hourlyStats.map((h) => h.minutes));

  // Geometry
  const size = 360;
  const center = size / 2;
  const innerRadius = 55;
  const maxOuterRadius = 150;

  // Active inspected hour
  const inspectedHour = hoveredHour !== null ? hourlyStats[hoveredHour] : null;

  // Determine peak hour
  const peakStat = hourlyStats.reduce(
    (max, cur) => (cur.minutes > max.minutes ? cur : max),
    hourlyStats[0] || { hour: 0, minutes: 0 }
  );

  return (
    <div className="nocturne-listening-clock">
      <div className="nocturne-listening-clock__header">
        <div>
          <div className="nocturne-listening-clock__title-row">
            <Clock size={18} className="nocturne-listening-clock__icon" />
            <h3 className="nocturne-listening-clock__title">24-Hour Listening Clock</h3>
          </div>
          <p className="nocturne-listening-clock__subtitle">
            Radial circadian distribution of nocturnal streaming habits (00:00 - 23:00)
          </p>
        </div>

        <div className="nocturne-listening-clock__badge">
          <Moon size={14} />
          <span>{nocturnalRatio}% Nocturnal Immersion</span>
        </div>
      </div>

      <div className="nocturne-listening-clock__container">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="nocturne-listening-clock__svg"
          aria-label="24-Hour Listening Clock visualization"
        >
          <defs>
            <radialGradient id="clockCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nightWedgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--accent-secondary, #8b5cf6)" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="dayWedgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a5568" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2d3748" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Background Quadrant rings & guides */}
          <circle cx={center} cy={center} r={innerRadius} className="nocturne-clock-guide" />
          <circle cx={center} cy={center} r={innerRadius + (maxOuterRadius - innerRadius) * 0.5} className="nocturne-clock-guide nocturne-clock-guide--mid" />
          <circle cx={center} cy={center} r={maxOuterRadius} className="nocturne-clock-guide" />
          <circle cx={center} cy={center} r={innerRadius} fill="url(#clockCenterGlow)" />

          {/* Quadrant Axis Lines */}
          <line x1={center} y1={center - maxOuterRadius - 8} x2={center} y2={center + maxOuterRadius + 8} className="nocturne-clock-axis" />
          <line x1={center - maxOuterRadius - 8} y1={center} x2={center + maxOuterRadius + 8} y2={center} className="nocturne-clock-axis" />

          {/* Quadrant Markers */}
          <text x={center} y={center - maxOuterRadius - 14} className="nocturne-clock-label nocturne-clock-label--top">00:00 (Midnight)</text>
          <text x={center + maxOuterRadius + 14} y={center + 4} className="nocturne-clock-label nocturne-clock-label--right">06:00 (Dawn)</text>
          <text x={center} y={center + maxOuterRadius + 22} className="nocturne-clock-label nocturne-clock-label--bottom">12:00 (Noon)</text>
          <text x={center - maxOuterRadius - 14} y={center + 4} className="nocturne-clock-label nocturne-clock-label--left">18:00 (Dusk)</text>

          {/* 24 Radial Hour Wedges */}
          {hourlyStats.map((stat) => {
            const h = stat.hour;
            // 24 hours in 360 deg => 15 deg per hour.
            // Hour 0 (Midnight) should be at top (angle = -90 deg or 270 deg)
            const angleStep = 360 / 24;
            const startAngle = (h * angleStep - 90 + 0.8) * (Math.PI / 180);
            const endAngle = ((h + 1) * angleStep - 90 - 0.8) * (Math.PI / 180);

            // Radius scales proportionally from innerRadius up to maxOuterRadius
            const heightRatio = stat.minutes > 0 ? 0.15 + (stat.minutes / maxMinutes) * 0.85 : 0.05;
            const currentOuter = innerRadius + (maxOuterRadius - innerRadius) * heightRatio;

            // Coordinates for SVG Arc Wedge
            const x1 = center + innerRadius * Math.cos(startAngle);
            const y1 = center + innerRadius * Math.sin(startAngle);
            const x2 = center + currentOuter * Math.cos(startAngle);
            const y2 = center + currentOuter * Math.sin(startAngle);
            const x3 = center + currentOuter * Math.cos(endAngle);
            const y3 = center + currentOuter * Math.sin(endAngle);
            const x4 = center + innerRadius * Math.cos(endAngle);
            const y4 = center + innerRadius * Math.sin(endAngle);

            const pathD = `M ${x1} ${y1} L ${x2} ${y2} A ${currentOuter} ${currentOuter} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;

            const isNocturnal = h >= 22 || h < 6;
            const isHovered = hoveredHour === h;
            const isPeak = stat.isPeak;

            return (
              <path
                key={h}
                d={pathD}
                className={`nocturne-clock-wedge ${isHovered ? 'nocturne-clock-wedge--hovered' : ''} ${
                  isPeak ? 'nocturne-clock-wedge--peak' : ''
                } ${isNocturnal ? 'nocturne-clock-wedge--nocturnal' : 'nocturne-clock-wedge--diurnal'}`}
                fill={isNocturnal ? 'url(#nightWedgeGrad)' : 'url(#dayWedgeGrad)'}
                onMouseEnter={() => setHoveredHour(h)}
                onMouseLeave={() => setHoveredHour(null)}
              />
            );
          })}

          {/* Center Hub Display */}
          <g className="nocturne-clock-center-hub" pointerEvents="none">
            {inspectedHour ? (
              <>
                <text x={center} y={center - 12} className="nocturne-hub-time">
                  {inspectedHour.label}
                </text>
                <text x={center} y={center + 8} className="nocturne-hub-value">
                  {inspectedHour.minutes}m
                </text>
                <text x={center} y={center + 24} className="nocturne-hub-sub">
                  {inspectedHour.songCount} hymns
                </text>
              </>
            ) : (
              <>
                <text x={center} y={center - 14} className="nocturne-hub-tag">
                  PEAK HOUR
                </text>
                <text x={center} y={center + 6} className="nocturne-hub-peak">
                  {peakStat?.label || '12 AM'}
                </text>
                <text x={center} y={center + 22} className="nocturne-hub-sub">
                  {peakStat?.minutes || 0} mins
                </text>
              </>
            )}
          </g>
        </svg>

        {/* Legend / Quadrants Info */}
        <div className="nocturne-listening-clock__legend">
          <div className="nocturne-legend-item">
            <span className="nocturne-legend-swatch nocturne-legend-swatch--night" />
            <div className="nocturne-legend-text">
              <span className="nocturne-legend-title">
                <Moon size={12} /> Nocturnal Sanctuary (22:00 - 05:00)
              </span>
              <span className="nocturne-legend-desc">Witching hours, solitary immersion</span>
            </div>
          </div>

          <div className="nocturne-legend-item">
            <span className="nocturne-legend-swatch nocturne-legend-swatch--dawn" />
            <div className="nocturne-legend-text">
              <span className="nocturne-legend-title">
                <Sunrise size={12} /> Crepuscular Dawn (05:00 - 11:00)
              </span>
              <span className="nocturne-legend-desc">Liminal morning light, awakening</span>
            </div>
          </div>

          <div className="nocturne-legend-item">
            <span className="nocturne-legend-swatch nocturne-legend-swatch--day" />
            <div className="nocturne-legend-text">
              <span className="nocturne-legend-title">
                <Sun size={12} /> Solar Realm (11:00 - 18:00)
              </span>
              <span className="nocturne-legend-desc">Focused background listening</span>
            </div>
          </div>

          <div className="nocturne-legend-item">
            <span className="nocturne-legend-swatch nocturne-legend-swatch--dusk" />
            <div className="nocturne-legend-text">
              <span className="nocturne-legend-title">
                <Sunset size={12} /> Twilight Veil (18:00 - 22:00)
              </span>
              <span className="nocturne-legend-desc">Descent into evening shadows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
