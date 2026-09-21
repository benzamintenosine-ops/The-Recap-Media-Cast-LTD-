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
import { NewsArticle, Category, Language, SiteSettings } from '../types';
import { getTranslation } from '../utils/i18n';
import { formatReporterName } from '../utils/authorHelper';
import { AdPanel } from './AdPanel';
import { SocialBarController } from './DynamicAdServices';

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
  siteSettings?: SiteSettings;
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
  setShowOfflineOnly,
  siteSettings
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
      {/* Dynamic Social Bar Controller */}
      <SocialBarController settings={siteSettings?.dynamicAds?.socialBar} />

      {/* Header Advertisement Banner Space */}
      <AdPanel placement="header_top" siteSettings={siteSettings} />

      {/* Filter Status Notification Bar if active */}
      {(showBookmarksOnly || showOfflineOnly || selectedTag || searchQuery) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-black text-white rounded-xl border border-zinc-800 text-xs shadow-sm">
          <div className="flex items-center gap-2 font-bold text-white">
            <Filter className="w-4 h-4 text-white" />
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
            className="px-3 py-1 rounded-lg bg-white text-black font-extrabold hover:bg-zinc-200 transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider cursor-pointer shadow-xs"
          >
            <X className="w-3.5 h-3.5" /> ফিল্টার রিসেট
          </button>
        </div>
      )}

      {/* Tag Cloud Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-extrabold text-black dark:text-white shrink-0 flex items-center gap-1 uppercase tracking-wider text-[11px]">
          <Tag className="w-3.5 h-3.5 text-black dark:text-white" /> ট্রেন্ডিং ট্যাগ:
        </span>
        {allTags.map((tag, idx) => (
          <button
            key={`tag-${tag}-${idx}`}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap transition-all border cursor-pointer ${
              selectedTag === tag
                ? 'bg-black text-white border-2 border-zinc-700 ring-2 ring-black font-extrabold shadow-sm'
                : 'bg-black text-white hover:bg-zinc-800 border-black shadow-xs'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* No articles state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/10 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-black text-white mx-auto flex items-center justify-center border border-black shadow-sm">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-black dark:text-gray-100">
              এখনো কোনো সংবাদ প্রকাশিত হয়নি
            </h3>
            <p className="text-xs text-black dark:text-gray-400 leading-relaxed font-medium">
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
                  className="group relative bg-white dark:bg-[#111111] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md hover:border-black transition-all duration-300 cursor-pointer"
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
                        <span className="px-3 py-1 bg-black text-white rounded text-[10px] font-bold uppercase tracking-widest shadow border border-white/20">
                          {heroArticle.category}
                        </span>
                        {heroArticle.isBreaking && (
                          <span className="px-3 py-1 bg-black text-white border border-white/40 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow">
                            <Flame className="w-3.5 h-3.5 fill-white text-white" /> BREAKING
                          </span>
                        )}
                        {(heroArticle.videoUrl || heroArticle.hasVideo || heroArticle.content?.includes('<iframe') || heroArticle.content?.includes('<video')) && (
                          <span className="px-2.5 py-1 bg-black text-white rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider shadow border border-white/20">
                            <Play className="w-3 h-3 text-white fill-white" /> ভিডিও আছে
                          </span>
                        )}
                      </div>

                    {/* Quick Bookmark button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleBookmark(heroArticle.id); }}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-black text-white backdrop-blur hover:bg-zinc-800 transition-colors border border-white/20 cursor-pointer"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(heroArticle.id) ? 'fill-white text-white' : ''}`} />
                    </button>

                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
                      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight group-hover:text-zinc-200 transition-colors">
                        {currentLang === 'en' && heroArticle.titleEn ? heroArticle.titleEn : heroArticle.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 max-w-3xl font-medium leading-relaxed">
                        {currentLang === 'en' && heroArticle.summaryEn ? heroArticle.summaryEn : heroArticle.summary}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 font-medium pt-1">
                        <span className="flex items-center gap-1 text-white font-bold">
                          <User className="w-3.5 h-3.5 text-zinc-300" /> {formatReporterName(heroArticle.author, heroArticle.authorDistrict)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-300" /> {heroArticle.readTimeMinutes} {t('readTime')}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-white font-semibold font-mono">
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
                    className="group bg-white dark:bg-[#111111] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-black transition-all duration-200 cursor-pointer flex flex-col shadow-xs hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black border border-white/20 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                        {art.category}
                      </span>
                      {(art.videoUrl || art.hasVideo || art.content?.includes('<iframe') || art.content?.includes('<video')) && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black text-white rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider shadow border border-white/20">
                          <Play className="w-3 h-3 text-white fill-white" /> ভিডিও আছে
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleBookmark(art.id); }}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors border border-white/20 cursor-pointer"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(art.id) ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-[#111111]">
                      <div className="space-y-2">
                        <h3 className="font-serif text-lg font-bold text-black dark:text-white line-clamp-2 leading-snug group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                          {currentLang === 'en' && art.titleEn ? art.titleEn : art.title}
                        </h3>
                        <p className="text-xs text-black dark:text-zinc-300 line-clamp-2 leading-relaxed font-medium">
                          {currentLang === 'en' && art.summaryEn ? art.summaryEn : art.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-black dark:text-zinc-400 pt-3 border-t border-slate-200 dark:border-white/10 gap-2 font-bold">
                        <span className="flex items-center gap-1 text-black dark:text-zinc-300 font-bold truncate max-w-[140px]">
                          <User className="w-3 h-3 text-black dark:text-zinc-400 shrink-0" />
                          {formatReporterName(art.author, art.authorDistrict)}
                        </span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="flex items-center gap-1 text-black dark:text-zinc-400">
                            <Clock className="w-3 h-3 text-black dark:text-zinc-400" /> {art.readTimeMinutes} min
                          </span>
                          <span className="flex items-center gap-1 text-black dark:text-zinc-300 font-extrabold font-mono">
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
              <AdPanel placement="sidebar" siteSettings={siteSettings} />

              {/* Trending News Widget */}
              <div className="bg-black text-white rounded-2xl p-6 border border-zinc-800 space-y-4 shadow-md">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <TrendingUp className="w-4 h-4 text-white" />
                  জনপ্রিয় সংবাদ (Trending Top Reads)
                </h3>
                <div className="space-y-4">
                  {articles.slice(0, 5).map((tArt, i) => (
                    <div
                      key={`trend-art-${tArt.id}-${i}`}
                      onClick={() => onSelectArticle(tArt)}
                      className="flex items-start gap-3 group cursor-pointer"
                    >
                      <span className="font-mono text-xl font-bold text-zinc-400 group-hover:text-white transition-colors w-6">
                        0{i + 1}
                      </span>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-zinc-300 transition-colors leading-snug">
                          {currentLang === 'en' && tArt.titleEn ? tArt.titleEn : tArt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                          <span className="uppercase font-semibold">{tArt.category}</span>
                          <span>•</span>
                          <span className="font-mono text-white font-bold">{tArt.viewsCount} {t('views')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline Reading Promo Widget */}
              <div className="p-6 bg-black text-white rounded-2xl space-y-3 shadow-md border border-zinc-800">
                <span className="bg-zinc-900 border border-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  অফলাইন রিডিং সুবিধা
                </span>
                <h4 className="font-serif text-lg font-bold text-white">ইন্টারনেট ছাড়াও পড়ুন প্রিয় নিউজ!</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  যেকোনো সংবাদের অফলাইন বাটন চাপুন। আপনার ডিভাইসে সংরক্ষিত থাকবে ইন্টারনেট ছাড়াই পড়ার জন্য।
                </p>
                <button
                  onClick={() => setShowOfflineOnly(true)}
                  className="w-full py-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors shadow cursor-pointer"
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
