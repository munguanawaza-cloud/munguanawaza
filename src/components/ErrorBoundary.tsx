import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  retryLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  isPermissionError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    isPermissionError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const msg = error?.message ?? '';
    const isPermissionError =
      msg.includes('Missing or insufficient permissions') ||
      msg.includes('permission-denied') ||
      msg.includes('"operationType"');
    return {
      hasError: true,
      isPermissionError,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error.message, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, isPermissionError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="bg-[#0A0A0A] py-12 border-t border-white/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-3xl border border-[#D4AF37]/30 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#111111]">
                <AlertTriangle className="h-6 w-6 text-[#D4AF37]" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-white">
                {this.props.fallbackTitle ?? 'Operations Workspace Temporarily Unavailable'}
              </h3>
              <p className="mt-2 text-sm text-neutral-300">
                {this.state.isPermissionError
                  ? this.props.fallbackMessage ??
                    'Your current account permissions or session state could not access this Firestore operation.'
                  : this.props.fallbackMessage ??
                    'An unexpected operational error occurred while syncing live data.'}
              </p>
              <button
                type="button"
                onClick={this.handleRetry}
                className="gold-outline-pill mt-6 inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>{this.props.retryLabel ?? 'Retry'}</span>
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
