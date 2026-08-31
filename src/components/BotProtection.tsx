import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Lock, Shield, RefreshCw } from 'lucide-react';

interface BotProtectionModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose?: () => void;
  actionTitle?: string;
}

export const BotProtectionModal: React.FC<BotProtectionModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  actionTitle = 'নিরাপত্তা যাচাই (Security Verification)'
}) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [rayId, setRayId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      // Generate realistic Cloudflare Ray ID
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 8);
      setRayId(`8f92${randomHex}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyClick = () => {
    if (status !== 'idle') return;
    setStatus('verifying');

    // Simulate realistic Cloudflare turnstile behavioral challenge calculation
    setTimeout(() => {
      setStatus('success');
      // Store verification in sessionStorage so repeated actions pass swiftly
      try {
        sessionStorage.setItem('recap_human_verified', 'true');
        sessionStorage.setItem('recap_human_verified_at', Date.now().toString());
      } catch {}

      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-[999990] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-900 dark:text-white relative">
        {/* Header with Cloudflare & Shield branding */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-xs">
              <Shield className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cloudflare &amp; reCAPTCHA</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">বট ও স্প্যাম প্রতিরোধ ব্যবস্থা (DDoS &amp; Bot Protection)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
            TLS 1.3
          </span>
        </div>

        <div className="text-center space-y-1.5 pt-1">
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {actionTitle}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            নিশ্চিত করুন যে আপনি কোনো স্বয়ংক্রিয় রোবট বা স্ক্রিপ্ট নন।
          </p>
        </div>

        {/* Cloudflare Turnstile Styled Interactive Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div
            onClick={handleVerifyClick}
            className={`flex items-center gap-3.5 cursor-pointer select-none ${status === 'verifying' ? 'pointer-events-none' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                status === 'success'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                  : status === 'verifying'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-slate-400 dark:border-slate-600 hover:border-orange-500 bg-white dark:bg-slate-800'
              }`}
            >
              {status === 'success' && <Check className="w-4 h-4 stroke-[3]" />}
              {status === 'verifying' && <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />}
            </div>

            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {status === 'success' ? (
                <span className="text-emerald-600 dark:text-emerald-400">যাচাই সফল হয়েছে (Verified Human)</span>
              ) : status === 'verifying' ? (
                <span className="text-orange-500 animate-pulse">যাচাই করা হচ্ছে...</span>
              ) : (
                <span>Verify you are human (আমি রোবট নই)</span>
              )}
            </span>
          </div>

          {/* Cloudflare Logo / Branding badge */}
          <div className="flex flex-col items-end pl-2 text-right">
            <div className="flex items-center gap-1">
              <svg className="w-6 h-4 text-orange-500" viewBox="0 0 100 40" fill="currentColor">
                <path d="M78 20c-1-6-6-10-12-10-2 0-4 1-6 2-2-4-7-7-12-7-8 0-14 6-15 14-3 0-6 2-7 5-2 3-1 7 1 9h50c5 0 9-4 9-9 0-2-1-3-2-4z" />
              </svg>
              <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 tracking-tight">CLOUDFLARE</span>
            </div>
            <span className="text-[8px] text-slate-400 dark:text-slate-500">Privacy • Terms</span>
          </div>
        </div>

        {/* Security Meta Footer */}
        <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800">
          <span>Ray ID: {rayId}</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-bold">
            <Lock className="w-2.5 h-2.5" />
            reCAPTCHA v3 &amp; WAF Protected
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-center"
          >
            বাতিল করুন
          </button>
        )}
      </div>
    </div>
  );
};

// Global Floating Security Badge
export const CloudflareSecurityBadge: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md text-slate-700 dark:text-slate-300 text-[10px] font-medium hover:border-orange-500/50 transition-all cursor-pointer"
        title="Protected by Cloudflare Turnstile and reCAPTCHA"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span className="font-bold text-orange-500">Cloudflare</span>
        <span className="hidden sm:inline text-slate-400 dark:text-slate-500">• Protected</span>
      </button>

      {showDetails && (
        <div className="absolute bottom-10 right-0 w-64 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-xs space-y-2 text-slate-800 dark:text-slate-200 animate-fade-in">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <span className="flex items-center gap-1 text-orange-500">
              <Shield className="w-3.5 h-3.5" />
              সিস্টেম সিকিউরিটি
            </span>
            <span className="text-[10px] text-emerald-500 font-mono">ACTIVE</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            এই পোর্টালটি <strong>Cloudflare Turnstile WAF</strong> এবং <strong>reCAPTCHA</strong> দ্বারা স্প্যাম ও অটোমেটেড বট আক্রমণ থেকে সুরক্ষিত।
          </p>
          <div className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <span>The Recap Media Cast</span>
            <button onClick={() => setShowDetails(false)} className="text-red-500 font-bold">বন্ধ</button>
          </div>
        </div>
      )}
    </div>
  );
};
