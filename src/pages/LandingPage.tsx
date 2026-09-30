import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  Moon,
  Sparkles,
  Sliders,
  ArrowRight,
  Radio,
  Clock,
  Layers,
  Headphones,
} from 'lucide-react';
import { Button } from '../components/primitives/Button';
import { usePlayer } from '../state/PlayerContext';
import { useToast } from '../state/ToastContext';
import { MOCK_TRACKS, MOCK_ALBUMS } from '../data/mockData';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, status, togglePlayPause } = usePlayer();
  const { showToast } = useToast();

  const previewTrack = MOCK_TRACKS[0]; // Deftones - Change (In the House of Flies)
  const isPreviewPlaying = currentTrack?.id === previewTrack.id && status === 'playing';

  const handleTogglePreview = () => {
    if (currentTrack?.id === previewTrack.id) {
      togglePlayPause();
    } else {
      playTrack(previewTrack, [previewTrack], 0);
      showToast('Sanctuary Sample Active', 'Streaming 24-bit / 96kHz FLAC preview', 'atmosphere');
    }
  };

  const handleEnterApp = () => {
    navigate('/home');
    showToast('Welcome to Nocturne', 'Music for the hours that belong to you', 'atmosphere');
  };

  return (
    <div className="nocturne-landing">
      {/* Background Atmosphere */}
      <div className="nocturne-landing__bg-glow" aria-hidden="true" />
      <div className="nocturne-landing__stars" aria-hidden="true" />

      {/* Navigation Header */}
      <header className="nocturne-landing__nav">
        <div className="nocturne-landing__brand">
          <div className="nocturne-landing__brand-icon">
            <Moon size={22} />
          </div>
          <span className="nocturne-landing__brand-title">NOCTURNE</span>
        </div>

        <nav className="nocturne-landing__nav-links">
          <a href="#sound" className="nocturne-landing__nav-link">
            The Sound
          </a>
          <a href="#pillars" className="nocturne-landing__nav-link">
            Architecture
          </a>
          <a href="#recordings" className="nocturne-landing__nav-link">
            Recordings
          </a>
        </nav>

        <div className="nocturne-landing__nav-actions">
          <button
            type="button"
            className="nocturne-landing__primary-btn"
            style={{ padding: '10px 22px', fontSize: '13px' }}
            onClick={handleEnterApp}
          >
            <span>Enter Nocturne</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* Main Hero Showcase */}
      <main>
        <section className="nocturne-landing__hero">
          <div className="nocturne-landing__badge">
            <Sparkles size={14} />
            <span>FLAC 24-BIT 96kHz • NOCTURNAL SANCTUARY</span>
          </div>

          <h1 className="nocturne-landing__headline">
            NOCTURNE
            <span className="nocturne-landing__headline-span">
              "Music for the hours that belong to you."
            </span>
          </h1>

          <p className="nocturne-landing__subhead">
            When the waking world recedes into silence, music ceases to be background noise.
            Step inside our curated darkwave, liturgical reverb, and uncompressed analog ambient sanctum.
          </p>

          <div className="nocturne-landing__cta-row">
            <button
              type="button"
              className="nocturne-landing__primary-btn"
              onClick={handleEnterApp}
              id="landing-enter-btn"
            >
              <span>Enter Nocturne</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="nocturne-landing__secondary-btn"
              onClick={handleTogglePreview}
            >
              {isPreviewPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              <span>{isPreviewPlaying ? 'Pause Sample' : 'Listen to Preview'}</span>
            </button>
          </div>

          {/* Interactive Floating Preview Pod */}
          <div className="nocturne-landing__preview-card" id="sound">
            <div className="nocturne-landing__preview-info">
              <img
                src={previewTrack.artwork}
                alt={previewTrack.title}
                className="nocturne-landing__preview-thumb"
              />
              <div className="nocturne-landing__preview-text">
                <span className="nocturne-landing__preview-title">{previewTrack.title}</span>
                <span className="nocturne-landing__preview-artist">{previewTrack.artist} • 24-bit FLAC</span>
              </div>
            </div>

            <div className="nocturne-landing__preview-wave" aria-hidden="true">
              <span className={`nocturne-landing__preview-bar ${isPreviewPlaying ? 'nocturne-landing__preview-bar--playing' : ''}`} />
              <span className={`nocturne-landing__preview-bar ${isPreviewPlaying ? 'nocturne-landing__preview-bar--playing' : ''}`} />
              <span className={`nocturne-landing__preview-bar ${isPreviewPlaying ? 'nocturne-landing__preview-bar--playing' : ''}`} />
              <span className={`nocturne-landing__preview-bar ${isPreviewPlaying ? 'nocturne-landing__preview-bar--playing' : ''}`} />
              <span className={`nocturne-landing__preview-bar ${isPreviewPlaying ? 'nocturne-landing__preview-bar--playing' : ''}`} />
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={isPreviewPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              onClick={handleTogglePreview}
            >
              {isPreviewPlaying ? 'Pause' : 'Play Sample'}
            </Button>
          </div>
        </section>

        {/* The 6 Pillars of Nocturne */}
        <section className="nocturne-landing__section" id="pillars">
          <div className="nocturne-landing__section-head">
            <span className="nocturne-landing__section-eyebrow">Acoustic Foundation</span>
            <h2 className="nocturne-landing__section-title">Built Specifically for Solitary Listening</h2>
            <p className="nocturne-landing__section-sub">
              Every detail is engineered to honor the nocturnal hours with cinematic elegance and acoustic purity.
            </p>
          </div>

          <div className="nocturne-landing__pillars-grid">
            <div className="nocturne-landing__pillar-card">
              <div className="nocturne-landing__pillar-icon">
                <Headphones size={24} />
              </div>
              <h3 className="nocturne-landing__pillar-title">Lossless Studio Masters</h3>
              <p className="nocturne-landing__pillar-desc">
                Pristine 24-bit / 96kHz master recordings with zero harsh dynamic compression, preserving every breath of tape hiss and room decay.
              </p>
            </div>

            <div className="nocturne-landing__pillar-card">
              <div className="nocturne-landing__pillar-icon">
                <Sparkles size={24} />
              </div>
              <h3 className="nocturne-landing__pillar-title">Synchronized Lyrics & Lore</h3>
              <p className="nocturne-landing__pillar-desc">
                Line-by-line synchronized lyric scrolling, liturgical liner annotations, and fluid word timing illuminated with subtle luminescence.
              </p>
            </div>

            <div className="nocturne-landing__pillar-card">
              <div className="nocturne-landing__pillar-icon">
                <Sliders size={24} />
              </div>
              <h3 className="nocturne-landing__pillar-title">7-Band Web Audio EQ</h3>
              <p className="nocturne-landing__pillar-desc">
                Fine-grain parametric equalization calibrated with darkwave, cathedral organ, tape warmth, and bass boost acoustic presets.
              </p>
            </div>

            <div className="nocturne-landing__pillar-card">
              <div className="nocturne-landing__pillar-icon">
                <Radio size={24} />
              </div>
              <h3 className="nocturne-landing__pillar-title">Adaptive Crossfade</h3>
              <p className="nocturne-landing__pillar-desc">
                Seamless 0 to 10 second dual-gain node transitions that weave successive hymns into an unbroken midnight tapestry.
              </p>
            </div>

            <div className="nocturne-landing__pillar-card">
              <div className="nocturne-landing__pillar-icon">
                <Layers size={24} />
              </div>
              <h3 className="nocturne-landing__pillar-title">Five Gothic Themes</h3>
              <p className="nocturne-landing__pillar-desc">
                Curated midnight color palettes including Obsidian, Blood Moon, Crypt, Ethereal Mist, and Signature Amethyst Nocturne.
              </p>
            </div>

            <div className="nocturne-landing__pillar-card">
              <div className="nocturne-landing__pillar-icon">
                <Clock size={24} />
              </div>
              <h3 className="nocturne-landing__pillar-title">Private Sanctuary Chronicles</h3>
              <p className="nocturne-landing__pillar-desc">
                Hour-by-hour listening analytics, acoustic personality archetypes, and zero third-party telemetry or surveillance algorithms.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Master Recordings Showcase */}
        <section className="nocturne-landing__section" id="recordings">
          <div className="nocturne-landing__section-head">
            <span className="nocturne-landing__section-eyebrow">Curated Vault</span>
            <h2 className="nocturne-landing__section-title">Recordings of the Sanctum</h2>
            <p className="nocturne-landing__section-sub">
              Explore hymns composed for solitude, cathedral organs, and hypnotic synthesizer pulses.
            </p>
          </div>

          <div className="nocturne-landing__showcase-grid">
            {MOCK_ALBUMS.slice(0, 4).map((alb) => {
              const albumYear = alb.releaseYear || (alb.releaseDate ? alb.releaseDate.slice(0, 4) : '2025');
              const albumCover = alb.artwork || alb.coverUrl || '';
              return (
                <div
                  key={alb.id}
                  className="nocturne-landing__showcase-card"
                  onClick={() => {
                    if (alb.tracks && alb.tracks.length > 0) {
                      playTrack(alb.tracks[0], alb.tracks, 0);
                      showToast('Streaming Album', alb.title, 'atmosphere');
                    }
                    navigate('/home');
                  }}
                >
                  <img src={albumCover} alt={alb.title} className="nocturne-landing__showcase-art" />
                  <span className="nocturne-landing__showcase-title">{alb.title}</span>
                  <span className="nocturne-landing__showcase-meta">{alb.artist} • {albumYear}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="nocturne-landing__footer-cta">
          <h2 className="nocturne-landing__footer-title">The hours are quiet. The sanctuary is open.</h2>
          <p className="nocturne-landing__footer-desc">
            Leave the day behind. Step inside and let the darkwave and ambient reverbs become your companion.
          </p>

          <button
            type="button"
            className="nocturne-landing__primary-btn"
            onClick={handleEnterApp}
          >
            <span>Enter Sanctuary Now</span>
            <ArrowRight size={18} />
          </button>

          <span className="nocturne-landing__copyright">
            NOCTURNE © 2025 • MUSIC FOR THE HOURS THAT BELONG TO YOU • 24-BIT FLAC MASTERING
          </span>
        </section>
      </main>
    </div>
  );
};
