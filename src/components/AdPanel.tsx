import React, { useState, useEffect } from 'react';
import { ExternalLink, Tag, ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';
import { AdBanner, SiteSettings } from '../types';

interface AdPanelProps {
  ad?: AdBanner;
  ads?: AdBanner[];
  siteSettings?: SiteSettings;
  placement: 'header_top' | 'sidebar' | 'in_article';
}

export const AdPanel: React.FC<AdPanelProps> = ({ ad, ads, siteSettings, placement }) => {
  // Determine source of ads
  let candidateAds: AdBanner[] = [];
  if (ads && ads.length > 0) {
    candidateAds = ads;
  } else if (ad) {
    candidateAds = [ad];
  } else if (siteSettings && siteSettings.adBanners && siteSettings.adBanners.length > 0) {
    candidateAds = siteSettings.adBanners;
  }

  // Filter ads by placement & active status
  const activeAds = candidateAds.filter((a) => {
    if (!a) return false;
    const isActive = a.active ?? a.isActive ?? true;
    if (!isActive) return false;

    // Check placement matching
    if (placement === 'header_top') {
      return a.placement === 'header_top' || a.position === 'header';
    }
    if (placement === 'sidebar') {
      return a.placement === 'sidebar' || a.position === 'sidebar' || (!a.placement && !a.position);
    }
    if (placement === 'in_article') {
      return a.placement === 'in_article' || a.position === 'in_article';
    }
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index if ads change
  useEffect(() => {
    if (currentIndex >= activeAds.length) {
      setCurrentIndex(0);
    }
  }, [activeAds.length, currentIndex]);

  // Auto-slide right to left every 4 seconds
  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeAds.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeAds.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeAds.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  };

  // Render Placeholder when no ads exist for this placement
  if (activeAds.length === 0) {
    if (placement === 'header_top') {
      return (
        <div className="max-w-7xl mx-auto my-3">
          <div className="w-full h-16 sm:h-24 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex items-center justify-between px-6 text-slate-500 dark:text-gray-400 text-xs shadow-sm">
            <div className="flex items-center gap-2.5 font-medium">
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800/50 uppercase tracking-wider flex items-center gap-1">
                <Megaphone className="w-3 h-3 text-amber-600 dark:text-amber-400" /> WIDGET 1 (HEADER TOP)
              </span>
              <span className="hidden sm:inline font-sans text-xs text-slate-600 dark:text-slate-300">
                বিজ্ঞাপন দিন • The Recap Media Cast LTD ডিজিটাল ব্যানার স্পেস
              </span>
            </div>
            <a
              href="mailto:news@therecapmedia.com"
              className="text-red-600 dark:text-red-400 font-bold hover:underline uppercase text-[11px] tracking-wider"
            >
              বিজ্ঞাপন দিন &rarr;
            </a>
          </div>
        </div>
      );
    }

    if (placement === 'sidebar') {
      return (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 shadow-sm">
          <div className="flex items-center justify-center gap-1.5">
            <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              WIDGET 2: SIDEBAR AD
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
            আপনার ব্র্যান্ডের প্রচার পৌঁছাক লাখো পাঠকের কাছে।
          </p>
          <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800/80 rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs font-mono p-4 border border-slate-200 dark:border-slate-700/50">
            <Megaphone className="w-6 h-6 text-slate-400 mb-1" />
            <span>300x250 Banner Area</span>
            <span className="text-[10px] text-slate-500 mt-1">Sidebar Ad Widget</span>
          </div>
        </div>
      );
    }

    return (
      <div className="my-6 p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-700 dark:text-gray-200">
            স্পন্সর বিজ্ঞাপন স্পেস (In-Article Sponsor Area)
          </span>
        </div>
        <a
          href="mailto:news@therecapmedia.com"
          className="px-3.5 py-1.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors uppercase text-[11px]"
        >
          বিজ্ঞাপন দিন
        </a>
      </div>
    );
  }

  const currentAd = activeAds[currentIndex] || activeAds[0];

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all hover:shadow-lg relative group ${
      placement === 'header_top' ? 'max-w-7xl mx-auto my-4' : 'my-4'
    }`}>
      <div className="relative w-full overflow-hidden">
        {/* Ad Image & Content */}
        <a
          href={currentAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative overflow-hidden group"
        >
          <img
            key={currentAd.id}
            src={currentAd.imageUrl}
            alt={currentAd.title}
            referrerPolicy="no-referrer"
            className={`w-full object-cover transition-all duration-500 ease-in-out transform group-hover:scale-[1.01] ${
              placement === 'header_top' 
                ? 'h-28 sm:h-36 md:h-44' 
                : placement === 'sidebar' 
                ? 'h-48 sm:h-56' 
                : 'h-36 sm:h-48'
            }`}
          />
          <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow flex items-center gap-1 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>AD • {currentAd.sponsorName || 'SPONSOR'}</span>
          </div>
          
          <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg hover:bg-red-600 transition-colors border border-white/10">
            <span>{currentAd.title}</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </a>

        {/* Left & Right Interactive Navigation Controls for Multiple Ads */}
        {activeAds.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-red-600 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm shadow z-10"
              title="পূর্ববর্তী বিজ্ঞাপন (Previous Ad)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-red-600 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm shadow z-10"
              title="পরবর্তী বিজ্ঞাপন (Next Ad)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              {activeAds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-red-500 w-4' : 'bg-white/60 hover:bg-white w-2'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
