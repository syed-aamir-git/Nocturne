import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Moon, Compass } from 'lucide-react';
import { Button } from '../components/primitives/Button';
import { AlbumCard } from '../components/primitives/AlbumCard';
import { ArtistCard } from '../components/primitives/ArtistCard';
import { PlaylistCard } from '../components/primitives/PlaylistCard';
import { TrackList } from '../components/primitives/TrackList';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { musicService } from '../services/musicService';
import type { Album, Playlist, Track, Artist } from '../types';
import './DiscoverPage.css';

export const DiscoverPage: React.FC = () => {
  const { playTrack, currentTrack, status } = usePlayer();
  const { showToast } = useToast();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [activeGenre, setActiveGenre] = useState<string>('All');

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      musicService.getAllAlbums(),
      musicService.getAllPlaylists(),
      musicService.getAllArtists(),
      musicService.getAllTracks(),
      musicService.getGenres(),
    ]).then(([albs, pls, arts, trks, gnrs]) => {
      if (!isCancelled) {
        setAlbums(albs);
        setPlaylists(pls);
        setArtists(arts);
        setTracks(trks);
        setGenres(['All', ...gnrs]);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const handlePlayAlbum = (album: Album) => {
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks.slice(1));
      showToast('Album Loaded', `Playing "${album.title}" by ${album.artist}`, 'atmosphere');
    } else {
      showToast('Album Selected', album.title, 'default');
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks.slice(1));
      showToast('Curated Stream Initiated', playlist.title, 'atmosphere');
    }
  };

  const filteredTracks =
    activeGenre === 'All'
      ? tracks
      : tracks.filter((t) => t.genre.toLowerCase().includes(activeGenre.toLowerCase()));

  const filteredAlbums =
    activeGenre === 'All'
      ? albums
      : albums.filter((a) => a.genre.toLowerCase().includes(activeGenre.toLowerCase()));

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
            onClick={() => {
              if (tracks.length > 0) {
                playTrack(tracks[0], tracks.slice(1));
                showToast('Sanctuary Unlocked', 'Beginning midnight listening ritual', 'atmosphere');
              }
            }}
          >
            Enter Sanctuary
          </Button>
          <Button
            variant="gothic"
            size="lg"
            leftIcon={<Sparkles size={16} />}
            onClick={() =>
              showToast('Deep Drift Initiated', 'Continuous non-stop midnight ambient audio mode active', 'atmosphere')
            }
          >
            Nocturnal Drift
          </Button>
        </div>
      </section>

      {/* Genre Filter Pills */}
      {genres.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-medium)', fontSize: '13px' }}>
            <Compass size={15} color="var(--accent-secondary)" />
            <span>Explore Sonic Sub-Disciplines</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGenre(g)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: activeGenre === g ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  border: `1px solid ${activeGenre === g ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  color: activeGenre === g ? 'var(--accent-secondary)' : 'var(--text-medium)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-snappy)',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Late-Night Playlists */}
      <section className="nocturne-section">
        <div className="nocturne-section__header">
          <div>
            <h2 className="nocturne-section__title">Curated For The Dark Hours</h2>
            <p className="nocturne-section__sub">Sonic rituals tailored to the quiet stillness of night</p>
          </div>
        </div>

        <div className="nocturne-grid-albums">
          {playlists.map((playlist) => (
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

        <TrackList
          tracks={filteredTracks.slice(0, 8)}
          currentTrackId={currentTrack?.id}
          isPlaying={status === 'playing'}
          onTrackPlay={(track, _all, index) => {
            playTrack(track, filteredTracks.slice(index + 1));
          }}
          onLikeToggle={(t, l) => showToast(l ? 'Liked' : 'Unliked', t.title, 'default')}
        />
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
          {filteredAlbums.map((album) => (
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
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
