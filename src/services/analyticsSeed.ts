import { MOCK_TRACKS } from '../data/mockData';
import type { ListeningHistoryEntry } from '../types/analytics';

/**
 * Creates authentic seed listening history entries using Nocturne's demo tracks.
 * Entries span across Today, Yesterday, This Week, Last Week, and Earlier
 * with nocturnal listening concentrations (11 PM - 4 AM).
 */
export function generateSeedHistory(): ListeningHistoryEntry[] {
  const now = Date.now();
  const ONE_HOUR = 3600 * 1000;

  // Relative offsets in hours from now
  const historyTemplates = [
    // Today
    { trackIdx: 0, hoursAgo: 1.5, listenedRatio: 1.0 },
    { trackIdx: 1, hoursAgo: 2.2, listenedRatio: 0.95 },
    { trackIdx: 2, hoursAgo: 3.8, listenedRatio: 0.88 },
    { trackIdx: 3, hoursAgo: 5.0, listenedRatio: 1.0 },
    { trackIdx: 4, hoursAgo: 7.2, listenedRatio: 0.75 },

    // Yesterday
    { trackIdx: 5, hoursAgo: 25.5, listenedRatio: 1.0 },
    { trackIdx: 6, hoursAgo: 26.2, listenedRatio: 0.92 },
    { trackIdx: 7, hoursAgo: 27.8, listenedRatio: 1.0 },
    { trackIdx: 8, hoursAgo: 30.1, listenedRatio: 0.85 },
    { trackIdx: 9, hoursAgo: 34.0, listenedRatio: 1.0 },

    // This Week (2-4 days ago)
    { trackIdx: 10, hoursAgo: 48 + 3, listenedRatio: 1.0 },
    { trackIdx: 11, hoursAgo: 48 + 5, listenedRatio: 0.9 },
    { trackIdx: 12, hoursAgo: 72 + 2, listenedRatio: 1.0 },
    { trackIdx: 13, hoursAgo: 72 + 4, listenedRatio: 0.82 },
    { trackIdx: 14, hoursAgo: 96 + 1, listenedRatio: 1.0 },
    { trackIdx: 15, hoursAgo: 96 + 3, listenedRatio: 0.95 },

    // Last Week (7-12 days ago)
    { trackIdx: 0, hoursAgo: 7 * 24 + 2, listenedRatio: 1.0 },
    { trackIdx: 2, hoursAgo: 8 * 24 + 1, listenedRatio: 1.0 },
    { trackIdx: 4, hoursAgo: 9 * 24 + 4, listenedRatio: 0.88 },
    { trackIdx: 6, hoursAgo: 10 * 24 + 2, listenedRatio: 1.0 },
    { trackIdx: 8, hoursAgo: 11 * 24 + 3, listenedRatio: 0.92 },
    { trackIdx: 1, hoursAgo: 12 * 24 + 1, listenedRatio: 1.0 },

    // Earlier (15-28 days ago)
    { trackIdx: 3, hoursAgo: 15 * 24 + 2, listenedRatio: 1.0 },
    { trackIdx: 5, hoursAgo: 18 * 24 + 3, listenedRatio: 0.85 },
    { trackIdx: 7, hoursAgo: 21 * 24 + 1, listenedRatio: 1.0 },
    { trackIdx: 9, hoursAgo: 24 * 24 + 4, listenedRatio: 0.94 },
    { trackIdx: 11, hoursAgo: 28 * 24 + 2, listenedRatio: 1.0 },
  ];

  const seed: ListeningHistoryEntry[] = [];

  historyTemplates.forEach((t, i) => {
    const track = MOCK_TRACKS[t.trackIdx % MOCK_TRACKS.length];
    if (!track) return;

    const endMs = now - Math.round(t.hoursAgo * ONE_HOUR);
    const durationSec = track.duration || 240;
    const listenedSec = Math.max(30, Math.round(durationSec * t.listenedRatio));
    const startMs = endMs - listenedSec * 1000;
    const startDate = new Date(startMs);
    const dateStr = startDate.toISOString().split('T')[0];

    seed.push({
      id: `seed-hist-${i}-${startMs}`,
      trackId: track.id,
      trackTitle: track.title,
      artist: track.artist,
      artistId: track.artistId,
      album: track.album,
      albumId: track.albumId,
      artwork: track.artwork || track.coverUrl || '',
      audioUrl: track.audioUrl,
      genre: track.genre || 'Gothic Darkwave',
      duration: durationSec,
      startTime: startMs,
      endTime: endMs,
      date: dateStr,
      durationListened: listenedSec,
      completionPercentage: Math.min(100, Math.round((listenedSec / durationSec) * 100)),
      vibe: track.vibe,
    });
  });

  // Sort descending by start time (newest first)
  seed.sort((a, b) => b.startTime - a.startTime);
  return seed;
}
