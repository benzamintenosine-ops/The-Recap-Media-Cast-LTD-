import React, { useState, useEffect } from 'react';
import { ExternalLink, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdBanner } from '../types';

interface AdPanelProps {
  ad?: AdBanner;
  ads?: AdBanner[];
  placement: 'header_top' | 'sidebar' | 'in_article';
}

export const AdPanel: React.FC<AdPanelProps> = ({ ad, ads = [], placement }) => {
  // Combine single ad or ads array
  const activeAds = (ads && ads.length > 0 ? ads : ad ? [ad] : []).filter(
    (a) => a && (a.isActive ?? a.active ?? true)
  );

  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (activeAds.length === 0) {
    if (placement === 'header_top') {
      return (
        <div className="max-w-7xl mx-auto px-4 my-3">
          <div className="w-full h-16 sm:h-24 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex items-center justify-between px-6 text-slate-500 dark:text-gray-400 text-xs shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800/50 uppercase tracking-widest">
                WIDGET 1: HEADER AD
              </span>
              <span className="hidden sm:inline font-mono">THE RECAP MEDIA CAST - DIGITAL AD SPACE</span>
            </div>
            <button className="text-red-600 dark:text-red-400 font-bold hover:underline uppercase text-[11px] tracking-wider">
              বিজ্ঞাপন দিন &rarr;
            </button>
          </div>
        </div>
      );
    }

    if (placement === 'sidebar') {
      return (
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2 shadow-sm">
          <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            WIDGET 2: SIDEBAR AD SPACE
          </span>
          <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
            আপনার ব্র্যান্ডের প্রচার পৌঁছাক লাখো পাঠকের কাছে।
          </p>
          <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 text-xs font-mono">
            300x250 Banner Area
          </div>
        </div>
      );
    }

    return (
      <div className="my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-700 dark:text-gray-200">
            বিজ্ঞাপন স্পেস (In-Article Sponsor Area)
          </span>
        </div>
        <button className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors uppercase text-[11px]">
          বিস্তারিত দেখুন
        </button>
      </div>
    );
  }

  const currentAd = activeAds[currentIndex];

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md relative group">
      <div className="relative w-full overflow-hidden">
        {/* Ad Image & Content */}
        <a
          href={currentAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative overflow-hidden"
        >
          <img
            key={currentAd.id}
            src={currentAd.imageUrl}
            alt={currentAd.title}
            referrerPolicy="no-referrer"
            className="w-full object-cover max-h-48 sm:max-h-56 transition-all duration-500 ease-in-out transform scale-100 group-hover:scale-[1.01]"
          />
          <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
            AD • {currentAd.sponsorName || 'Sponsor'}
          </div>
          <div className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow hover:bg-red-600 transition-colors">
            {currentAd.title} <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Left & Right Interactive Navigation Controls for Visitors */}
        {activeAds.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-red-600 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm shadow z-10"
              title="পূর্ববর্তী বিজ্ঞাপন (Previous Ad)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-red-600 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 backdrop-blur-sm shadow z-10"
              title="পরবর্তী বিজ্ঞাপন (Next Ad)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-900/50 backdrop-blur-sm px-2 py-1 rounded-full">
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
