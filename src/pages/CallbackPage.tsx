import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Radio, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { spotifyAuth } from '../services/spotify/spotifyAuth';
import { useToast } from '../state/ToastContext';
import { Button } from '../components/primitives/Button';
import { Card } from '../components/primitives/Card';

export const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        if (!isCancelled) {
          setStatus('error');
          if (errorParam === 'access_denied') {
            setErrorMessage('Spotify connection was cancelled. No changes were made to your Nocturne account.');
          } else {
            setErrorMessage(`Spotify authentication failed: ${errorParam}`);
          }
        }
        return;
      }

      if (!code || !state) {
        if (!isCancelled) {
          setStatus('error');
          setErrorMessage('Missing authorization credentials in redirect URL.');
        }
        return;
      }

      spotifyAuth
        .handleCallback(code, state)
        .then((profile) => {
          if (!isCancelled) {
            setStatus('success');
            showToast(
              'Spotify Connected',
              `Welcome, ${profile.name}. Account linked to Nocturne Sanctuary.`,
              'atmosphere'
            );
            setTimeout(() => {
              navigate('/import', { replace: true });
            }, 800);
          }
        })
        .catch((err: any) => {
          if (!isCancelled) {
            setStatus('error');
            setErrorMessage(err.message || 'Failed to exchange authorization token with Spotify.');
          }
        });
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchParams, navigate, showToast]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        padding: 24,
      }}
    >
      <Card
        variant="elevated"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: 32,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {status === 'verifying' && (
          <>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(157, 114, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.8s infinite ease-in-out',
              }}
            >
              <Radio size={28} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 6px 0' }}>
                Verifying Handshake
              </h2>
              <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', margin: 0 }}>
                Authenticating with Spotify via PKCE OAuth 2.0. Securing session tokens...
              </p>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Radio size={28} color="var(--indicator-success)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 6px 0', color: 'var(--text-pure)' }}>
                Sanctuary Synchronized
              </h2>
              <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', margin: 0 }}>
                Entering Import Music chambers...
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={28} color="var(--indicator-error)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', margin: '0 0 8px 0', color: 'var(--text-pure)' }}>
                Authentication Aborted
              </h2>
              <p style={{ color: 'var(--text-medium)', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                {errorMessage}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Button
                variant="secondary"
                leftIcon={<ArrowLeft size={15} />}
                onClick={() => navigate('/import')}
              >
                Back to Import
              </Button>
              <Button
                variant="primary"
                leftIcon={<RefreshCw size={15} />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
