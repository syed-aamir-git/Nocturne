import type {
  AnalyticsOverview,
  AnalyticsTimeRange,
  DayListeningStat,
  GroupedHistory,
  HourlyListeningStat,
  ListeningHistoryEntry,
  MonthlyListeningStat,
  MusicPersonality,
  TopRankedItem,
  WeekdayListeningStat,
} from '../types/analytics';

/**
 * Groups listening history entries chronologically into:
 * - Today
 * - Yesterday
 * - This Week
 * - Last Week
 * - Earlier
 */
export function groupHistoryEntries(entries: ListeningHistoryEntry[]): GroupedHistory[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;

  // Monday-based week start
  const day = now.getDay();
  const daysSinceMonday = (day + 6) % 7;
  const startOfThisWeek = startOfToday - daysSinceMonday * 86400000;
  const startOfLastWeek = startOfThisWeek - 7 * 86400000;

  const buckets: Record<string, ListeningHistoryEntry[]> = {
    today: [],
    yesterday: [],
    this_week: [],
    last_week: [],
    earlier: [],
  };

  entries.forEach((entry) => {
    const t = entry.startTime;
    if (t >= startOfToday) {
      buckets.today.push(entry);
    } else if (t >= startOfYesterday) {
      buckets.yesterday.push(entry);
    } else if (t >= startOfThisWeek) {
      buckets.this_week.push(entry);
    } else if (t >= startOfLastWeek) {
      buckets.last_week.push(entry);
    } else {
      buckets.earlier.push(entry);
    }
  });

  const groups: GroupedHistory[] = [];

  if (buckets.today.length > 0) {
    groups.push({ group: 'today', label: 'Today', entries: buckets.today });
  }
  if (buckets.yesterday.length > 0) {
    groups.push({ group: 'yesterday', label: 'Yesterday', entries: buckets.yesterday });
  }
  if (buckets.this_week.length > 0) {
    groups.push({ group: 'this_week', label: 'This Week', entries: buckets.this_week });
  }
  if (buckets.last_week.length > 0) {
    groups.push({ group: 'last_week', label: 'Last Week', entries: buckets.last_week });
  }
  if (buckets.earlier.length > 0) {
    groups.push({ group: 'earlier', label: 'Earlier', entries: buckets.earlier });
  }

  return groups;
}

/**
 * Filters history entries by the selected time range.
 */
export function filterHistoryByRange(
  entries: ListeningHistoryEntry[],
  range: AnalyticsTimeRange
): ListeningHistoryEntry[] {
  if (range === 'all') return entries;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let cutoff = 0;
  switch (range) {
    case 'today':
      cutoff = startOfToday;
      break;
    case '7d':
      cutoff = now.getTime() - 7 * 86400000;
      break;
    case '30d':
      cutoff = now.getTime() - 30 * 86400000;
      break;
    case '3m':
      cutoff = now.getTime() - 90 * 86400000;
      break;
    case '6m':
      cutoff = now.getTime() - 180 * 86400000;
      break;
    case '1y':
      cutoff = now.getTime() - 365 * 86400000;
      break;
  }

  return entries.filter((e) => e.startTime >= cutoff);
}

/**
 * Calculates overview metrics across the filtered history entries.
 */
export function calculateOverview(entries: ListeningHistoryEntry[]): AnalyticsOverview {
  if (entries.length === 0) {
    return {
      totalListeningSeconds: 0,
      totalListeningMinutes: 0,
      totalListeningHours: 0,
      totalSongsPlayed: 0,
      uniqueArtistsCount: 0,
      uniqueAlbumsCount: 0,
      mostPlayedSong: null,
      mostPlayedArtist: null,
      mostPlayedAlbum: null,
      completionRateAverage: 0,
    };
  }

  let totalSec = 0;
  let totalCompPct = 0;
  const songMap = new Map<string, { title: string; artist: string; artwork: string; count: number; sec: number }>();
  const artistMap = new Map<string, { name: string; artwork?: string; count: number; sec: number }>();
  const albumMap = new Map<string, { title: string; artist: string; artwork: string; count: number; sec: number }>();

  entries.forEach((e) => {
    totalSec += e.durationListened;
    totalCompPct += e.completionPercentage;

    // Song aggregation
    const s = songMap.get(e.trackId) || {
      title: e.trackTitle,
      artist: e.artist,
      artwork: e.artwork,
      count: 0,
      sec: 0,
    };
    s.count++;
    s.sec += e.durationListened;
    songMap.set(e.trackId, s);

    // Artist aggregation
    const a = artistMap.get(e.artist) || {
      name: e.artist,
      artwork: e.artwork,
      count: 0,
      sec: 0,
    };
    a.count++;
    a.sec += e.durationListened;
    artistMap.set(e.artist, a);

    // Album aggregation
    const albumKey = `${e.album} - ${e.artist}`;
    const alb = albumMap.get(albumKey) || {
      title: e.album,
      artist: e.artist,
      artwork: e.artwork,
      count: 0,
      sec: 0,
    };
    alb.count++;
    alb.sec += e.durationListened;
    albumMap.set(albumKey, alb);
  });

  // Find most played song
  let topSongItem: TopRankedItem | null = null;
  let maxSongSec = -1;
  songMap.forEach((v, k) => {
    if (v.sec > maxSongSec) {
      maxSongSec = v.sec;
      topSongItem = {
        id: k,
        title: v.title,
        subtitle: v.artist,
        artwork: v.artwork,
        count: v.count,
        minutes: Math.round(v.sec / 60),
        percentage: totalSec > 0 ? Math.round((v.sec / totalSec) * 100) : 0,
      };
    }
  });

  // Find most played artist
  let topArtistItem: TopRankedItem | null = null;
  let maxArtistSec = -1;
  artistMap.forEach((v, k) => {
    if (v.sec > maxArtistSec) {
      maxArtistSec = v.sec;
      topArtistItem = {
        id: k,
        title: v.name,
        subtitle: `${v.count} tracks played`,
        artwork: v.artwork,
        count: v.count,
        minutes: Math.round(v.sec / 60),
        percentage: totalSec > 0 ? Math.round((v.sec / totalSec) * 100) : 0,
      };
    }
  });

  // Find most played album
  let topAlbumItem: TopRankedItem | null = null;
  let maxAlbumSec = -1;
  albumMap.forEach((v, k) => {
    if (v.sec > maxAlbumSec) {
      maxAlbumSec = v.sec;
      topAlbumItem = {
        id: k,
        title: v.title,
        subtitle: v.artist,
        artwork: v.artwork,
        count: v.count,
        minutes: Math.round(v.sec / 60),
        percentage: totalSec > 0 ? Math.round((v.sec / totalSec) * 100) : 0,
      };
    }
  });

  const totalMin = Math.round(totalSec / 60);
  const totalHrs = Number((totalSec / 3600).toFixed(1));
  const avgCompletion = Math.round(totalCompPct / entries.length);

  return {
    totalListeningSeconds: totalSec,
    totalListeningMinutes: totalMin,
    totalListeningHours: totalHrs,
    totalSongsPlayed: entries.length,
    uniqueArtistsCount: artistMap.size,
    uniqueAlbumsCount: albumMap.size,
    mostPlayedSong: topSongItem,
    mostPlayedArtist: topArtistItem,
    mostPlayedAlbum: topAlbumItem,
    completionRateAverage: avgCompletion,
  };
}

/**
 * Computes listening minutes per day for the selected timeframe.
 */
export function calculateDailyListening(
  entries: ListeningHistoryEntry[],
  range: AnalyticsTimeRange
): DayListeningStat[] {
  if (entries.length === 0) return [];

  // Group by date YYYY-MM-DD
  const dateMap = new Map<string, { minutes: number; count: number }>();

  // Determine span
  const now = new Date();
  const daysToShow = range === 'today' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 14;

  // Initialize days in range so chart is continuous
  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    dateMap.set(key, { minutes: 0, count: 0 });
  }

  entries.forEach((e) => {
    const existing = dateMap.get(e.date);
    const addMin = Math.round(e.durationListened / 60);
    if (existing) {
      existing.minutes += addMin;
      existing.count += 1;
    } else if (range === 'all' || range === '3m' || range === '6m' || range === '1y') {
      dateMap.set(e.date, { minutes: addMin, count: 1 });
    }
  });

  const result: DayListeningStat[] = [];
  dateMap.forEach((val, dateStr) => {
    const dateObj = new Date(dateStr + 'T12:00:00');
    const label = dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      weekday: daysToShow <= 7 ? 'short' : undefined,
    });
    result.push({
      date: dateStr,
      label,
      minutes: val.minutes,
      songCount: val.count,
    });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Computes 24-hour distribution of listening minutes (00:00 to 23:00).
 */
export function calculateHourlyListening(entries: ListeningHistoryEntry[]): HourlyListeningStat[] {
  const hours: { minutes: number; count: number }[] = Array.from({ length: 24 }, () => ({
    minutes: 0,
    count: 0,
  }));

  let totalMinutes = 0;

  entries.forEach((e) => {
    const dateObj = new Date(e.startTime);
    const h = dateObj.getHours();
    const min = Math.round(e.durationListened / 60);
    hours[h].minutes += min;
    hours[h].count += 1;
    totalMinutes += min;
  });

  let maxMinutes = -1;
  let peakHour = 0;
  hours.forEach((h, idx) => {
    if (h.minutes > maxMinutes) {
      maxMinutes = h.minutes;
      peakHour = idx;
    }
  });

  return hours.map((h, hour) => {
    const displayHour = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    return {
      hour,
      label: displayHour,
      minutes: h.minutes,
      songCount: h.count,
      percentage: totalMinutes > 0 ? Math.round((h.minutes / totalMinutes) * 100) : 0,
      isPeak: hour === peakHour && h.minutes > 0,
    };
  });
}

/**
 * Computes listening minutes by weekday (Sunday to Saturday).
 */
export function calculateWeekdayListening(entries: ListeningHistoryEntry[]): WeekdayListeningStat[] {
  const days = [
    { dayIndex: 0, name: 'Sunday', shortName: 'Sun', minutes: 0, songCount: 0 },
    { dayIndex: 1, name: 'Monday', shortName: 'Mon', minutes: 0, songCount: 0 },
    { dayIndex: 2, name: 'Tuesday', shortName: 'Tue', minutes: 0, songCount: 0 },
    { dayIndex: 3, name: 'Wednesday', shortName: 'Wed', minutes: 0, songCount: 0 },
    { dayIndex: 4, name: 'Thursday', shortName: 'Thu', minutes: 0, songCount: 0 },
    { dayIndex: 5, name: 'Friday', shortName: 'Fri', minutes: 0, songCount: 0 },
    { dayIndex: 6, name: 'Saturday', shortName: 'Sat', minutes: 0, songCount: 0 },
  ];

  entries.forEach((e) => {
    const d = new Date(e.startTime).getDay();
    const min = Math.round(e.durationListened / 60);
    days[d].minutes += min;
    days[d].songCount += 1;
  });

  return days;
}

/**
 * Computes monthly listening trends.
 */
export function calculateMonthlyListening(entries: ListeningHistoryEntry[]): MonthlyListeningStat[] {
  const monthMap = new Map<string, { label: string; minutes: number; count: number }>();

  entries.forEach((e) => {
    const d = new Date(e.startTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const min = Math.round(e.durationListened / 60);

    const curr = monthMap.get(key) || { label, minutes: 0, count: 0 };
    curr.minutes += min;
    curr.count += 1;
    monthMap.set(key, curr);
  });

  const result: MonthlyListeningStat[] = [];
  monthMap.forEach((v, k) => {
    result.push({
      monthKey: k,
      label: v.label,
      minutes: v.minutes,
      songCount: v.count,
    });
  });

  return result.sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

/**
 * Computes top artists ranked by total listening time.
 */
export function calculateTopArtists(
  entries: ListeningHistoryEntry[],
  limit: number = 8
): TopRankedItem[] {
  const artistMap = new Map<string, { name: string; artwork?: string; count: number; sec: number }>();
  let totalSec = 0;

  entries.forEach((e) => {
    totalSec += e.durationListened;
    const a = artistMap.get(e.artist) || { name: e.artist, artwork: e.artwork, count: 0, sec: 0 };
    a.count++;
    a.sec += e.durationListened;
    artistMap.set(e.artist, a);
  });

  const ranked: TopRankedItem[] = [];
  artistMap.forEach((v, k) => {
    ranked.push({
      id: k,
      title: v.name,
      subtitle: `${v.count} tracks • ${Math.round(v.sec / 60)} mins`,
      artwork: v.artwork,
      count: v.count,
      minutes: Math.round(v.sec / 60),
      percentage: totalSec > 0 ? Math.round((v.sec / totalSec) * 100) : 0,
    });
  });

  return ranked.sort((a, b) => b.minutes - a.minutes).slice(0, limit);
}

/**
 * Computes top genres ranked by total listening time.
 */
export function calculateTopGenres(
  entries: ListeningHistoryEntry[],
  limit: number = 6
): TopRankedItem[] {
  const genreMap = new Map<string, { name: string; count: number; sec: number }>();
  let totalSec = 0;

  entries.forEach((e) => {
    const genre = e.genre || 'Nocturnal Darkwave';
    totalSec += e.durationListened;
    const g = genreMap.get(genre) || { name: genre, count: 0, sec: 0 };
    g.count++;
    g.sec += e.durationListened;
    genreMap.set(genre, g);
  });

  const ranked: TopRankedItem[] = [];
  genreMap.forEach((v, k) => {
    ranked.push({
      id: k,
      title: v.name,
      subtitle: `${v.count} tracks`,
      count: v.count,
      minutes: Math.round(v.sec / 60),
      percentage: totalSec > 0 ? Math.round((v.sec / totalSec) * 100) : 0,
    });
  });

  return ranked.sort((a, b) => b.minutes - a.minutes).slice(0, limit);
}

/**
 * Computes top songs ranked by total listening time.
 */
export function calculateTopSongs(
  entries: ListeningHistoryEntry[],
  limit: number = 10
): TopRankedItem[] {
  const songMap = new Map<
    string,
    { title: string; artist: string; artwork: string; audioUrl?: string; count: number; sec: number }
  >();
  let totalSec = 0;

  entries.forEach((e) => {
    totalSec += e.durationListened;
    const s = songMap.get(e.trackId) || {
      title: e.trackTitle,
      artist: e.artist,
      artwork: e.artwork,
      audioUrl: e.audioUrl,
      count: 0,
      sec: 0,
    };
    s.count++;
    s.sec += e.durationListened;
    songMap.set(e.trackId, s);
  });

  const ranked: TopRankedItem[] = [];
  songMap.forEach((v, k) => {
    ranked.push({
      id: k,
      title: v.title,
      subtitle: v.artist,
      artwork: v.artwork,
      count: v.count,
      minutes: Math.round(v.sec / 60),
      percentage: totalSec > 0 ? Math.round((v.sec / totalSec) * 100) : 0,
    });
  });

  return ranked.sort((a, b) => b.minutes - a.minutes).slice(0, limit);
}

/**
 * Computes the descriptive "Music Personality" archetype from real stored listening data.
 * Purely derived from listening hours, genres, completion rates, and sonic variety.
 */
export function calculateMusicPersonality(entries: ListeningHistoryEntry[]): MusicPersonality {
  if (entries.length === 0) {
    return {
      archetype: 'The Uninitiated Soul',
      atmosphere: 'Silent Horizon',
      tagline: 'Awaiting the first nocturnal reverie.',
      summary:
        'Your nocturnal listening chronicle has just begun. As you immerse yourself in solitary listening rituals, your signature atmosphere and acoustic profile will unveil here.',
      peakHourDescription: 'Undetermined',
      topVibe: 'Silence & Solitude',
      nocturnalRatio: 0,
      traits: [
        { label: 'Acoustic Phase', value: 'Dormant', detail: 'No playback logged' },
        { label: 'Immersion Depth', value: 'Neutral', detail: '0 hymns recorded' },
      ],
      soundSignature: ['Untouched frequencies'],
    };
  }

  // 1. Nocturnal ratio: Listening between 22:00 (10 PM) and 05:00 (5 AM)
  let nocturnalSeconds = 0;
  let totalSeconds = 0;
  const hourCounts: number[] = Array(24).fill(0);
  const genreCounts = new Map<string, number>();

  entries.forEach((e) => {
    totalSeconds += e.durationListened;
    const d = new Date(e.startTime);
    const h = d.getHours();
    hourCounts[h] += e.durationListened;

    if (h >= 22 || h < 5) {
      nocturnalSeconds += e.durationListened;
    }

    const g = e.genre || 'Gothic Darkwave';
    genreCounts.set(g, (genreCounts.get(g) || 0) + e.durationListened);
  });

  const nocturnalRatio = totalSeconds > 0 ? Math.round((nocturnalSeconds / totalSeconds) * 100) : 0;

  // Peak Hour
  let maxHourSec = -1;
  let peakHour = 0;
  hourCounts.forEach((sec, h) => {
    if (sec > maxHourSec) {
      maxHourSec = sec;
      peakHour = h;
    }
  });

  const peakDisplay =
    peakHour === 0 ? 'Midnight (12:00 AM)' : peakHour < 12 ? `${peakHour}:00 AM` : `${peakHour - 12}:00 PM`;

  // Top Genre
  let topGenre = 'Gothic Darkwave';
  let maxGenreSec = -1;
  genreCounts.forEach((sec, g) => {
    if (sec > maxGenreSec) {
      maxGenreSec = sec;
      topGenre = g;
    }
  });

  // Calculate Average Completion Rate
  const totalCompletion = entries.reduce((acc, curr) => acc + curr.completionPercentage, 0);
  const avgCompletion = Math.round(totalCompletion / entries.length);

  // Derive Archetype
  let archetype = 'Midnight Dreamer';
  let atmosphere = 'Midnight Dreamer';
  let tagline = 'You dwell in nocturnal reverberations while the waking world rests.';
  let summary =
    'Your listening sessions concentrate heavily in the witching hours. You seek refuge in expansive, shadowy acoustic tapestries that calm the spirit and dissolve outer noise.';
  let soundSig = ['Subterranean Reverb', 'Spectral Synthesizers', 'Low-frequency Resonance'];

  if (nocturnalRatio >= 75 && (topGenre.includes('Gothic') || topGenre.includes('Darkwave'))) {
    archetype = 'Gothic Mystic';
    atmosphere = 'Gothic Mystic';
    tagline = 'Drawn to obsidian shadows and solemn cathedral frequencies.';
    summary =
      'You find sublime peace in towering darkwave anthems, minor-key progressions, and velvet vocal harmonies. The deeper the night, the clearer your acoustic intuition becomes.';
    soundSig = ['Gothic Basslines', 'Cathedral Echoes', 'Dark Synth Cadences'];
  } else if (nocturnalRatio >= 60 && (topGenre.includes('Ambient') || topGenre.includes('Calm'))) {
    archetype = 'Midnight Dreamer';
    atmosphere = 'Midnight Dreamer';
    tagline = 'Drifting through weightless sonic clouds beyond waking hours.';
    summary =
      'You use nocturnal soundscapes as meditative solace. Ambient textures and continuous acoustic flows envelop your consciousness during solitary late-night rituals.';
    soundSig = ['Ethereal Drones', 'Weightless Pads', 'Tape Saturation'];
  } else if (topGenre.includes('Focus') || topGenre.includes('Electronic') || topGenre.includes('Synthwave')) {
    archetype = 'Nocturnal Architect';
    atmosphere = 'Nocturnal Architect';
    tagline = 'Fueled by rhythmic precision in the stillness of deep midnight.';
    summary =
      'You translate nocturnal silence into disciplined focus. Relentless electronic pulses and crisp arpeggios sharpen your mind while the world around you is fast asleep.';
    soundSig = ['Analog Arpeggios', 'Bit-perfect Transients', 'Modular Sequencers'];
  } else if (avgCompletion >= 90) {
    archetype = 'Shadow Poet';
    atmosphere = 'Shadow Poet';
    tagline = 'Absorbing full sonic narratives with patient, reverent devotion.';
    summary =
      'You never rush through art. You listen to songs from their opening breath to the last decaying reverb tail, treating each track as an unbroken contemplation.';
    soundSig = ['Lyrical Depth', 'Acoustic Decay', 'Uninterrupted Movement'];
  } else if (nocturnalRatio <= 40) {
    archetype = 'Crepuscular Wanderer';
    atmosphere = 'Crepuscular Wanderer';
    tagline = 'Traversing the liminal borderlands between dusk and morning light.';
    summary =
      'Your listening spans dawn transitions and evening sunsets. You weave music into twilight moments where night and day gently bleed into each other.';
    soundSig = ['Twilight Melodies', 'Organic Acoustics', 'Dusk Harmony'];
  } else {
    archetype = 'Solitary Frequencer';
    atmosphere = 'Solitary Frequencer';
    tagline = 'Finding rare harmonic balance across late-night frequencies.';
    summary =
      'An intuitive night listener with wide sonic curiosity. You gravitate toward evocative soundscapes that match your fluctuating evening introspections.';
    soundSig = ['Deep Harmonic Waves', 'Velvet Textures', 'Nocturne Fidelity'];
  }

  return {
    archetype,
    atmosphere,
    tagline,
    summary,
    peakHourDescription: peakDisplay,
    topVibe: topGenre,
    nocturnalRatio,
    traits: [
      {
        label: 'Nocturnal Concentration',
        value: `${nocturnalRatio}%`,
        detail: 'Streams between 10:00 PM and 05:00 AM',
      },
      {
        label: 'Peak Ritual Hour',
        value: peakDisplay,
        detail: 'Most frequent listening threshold',
      },
      {
        label: 'Immersion Completeness',
        value: `${avgCompletion}%`,
        detail: 'Average track finish rate',
      },
      {
        label: 'Dominant Frequencies',
        value: topGenre,
        detail: 'Most explored nocturnal acoustic space',
      },
    ],
    soundSignature: soundSig,
  };
}
