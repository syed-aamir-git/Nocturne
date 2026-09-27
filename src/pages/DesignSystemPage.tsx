import React, { useState } from 'react';
import {
  Play,
  Heart,
  Volume2,
  Sparkles,
  Layers,
  Settings,
  Flame,
  Radio,
  Share2,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import {
  Button,
  IconButton,
  Modal,
  Dropdown,
  Tooltip,
  Slider,
  Tabs,
  Card,
  Avatar,
  AlbumCard,
  ArtistCard,
  TrackRow,
  PlaylistCard,
  Skeleton,
  EmptyState,
} from '../components/primitives';
import { useTheme } from '../state/ThemeContext';
import { useToast } from '../state/ToastContext';
import { usePlayer } from '../state/PlayerContext';
import {
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_PLAYLISTS,
  MOCK_TRACKS,
} from '../data/mockData';

export const DesignSystemPage: React.FC = () => {
  const { currentTheme, availableThemes, setThemeId } = useTheme();
  const { showToast } = useToast();
  const { playTrack, currentTrack, status } = usePlayer();

  // State for interactive primitives
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState(64);
  const [activeTab, setActiveTab] = useState('primitives');

  const demoTabs = [
    { id: 'primitives', label: 'Action & Control Primitives', badge: '7' },
    { id: 'domain', label: 'Audio Domain Primitives', badge: '5' },
    { id: 'feedback', label: 'Feedback & Layout Primitives', badge: '4' },
  ];

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Layers size={24} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Nocturne Design System</h1>
        </div>
        <p style={{ color: 'var(--text-medium)', fontSize: '14px', maxWidth: 700 }}>
          Living specification of all 16 atomic design primitives and atmospheric tokens
          crafted for late-night listening sanctuaries.
        </p>
      </div>

      {/* Theme System Bar */}
      <Card variant="elevated" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="var(--accent-primary)" />
          Nocturnal Theme Matrix
        </h3>
        <p style={{ color: 'var(--text-low)', fontSize: '12.5px', marginBottom: 16 }}>
          Current Active Theme: <strong style={{ color: 'var(--accent-secondary)' }}>{currentTheme.name}</strong> — {currentTheme.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {availableThemes.map((thm) => {
            const isSelected = thm.id === currentTheme.id;
            return (
              <div
                key={thm.id}
                onClick={() => {
                  setThemeId(thm.id);
                  showToast('Theme Changed', `Activated ${thm.name}`, 'atmosphere');
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--bg-surface-hover)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1.5px solid ${isSelected ? thm.accent : 'var(--border-subtle)'}`,
                  boxShadow: isSelected ? `0 0 16px ${thm.glow}` : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-snappy)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: thm.accent,
                      boxShadow: `0 0 8px ${thm.accent}`,
                    }}
                  />
                  <strong style={{ fontSize: '13px', color: 'var(--text-pure)' }}>{thm.name}</strong>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-low)', lineHeight: 1.4 }}>
                  {thm.description}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Primitive Category Tabs */}
      <Tabs tabs={demoTabs} activeId={activeTab} onChange={setActiveTab} />

      {/* SECTION 1: Action & Control Primitives */}
      {activeTab === 'primitives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* 1. Button */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>1. Button Primitive</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <Button variant="primary" leftIcon={<Play size={16} fill="currentColor" />}>
                Primary Action
              </Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="gothic">Gothic Classical</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </Card>

          {/* 2. IconButton */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>2. IconButton Primitive</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              <IconButton variant="primary" size="sm" aria-label="Play">
                <Play size={14} fill="currentColor" />
              </IconButton>
              <IconButton variant="primary" size="md" aria-label="Play">
                <Play size={18} fill="currentColor" />
              </IconButton>
              <IconButton variant="secondary" size="md" aria-label="Favorite">
                <Heart size={18} />
              </IconButton>
              <IconButton variant="ghost" size="md" active aria-label="Glowing state">
                <Sparkles size={18} />
              </IconButton>
              <IconButton variant="secondary" size="lg" aria-label="Large volume">
                <Volume2 size={22} />
              </IconButton>
              <IconButton variant="secondary" size="xl" aria-label="XL flame">
                <Flame size={26} />
              </IconButton>
            </div>
          </Card>

          {/* 3. Modal */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>3. Modal Primitive</h3>
            <Button
              variant="gothic"
              onClick={() => setModalOpen(true)}
            >
              Open Demonstration Modal
            </Button>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Sacred Chamber of Audio Architecture"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>
                    Depart
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setModalOpen(false);
                      showToast('Configuration Sealed', 'Your audio sanctuary preferences are preserved.', 'atmosphere');
                    }}
                  >
                    Accept Ritual
                  </Button>
                </>
              }
            >
              <p style={{ marginBottom: 14 }}>
                This modal primitive features backdrop blur, trap-safe dismissal via Escape or backdrop click,
                and gothic typography matching Nocturne's late-night identity.
              </p>
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-pure)', marginBottom: 4 }}>
                  Hi-Res Audio Pipeline
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-medium)' }}>
                  Rendering via 24-bit 96kHz master stream. Press ESC or click outside to dismiss.
                </div>
              </div>
            </Modal>
          </Card>

          {/* 4. Dropdown */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>4. Dropdown Primitive</h3>
            <Dropdown
              trigger={
                <Button variant="secondary" rightIcon={<Settings size={15} />}>
                  Sanctuary Options Menu
                </Button>
              }
              items={[
                {
                  id: 'share',
                  label: 'Share Atmosphere',
                  icon: <Share2 size={15} />,
                  onClick: () => showToast('Share Link Created', 'Copied nocturnal permalink', 'default'),
                },
                {
                  id: 'stream',
                  label: 'Switch to FLAC 192kHz',
                  icon: <Radio size={15} />,
                  onClick: () => showToast('Audio Stream Upgraded', '24-bit 192kHz Studio Master', 'atmosphere'),
                },
                'divider',
                {
                  id: 'clear',
                  label: 'Purge Midnight Cache',
                  danger: true,
                  icon: <Trash2 size={15} />,
                  onClick: () => showToast('Cache Purged', 'Temporary memory cleansed', 'warning'),
                },
              ]}
            />
          </Card>

          {/* 5. Tooltip */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>5. Tooltip Primitive</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <Tooltip content="Tooltip docked on top" position="top">
                <Button variant="secondary" size="sm">Hover: Top</Button>
              </Tooltip>
              <Tooltip content="Tooltip docked on bottom" position="bottom">
                <Button variant="secondary" size="sm">Hover: Bottom</Button>
              </Tooltip>
              <Tooltip content="Tooltip docked on left" position="left">
                <Button variant="secondary" size="sm">Hover: Left</Button>
              </Tooltip>
              <Tooltip content="Tooltip docked on right" position="right">
                <Button variant="secondary" size="sm">Hover: Right</Button>
              </Tooltip>
            </div>
          </Card>

          {/* 6. Slider */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>6. Slider Primitive</h3>
            <div style={{ maxWidth: 400 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-medium)', marginBottom: 6 }}>
                <span>Atmospheric Intensity</span>
                <span className="font-mono">{sliderVal}%</span>
              </div>
              <Slider
                value={sliderVal}
                min={0}
                max={100}
                onChange={setSliderVal}
                aria-label="Atmospheric intensity slider"
              />
            </div>
          </Card>

          {/* 7. Tabs */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>7. Tabs Primitive</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-medium)', marginBottom: 14 }}>
              Active tabs component is showcased above controlling this very page section!
            </p>
          </Card>
        </div>
      )}

      {/* SECTION 2: Audio Domain Primitives */}
      {activeTab === 'domain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* 8. AlbumCard */}
          <Card>
            <h3 style={{ marginBottom: 16 }}>8. AlbumCard Primitive</h3>
            <div className="nocturne-grid-albums">
              {MOCK_ALBUMS.slice(0, 3).map((alb) => (
                <AlbumCard
                  key={alb.id}
                  album={alb}
                  onPlay={(a) => showToast('Playing Album', a.title, 'atmosphere')}
                />
              ))}
            </div>
          </Card>

          {/* 9. ArtistCard */}
          <Card>
            <h3 style={{ marginBottom: 16 }}>9. ArtistCard Primitive</h3>
            <div className="nocturne-grid-artists">
              {MOCK_ARTISTS.slice(0, 4).map((art) => (
                <ArtistCard
                  key={art.id}
                  artist={art}
                  onClick={(a) => showToast('Artist Profile', a.name, 'default')}
                />
              ))}
            </div>
          </Card>

          {/* 10. TrackRow */}
          <Card>
            <h3 style={{ marginBottom: 16 }}>10. TrackRow Primitive</h3>
            <div className="nocturne-tracklist">
              {MOCK_TRACKS.slice(0, 3).map((track, i) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={i}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={status === 'playing'}
                  onPlay={(t) => playTrack(t, MOCK_TRACKS)}
                />
              ))}
            </div>
          </Card>

          {/* 11. PlaylistCard */}
          <Card>
            <h3 style={{ marginBottom: 16 }}>11. PlaylistCard Primitive</h3>
            <div className="nocturne-grid-albums">
              {MOCK_PLAYLISTS.slice(0, 3).map((pl) => (
                <PlaylistCard
                  key={pl.id}
                  playlist={pl}
                  onPlay={(p) => showToast('Streaming Playlist', p.title, 'atmosphere')}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SECTION 3: Feedback, Layout, & Data Primitives */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* 12. Card */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>12. Card Primitive</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              <Card variant="flat">
                <strong>Flat Card</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: 4 }}>
                  Subtle border for muted surfaces
                </p>
              </Card>
              <Card variant="elevated">
                <strong>Elevated Card</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: 4 }}>
                  High contrast with deep ambient shadow
                </p>
              </Card>
              <Card interactive onClick={() => showToast('Card Clicked', 'Interactive hover response', 'default')}>
                <strong>Interactive Card</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: 4 }}>
                  Hover to observe elevation & border glow
                </p>
              </Card>
            </div>
          </Card>

          {/* 13. Avatar */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>13. Avatar Primitive</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Avatar name="Small" size="sm" />
              <Avatar name="Medium" size="md" />
              <Avatar
                name="Vespera"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                size="lg"
                ring
              />
              <Avatar
                name="Gothic Void"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                size="xl"
                ring
              />
            </div>
          </Card>

          {/* 14. Toast */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>14. Toast Primitive</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => showToast('Sanctuary Synced', 'Audio catalog synchronized.', 'default')}
              >
                Default Toast
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => showToast('Sacrament Recorded', 'Track preserved in favorites.', 'success')}
              >
                Success Toast
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => showToast('Void Turbulence', 'Audio buffer underrun detected.', 'error')}
              >
                Error Toast
              </Button>
              <Button
                variant="gothic"
                size="sm"
                onClick={() => showToast('The Witching Hour Arrives', 'Late-night atmospheric filters engaged.', 'atmosphere')}
              >
                Atmospheric Glow Toast
              </Button>
            </div>
          </Card>

          {/* 15. Skeleton */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>15. Skeleton Primitive</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 450 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Skeleton width={48} height={48} variant="circle" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton height={16} width="65%" />
                  <Skeleton height={12} width="40%" />
                </div>
              </div>
              <Skeleton height={110} variant="rounded" />
            </div>
          </Card>

          {/* 16. EmptyState */}
          <Card>
            <h3 style={{ marginBottom: 12 }}>16. EmptyState Primitive</h3>
            <EmptyState
              title="Nothing Dwells in This Crypt"
              description="No saved tracks or recorded nocturnal broadcasts exist in this collection."
              icon={<HelpCircle size={28} />}
              action={<Button variant="secondary">Browse The Sanctum</Button>}
            />
          </Card>
        </div>
      )}
    </div>
  );
};
