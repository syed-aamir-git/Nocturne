import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { TrackList } from '../components/primitives/TrackList';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { musicService } from '../services/musicService';
import { getNocturnalHourPhase } from '../utilities/formatters';
import type { Album, Playlist, Track, Artist } from '../types';
import './HomePage.css';

interface MoodCollectionItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, status } = usePlayer();
  const { showToast } = useToast();
  const timePhase = getNocturnalHourPhase();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      musicService.getFeaturedAlbums(),
      musicService.getFeaturedPlaylists(),
      musicService.getFeaturedArtists(),
      musicService.getAllTracks(),
    ]).then(([albs, pls, arts, trks]) => {
      if (!isCancelled) {
        setAlbums(albs);
        setPlaylists(pls);
        setArtists(arts);
        setTracks(trks);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handlePlayAlbum = (album: Album) => {
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks, 0);
      showToast('Album Loaded', `Playing "${album.title}" by ${album.artist}`, 'atmosphere');
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks, 0);
      showToast('Sanctuary Mix Active', playlist.title, 'atmosphere');
    }
  };

  const continueItems = tracks.slice(0, 3).map((track, i) => ({
    track,
    progress: [68, 32, 85][i] || 50,
  }));

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
      {continueItems.length > 0 && (
        <section>
          <div className="nocturne-home__section-head">
            <div>
              <h2 className="nocturne-home__section-title">Continue Listening</h2>
              <span className="nocturne-home__section-sub">Resume your ongoing midnight sessions</span>
            </div>
          </div>

          <div className="nocturne-home__continue-grid">
            {continueItems.map((item) => {
              const coverSrc = item.track.artwork || item.track.coverUrl || '';
              return (
                <div
                  key={item.track.id}
                  className="nocturne-continue-card"
                  onClick={() => playTrack(item.track, tracks)}
                >
                  <div className="nocturne-continue-card__cover-wrap">
                    {coverSrc && (
                      <img
                        src={coverSrc}
                        alt={item.track.title}
                        className="nocturne-continue-card__cover"
                        loading="lazy"
                      />
                    )}
                    <div className="nocturne-continue-card__play-overlay">
                      <Play size={18} fill="currentColor" />
                    </div>
                  </div>
                  <div className="nocturne-continue-card__info">
                    <span className="nocturne-continue-card__title">
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
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Recently Played (TrackList) */}
      {tracks.length > 0 && (
        <section>
          <div className="nocturne-home__section-head">
            <div>
              <h2 className="nocturne-home__section-title">Recently Played</h2>
              <span className="nocturne-home__section-sub">Recent frequencies absorbed into your memory</span>
            </div>
          </div>

          <TrackList
            tracks={tracks.slice(0, 5)}
            currentTrackId={currentTrack?.id}
            isPlaying={status === 'playing'}
            onTrackPlay={(t, _all, i) => playTrack(t, tracks, i)}
            onLikeToggle={(t, l) => showToast(l ? 'Liked' : 'Unliked', t.title, 'default')}
          />
        </section>
      )}

      {/* 4. Made For You (Playlists) */}
      {playlists.length > 0 && (
        <section>
          <div className="nocturne-home__section-head">
            <div>
              <h2 className="nocturne-home__section-title">Made For You</h2>
              <span className="nocturne-home__section-sub">Algorithmic soundscapes tuned to your listening hour</span>
            </div>
          </div>

          <div className="nocturne-home__grid-cinematic">
            {playlists.map((pl) => (
              <PlaylistCard
                key={pl.id}
                playlist={pl}
                onClick={(p) => navigate(`/playlist/${p.id}`)}
                onPlay={handlePlayPlaylist}
              />
            ))}
          </div>
        </section>
      )}

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

      {/* 6. Your Rotation (Artists) */}
      {artists.length > 0 && (
        <section>
          <div className="nocturne-home__section-head">
            <div>
              <h2 className="nocturne-home__section-title">Your Rotation</h2>
              <span className="nocturne-home__section-sub">Sanctum creators in your constant frequency</span>
            </div>
          </div>

          <div className="nocturne-home__grid-artists">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onClick={(a) => navigate(`/artist/${a.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. New Releases (Albums) */}
      {albums.length > 0 && (
        <section>
          <div className="nocturne-home__section-head">
            <div>
              <h2 className="nocturne-home__section-title">New Releases</h2>
              <span className="nocturne-home__section-sub">Subterranean albums freshly unveiled into the dark</span>
            </div>
          </div>

          <div className="nocturne-home__grid-cinematic">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={(a) => navigate(`/album/${a.id}`)}
                onPlay={handlePlayAlbum}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
