import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Activity, RefreshCw, Eye } from 'lucide-react';

interface FooterStatsData {
  dailyReaders: number;
  dailyReporters: number;
  monthlyReaders: number;
  monthlyReporters: number;
  lastUpdated?: string;
}

export const FooterStats: React.FC = () => {
  const [stats, setStats] = useState<FooterStatsData>(() => {
    // Initial fallback with strict 1:4 ratio (reporters = readers / 4)
    const saved = localStorage.getItem('recap_footer_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.dailyReaders) {
          return {
            ...parsed,
            dailyReporters: Math.max(1, Math.round(parsed.dailyReaders / 4)),
            monthlyReporters: Math.max(1, Math.round(parsed.monthlyReaders / 4))
          };
        }
      } catch {}
    }
    const defaultDailyReaders = 4280;
    const defaultMonthlyReaders = 84200;
    return {
      dailyReaders: defaultDailyReaders,
      dailyReporters: Math.round(defaultDailyReaders / 4),
      monthlyReaders: defaultMonthlyReaders,
      monthlyReporters: Math.round(defaultMonthlyReaders / 4),
      lastUpdated: new Date().toISOString()
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/footer-stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const formatted: FooterStatsData = {
            dailyReaders: data.dailyReaders,
            dailyReporters: Math.max(1, Math.round(data.dailyReaders / 4)), // Strict 1/4 rule
            monthlyReaders: data.monthlyReaders,
            monthlyReporters: Math.max(1, Math.round(data.monthlyReaders / 4)), // Strict 1/4 rule
            lastUpdated: data.lastUpdated || new Date().toISOString()
          };
          setStats(formatted);
          localStorage.setItem('recap_footer_stats', JSON.stringify(formatted));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch footer stats:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto refresh every 30 minutes (30 * 60 * 1000 ms)
    const interval = setInterval(fetchStats, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/80 dark:bg-black/90 border-y border-slate-800 dark:border-white/10 py-6 px-4 sm:px-6 my-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              লাইভ পাঠকমহল ও সাংবাদিক নেটওয়ার্ক পরিসংখ্যান
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              (প্রতি ৩০ মিনিট পর পর স্বয়ংক্রিয় আপডেট)
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            {isLoading && <RefreshCw className="w-3 h-3 text-red-500 animate-spin" />}
            <span className="font-mono text-[10px] text-slate-500">
              সর্বশেষ সিঙ্ক: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) : 'সবেমাত্র'}
            </span>
          </div>
        </div>

        {/* 4-Card Responsive Grid for Daily and Monthly counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Daily Readers */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>দৈনিক পাঠক</span>
              <Users className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {stats.dailyReaders.toLocaleString('bn-BD')}
            </div>
            <div className="text-[10px] text-blue-400/90 font-medium">
              আজকের সক্রিয় পাঠক
            </div>
          </div>

          {/* Daily Reporters (1/4th of Daily Readers) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>দৈনিক প্রতিবেদক</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {stats.dailyReporters.toLocaleString('bn-BD')}
            </div>
            <div className="text-[10px] text-emerald-400/90 font-medium">
              আজকে কর্মরত সাংবাদিক
            </div>
          </div>

          {/* Monthly Readers */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>মাসিক পাঠক</span>
              <Eye className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {stats.monthlyReaders.toLocaleString('bn-BD')}
            </div>
            <div className="text-[10px] text-amber-400/90 font-medium">
              এই মাসের মোট ভিজিটর
            </div>
          </div>

          {/* Monthly Reporters (1/4th of Monthly Readers) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>মাসিক প্রতিবেদক</span>
              <Activity className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
              {stats.monthlyReporters.toLocaleString('bn-BD')}
            </div>
            <div className="text-[10px] text-purple-400/90 font-medium">
              মাসিক নিবন্ধিত প্রতিনিধি
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
