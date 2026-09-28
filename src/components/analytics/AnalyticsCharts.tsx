import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Play,
  Flame,
  Award,
  Music2,
  Disc3,
  TrendingUp,
} from 'lucide-react';
import type {
  DayListeningStat,
  HourlyListeningStat,
  MonthlyListeningStat,
  TopRankedItem,
  WeekdayListeningStat,
} from '../../types/analytics';
import { usePlayer } from '../../state/PlayerContext';
import { MOCK_TRACKS } from '../../data/mockData';
import './AnalyticsCharts.css';

// --- Daily Listening Bar Chart ---
interface DailyChartProps {
  stats: DayListeningStat[];
}

export const DailyListeningChart: React.FC<DailyChartProps> = ({ stats }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxMin = Math.max(1, ...stats.map((s) => s.minutes));

  if (stats.length === 0) {
    return (
      <div className="nocturne-chart-empty">No daily listening logged in this window.</div>
    );
  }

  return (
    <div className="nocturne-analytics-chart-card">
      <div className="nocturne-chart-header">
        <div className="nocturne-chart-title-group">
          <Calendar size={16} className="nocturne-chart-icon" />
          <h4 className="nocturne-chart-title">Daily Listening Volume</h4>
        </div>
        <span className="nocturne-chart-metric-badge">
          Peak: {maxMin} mins
        </span>
      </div>

      <div className="nocturne-bar-chart-container">
        <div className="nocturne-bar-chart-bars">
          {stats.map((item, idx) => {
            const heightPct = Math.max(4, Math.round((item.minutes / maxMin) * 100));
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.date}
                className="nocturne-bar-col"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="nocturne-bar-tooltip">
                    <div className="nocturne-bar-tooltip__date">{item.label}</div>
                    <div className="nocturne-bar-tooltip__val">{item.minutes} mins</div>
                    <div className="nocturne-bar-tooltip__sub">{item.songCount} songs</div>
                  </div>
                )}

                <div className="nocturne-bar-track">
                  <div
                    className={`nocturne-bar-fill ${item.minutes > 0 ? 'nocturne-bar-fill--active' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="nocturne-bar-label">{item.label.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Hourly Distribution Chart (00:00 - 23:00) ---
interface HourlyChartProps {
  stats: HourlyListeningStat[];
}

export const HourlyListeningChart: React.FC<HourlyChartProps> = ({ stats }) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const maxMin = Math.max(1, ...stats.map((s) => s.minutes));

  return (
    <div className="nocturne-analytics-chart-card">
      <div className="nocturne-chart-header">
        <div className="nocturne-chart-title-group">
          <Clock size={16} className="nocturne-chart-icon" />
          <h4 className="nocturne-chart-title">Hourly Density (00:00 - 23:00)</h4>
        </div>
        <span className="nocturne-chart-metric-badge">
          24h Rhythm
        </span>
      </div>

      <div className="nocturne-bar-chart-container">
        <div className="nocturne-bar-chart-bars nocturne-bar-chart-bars--dense">
          {stats.map((h) => {
            const heightPct = Math.max(3, Math.round((h.minutes / maxMin) * 100));
            const isNocturnal = h.hour >= 22 || h.hour < 6;
            const isHovered = hoveredHour === h.hour;

            return (
              <div
                key={h.hour}
                className="nocturne-bar-col"
                onMouseEnter={() => setHoveredHour(h.hour)}
                onMouseLeave={() => setHoveredHour(null)}
              >
                {isHovered && (
                  <div className="nocturne-bar-tooltip">
                    <div className="nocturne-bar-tooltip__date">{h.label}</div>
                    <div className="nocturne-bar-tooltip__val">{h.minutes} mins</div>
                    <div className="nocturne-bar-tooltip__sub">{h.songCount} songs</div>
                  </div>
                )}

                <div className="nocturne-bar-track">
                  <div
                    className={`nocturne-bar-fill ${
                      isNocturnal ? 'nocturne-bar-fill--nocturnal' : ''
                    } ${h.isPeak ? 'nocturne-bar-fill--peak' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="nocturne-bar-label">
                  {h.hour % 4 === 0 ? (h.hour === 0 ? '12a' : h.hour === 12 ? '12p' : `${h.hour}h`) : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Weekday Distribution Chart (Sun - Sat) ---
interface WeekdayChartProps {
  stats: WeekdayListeningStat[];
}

export const WeekdayListeningChart: React.FC<WeekdayChartProps> = ({ stats }) => {
  const maxMin = Math.max(1, ...stats.map((s) => s.minutes));

  return (
    <div className="nocturne-analytics-chart-card">
      <div className="nocturne-chart-header">
        <div className="nocturne-chart-title-group">
          <Calendar size={16} className="nocturne-chart-icon" />
          <h4 className="nocturne-chart-title">Listening by Weekday</h4>
        </div>
      </div>

      <div className="nocturne-weekday-list">
        {stats.map((day) => {
          const pct = Math.round((day.minutes / maxMin) * 100);

          return (
            <div key={day.dayIndex} className="nocturne-weekday-row">
              <span className="nocturne-weekday-name">{day.shortName}</span>
              <div className="nocturne-weekday-track">
                <div
                  className="nocturne-weekday-fill"
                  style={{ width: `${Math.max(2, pct)}%` }}
                />
              </div>
              <span className="nocturne-weekday-val">{day.minutes}m</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Monthly Trends Chart ---
interface MonthlyChartProps {
  stats: MonthlyListeningStat[];
}

export const MonthlyListeningChart: React.FC<MonthlyChartProps> = ({ stats }) => {
  const maxMin = Math.max(1, ...stats.map((s) => s.minutes));

  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="nocturne-analytics-chart-card">
      <div className="nocturne-chart-header">
        <div className="nocturne-chart-title-group">
          <TrendingUp size={16} className="nocturne-chart-icon" />
          <h4 className="nocturne-chart-title">Monthly Listening Trends</h4>
        </div>
      </div>

      <div className="nocturne-bar-chart-container">
        <div className="nocturne-bar-chart-bars">
          {stats.map((m) => {
            const heightPct = Math.max(6, Math.round((m.minutes / maxMin) * 100));

            return (
              <div key={m.monthKey} className="nocturne-bar-col">
                <div className="nocturne-bar-track">
                  <div
                    className="nocturne-bar-fill nocturne-bar-fill--active"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="nocturne-bar-label">{m.label.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Top Artists List ---
interface TopArtistsProps {
  artists: TopRankedItem[];
}

export const TopArtistsChart: React.FC<TopArtistsProps> = ({ artists }) => {
  if (artists.length === 0) return null;

  return (
    <div className="nocturne-analytics-chart-card">
      <div className="nocturne-chart-header">
        <div className="nocturne-chart-title-group">
          <Award size={16} className="nocturne-chart-icon" />
          <h4 className="nocturne-chart-title">Top Artists</h4>
        </div>
      </div>

      <div className="nocturne-top-list">
        {artists.map((artist, idx) => (
          <div key={artist.id} className="nocturne-top-item">
            <span className="nocturne-top-rank">#{idx + 1}</span>

            {artist.artwork && (
              <img
                src={artist.artwork}
                alt={artist.title}
                className="nocturne-top-avatar"
              />
            )}

            <div className="nocturne-top-info">
              <span className="nocturne-top-title">{artist.title}</span>
              <span className="nocturne-top-sub">{artist.subtitle}</span>
              <div className="nocturne-top-progress-track">
                <div
                  className="nocturne-top-progress-fill"
                  style={{ width: `${Math.max(4, artist.percentage)}%` }}
                />
              </div>
            </div>

            <span className="nocturne-top-minutes">{artist.minutes}m</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Top Genres Chart ---
interface TopGenresProps {
  genres: TopRankedItem[];
}

export const TopGenresChart: React.FC<TopGenresProps> = ({ genres }) => {
  if (genres.length === 0) return null;

  return (
    <div className="nocturne-analytics-chart-card">
      <div className="nocturne-chart-header">
        <div className="nocturne-chart-title-group">
          <Disc3 size={16} className="nocturne-chart-icon" />
          <h4 className="nocturne-chart-title">Top Genres</h4>
        </div>
      </div>

      <div className="nocturne-genre-bars">
        {genres.map((g) => (
          <div key={g.id} className="nocturne-genre-row">
            <div className="nocturne-genre-info">
              <span className="nocturne-genre-title">{g.title}</span>
              <span className="nocturne-genre-pct">{g.percentage}%</span>
            </div>
            <div className="nocturne-genre-track">
              <div
                className="nocturne-genre-fill"
                style={{ width: `${Math.max(4, g.percentage)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Top Songs Ranked List ---
interface TopSongsProps {
  songs: TopRankedItem[];
}

export const TopSongsChart: React.FC<TopSongsProps> = ({ songs }) => {
  const { playTrack } = usePlayer();

  if (songs.length === 0) return null;

  const handlePlaySong = (songItem: TopRankedItem) => {
    const fullTrack = MOCK_TRACKS.find((t) => t.id === songItem.id);
    if (fullTrack) {
      playTrack(fullTrack);
    }
  };

  return (
    <div className="nocturne-analytics-chart-card">
      <div className="nocturne-chart-header">
        <div className="nocturne-chart-title-group">
          <Flame size={16} className="nocturne-chart-icon" />
          <h4 className="nocturne-chart-title">Top Songs</h4>
        </div>
      </div>

      <div className="nocturne-top-list">
        {songs.map((song, idx) => (
          <div key={song.id} className="nocturne-top-item nocturne-top-item--interactive">
            <span className="nocturne-top-rank">#{idx + 1}</span>

            <div className="nocturne-top-thumb-wrap" onClick={() => handlePlaySong(song)}>
              {song.artwork ? (
                <img src={song.artwork} alt={song.title} className="nocturne-top-thumb" />
              ) : (
                <div className="nocturne-top-thumb-fallback">
                  <Music2 size={16} />
                </div>
              )}
              <div className="nocturne-top-play-overlay">
                <Play size={12} fill="white" />
              </div>
            </div>

            <div className="nocturne-top-info" onClick={() => handlePlaySong(song)}>
              <span className="nocturne-top-title">{song.title}</span>
              <span className="nocturne-top-sub">{song.subtitle}</span>
            </div>

            <div className="nocturne-top-stats-right">
              <span className="nocturne-top-plays">{song.count} plays</span>
              <span className="nocturne-top-minutes">{song.minutes}m</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
