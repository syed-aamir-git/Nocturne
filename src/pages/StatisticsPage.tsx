import React from 'react';
import { BarChart2, Moon, Clock, Radio, Activity } from 'lucide-react';
import { Card } from '../components/primitives/Card';

export const StatisticsPage: React.FC = () => {
  const hourDistribution = [
    { hour: '10 PM', pct: 25 },
    { hour: '11 PM', pct: 45 },
    { hour: '12 AM', pct: 75 },
    { hour: '01 AM', pct: 90 },
    { hour: '02 AM', pct: 100 },
    { hour: '03 AM', pct: 95 },
    { hour: '04 AM', pct: 60 },
    { hour: '05 AM', pct: 30 },
  ];

  const metrics = [
    {
      title: 'Midnight Immersion Ratio',
      val: '88.4%',
      sub: 'Streams occurring between 00:00 - 05:00',
      icon: <Moon size={18} />,
    },
    {
      title: 'Total Sanctuary Hours',
      val: '218.5 hrs',
      sub: 'Time spent in solitary listening',
      icon: <Clock size={18} />,
    },
    {
      title: 'Peak Reverberation',
      val: '02:45 AM',
      sub: 'Most concentrated listening window',
      icon: <Activity size={18} />,
    },
    {
      title: 'Bit-Perfect Ratio',
      val: '94.2%',
      sub: 'Rendered in 24-bit 96kHz Lossless',
      icon: <Radio size={18} />,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <BarChart2 size={22} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Sanctuary Statistics</h1>
        </div>
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px' }}>
          Quantitative reflections of your late-night acoustic habits
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {metrics.map((m) => (
          <Card key={m.title} variant="elevated" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent-primary)', marginBottom: 12 }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-low)' }}>
                {m.title}
              </span>
              {m.icon}
            </div>
            <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', color: 'var(--text-pure)', fontWeight: 700, marginBottom: 4 }}>
              {m.val}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-medium)' }}>
              {m.sub}
            </div>
          </Card>
        ))}
      </div>

      {/* Hourly Density Visualization */}
      <Card variant="flat" style={{ padding: '24px' }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Nighttime Density Distribution</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-medium)' }}>
            Average volume of audio streamed across nocturnal hours
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, paddingTop: 20 }}>
          {hourDistribution.map((slot) => (
            <div
              key={slot.hour}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '40%',
                  minWidth: 16,
                  maxWidth: 36,
                  height: `${(slot.pct / 100) * 140}px`,
                  background: slot.pct >= 90 ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-xs)',
                  transition: 'height var(--transition-flow)',
                  boxShadow: slot.pct >= 90 ? '0 0 16px var(--accent-glow)' : 'none',
                }}
              />
              <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-low)' }}>
                {slot.hour}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
