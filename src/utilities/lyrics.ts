import type { SyncedLyricLine } from '../types';

/**
 * Sanitizes and validates synced lyric lines.
 * Filters out invalid lines, guarantees non-negative numerical timestamps,
 * and sorts lines chronologically.
 */
export function sanitizeSyncedLyrics(rawLyrics: unknown): SyncedLyricLine[] {
  if (!Array.isArray(rawLyrics)) return [];

  const validLines: SyncedLyricLine[] = [];

  for (const line of rawLyrics) {
    if (
      line &&
      typeof line === 'object' &&
      typeof line.text === 'string' &&
      line.text.trim().length > 0 &&
      typeof line.time === 'number' &&
      !isNaN(line.time) &&
      line.time >= 0
    ) {
      validLines.push({
        time: line.time,
        text: line.text.trim(),
      });
    }
  }

  return validLines.sort((a, b) => a.time - b.time);
}

/**
 * Sanitizes plain text lyrics.
 */
export function sanitizePlainLyrics(rawLyrics: unknown): string {
  if (typeof rawLyrics !== 'string') return '';
  return rawLyrics.trim();
}
