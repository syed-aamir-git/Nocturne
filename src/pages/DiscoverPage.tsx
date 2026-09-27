import React from 'react';
import { Play, Sparkles, Moon } from 'lucide-react';
import { Button } from '../components/primitives/Button';
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
import type { Album, Playlist, Track } from '../types';
import './DiscoverPage.css';

export const DiscoverPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();
  const { showToast } = useToast();

  const handlePlayAlbum = (album: Album) => {
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks.slice(1));
      showToast('Album Loaded', `Playing "${album.title}" by ${album.artist}`, 'atmosphere');
    } else {
      showToast('Album Selected', album.title, 'default');
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (MOCK_TRACKS.length > 0) {
      playTrack(MOCK_TRACKS[0], MOCK_TRACKS.slice(1));
      showToast('Curated Stream Initiated', playlist.title, 'atmosphere');
    }
  };

  const handlePlayTrack = (track: Track) => {
    playTrack(track, MOCK_TRACKS);
    showToast('Playing Track', `${track.title} • ${track.artist}`, 'default');
  };

  return (
    <div className="nocturne-discover">
      {/* Gothic Atmospheric Hero */}
      <section className="nocturne-hero">
        <div className="nocturne-hero__badge">
          <Moon size={13} />
          <span>MIDNIGHT RESONANCE SELECTION</span>
        </div>
        <h1 className="nocturne-hero__title">The Hours That Belong To You</h1>
        <p className="nocturne-hero__tagline">
          When the world recedes into silence, music ceases to be background sound.
          Step inside our curated darkwave, liturgical reverb, and analog ambient sanctum.
        </p>
        <div className="nocturne-hero__actions">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play size={18} fill="currentColor" />}
            onClick={() => handlePlayTrack(MOCK_TRACKS[0])}
          >
            Enter Sanctuary
          </Button>
          <Button
            variant="gothic"
            size="lg"
            leftIcon={<Sparkles size={16} />}
            onClick={() => showToast('Deep Drift Initiated', 'Continuous non-stop midnight ambient audio mode active', 'atmosphere')}
          >
            Nocturnal Drift
          </Button>
        </div>
      </section>

      {/* Featured Late-Night Playlists */}
      <section className="nocturne-section">
        <div className="nocturne-section__header">
          <div>
            <h2 className="nocturne-section__title">Curated For The Dark Hours</h2>
            <p className="nocturne-section__sub">Sonic rituals tailored to the quiet stillness of night</p>
          </div>
        </div>

        <div className="nocturne-grid-albums">
          {MOCK_PLAYLISTS.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={handlePlayPlaylist}
            />
          ))}
        </div>
      </section>

      {/* Atmospheric Tracks */}
      <section className="nocturne-section">
        <div className="nocturne-section__header">
          <div>
            <h2 className="nocturne-section__title">Echoes In The Void</h2>
            <p className="nocturne-section__sub">Bit-perfect 24-bit studio master lossless tracks</p>
          </div>
        </div>

        <div className="nocturne-tracklist">
          {MOCK_TRACKS.slice(0, 5).map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              isActive={currentTrack?.id === track.id}
              isPlaying={status === 'playing'}
              onPlay={handlePlayTrack}
            />
          ))}
        </div>
      </section>

      {/* Essential Midnight Albums */}
      <section className="nocturne-section">
        <div className="nocturne-section__header">
          <div>
            <h2 className="nocturne-section__title">Architectures of Sound</h2>
            <p className="nocturne-section__sub">Deep-listening albums designed for headphones in the dark</p>
          </div>
        </div>

        <div className="nocturne-grid-albums">
          {MOCK_ALBUMS.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onPlay={handlePlayAlbum}
            />
          ))}
        </div>
      </section>

      {/* Master Artists */}
      <section className="nocturne-section">
        <div className="nocturne-section__header">
          <div>
            <h2 className="nocturne-section__title">Sanctum Artists</h2>
            <p className="nocturne-section__sub">Pioneers of gothic darkwave, neoclassical, and slowcore</p>
          </div>
        </div>

        <div className="nocturne-grid-artists">
          {MOCK_ARTISTS.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={(ar) => showToast('Artist Profile', ar.name, 'default')}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
