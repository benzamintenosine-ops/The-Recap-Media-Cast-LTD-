import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Calendar, User, ArrowRight, Tag, Eye, Newspaper } from 'lucide-react';
import { NewsArticle, Category, Language } from '../types';
import { formatReporterName } from '../utils/authorHelper';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  initialQuery?: string;
  onCategorySelect?: (cat: Category | 'ALL') => void;
  currentLang?: Language;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
  initialQuery = '',
  onCategorySelect,
  currentLang = 'bn'
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialQuery]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter published articles
  const availableArticles = useMemo(() => {
    return (articles || []).filter((a) => !a.isUnpublished);
  }, [articles]);

  // Get dynamic unique categories
  const categoriesList = useMemo(() => {
    const cats = Array.from(new Set(availableArticles.map((a) => a.category).filter(Boolean)));
    return ['ALL', ...cats];
  }, [availableArticles]);

  // Search results
  const searchResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    
    return availableArticles.filter((article) => {
      // Category filter check
      if (selectedCatFilter !== 'ALL' && article.category !== selectedCatFilter) {
        return false;
      }

      if (!cleanQuery) return true;

      const titleMatch = (article.title || '').toLowerCase().includes(cleanQuery);
      const titleEnMatch = (article.titleEn || '').toLowerCase().includes(cleanQuery);
      const summaryMatch = (article.summary || '').toLowerCase().includes(cleanQuery);
      const contentMatch = (article.content || '').toLowerCase().includes(cleanQuery);
      const authorMatch = (article.author || '').toLowerCase().includes(cleanQuery);
      const categoryMatch = (article.category || '').toLowerCase().includes(cleanQuery);
      const tagsMatch = (article.tags || []).some((t) => t.toLowerCase().includes(cleanQuery));

      return titleMatch || titleEnMatch || summaryMatch || contentMatch || authorMatch || categoryMatch || tagsMatch;
    });
  }, [availableArticles, query, selectedCatFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden my-8 z-10 flex flex-col max-h-[85vh]">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-black dark:text-white" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="সংবাদের শিরোনাম, কি-ওয়ার্ড, ট্যাগ বা প্রতিবেদকের নাম দিয়ে খুঁজুন..."
                className="w-full pl-11 pr-10 py-3 text-sm sm:text-base rounded-2xl border-2 border-black bg-white dark:bg-[#111] text-black dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-black shadow-xs transition-all font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-black dark:text-white hover:text-zinc-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-3 text-white bg-black hover:bg-zinc-800 rounded-2xl transition-colors cursor-pointer border border-black shadow-sm"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
            <span className="text-[11px] font-bold text-black dark:text-zinc-400 shrink-0 mr-1">বিভাগ:</span>
            {categoriesList.map((cat) => (
              <button
                key={`search-cat-${cat}`}
                onClick={() => setSelectedCatFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCatFilter === cat
                    ? 'bg-black text-white border-2 border-zinc-700 ring-2 ring-black font-black'
                    : 'bg-black text-white hover:bg-zinc-800 border border-black'
                }`}
              >
                {cat === 'ALL' ? 'সকল বিভাগ' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-black dark:text-zinc-400 font-bold px-1">
            <span>
              {query
                ? `"${query}" এর জন্য ফলাফল (${searchResults.length} টি সংবাদ)`
                : `সাম্প্রতিক ও আলোচিত সংবাদ (${searchResults.length} টি)`}
            </span>
            {selectedCatFilter !== 'ALL' && (
              <span className="text-black dark:text-white font-bold">বিভাগ: {selectedCatFilter}</span>
            )}
          </div>

          {searchResults.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-zinc-800">
              {searchResults.map((article) => (
                <div
                  key={`search-res-${article.id}`}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="py-3.5 px-3 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-2xl transition-colors cursor-pointer flex gap-3.5 sm:gap-4 items-start group"
                >
                  {/* Article Thumbnail */}
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-300 dark:border-zinc-800 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl bg-black text-white flex items-center justify-center shrink-0 border border-zinc-800">
                      <Newspaper className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* Article Metadata */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-black text-white border border-zinc-800 text-[10px] font-bold">
                        {article.category}
                      </span>
                      {article.postType === 'video' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-black text-white border border-zinc-800 text-[10px] font-bold">
                          📹 ভিডিও
                        </span>
                      )}
                      <span className="text-[11px] text-black dark:text-zinc-400 flex items-center gap-1 font-medium font-mono">
                        <Calendar className="w-3 h-3 text-black dark:text-zinc-400" />
                        {new Date(article.publishedAt).toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US')}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-black dark:text-white line-clamp-2 font-serif group-hover:underline transition-colors">
                      {article.title}
                    </h4>

                    {article.summary && (
                      <p className="text-xs text-black dark:text-zinc-300 line-clamp-1 font-medium">
                        {article.summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-0.5 text-[11px] text-black dark:text-zinc-400">
                      <span className="font-semibold text-black dark:text-zinc-300">
                        প্রতিবেদক: {formatReporterName(article.author, article.authorDistrict)}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-black dark:text-white group-hover:translate-x-1 transition-transform">
                        পড়ুন <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto border border-zinc-800 shadow-sm">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-base font-extrabold text-black dark:text-white">
                কোনো সংবাদ পাওয়া যায়নি
              </h4>
              <p className="text-xs text-black dark:text-zinc-300 max-w-sm mx-auto font-medium">
                অনুগ্রহ করে অন্য কোনো শব্দ বা অন্য কোনো বিভাগ নির্বাচন করে পুনরায় অনুসন্ধান করুন।
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-between text-xs text-black dark:text-zinc-400 font-medium">
          <span className="text-[11px]">The Recap Media Cast Ltd • বস্তুনিষ্ঠ সংবাদ অনুসন্ধান</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold transition-colors cursor-pointer border border-black shadow-sm"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
