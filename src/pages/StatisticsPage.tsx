import React from 'react';
import {
  BarChart2,
  Clock,
  Music,
  Users,
  Disc,
  Play,
  Flame,
  Award,
} from 'lucide-react';
import { useAnalytics } from '../state/AnalyticsContext';
import { usePlayer } from '../state/PlayerContext';
import { Card } from '../components/primitives/Card';
import { ListeningClock } from '../components/analytics/ListeningClock';
import { MusicPersonalityCard } from '../components/analytics/MusicPersonalityCard';
import {
  DailyListeningChart,
  HourlyListeningChart,
  MonthlyListeningChart,
  TopArtistsChart,
  TopGenresChart,
  TopSongsChart,
  WeekdayListeningChart,
} from '../components/analytics/AnalyticsCharts';
import { MOCK_TRACKS } from '../data/mockData';
import type { AnalyticsTimeRange } from '../types/analytics';
import './StatisticsPage.css';

const TIME_RANGE_OPTIONS: { id: AnalyticsTimeRange; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '3m', label: '3 Months' },
  { id: '6m', label: '6 Months' },
  { id: '1y', label: '1 Year' },
  { id: 'all', label: 'All Time' },
];

export const StatisticsPage: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    overview,
    dailyStats,
    hourlyStats,
    weekdayStats,
    monthlyStats,
    topArtists,
    topGenres,
    topSongs,
    personality,
    history,
  } = useAnalytics();

  const { playTrack } = usePlayer();

  const handlePlayTopSong = () => {
    if (overview.mostPlayedSong) {
      const full = MOCK_TRACKS.find((t) => t.id === overview.mostPlayedSong?.id);
      if (full) playTrack(full);
    }
  };

  const formatHoursOrMinutes = (mins: number, hours: number): string => {
    if (hours >= 1) return `${hours} hrs`;
    return `${mins} mins`;
  };

  return (
    <div className="nocturne-stats-page">
      {/* Top Header & Range Filters */}
      <div className="nocturne-stats-header">
        <div className="nocturne-stats-header__left">
          <div className="nocturne-stats-header__title-row">
            <BarChart2 size={24} className="nocturne-stats-icon" />
            <h1 className="nocturne-stats-title">Sanctuary Statistics</h1>
          </div>
          <p className="nocturne-stats-subtitle">
            Quantitative reflections and circadian analytics derived from actual stored listening data
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="nocturne-stats-time-filters" role="group" aria-label="Time Filter Options">
          {TIME_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`nocturne-stats-time-pill ${
                timeRange === opt.id ? 'nocturne-stats-time-pill--active' : ''
              }`}
              onClick={() => setTimeRange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="nocturne-stats-empty">
          <Clock size={40} className="nocturne-stats-empty-icon" />
          <h2>Awaiting Acoustic Inscriptions</h2>
          <p>
            No listening data is currently recorded. Once you stream music in Nocturne, your detailed
            analytics, 24-hour listening clock, and personality profile will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Overview Metric Cards */}
          <div className="nocturne-stats-overview-grid">
            <Card variant="elevated" className="nocturne-stats-metric-card">
              <div className="nocturne-metric-card__header">
                <span className="nocturne-metric-card__label">Total Listening Time</span>
                <Clock size={16} className="nocturne-metric-card__icon" />
              </div>
              <div className="nocturne-metric-card__val">
                {formatHoursOrMinutes(overview.totalListeningMinutes, overview.totalListeningHours)}
              </div>
              <div className="nocturne-metric-card__sub">
                {overview.totalListeningMinutes.toLocaleString()} minutes streamed
              </div>
            </Card>

            <Card variant="elevated" className="nocturne-stats-metric-card">
              <div className="nocturne-metric-card__header">
                <span className="nocturne-metric-card__label">Songs Played</span>
                <Music size={16} className="nocturne-metric-card__icon" />
              </div>
              <div className="nocturne-metric-card__val">{overview.totalSongsPlayed}</div>
              <div className="nocturne-metric-card__sub">
                {overview.completionRateAverage}% avg completion rate
              </div>
            </Card>

            <Card variant="elevated" className="nocturne-stats-metric-card">
              <div className="nocturne-metric-card__header">
                <span className="nocturne-metric-card__label">Artists Listened</span>
                <Users size={16} className="nocturne-metric-card__icon" />
              </div>
              <div className="nocturne-metric-card__val">{overview.uniqueArtistsCount}</div>
              <div className="nocturne-metric-card__sub">Unique sonic creators explored</div>
            </Card>

            <Card variant="elevated" className="nocturne-stats-metric-card">
              <div className="nocturne-metric-card__header">
                <span className="nocturne-metric-card__label">Albums Explored</span>
                <Disc size={16} className="nocturne-metric-card__icon" />
              </div>
              <div className="nocturne-metric-card__val">{overview.uniqueAlbumsCount}</div>
              <div className="nocturne-metric-card__sub">Nocturnal chambers experienced</div>
            </Card>
          </div>

          {/* Most Played Highlights */}
          <div className="nocturne-stats-highlights-grid">
            {/* Most Played Song */}
            <Card variant="flat" className="nocturne-stats-highlight-card">
              <div className="nocturne-highlight-tag">
                <Flame size={13} />
                <span>Most Played Song</span>
              </div>

              {overview.mostPlayedSong ? (
                <div className="nocturne-highlight-content">
                  <div className="nocturne-highlight-thumb-wrap" onClick={handlePlayTopSong}>
                    {overview.mostPlayedSong.artwork && (
                      <img
                        src={overview.mostPlayedSong.artwork}
                        alt={overview.mostPlayedSong.title}
                        className="nocturne-highlight-thumb"
                      />
                    )}
                    <div className="nocturne-highlight-play-btn">
                      <Play size={14} fill="white" />
                    </div>
                  </div>

                  <div className="nocturne-highlight-info">
                    <span className="nocturne-highlight-title">
                      {overview.mostPlayedSong.title}
                    </span>
                    <span className="nocturne-highlight-sub">
                      {overview.mostPlayedSong.subtitle}
                    </span>
                    <span className="nocturne-highlight-stats">
                      {overview.mostPlayedSong.count} plays • {overview.mostPlayedSong.minutes} mins
                    </span>
                  </div>
                </div>
              ) : (
                <div className="nocturne-highlight-empty">None recorded yet</div>
              )}
            </Card>

            {/* Most Played Artist */}
            <Card variant="flat" className="nocturne-stats-highlight-card">
              <div className="nocturne-highlight-tag">
                <Award size={13} />
                <span>Most Played Artist</span>
              </div>

              {overview.mostPlayedArtist ? (
                <div className="nocturne-highlight-content">
                  {overview.mostPlayedArtist.artwork ? (
                    <img
                      src={overview.mostPlayedArtist.artwork}
                      alt={overview.mostPlayedArtist.title}
                      className="nocturne-highlight-avatar"
                    />
                  ) : (
                    <div className="nocturne-highlight-avatar-fallback">
                      <Users size={18} />
                    </div>
                  )}

                  <div className="nocturne-highlight-info">
                    <span className="nocturne-highlight-title">
                      {overview.mostPlayedArtist.title}
                    </span>
                    <span className="nocturne-highlight-sub">
                      {overview.mostPlayedArtist.subtitle}
                    </span>
                    <span className="nocturne-highlight-stats">
                      {overview.mostPlayedArtist.minutes} mins listened
                    </span>
                  </div>
                </div>
              ) : (
                <div className="nocturne-highlight-empty">None recorded yet</div>
              )}
            </Card>

            {/* Most Played Album */}
            <Card variant="flat" className="nocturne-stats-highlight-card">
              <div className="nocturne-highlight-tag">
                <Disc size={13} />
                <span>Most Played Album</span>
              </div>

              {overview.mostPlayedAlbum ? (
                <div className="nocturne-highlight-content">
                  {overview.mostPlayedAlbum.artwork && (
                    <img
                      src={overview.mostPlayedAlbum.artwork}
                      alt={overview.mostPlayedAlbum.title}
                      className="nocturne-highlight-thumb"
                    />
                  )}

                  <div className="nocturne-highlight-info">
                    <span className="nocturne-highlight-title">
                      {overview.mostPlayedAlbum.title}
                    </span>
                    <span className="nocturne-highlight-sub">
                      {overview.mostPlayedAlbum.subtitle}
                    </span>
                    <span className="nocturne-highlight-stats">
                      {overview.mostPlayedAlbum.count} tracks • {overview.mostPlayedAlbum.minutes} mins
                    </span>
                  </div>
                </div>
              ) : (
                <div className="nocturne-highlight-empty">None recorded yet</div>
              )}
            </Card>
          </div>

          {/* Music Personality Section */}
          <MusicPersonalityCard personality={personality} />

          {/* 24-Hour Listening Clock */}
          <ListeningClock hourlyStats={hourlyStats} nocturnalRatio={personality.nocturnalRatio} />

          {/* Analytical Charts Grid */}
          <div className="nocturne-stats-charts-grid">
            <DailyListeningChart stats={dailyStats} />
            <HourlyListeningChart stats={hourlyStats} />
          </div>

          <div className="nocturne-stats-charts-grid">
            <TopSongsChart songs={topSongs} />
            <TopArtistsChart artists={topArtists} />
          </div>

          <div className="nocturne-stats-charts-grid nocturne-stats-charts-grid--three">
            <TopGenresChart genres={topGenres} />
            <WeekdayListeningChart stats={weekdayStats} />
            {monthlyStats.length > 0 && <MonthlyListeningChart stats={monthlyStats} />}
          </div>
        </>
      )}
    </div>
  );
};
