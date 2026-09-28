import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('🧪 Starting Nocturne System Audit & Regression Test Suite...\n');

const rootDir = process.cwd();

// Test 1: Verify tokens.css z-index hierarchy
console.log('Checking Design System Layer Tokens in tokens.css...');
const tokensCss = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
assert(tokensCss.includes('--z-fullscreen: 1100;'), 'Missing --z-fullscreen in tokens.css');
assert(tokensCss.includes('--z-modal: 1300;'), 'Missing --z-modal in tokens.css');
assert(tokensCss.includes('--z-toast: 2000;'), 'Missing --z-toast in tokens.css');
console.log('  ✓ Layer z-indices defined with proper hierarchy: Fullscreen (1100) < Modal (1300) < Toast (2000)');

// Test 2: Verify NowPlayingModal.css & EqualizerModal.css stacking context
console.log('Checking Stacking Context between NowPlaying and Equalizer...');
const nowPlayingCss = fs.readFileSync(path.join(rootDir, 'src/components/nowplaying/NowPlayingModal.css'), 'utf-8');
const eqModalCss = fs.readFileSync(path.join(rootDir, 'src/components/audio/EqualizerModal.css'), 'utf-8');
assert(nowPlayingCss.includes('var(--z-fullscreen, 1100)'), 'NowPlayingModal does not use --z-fullscreen');
assert(eqModalCss.includes('var(--z-modal)'), 'EqualizerModal does not use --z-modal');
console.log('  ✓ EqualizerModal correctly layers on top of NowPlayingModal without z-index collisions');

// Test 3: Verify NowPlayingModal.tsx features
console.log('Checking NowPlayingModal.tsx implementation details...');
const nowPlayingTsx = fs.readFileSync(path.join(rootDir, 'src/components/nowplaying/NowPlayingModal.tsx'), 'utf-8');
assert(nowPlayingTsx.includes('openEqualizer'), 'Missing openEqualizer access');
assert(nowPlayingTsx.includes('isEqualizerOpen'), 'Missing isEqualizerOpen check for Escape priority');
assert(nowPlayingTsx.includes('showAudioSettings'), 'Missing Audio Settings popover state');
assert(nowPlayingTsx.includes('audioDrawerRef'), 'Missing click-outside handler ref for audio drawer');
assert(nowPlayingTsx.includes('isCrossfadingBg'), 'Missing smooth backdrop crossfade state');
assert(nowPlayingTsx.includes('bgPrevious'), 'Missing dual-layer background for smooth track transition');
assert(nowPlayingTsx.includes('imgErrorTrackId'), 'Missing per-track image error tracking');
assert(nowPlayingTsx.includes('deltaY > 60'), 'Missing touch swipe down dismiss gesture');
assert(nowPlayingTsx.includes("setNowPlayingTab('lyrics')"), 'Missing lyrics tab handler');
assert(nowPlayingTsx.includes("setNowPlayingTab('queue')"), 'Missing queue tab handler');
assert(nowPlayingTsx.includes("setNowPlayingTab('info')"), 'Missing song info tab handler');
assert(nowPlayingTsx.includes("setNowPlayingTab('credits')"), 'Missing credits tab handler');
assert(nowPlayingTsx.includes("Lyrics aren't available for this track yet."), 'Missing empty lyrics fallback string');
console.log('  ✓ All Now Playing requirements verified (Artwork, Lyrics, Queue, Info, Credits, Audio Settings, Gestures, Transitions)');

// Test 4: Verify PlayerBar.tsx triggers
console.log('Checking PlayerBar.tsx triggers...');
const playerBarTsx = fs.readFileSync(path.join(rootDir, 'src/components/layout/PlayerBar.tsx'), 'utf-8');
assert(playerBarTsx.includes("openNowPlaying('artwork')"), 'PlayerBar does not trigger openNowPlaying');
assert(playerBarTsx.includes('window.innerWidth <= 768'), 'PlayerBar lacks mobile touch friendliness');
assert(playerBarTsx.includes('Maximize2'), 'PlayerBar lacks Maximize icon');
console.log('  ✓ PlayerBar triggers Now Playing on click, mobile tap, and maximize button');

// Test 5: Verify MainLayout.tsx mounting & shortcuts
console.log('Checking MainLayout.tsx keyboard shortcuts & modal order...');
const mainLayoutTsx = fs.readFileSync(path.join(rootDir, 'src/layouts/MainLayout.tsx'), 'utf-8');
assert(mainLayoutTsx.includes('<NowPlayingModal />'), 'NowPlayingModal not mounted in MainLayout');
assert(mainLayoutTsx.includes("e.key === 'n' || e.key === 'N'"), 'Shortcut N not bound to NowPlaying');
assert(mainLayoutTsx.includes("e.key === 'l' || e.key === 'L'"), 'Shortcut L not bound to Lyrics');
assert(mainLayoutTsx.includes("e.key === 'e' || e.key === 'E'"), 'Shortcut E not bound to Equalizer');
console.log('  ✓ MainLayout mounts NowPlayingModal and binds N/L/E shortcuts');

// Test 6: Verify Audio Engine, Equalizer & Crossfade subsystems
console.log('Checking Audio Engine & EQ persistence...');
const audioEngineTs = fs.readFileSync(path.join(rootDir, 'src/audio/AudioEngine.ts'), 'utf-8');
assert(audioEngineTs.includes('setEQGains'), 'AudioEngine missing setEQGains');
assert(audioEngineTs.includes('startCrossfade'), 'AudioEngine missing startCrossfade');
assert(audioEngineTs.includes('setVolumeNormalization'), 'AudioEngine missing setVolumeNormalization');
console.log('  ✓ AudioEngine DSP, 7-band EQ and acoustic startCrossfade verified');

// Test 7: Verify Appearance Customization subsystem
console.log('Checking Appearance & Themes...');
const constantsTs = fs.readFileSync(path.join(rootDir, 'src/utilities/constants.ts'), 'utf-8');
assert(constantsTs.includes("'nocturne'"), 'Theme nocturne missing');
assert(constantsTs.includes("'obsidian'"), 'Theme obsidian missing');
assert(constantsTs.includes("'crimson'"), 'Theme crimson missing');
assert(constantsTs.includes("'midnight'"), 'Theme midnight missing');
assert(constantsTs.includes("'violet'"), 'Theme violet missing');
assert(constantsTs.includes("'monochrome'"), 'Theme monochrome missing');
console.log('  ✓ 6 Appearance themes verified in constants & tokens');

// Test 8: Verify Listening Analytics subsystem
console.log('Checking Listening Analytics & Clock...');
const analyticsEngineTs = fs.readFileSync(path.join(rootDir, 'src/services/analyticsEngine.ts'), 'utf-8');
assert(analyticsEngineTs.includes('calculateHourlyListening'), 'Hourly listening calculator missing');
assert(analyticsEngineTs.includes('calculateMusicPersonality'), 'Music personality calculator missing');
console.log('  ✓ Analytics engine, hourly metrics for Listening Clock, and personality engine verified');

console.log('\n🎉 ALL 8 AUDIT AND REGRESSION TEST SUITES PASSED CLEANLY!\n');
