import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearAndReload = () => {
    try {
      localStorage.removeItem('kare_student_token');
      localStorage.removeItem('kare_student_user');
      localStorage.removeItem('kare_admin_token');
      localStorage.removeItem('kare_admin_user');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {this.props.fallbackTitle || 'Display Interruption Recovered'}
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                An unexpected interface issue occurred. Your account data is securely stored. You can quickly refresh to restore the portal.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-left">
                <span className="text-[10px] text-slate-500 font-mono block mb-1">Details:</span>
                <p className="text-xs text-amber-300 font-mono break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Resuming Portal</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleClearAndReload}
                className="text-[11px] text-slate-500 hover:text-slate-400 underline pt-1 cursor-pointer"
              >
                Clear local session cache and restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
