import React from 'react';
import { 
  X, 
  MapPin, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Award
} from 'lucide-react';
import { NewsArticle, WriterProfile } from '../types';
import { formatReporterName } from '../utils/authorHelper';

interface ReporterPublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporterName: string;
  reporterDistrict?: string;
  reporterAvatar?: string;
  writerProfile?: WriterProfile | null;
  allArticles: NewsArticle[];
  onSelectArticle?: (article: NewsArticle) => void;
}

export const ReporterPublicProfileModal: React.FC<ReporterPublicProfileModalProps> = ({
  isOpen,
  onClose,
  reporterName,
  reporterDistrict,
  reporterAvatar,
  writerProfile,
  allArticles,
  onSelectArticle,
}) => {
  if (!isOpen) return null;

  // Clean reporter name
  const cleanName = reporterName
    .replace(/\s*\(প্রতিবেদক\)/gi, '')
    .replace(/\s*\(লেখক\)/gi, '')
    .replace(/\s*\|\s*স্টাফ রিপোর্টার/gi, '')
    .replace(/,\s*.*$/, '') // Strip appended district if already in string
    .trim() || 'সম্মানিত প্রতিবেদক';

  // Find effective district and division
  const effectiveDistrict = writerProfile?.district?.trim() || reporterDistrict?.trim() || '';
  const effectiveDivision = writerProfile?.division?.trim() || '';
  const effectiveAvatar = writerProfile?.avatarUrl || reporterAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`;

  // Find all articles written by this reporter
  const reporterArticles = allArticles.filter((art) => {
    if (writerProfile?.id && art.authorId === writerProfile.id) return true;
    if (art.author) {
      const artAuthorClean = art.author.toLowerCase();
      const targetName = cleanName.toLowerCase();
      return artAuthorClean.includes(targetName) || targetName.includes(artAuthorClean);
    }
    return false;
  });

  const totalSuccessfulPosts = Math.max(reporterArticles.length, 1);
  const totalViews = reporterArticles.reduce((sum, a) => sum + (a.viewsCount || 0), 0);

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 relative">
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="absolute top-3 right-3 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-3 left-4 flex items-center gap-1.5 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-white text-[11px] font-bold">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>অফিশিয়াল প্রতিবেদক প্রোফাইল</span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 space-y-5 -mt-12 relative">
          {/* Avatar & Verification Badge */}
          <div className="flex items-end justify-between">
            <div className="relative">
              <img
                src={effectiveAvatar}
                alt={cleanName}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-lg bg-slate-100 dark:bg-slate-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`;
                }}
              />
              <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-sm" title="যাচাইকৃত প্রতিবেদক">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            <div className="text-right pb-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                <UserCheck className="w-3.5 h-3.5" /> দ্য রিক্যাপ মিডিয়া প্রতিবেদক
              </span>
            </div>
          </div>

          {/* Name & Location */}
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-2">
              {cleanName}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              {effectiveDistrict && (
                <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  জেলা: {effectiveDistrict}
                  {effectiveDivision && ` (${effectiveDivision} বিভাগ)`}
                </span>
              )}
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                সক্রিয় সদস্য
              </span>
            </div>
          </div>

          {/* Stats Bar (সফল প্রতিবেদন সংখ্যা & মোট পাঠক ভিউ) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-red-50/80 dark:bg-red-950/40 rounded-2xl border border-red-100 dark:border-red-900/40 text-center">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5" /> মোট সফল প্রতিবেদন
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {totalSuccessfulPosts}টি
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                অনুমোদিত ও প্রকাশিত
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/40 text-center">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                <Eye className="w-3.5 h-3.5" /> পাঠক এনগেজমেন্ট
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {totalViews > 0 ? `${totalViews.toLocaleString()} ভিউ` : 'সক্রিয়'}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                লাইভ রিডার ইমপ্যাক্ট
              </span>
            </div>
          </div>

          {/* Bio / About if available */}
          {writerProfile?.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic">
              "{writerProfile.bio}"
            </p>
          )}

          {/* Reporter's Published Articles List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>প্রকাশিত সংবাদসমূহ ({reporterArticles.length})</span>
              <span className="text-[11px] text-red-500 font-normal">ক্লিক করে পড়ুন</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {reporterArticles.length > 0 ? (
                reporterArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onClose();
                      if (onSelectArticle) onSelectArticle(art);
                    }}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-red-50/60 dark:hover:bg-red-950/30 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 cursor-pointer transition-all group"
                  >
                    {art.imageUrl && (
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-14 h-11 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {art.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                          {art.category}
                        </span>
                        <span>{new Date(art.publishedAt).toLocaleDateString('bn-BD')}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  এই প্রতিবেদকের কোনো পূর্বের সংবাদ পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
