import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
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

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL UNCAUGHT FORENSIC ERROR:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetStorageAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Storage access blocked or restricted
    }
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050000] text-red-100 flex items-center justify-center p-4 font-mono select-none">
          <div className="max-w-2xl w-full glass-panel-crimson border-2 border-red-600/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(220,38,38,0.5)]">
            
            <div className="flex items-center gap-3 border-b border-red-900/80 pb-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-500 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                <ShieldAlert className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] text-red-500 font-bold tracking-widest uppercase">
                  C.I.B. RECONSTRUCTION RECOVERY PROTOCOL
                </div>
                <h1 className="text-xl sm:text-2xl font-creepster font-extrabold text-white tracking-wide">
                  SYSTEM ANOMALY RECOVERED
                </h1>
              </div>
            </div>

            <div className="bg-black/80 border border-red-900/80 rounded-xl p-4 mb-6 text-xs text-red-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>DIAGNOSTIC MATRIX EXCEPTION:</span>
              </div>
              <p className="font-mono text-[12px] text-red-200 break-words bg-red-950/40 p-2.5 rounded border border-red-900/50">
                {this.state.error?.message || 'Unexpected UI thread termination.'}
              </p>
              {this.state.error?.stack && (
                <pre className="text-[10px] text-red-400/60 max-h-32 overflow-y-auto whitespace-pre-wrap bg-black/60 p-2 rounded">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              The application prevented a complete system black screen. You can clear corrupted cached local credentials or reload the forensic mainframe.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={this.handleResetStorageAndReload}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>PURGE CACHE & ENTER MAIN</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-800/80 text-red-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>RELOAD PROTOCOL</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
