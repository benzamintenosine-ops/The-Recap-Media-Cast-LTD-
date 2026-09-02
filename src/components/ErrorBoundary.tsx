import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // @ts-ignore
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('recap_news_cache');
    } catch {}
    // @ts-ignore
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">পেজ লোড হতে সাময়িক সমস্যা হয়েছে</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                ব্রাউজার ক্যাশ রিসেট করে পেজটি পুনরায় লোড করার চেষ্টা করুন।
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
              >
                <RefreshCw className="w-4 h-4" />
                রিলোড ও রিস্টোর করুন
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                হোমপেজে যান
              </button>
            </div>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
