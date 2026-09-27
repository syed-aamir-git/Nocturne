import React from 'react';
import {
  Play,
  Moon,
  Clock,
  Sparkles,
  CloudRain,
  Flame,
  Radio,
} from 'lucide-react';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { TrackRow } from '../components/primitives/TrackRow';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import {
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_PLAYLISTS,
  MOCK_TRACKS,
} from '../data/mockData';
import { getNocturnalHourPhase } from '../../src/utilities/formatters';
import type { Album, Playlist, Track } from '../types';
import './HomePage.css';

interface MoodCollectionItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

export const HomePage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();
  const { showToast } = useToast();
  const timePhase = getNocturnalHourPhase();

  const handlePlayAlbum = (album: Album) => {
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks.slice(1));
      showToast('Album Loaded', `Playing "${album.title}" by ${album.artist}`, 'atmosphere');
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (MOCK_TRACKS.length > 0) {
      playTrack(MOCK_TRACKS[0], MOCK_TRACKS.slice(1));
      showToast('Sanctuary Mix Active', playlist.title, 'atmosphere');
    }
  };

  const handlePlayTrack = (track: Track) => {
    playTrack(track, MOCK_TRACKS);
    showToast('Immersed', `${track.title} • ${track.artist}`, 'default');
  };

  const continueItems = [
    {
      track: MOCK_TRACKS[0],
      progress: 68,
      timeLeft: '1:40 remaining',
    },
    {
      track: MOCK_TRACKS[1],
      progress: 32,
      timeLeft: '2:52 remaining',
    },
    {
      track: MOCK_TRACKS[2],
      progress: 85,
      timeLeft: '0:48 remaining',
    },
  ];

  const moodCollections: MoodCollectionItem[] = [
    {
      id: 'm1',
      name: 'Abyssal Solitude',
      desc: 'Sub-bass drones and vast reverbs for lone contemplation',
      icon: <Moon size={18} />,
    },
    {
      id: 'm2',
      name: 'Rain on Stained Glass',
      desc: 'Gentle slowcore melodies meeting crepuscular rain',
      icon: <CloudRain size={18} />,
    },
    {
      id: 'm3',
      name: 'The 3 AM Drift',
      desc: 'Minimal cello passages and slow decay acoustics',
      icon: <Clock size={18} />,
    },
    {
      id: 'm4',
      name: 'Witching Hour Chamber',
      desc: 'Liturgical strings and cathedral choir echoes',
      icon: <Sparkles size={18} />,
    },
    {
      id: 'm5',
      name: 'Velvet Noir',
      desc: 'Hypnotic darkwave pulses and late-night synth noir',
      icon: <Flame size={18} />,
    },
    {
      id: 'm6',
      name: 'Analog Tape Saturation',
      desc: 'Warm tape hiss and vintage tube preamps for tired minds',
      icon: <Radio size={18} />,
    },
  ];

  return (
    <div className="nocturne-home animate-fade-in">
      {/* 1. Poetic Greeting */}
      <section className="nocturne-home__greeting-wrap">
        <div className="nocturne-home__greeting-meta">
          <span className="nocturne-home__greeting-dot" />
          <span>{timePhase.label}</span>
          <span>•</span>
          <span>FLAC 24-BIT 96kHz</span>
        </div>
        <h1 className="nocturne-home__greeting-title">
          Good evening, Wanderer.
        </h1>
        <p className="nocturne-home__greeting-sub">
          The noise of the waking world has receded. The nocturnal hours belong to you alone.
        </p>
      </section>

      {/* 2. Continue Listening */}
      <section>
        <div className="nocturne-home__section-head">
          <div>
            <h2 className="nocturne-home__section-title">Continue Listening</h2>
            <span className="nocturne-home__section-sub">Resume your ongoing midnight sessions</span>
          </div>
        </div>

        <div className="nocturne-home__continue-grid">
          {continueItems.map((item) => (
            <div
              key={item.track.id}
              className="nocturne-continue-card"
              onClick={() => handlePlayTrack(item.track)}
            >
              <div className="nocturne-continue-card__cover-wrap">
                <img
                  src={item.track.coverUrl}
                  alt={item.track.title}
                  className="nocturne-continue-card__cover"
                  loading="lazy"
                />
                <div className="nocturne-continue-card__play-overlay">
                  <Play size={18} fill="currentColor" />
                </div>
              </div>

              <div className="nocturne-continue-card__info">
                <span className="nocturne-continue-card__title" title={item.track.title}>
                  {item.track.title}
                </span>
                <span className="nocturne-continue-card__artist">
                  {item.track.artist}
                </span>
                <div className="nocturne-continue-card__progress-wrap">
                  <div
                    className="nocturne-continue-card__progress-bar"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Recently Played */}
      <section>
        <div className="nocturne-home__section-head">
          <div>
            <h2 className="nocturne-home__section-title">Recently Played</h2>
            <span className="nocturne-home__section-sub">Recent frequencies absorbed into your memory</span>
          </div>
        </div>

        <div className="nocturne-tracklist">
          {MOCK_TRACKS.slice(0, 4).map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              isActive={currentTrack?.id === track.id}
              isPlaying={status === 'playing'}
              onPlay={handlePlayTrack}
            />
          ))}
        </div>
      </section>

      {/* 4. Made For You */}
      <section>
        <div className="nocturne-home__section-head">
          <div>
            <h2 className="nocturne-home__section-title">Made For You</h2>
            <span className="nocturne-home__section-sub">Algorithmic soundscapes tuned to your listening hour</span>
          </div>
        </div>

        <div className="nocturne-home__grid-cinematic">
          {MOCK_PLAYLISTS.map((pl) => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onPlay={handlePlayPlaylist}
            />
          ))}
        </div>
      </section>

      {/* 5. Mood Collections */}
      <section>
        <div className="nocturne-home__section-head">
          <div>
            <h2 className="nocturne-home__section-title">Mood Collections</h2>
            <span className="nocturne-home__section-sub">Calm atmospheric environments for deep stillness</span>
          </div>
        </div>

        <div className="nocturne-home__mood-grid">
          {moodCollections.map((mood) => (
            <div
              key={mood.id}
              className="nocturne-mood-slab"
              onClick={() => showToast('Mood Sanctuary Activated', mood.name, 'atmosphere')}
            >
              <div className="nocturne-mood-slab__icon">{mood.icon}</div>
              <span className="nocturne-mood-slab__name">{mood.name}</span>
              <span className="nocturne-mood-slab__desc">{mood.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Your Rotation */}
      <section>
        <div className="nocturne-home__section-head">
          <div>
            <h2 className="nocturne-home__section-title">Your Rotation</h2>
            <span className="nocturne-home__section-sub">Sanctum creators in your constant frequency</span>
          </div>
        </div>

        <div className="nocturne-home__grid-artists">
          {MOCK_ARTISTS.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={(a) => showToast('Artist Profile', a.name, 'default')}
            />
          ))}
        </div>
      </section>

      {/* 7. New Releases */}
      <section>
        <div className="nocturne-home__section-head">
          <div>
            <h2 className="nocturne-home__section-title">New Releases</h2>
            <span className="nocturne-home__section-sub">Subterranean albums freshly unveiled into the dark</span>
          </div>
        </div>

        <div className="nocturne-home__grid-cinematic">
          {MOCK_ALBUMS.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onPlay={handlePlayAlbum}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
