/**
 * Formats a duration in seconds into mm:ss or hh:mm:ss format
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;

  if (hrs > 0) {
    const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }
  return `${mins}:${paddedSecs}`;
}

/**
 * Formats large listener/play numbers to human readable (e.g. 1.2M, 840K)
 */
export function formatNumber(num: number): string {
  if (!num || isNaN(num) || !isFinite(num)) return '0';
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

/**
 * Formats the current time into poetic late-night nocturnal descriptors
 */
export function getNocturnalHourPhase(date: Date = new Date()): { label: string; subtext: string } {
  const hour = date.getHours();
  if (hour >= 0 && hour < 3) {
    return { label: 'The Dead of Night', subtext: 'Deep solitude & atmospheric drift' };
  } else if (hour >= 3 && hour < 5) {
    return { label: 'The Witching Hour', subtext: 'Before the world awakens' };
  } else if (hour >= 5 && hour < 8) {
    return { label: 'Crepuscular Dawn', subtext: 'First mist meeting shadow' };
  } else if (hour >= 20 && hour < 22) {
    return { label: 'Twilight Veil', subtext: 'The evening recedes into dark' };
  } else if (hour >= 22 && hour < 24) {
    return { label: 'Midnight Descent', subtext: 'The realm of solitary resonance' };
  }
  return { label: 'Nocturne Hours', subtext: 'Your sound sanctuary' };
}

/**
 * Clamps a number between min and max bounds
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
