import type { Track, Artist, Album } from '../types';
import { MOCK_TRACKS, MOCK_ALBUMS, MOCK_ARTISTS } from '../data/mockData';

export interface MoodCollection {
  id: string;
  name: string;
  tagline: string;
  description: string;
  artwork: string;
  accentColor: string;
  genres: string[];
  vibes: string[];
}

export const MOOD_COLLECTIONS: MoodCollection[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Music for the deepest hour',
    description: 'Cathedral organs, twilight strings, and liturgical stillness for the zero hour.',
    artwork: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    accentColor: '#9d72ff',
    genres: ['Gothic Neoclassical', 'Gothic Darkwave'],
    vibes: ['Gothic Darkwave', 'Gothic Neoclassical'],
  },
  {
    id: 'melancholy',
    name: 'Melancholy',
    tagline: 'Quiet grief and twilight solace',
    description: 'Slow-burning acoustic decay and intimate vocals echoing through empty corridors.',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    accentColor: '#6366f1',
    genres: ['Midnight Slowcore', 'Ethereal Dark Pop'],
    vibes: ['Midnight Slowcore', 'Slowcore'],
  },
  {
    id: 'night-drive',
    name: 'Night Drive',
    tagline: 'Empty highways through city fog',
    description: 'Hypnotic dark electronic beats, tape delay, and cold industrial synthesizers.',
    artwork: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
    accentColor: '#38bdf8',
    genres: ['Coldwave / EBM', 'Darkwave', 'Synthwave'],
    vibes: ['Coldwave / EBM', 'Industrial / Post-Punk'],
  },
  {
    id: 'rain',
    name: 'Rain',
    tagline: 'Water falling against ancient glass',
    description: 'Gentle pitch drifts, soft room reverb, and subterranean aquatic resonance.',
    artwork: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    accentColor: '#0ea5e9',
    genres: ['Midnight Slowcore', 'Dark Ambient Drone'],
    vibes: ['Rain on Stained Glass', 'Midnight Slowcore'],
  },
  {
    id: 'focus',
    name: 'Focus',
    tagline: 'Sub-bass drones for deep nocturnal labor',
    description: 'Minimal harmonic distortion and tape hiss calibrated for undisturbed immersion.',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    accentColor: '#a855f7',
    genres: ['Dark Ambient Drone', 'Dungeon Synth'],
    vibes: ['Analog Tape Hiss', 'Dark Ambient Drone'],
  },
  {
    id: 'ambient',
    name: 'Ambient',
    tagline: 'Weightless spatial soundscapes',
    description: 'Slow decaying subterranean drones free from rhythm, pressure, and hurry.',
    artwork: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    accentColor: '#818cf8',
    genres: ['Dark Ambient Drone'],
    vibes: ['Dark Ambient Drone', 'Abyssal Solitude'],
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    tagline: 'Between waking life and slumber',
    description: 'Shimmering guitars, ethereal choral mist, and surreal shoegaze reverberation.',
    artwork: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    accentColor: '#c084fc',
    genres: ['Ethereal Dark Pop', 'Midnight Slowcore'],
    vibes: ['Ethereal Dark Pop'],
  },
  {
    id: 'gothic',
    name: 'Gothic',
    tagline: 'Archaic gloom and liturgical splendor',
    description: 'Cathedral bells, driving basslines, and poetic lyricism crafted in obsidian.',
    artwork: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    accentColor: '#ec4899',
    genres: ['Gothic Darkwave', 'Gothic Neoclassical'],
    vibes: ['Gothic Darkwave'],
  },
  {
    id: 'calm',
    name: 'Calm',
    tagline: 'Restoration for overstimulated minds',
    description: 'Warm cello harmonics, gentle analog tape saturation, and quiet stillness.',
    artwork: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    accentColor: '#34d399',
    genres: ['Gothic Neoclassical', 'Midnight Slowcore'],
    vibes: ['The 3 AM Drift', 'Midnight Slowcore'],
  },
  {
    id: 'energy',
    name: 'Energy',
    tagline: 'Pulsing rhythm for insomnia and night walks',
    description: 'Propulsive post-punk drums, cutting synthesizer basslines, and hypnotic tempo.',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    accentColor: '#f43f5e',
    genres: ['Coldwave / EBM', 'Industrial / Post-Punk'],
    vibes: ['Coldwave / EBM', 'Cybernetic Isolation'],
  },
];

export const recommendationService = {
  /**
   * Generates honest heuristic recommendations based on user listening behavior:
   * Analyzes recent tracks and liked tracks to score genres and artists.
   */
  getPersonalizedRecommendations(
    history: Track[],
    likedTrackIds: Set<string>,
    currentTrack: Track | null
  ): {
    title: string;
    reason: string;
    tracks: Track[];
  } {
    // Collect all tracks that the user has interacted with
    const interactedTracks: Track[] = [...history];
    if (currentTrack) {
      interactedTracks.push(currentTrack);
    }
    MOCK_TRACKS.forEach((t) => {
      if (likedTrackIds.has(t.id) && !interactedTracks.some((i) => i.id === t.id)) {
        interactedTracks.push(t);
      }
    });

    // If user has not interacted with any tracks yet, provide curated starter set
    if (interactedTracks.length === 0) {
      return {
        title: 'Midnight Resonance Starter',
        reason: 'Curated sonic rituals tailored for first-time night listening',
        tracks: MOCK_TRACKS.slice(0, 8),
      };
    }

    // Calculate genre and artist weights based on interaction count
    const genreScores: Record<string, number> = {};
    const artistScores: Record<string, number> = {};

    interactedTracks.forEach((track) => {
      genreScores[track.genre] = (genreScores[track.genre] || 0) + 1;
      artistScores[track.artist] = (artistScores[track.artist] || 0) + 1.5;
    });

    // Determine primary preferred genre and artist
    const topGenre = Object.entries(genreScores).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topArtist = Object.entries(artistScores).sort((a, b) => b[1] - a[1])[0]?.[0];

    // Score all catalog tracks by acoustic affinity
    const scoredTracks = MOCK_TRACKS.map((track) => {
      let score = 0;
      if (track.genre === topGenre) score += 3;
      if (track.artist === topArtist) score += 4;
      // Slight boost for popular tracks
      score += Math.min(2, track.playCount / 1000000);
      return { track, score };
    });

    // Sort by score descending and take top 8
    scoredTracks.sort((a, b) => b.score - a.score);
    const recommendedTracks = scoredTracks.map((item) => item.track).slice(0, 8);

    const reason = topArtist
      ? `Acoustic affinity matches your frequent listening of ${topArtist} and ${topGenre}`
      : `Harmonic resonance tuned to your preference for ${topGenre}`;

    return {
      title: topArtist ? `Because You Listened To ${topArtist}` : `Resonating In ${topGenre}`,
      reason,
      tracks: recommendedTracks,
    };
  },

  /**
   * Finds tracks similar to a given track based on genre, vibe, and artist
   */
  getSimilarSongs(track: Track): Track[] {
    return MOCK_TRACKS.filter(
      (t) =>
        t.id !== track.id &&
        (t.genre.toLowerCase() === track.genre.toLowerCase() ||
          t.artistId === track.artistId ||
          (t.vibe && track.vibe && t.vibe.toLowerCase() === track.vibe.toLowerCase()))
    ).slice(0, 6);
  },

  /**
   * Finds artists similar to a given artist based on shared genres
   */
  getSimilarArtists(artistId: string): Artist[] {
    const targetArtist = MOCK_ARTISTS.find((a) => a.id === artistId);
    if (!targetArtist) return MOCK_ARTISTS.slice(0, 4);

    const targetGenres = new Set(targetArtist.genres.map((g) => g.toLowerCase()));

    return MOCK_ARTISTS.filter((a) => {
      if (a.id === artistId) return false;
      return a.genres.some((g) => targetGenres.has(g.toLowerCase()));
    }).slice(0, 4);
  },

  /**
   * Retrieves tracks matching a specific mood
   */
  getTracksByMood(moodId: string): Track[] {
    const mood = MOOD_COLLECTIONS.find((m) => m.id === moodId);
    if (!mood) return MOCK_TRACKS.slice(0, 8);

    return MOCK_TRACKS.filter((t) => {
      const matchGenre = mood.genres.some((g) =>
        t.genre.toLowerCase().includes(g.toLowerCase())
      );
      const matchVibe = mood.vibes.some(
        (v) => t.vibe && t.vibe.toLowerCase().includes(v.toLowerCase())
      );
      return matchGenre || matchVibe;
    });
  },

  /**
   * New Releases: recently issued albums and singles
   */
  getNewReleases(): Album[] {
    return [...MOCK_ALBUMS].sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      return dateB - dateA;
    });
  },

  /**
   * Trending demo music: top play counts
   */
  getTrendingTracks(): Track[] {
    return [...MOCK_TRACKS].sort((a, b) => b.playCount - a.playCount).slice(0, 10);
  },
};
