import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

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
    console.error('ROHIT ONE ErrorBoundary caught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('rohit_one_files');
      localStorage.removeItem('rohit_one_settings');
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-xl shadow-indigo-500/30 mb-4">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <span className="font-black text-xl bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                R1
              </span>
            </div>
          </div>

          <h1 className="text-xl font-black text-white mb-1">ROHIT ONE</h1>
          <p className="text-xs text-rose-400 font-semibold mb-4 flex items-center gap-1.5 justify-center">
            <AlertTriangle className="w-4 h-4" />
            <span>एप्लिकेशन सुरक्षित मोड में रुका / App paused in safe mode</span>
          </p>

          <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
            एप्लिकेशन लोड होने में समस्या आई। नीचे दिए गए बटन से पुनः लोड करें या सुरक्षित रीसेट करें।
            <br />
            An issue occurred while loading. Tap reload or reset application cache.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs mb-6">
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>पुनः लोड करें / Reload App</span>
            </button>

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>कैश साफ़ करें / Reset Cache</span>
            </button>
          </div>

          {/* Collapsible Error Details */}
          {this.state.error && (
            <div className="w-full max-w-md text-left p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[10px] font-mono text-zinc-500 overflow-x-auto">
              <span className="text-zinc-300 font-bold block mb-1">Technical Diagnostics:</span>
              <p className="text-rose-400">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
