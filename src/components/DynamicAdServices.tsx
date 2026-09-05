import React, { useEffect, useRef } from 'react';
import { DynamicAdSettings } from '../types';

/**
 * Triggers Popunder Ad Script cleanly.
 * Specifically invoked when viewer clicks on news headline or cover image.
 */
export function triggerPopunder(scriptUrl?: string) {
  const url =
    scriptUrl ||
    'https://pl31159237.profitableratecpmnetwork.com/29/a8/67/29a8676045a7e37ef249372b2fa46d3c.js';

  if (!url || typeof window === 'undefined') return;

  try {
    // Remove previous instance if present to allow re-trigger on subsequent clicks
    const existingScript = document.getElementById('dynamic-popunder-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'dynamic-popunder-script';
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    script.onerror = () => {
      // Silently handle if blocked by client or network
      script.remove();
    };
    document.body.appendChild(script);
  } catch (err) {
    console.warn('Popunder trigger notice:', err);
  }
}

/**
 * Social Bar Ad Controller
 * Runs on viewer site, triggers every 45s (or user-configured interval)
 */
export const SocialBarController: React.FC<{
  settings?: DynamicAdSettings['socialBar'];
}> = ({ settings }) => {
  useEffect(() => {
    const isEnabled = settings?.enabled ?? true;
    if (!isEnabled) return;

    const scriptUrl =
      settings?.scriptUrl ||
      'https://pl31159238.profitableratecpmnetwork.com/27/65/fa/2765fa033dbdb8258da4afcb4fde947e.js';
    const intervalSec = Math.max(10, settings?.intervalSeconds || 45);

    const loadSocialBar = () => {
      try {
        const old = document.getElementById('dynamic-social-bar-script');
        if (old) {
          old.remove();
        }
        const script = document.createElement('script');
        script.id = 'dynamic-social-bar-script';
        script.type = 'text/javascript';
        script.src = scriptUrl;
        script.async = true;
        script.onerror = () => {
          script.remove();
        };
        document.body.appendChild(script);
      } catch (err) {
        console.warn('Social Bar load notice:', err);
      }
    };

    // Initial activation
    loadSocialBar();

    // Re-trigger every interval seconds
    const intervalTimer = setInterval(() => {
      loadSocialBar();
    }, intervalSec * 1000);

    return () => {
      clearInterval(intervalTimer);
      const old = document.getElementById('dynamic-social-bar-script');
      if (old) old.remove();
    };
  }, [settings?.enabled, settings?.scriptUrl, settings?.intervalSeconds]);

  return null;
};

/**
 * Native Banner Ad Component
 * Displays in Writer Panel & Managing Panel, but automatically hidden while creating/editing posts.
 */
interface NativeBannerAdProps {
  settings?: DynamicAdSettings['nativeBanner'];
  isPostWriting?: boolean;
  panelLabel?: string;
  className?: string;
}

export const NativeBannerAd: React.FC<NativeBannerAdProps> = ({
  settings,
  isPostWriting = false,
  panelLabel = 'প্যানেল',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false);

  const isEnabled = settings?.enabled ?? true;
  const hideDuringPost = settings?.hideDuringPostCreation ?? true;

  // If disabled globally or currently composing post, do not render
  if (!isEnabled) return null;
  if (isPostWriting && hideDuringPost) return null;

  const scriptUrl =
    settings?.scriptUrl ||
    'https://pl31159239.profitableratecpmnetwork.com/521fd3d07f58a510c8b2fa24d6fac606/invoke.js';
  const containerId =
    settings?.containerId || 'container-521fd3d07f58a510c8b2fa24d6fac606';
  const customWidth = settings?.width || '100%';
  const customMinHeight = settings?.minHeight || '90px';

  useEffect(() => {
    if (!containerRef.current || scriptInjectedRef.current) return;

    try {
      // Create and mount external ad invoke script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptUrl;
      script.onerror = () => {
        script.remove();
      };
      
      containerRef.current.appendChild(script);
      scriptInjectedRef.current = true;
    } catch (err) {
      console.warn('Native banner script inject notice:', err);
    }
  }, [scriptUrl, containerId]);

  return (
    <div
      className={`w-full overflow-hidden my-4 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          নেটিভ ব্যানার স্পন্সর • {panelLabel}
        </span>
        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
          NATIVE ADS
        </span>
      </div>

      <div
        ref={containerRef}
        id={containerId}
        style={{
          width: customWidth,
          minHeight: customMinHeight
        }}
        className="w-full overflow-hidden flex items-center justify-center rounded-xl bg-slate-50/60 dark:bg-slate-800/40 p-1"
      />
    </div>
  );
};
