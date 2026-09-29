import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Trash2 } from 'lucide-react';
import { Button } from './Button';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[NocturneErrorBoundary] Uncaught sanctuary disturbance:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = (): void => {
    this.handleReset();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private handleClearCorruptedStorage = (): void => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="nocturne-error-boundary" role="alert">
          <div className="nocturne-error-boundary__card">
            <div className="nocturne-error-boundary__icon-wrap">
              <AlertTriangle size={32} className="nocturne-error-boundary__icon" />
            </div>

            <h2 className="nocturne-error-boundary__title">
              {this.props.fallbackTitle || 'A Shadow Fell Upon This Chamber'}
            </h2>

            <p className="nocturne-error-boundary__desc">
              {this.props.fallbackDescription ||
                'An acoustic disturbance interrupted this chamber’s resonance. The sanctuary remains standing.'}
            </p>

            {this.state.error?.message && (
              <div className="nocturne-error-boundary__details">
                <code>{this.state.error.message}</code>
              </div>
            )}

            <div className="nocturne-error-boundary__actions">
              <Button
                variant="primary"
                size="md"
                leftIcon={<RefreshCw size={15} />}
                onClick={this.handleReset}
              >
                Restore Chamber
              </Button>

              <Button
                variant="secondary"
                size="md"
                leftIcon={<Home size={15} />}
                onClick={this.handleGoHome}
              >
                Return to Sanctum
              </Button>

              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 size={13} />}
                onClick={this.handleClearCorruptedStorage}
                title="Clears corrupted local cache and reloads application"
              >
                Purge Cache & Reload
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
