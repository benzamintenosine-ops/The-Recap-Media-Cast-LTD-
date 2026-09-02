import React, { useState } from 'react';
import { 
  Bookmark, 
  WifiOff, 
  Sparkles, 
  Clock, 
  User, 
  Eye, 
  MessageSquare, 
  Flame, 
  Filter, 
  X,
  Play,
  TrendingUp,
  Tag
} from 'lucide-react';
import { NewsArticle, Category, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { AdPanel } from './AdPanel';

interface ViewerSiteProps {
  articles: NewsArticle[];
  selectedCategory: Category | 'ALL';
  searchQuery: string;
  currentLang: Language;
  onSelectArticle: (article: NewsArticle) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  offlineSaved: string[];
  onToggleOffline: (article: NewsArticle) => void;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (val: boolean) => void;
  showOfflineOnly: boolean;
  setShowOfflineOnly: (val: boolean) => void;
}

export const ViewerSite: React.FC<ViewerSiteProps> = ({
  articles,
  selectedCategory,
  searchQuery,
  currentLang,
  onSelectArticle,
  bookmarks,
  onToggleBookmark,
  offlineSaved,
  onToggleOffline,
  showBookmarksOnly,
  setShowBookmarksOnly,
  showOfflineOnly,
  setShowOfflineOnly
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const t = (key: any) => getTranslation(currentLang, key);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(articles.flatMap((art) => art.tags || []))
  ).slice(0, 12);

  // Filter Articles
  let filtered = articles.filter((art) => {
    // Hide unpublished articles from readers
    if (art.isUnpublished) return false;

    // Mode filters
    if (showBookmarksOnly && !bookmarks.includes(art.id)) return false;
    if (showOfflineOnly && !offlineSaved.includes(art.id)) return false;

    // Category filter
    if (selectedCategory !== 'ALL' && art.category !== selectedCategory) return false;

    // Tag filter
    if (selectedTag && !art.tags?.includes(selectedTag)) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q) || (art.titleEn && art.titleEn.toLowerCase().includes(q));
      const matchSummary = art.summary.toLowerCase().includes(q) || (art.summaryEn && art.summaryEn.toLowerCase().includes(q));
      const matchTag = art.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchTag;
    }

    return true;
  });

  // Hero article (first breaking or first trending or first article)
  const heroArticle = filtered.find((a) => a.isBreaking) || filtered[0];
  const secondaryArticles = filtered.filter((a) => a.id !== heroArticle?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header Advertisement Banner Space */}
      <AdPanel placement="header_top" />

      {/* Filter Status Notification Bar if active */}
      {(showBookmarksOnly || showOfflineOnly || selectedTag || searchQuery) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-red-950/40 rounded-xl border border-red-600/30 text-xs">
          <div className="flex items-center gap-2 font-medium text-red-200">
            <Filter className="w-4 h-4 text-red-500" />
            <span>
              ফিল্টার সক্রিয়: {showBookmarksOnly && 'বুকমার্কসমূহ '}
              {showOfflineOnly && 'অফলাইন সেভ করা খবর '}
              {selectedTag && `#${selectedTag} `}
              {searchQuery && `"${searchQuery}" `}
              ({filtered.length} {t('searchResultCount')})
            </span>
          </div>
          <button
            onClick={() => {
              setShowBookmarksOnly(false);
              setShowOfflineOnly(false);
              setSelectedTag(null);
            }}
            className="px-2.5 py-1 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider"
          >
            <X className="w-3.5 h-3.5" /> ফিল্টার রিসেট
          </button>
        </div>
      )}

      {/* Tag Cloud Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-bold text-gray-400 shrink-0 flex items-center gap-1 uppercase tracking-wider text-[11px]">
          <Tag className="w-3.5 h-3.5 text-red-500" /> ট্রেন্ডিং ট্যাগ:
        </span>
        {allTags.map((tag, idx) => (
          <button
            key={`tag-${tag}-${idx}`}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all border ${
              selectedTag === tag
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white/5 dark:bg-[#111111] text-gray-300 border-slate-200 dark:border-white/10 hover:border-red-500/50 hover:text-white'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* No articles state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/10 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center border border-red-200 dark:border-red-900/40">
            <Tag className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">
              এখনো কোনো সংবাদ প্রকাশিত হয়নি
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
              লেখক বা অ্যাডমিন প্যানেল থেকে বস্তুনিষ্ঠ সংবাদ প্রকাশিত হওয়ামাত্র এখানে তা লাইভ স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Main Content */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Hero Featured Article Card */}
              {heroArticle && (
                <div 
                  onClick={() => onSelectArticle(heroArticle)}
                  className="group relative bg-white dark:bg-[#111111] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg hover:border-red-600/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-video sm:aspect-[21/9] overflow-hidden bg-[#050505]">
                    <img
                      src={heroArticle.imageUrl}
                      alt={heroArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-widest shadow">
                          {heroArticle.category}
                        </span>
                        {heroArticle.isBreaking && (
                          <span className="px-3 py-1 bg-amber-500 text-black rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow animate-pulse">
                            <Flame className="w-3.5 h-3.5 fill-black" /> BREAKING
                          </span>
                        )}
                        {(heroArticle.videoUrl || heroArticle.hasVideo || heroArticle.content?.includes('<iframe') || heroArticle.content?.includes('<video')) && (
                          <span className="px-2.5 py-1 bg-red-600 text-white rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider shadow">
                            <Play className="w-3 h-3 text-white fill-white" /> ভিডিও আছে
                          </span>
                        )}
                      </div>

                    {/* Quick Bookmark button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleBookmark(heroArticle.id); }}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 text-white backdrop-blur hover:bg-red-600 transition-colors border border-white/10"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(heroArticle.id) ? 'fill-white text-white' : ''}`} />
                    </button>

                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
                      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight group-hover:text-red-400 transition-colors">
                        {currentLang === 'en' && heroArticle.titleEn ? heroArticle.titleEn : heroArticle.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 max-w-3xl font-medium leading-relaxed">
                        {currentLang === 'en' && heroArticle.summaryEn ? heroArticle.summaryEn : heroArticle.summary}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-medium pt-1">
                        <span className="flex items-center gap-1 text-gray-200 font-semibold">
                          <User className="w-3.5 h-3.5 text-red-500" /> {heroArticle.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> {heroArticle.readTimeMinutes} {t('readTime')}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-red-400 font-semibold font-mono">
                          <Eye className="w-3.5 h-3.5" /> {heroArticle.viewsCount} {t('views')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Secondary News Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {secondaryArticles.map((art, idx) => (
                  <div
                    key={`sec-art-${art.id}-${idx}`}
                    onClick={() => onSelectArticle(art)}
                    className="group bg-white dark:bg-[#111111] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-red-600/30 transition-all duration-200 cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur text-white rounded text-[10px] font-bold uppercase tracking-wider">
                        {art.category}
                      </span>
                      {(art.videoUrl || art.hasVideo || art.content?.includes('<iframe') || art.content?.includes('<video')) && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-red-600 text-white rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider shadow">
                          <Play className="w-3 h-3 text-white fill-white" /> ভিডিও আছে
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleBookmark(art.id); }}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur hover:bg-red-600 transition-colors border border-white/10"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(art.id) ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                          {currentLang === 'en' && art.titleEn ? art.titleEn : art.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {currentLang === 'en' && art.summaryEn ? art.summaryEn : art.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400 pt-3 border-t border-slate-100 dark:border-white/10">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" /> {art.readTimeMinutes} min
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" /> {art.comments.length}
                          </span>
                          <span className="flex items-center gap-1 text-red-500 font-semibold font-mono">
                            <Eye className="w-3 h-3" /> {art.viewsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right 4 Cols: Sidebar Widgets & Ads */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Sidebar Advertisement Card */}
              <AdPanel placement="sidebar" />

              {/* Trending News Widget */}
              <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  জনপ্রিয় সংবাদ (Trending Top Reads)
                </h3>
                <div className="space-y-4">
                  {articles.slice(0, 5).map((tArt, i) => (
                    <div
                      key={`trend-art-${tArt.id}-${i}`}
                      onClick={() => onSelectArticle(tArt)}
                      className="flex items-start gap-3 group cursor-pointer"
                    >
                      <span className="font-mono text-xl font-bold text-red-600/40 group-hover:text-red-500 transition-colors w-6">
                        0{i + 1}
                      </span>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-gray-200 line-clamp-2 group-hover:text-red-500 transition-colors leading-snug">
                          {currentLang === 'en' && tArt.titleEn ? tArt.titleEn : tArt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <span className="uppercase">{tArt.category}</span>
                          <span>•</span>
                          <span className="font-mono text-red-400">{tArt.viewsCount} {t('views')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Reading Promo */}
              <div className="p-6 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl space-y-3 shadow-lg">
                <span className="bg-black/30 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  অফলাইন রিডিং সুবিধা
                </span>
                <h4 className="font-serif text-lg font-bold">ইন্টারনেট ছাড়াও পড়ুন প্রিয় নিউজ!</h4>
                <p className="text-xs text-red-100 leading-relaxed">
                  যেকোনো সংবাদের অফলাইন বাটন চাপুন। আপনার ফোনে সংরক্ষিত থাকবে ইন্টারনেট ছাড়াই পড়ার জন্য।
                </p>
                <button
                  onClick={() => setShowOfflineOnly(true)}
                  className="w-full py-2 bg-white text-red-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-50 transition-colors shadow"
                >
                  সংরক্ষিত অফলাইন খবর খুলুন &rarr;
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};
