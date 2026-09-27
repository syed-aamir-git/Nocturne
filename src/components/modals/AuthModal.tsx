import React from 'react';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { useSpotify } from '../../state/SpotifyContext';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { isConnected, isConnecting, userProfile, connect, connectDemo, disconnect } = useSpotify();

  const handleContinueWithSpotify = async () => {
    onClose();
    await connect();
  };

  const handleDemo = () => {
    connectDemo();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isConnected ? 'Sanctuary Identity' : 'Sanctuary Authentication'}
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center', padding: '8px 0' }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: isConnected ? 'rgba(52, 211, 153, 0.12)' : 'rgba(157, 114, 255, 0.12)',
            border: `1px solid ${isConnected ? 'rgba(52, 211, 153, 0.3)' : 'var(--accent-primary)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <Radio size={28} color={isConnected ? 'var(--indicator-success)' : 'var(--accent-primary)'} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.45rem', margin: '0 0 6px 0', color: 'var(--text-pure)' }}>
            {isConnected ? `Connected as ${userProfile?.name}` : 'Continue to Nocturne'}
          </h2>
          <p style={{ color: 'var(--text-medium)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
            {isConnected
              ? 'Your Spotify account is linked to Nocturne. Playlists and references can be synchronized seamlessly.'
              : 'Link your Spotify account to import playlists, preserve sequence structures, and calibrate your nocturnal recommendations.'}
          </p>
        </div>

        {!isConnected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Primary Continue with Spotify Button */}
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Radio size={18} />}
              onClick={handleContinueWithSpotify}
              disabled={isConnecting}
              style={{
                width: '100%',
                justifyContent: 'center',
                background: '#1db954',
                borderColor: '#1ed760',
                color: '#08080a',
                fontWeight: 700,
              }}
            >
              {isConnecting ? 'Authorizing with Spotify...' : 'Continue with Spotify'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<Sparkles size={16} />}
              onClick={handleDemo}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Enter Sandbox / Demo Account
            </Button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'center',
                marginTop: 6,
                fontSize: '11px',
                color: 'var(--text-low)',
              }}
            >
              <ShieldCheck size={14} color="var(--indicator-success)" />
              <span>Standard Spotify OAuth 2.0 PKCE • No audio files transferred</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
                color: 'var(--text-medium)',
              }}
            >
              Active Provider: <strong>Spotify OAuth 2.0</strong>
              <br />
              Email: {userProfile?.email || 'Authenticated'}
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                disconnect();
                onClose();
              }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Disconnect Spotify
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
