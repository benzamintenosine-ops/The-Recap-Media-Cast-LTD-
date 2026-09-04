import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, RefreshCw, Smartphone, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AdBlockerDetectorProps {
  onStatusChange?: (detected: boolean) => void;
}

export const AdBlockerDetector: React.FC<AdBlockerDetectorProps> = ({ onStatusChange }) => {
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);

  const isDismissed = () => {
    try {
      return sessionStorage.getItem('recap_adblock_dismissed') === 'true';
    } catch {
      return false;
    }
  };

  const runAdBlockCheck = useCallback(async () => {
    if (isDismissed()) return;

    setIsChecking(true);
    let detected = false;

    try {
      // Create a test ad element with realistic dimensions
      const bait = document.createElement('div');
      bait.setAttribute('class', 'adsbox ad-placement pub_300x250 pub_728x90 text-ad textAd text_ad ad-banner google-ad');
      bait.setAttribute('id', 'ad-detector-probe');
      bait.style.position = 'absolute';
      bait.style.top = '-9999px';
      bait.style.left = '-9999px';
      bait.style.width = '100px';
      bait.style.height = '100px';
      bait.style.display = 'block';
      bait.innerHTML = '&nbsp;';
      document.body.appendChild(bait);

      // Brief delay for DOM & ad blocker CSS injection
      await new Promise(r => setTimeout(r, 120));

      const styles = window.getComputedStyle(bait);
      // Ad blockers like uBlock/Adblock inject display: none !important or visibility: hidden
      if (styles.display === 'none' || styles.visibility === 'hidden') {
        detected = true;
      }

      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    } catch {
      detected = false;
    }

    setIsChecking(false);
    if (!isDismissed()) {
      setIsAdBlockerDetected(detected || testMode);
      if (onStatusChange) {
        onStatusChange(detected || testMode);
      }
    }
  }, [testMode, onStatusChange]);

  useEffect(() => {
    if (isDismissed()) return;

    const timer = setTimeout(() => {
      runAdBlockCheck();
    }, 1500);

    return () => clearTimeout(timer);
  }, [runAdBlockCheck]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('recap_adblock_dismissed', 'true');
    } catch {}
    setIsAdBlockerDetected(false);
    if (onStatusChange) onStatusChange(false);
  };

  // Handle manual retry
  const handleRecheck = () => {
    setTestMode(false);
    runAdBlockCheck();
  };

  // Expose global window test trigger for developer/admin preview
  useEffect(() => {
    (window as any).toggleAdBlockerPreview = (active?: boolean) => {
      setTestMode(prev => (typeof active === 'boolean' ? active : !prev));
      setIsAdBlockerDetected(prev => (typeof active === 'boolean' ? active : !prev));
    };
  }, []);

  if ((!isAdBlockerDetected && !testMode) || isDismissed()) {
    return null;
  }

  return (
    <div
      id="adblocker-overlay-modal"
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in select-none"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      <div className="max-w-lg w-full bg-slate-900/95 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/60 text-center space-y-6 text-white relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="w-20 h-20 bg-red-600/20 border-2 border-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/30 animate-pulse">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        {/* Primary Required Header & Subheading */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-red-500 tracking-wider uppercase drop-shadow-md">
            AD BLOCKER DETECTED
          </h2>
          <p className="text-base sm:text-lg font-bold text-amber-400">
            Please switch off private DNS from your device setting
          </p>
        </div>

        {/* Bengali Informational Guidelines */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 text-left space-y-2.5 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-white text-xs uppercase tracking-wider pb-1 border-b border-slate-800">
            <Smartphone className="w-4 h-4 text-red-400" />
            কীভাবে প্রাইভেট ডিএনএস বা অ্যাডব্লকার বন্ধ করবেন:
          </div>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span><strong>Android ফোনে:</strong> Settings &gt; Network &amp; Internet (বা Connections) &gt; <strong>Private DNS</strong> অপশনে গিয়ে <strong>Off</strong> বা <strong>Automatic</strong> সিলেক্ট করুন।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span><strong>iPhone / Safari তে:</strong> Settings &gt; Safari &gt; Extensions/Content Blockers সাময়িকভাবে বন্ধ করুন।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span><strong>ব্রাউজার এক্সটেনশন:</strong> আপনার অ্যাডব্লকার এক্সটেনশনে গিয়ে এই সাইটের জন্য নিষ্ক্রিয় (Whitelist) করুন।</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleRecheck}
            disabled={isChecking}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-700/40 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'যাচাই করা হচ্ছে...' : 'বন্ধ করেছি, পুনরায় যাচাই করুন (Check Again)'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>পেজ রিলোড</span>
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>চালিয়ে যান (Continue)</span>
            </button>
          </div>
        </div>

        {/* Small Notice */}
        <p className="text-[11px] text-slate-500">
          আমাদের পোর্টালের সার্বক্ষণিক ও নির্ভুল সংবাদ সেবা পাঠকদের জন্য সম্পূর্ণ উন্মুক্ত রাখতে সহায়তার জন্য ধন্যবাদ।
        </p>
      </div>
    </div>
  );
};
