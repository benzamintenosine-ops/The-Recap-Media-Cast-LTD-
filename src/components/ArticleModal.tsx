import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bookmark, 
  WifiOff, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  User, 
  Calendar, 
  Check, 
  Copy, 
  Facebook, 
  Twitter, 
  Send,
  Sparkles,
  Volume2,
  Globe,
  Lock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { NewsArticle, Language, SiteSettings, UserProfile, WriterProfile } from '../types';
import { getTranslation } from '../utils/i18n';
import { renderFormattedContent } from '../utils/formatContent';
import { formatReporterName } from '../utils/authorHelper';
import { AdPanel } from './AdPanel';
import { ReporterPublicProfileModal } from './ReporterPublicProfileModal';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  currentLang: Language;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  isOfflineSaved: boolean;
  onToggleOffline: (article: NewsArticle) => void;
  onAddComment: (articleId: string, authorName: string, text: string) => void;
  relatedArticles: NewsArticle[];
  onSelectRelated: (article: NewsArticle) => void;
  siteSettings?: SiteSettings;
  user?: UserProfile | null;
  onRequireLogin?: () => void;
  onValidView?: (articleId: string, stats: { durationSeconds: number; scrollDepthPercent: number; sessionId: string }) => void;
  writers?: WriterProfile[];
  allArticles?: NewsArticle[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  currentLang,
  isBookmarked,
  onToggleBookmark,
  isOfflineSaved,
  onToggleOffline,
  onAddComment,
  relatedArticles,
  onSelectRelated,
  siteSettings,
  user,
  onRequireLogin,
  onValidView,
  writers = [],
  allArticles = []
}) => {
  if (!article) return null;

  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [artLang, setArtLang] = useState<Language>(currentLang);
  const [showReporterModal, setShowReporterModal] = useState(false);

  // Anti-Fraud View Tracking state (15s active visibility + 30% scroll depth)
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [viewCounted, setViewCounted] = useState(false);

  const activeSecondsRef = useRef(0);
  const maxScrollDepthRef = useRef(0);
  const hasTriggeredViewRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-resolve Reporter's Profile, District, Avatar & Success Count
  const matchedWriter = writers.find((w) => {
    if (article.authorId && w.id === article.authorId) return true;
    if (article.author && w.name) {
      const wName = w.name.trim().toLowerCase();
      const aName = article.author.trim().toLowerCase();
      return wName === aName || aName.includes(wName);
    }
    return false;
  }) || null;

  const cleanReporterName = matchedWriter?.name || article.author || 'সম্মানিত প্রতিবেদক';
  const reporterDistrict = matchedWriter?.district?.trim() || article.authorDistrict?.trim() || '';
  const reporterAvatar = article.authorAvatar || matchedWriter?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanReporterName)}`;
  const formattedAuthor = formatReporterName(cleanReporterName, reporterDistrict);

  // Lock body scroll and handle Escape key while reading
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift if vertical scrollbar is present
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Reset scroll to top when article changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [article.id]);

  // 1. Page Visibility API & Active Time Counter (Must be on active tab for >= 15s)
  useEffect(() => {
    activeSecondsRef.current = 0;
    maxScrollDepthRef.current = 0;
    hasTriggeredViewRef.current = false;
    setActiveSeconds(0);
    setScrollDepth(0);
    setViewCounted(false);

    let intervalId: any = null;

    const startTimer = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (document.visibilityState === 'visible') {
            activeSecondsRef.current += 1;
            if (!hasTriggeredViewRef.current) {
              setActiveSeconds(activeSecondsRef.current);
            }
            checkAndTriggerValidView();
          }
        }, 1000);
      }
    };

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startTimer();
      } else {
        stopTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startTimer();

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [article.id]);

  // Throttled Scroll Depth Tracker (Must scroll >= 30% of content)
  const scrollRafIdRef = useRef<number | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight > 0) {
      const percentage = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
      if (percentage > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = percentage;
        checkAndTriggerValidView();

        if (!hasTriggeredViewRef.current && !scrollRafIdRef.current) {
          scrollRafIdRef.current = window.requestAnimationFrame(() => {
            setScrollDepth(maxScrollDepthRef.current);
            scrollRafIdRef.current = null;
          });
        }
      }
    }
  };

  // 3. Trigger Valid View Verification
  const checkAndTriggerValidView = () => {
    if (hasTriggeredViewRef.current) return;

    if (activeSecondsRef.current >= 15 && maxScrollDepthRef.current >= 30) {
      hasTriggeredViewRef.current = true;
      setViewCounted(true);

      // Retrieve or generate reader session ID
      let sessionId = sessionStorage.getItem('recap_reader_session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('recap_reader_session_id', sessionId);
      }

      if (onValidView) {
        onValidView(article.id, {
          durationSeconds: activeSecondsRef.current,
          scrollDepthPercent: maxScrollDepthRef.current,
          sessionId
        });
      }
    }
  };

  const t = (key: any) => getTranslation(artLang, key);

  const title = artLang === 'en' && article.titleEn ? article.titleEn : article.title;
  const summary = artLang === 'en' && article.summaryEn ? article.summaryEn : article.summary;
  const content = artLang === 'en' && article.contentEn ? article.contentEn : article.content;

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSocial = (platform: string) => {
    let url = '';
    const text = encodeURIComponent(title);
    const pageUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}&url=${pageUrl}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${text}%20${pageUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
        break;
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin?.();
      return;
    }
    if (!commentText.trim()) return;
    onAddComment(article.id, user.name || 'নিয়মিত পাঠক', commentText.trim());
    setCommentText('');
  };

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 dark:bg-black/90 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex justify-center items-start pt-3 sm:pt-6"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain',
        touchAction: 'pan-y'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col mb-16 transition-colors"
      >
        
        {/* Top Header Actions */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur border-b border-slate-200 dark:border-white/10 px-5 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-black text-white rounded text-xs font-bold uppercase tracking-widest border border-white/20 shadow-xs">
              {article.category}
            </span>
            {article.isAiGenerated && (
              <span className="px-2.5 py-0.5 bg-black text-white rounded text-xs font-semibold flex items-center gap-1 border border-white/20">
                <Sparkles className="w-3 h-3 text-white" /> {t('aiGenerated')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle in Modal */}
            <div className="flex bg-black text-white rounded-lg p-0.5 text-xs font-medium border border-zinc-800">
              <button
                onClick={() => setArtLang('bn')}
                className={`px-2 py-0.5 rounded cursor-pointer ${artLang === 'bn' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setArtLang('en')}
                className={`px-2 py-0.5 rounded cursor-pointer ${artLang === 'en' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Offline Save */}
            <button
              onClick={() => onToggleOffline(article)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isOfflineSaved
                  ? 'bg-black text-white border-zinc-700 shadow'
                  : 'bg-black text-white border-zinc-800 hover:bg-zinc-800'
              }`}
              title={isOfflineSaved ? t('savedOffline') : t('saveForOffline')}
            >
              <WifiOff className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-black text-white border-zinc-700 shadow'
                  : 'bg-black text-white border-zinc-800 hover:bg-zinc-800'
              }`}
              title={isBookmarked ? t('bookmarked') : t('addBookmark')}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors ml-2 cursor-pointer border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Scroll Body - Smooth natural scrolling without trapping or nested scrollbars */}
        <div 
          className="p-5 sm:p-7 space-y-5 bg-white dark:bg-[#0a0a0a]"
        >
          {/* Article Title */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle / Summary */}
          {summary && (
            <p className="text-base sm:text-lg text-black dark:text-zinc-200 font-medium leading-relaxed border-l-4 border-black dark:border-white pl-4 py-1.5 bg-slate-50 dark:bg-zinc-900 rounded-r-xl">
              {summary}
            </p>
          )}

          {/* Metadata Bar with Anti-Fraud Validation Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-black dark:text-zinc-400 py-3 border-y border-slate-200 dark:border-zinc-800 font-medium">
            <div className="flex flex-wrap items-center gap-4">
              {/* Reporter Profile Click Button */}
              <button
                type="button"
                onClick={() => setShowReporterModal(true)}
                className="flex items-center gap-2 group text-left hover:opacity-90 transition-opacity cursor-pointer bg-black text-white px-3 py-1.5 rounded-xl border border-zinc-800"
                title="প্রতিবেদকের প্রোফাইল দেখতে ক্লিক করুন"
              >
                <img
                  src={reporterAvatar}
                  alt={cleanReporterName}
                  className="w-5 h-5 rounded-full object-cover border border-white shrink-0 group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanReporterName)}`;
                  }}
                />
                <span className="font-bold text-white group-hover:text-zinc-200 transition-colors">
                  {formattedAuthor}
                </span>
                <ExternalLink className="w-3 h-3 text-zinc-300 group-hover:text-white" />
              </button>

              {article.source && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-black text-white rounded-lg text-xs font-medium border border-zinc-800 shadow-xs">
                  <Globe className="w-3.5 h-3.5 text-white" />
                  <span>তথ্যসূত্র: <strong>{article.source}</strong></span>
                </span>
              )}
              <span className="flex items-center gap-1 text-black dark:text-zinc-300 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString(artLang === 'bn' ? 'bn-BD' : 'en-US', {
                  dateStyle: 'medium'
                })}
              </span>
              <span className="flex items-center gap-1 text-black dark:text-zinc-300 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {article.readTimeMinutes} {t('readTime')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Anti-Fraud View Status */}
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                viewCounted 
                  ? 'bg-black text-white border border-zinc-700' 
                  : 'bg-black text-white border border-zinc-800'
              }`}>
                <ShieldCheck className="w-3 h-3 text-white" />
                {viewCounted ? 'যাচাইকৃত ভিউ' : `${activeSeconds}s • ${scrollDepth}%`}
              </span>

              <span className="font-extrabold text-black dark:text-white font-mono">
                {article.viewsCount} {t('views')}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-zinc-800">
            <img
              src={article.imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[450px] object-cover"
            />
          </div>

          {/* In-Article Advertisement Space - Placed Above News Share Banner */}
          <AdPanel placement="in_article" siteSettings={siteSettings} />

          {/* Social Share Bar */}
          <div className="bg-black text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-zinc-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-white" />
              {t('share')}:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShareSocial('facebook')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1 border border-zinc-700 cursor-pointer"
              >
                <Facebook className="w-3.5 h-3.5" /> Facebook
              </button>
              <button
                onClick={() => handleShareSocial('twitter')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1 border border-zinc-700 cursor-pointer"
              >
                <Twitter className="w-3.5 h-3.5" /> X
              </button>
              <button
                onClick={() => handleShareSocial('whatsapp')}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors border border-zinc-700 cursor-pointer"
              >
                WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                {copied ? t('linkCopied') : t('copyLink')}
              </button>
            </div>
          </div>

          {/* Article Main Formatted Content */}
          <div className="prose dark:prose-invert max-w-none text-black dark:text-zinc-200 leading-relaxed font-sans text-base sm:text-lg">
            {renderFormattedContent(content)}
          </div>

          {/* Reporter Byline Box Above Tag List (Clickable to view full reporter profile) */}
          <div className="pt-5 mt-4 border-t border-slate-200 dark:border-slate-800">
            <div 
              onClick={() => setShowReporterModal(true)}
              className="flex items-center justify-between flex-wrap gap-3 p-4 bg-black text-white hover:bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={reporterAvatar}
                    alt={cleanReporterName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanReporterName)}`;
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-zinc-300 block uppercase tracking-wider">
                    সংবাদ প্রতিবেদক • প্রোফাইল দেখতে ক্লিক করুন
                  </span>
                  <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif group-hover:text-zinc-200 transition-colors">
                    {formattedAuthor}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {article.source && (
                  <span className="text-xs text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-700 shadow-xs">
                    তথ্যসূত্র: <strong className="text-white">{article.source}</strong>
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs font-bold text-black bg-white hover:bg-zinc-200 px-3 py-1.5 rounded-xl shadow-xs transition-all">
                  <span>প্রোফাইল দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Tags List */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-black dark:text-white">ট্যাগসমূহ:</span>
              {article.tags.map((tag, idx) => (
                <span
                  key={`modal-tag-${tag}-${idx}`}
                  className="px-3 py-1 rounded-full bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 space-y-6">
            <h3 className="text-lg font-extrabold text-black dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-black dark:text-white" />
              {t('comments')} ({article.comments.length})
            </h3>

            {/* Write Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="space-y-3 bg-black text-white p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-bold text-white">
                      {user.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-white text-[10px] font-bold border border-zinc-700">
                      নিয়মিত পাঠক
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">আপনার মতামত লিখুন</span>
                </div>

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t('leaveComment')}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:ring-2 focus:ring-white outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 ml-auto shadow cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t('submitComment')}
                </button>
              </form>
            ) : (
              <div className="p-5 bg-black text-white rounded-2xl border border-zinc-800 text-center space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center mx-auto shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    সংবাদে মন্তব্য করতে নিয়মিত পাঠক হওয়া আবশ্যক
                  </h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto mt-1 leading-relaxed">
                    নিয়মিত পাঠক ছাড়া কেউ মন্তব্য করতে পারবেন না। আপনার মূল্যবান মতামত জানাতে নিয়মিত পাঠক হিসেবে সাইন-ইন বা নতুন অ্যাকাউন্ট তৈরি করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>নিয়মিত পাঠক হিসেবে Sign Up / Sign In করুন</span>
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {article.comments.length === 0 ? (
                <p className="text-xs text-black dark:text-zinc-400 italic font-medium">এখনো কোন মন্তব্য নেই। প্রথম মন্তব্যটি করুন!</p>
              ) : (
                article.comments.map((comment, idx) => (
                  <div key={`comment-${comment.id}-${idx}`} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-black dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-black dark:text-white" />
                        {comment.authorName}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-black dark:text-zinc-300 leading-relaxed pt-1 font-medium">
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related News Carousel */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 space-y-4">
              <h3 className="text-base font-extrabold text-black dark:text-white">
                {t('relatedNews')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.slice(0, 4).map((rel, idx) => (
                  <div
                    key={`rel-art-${rel.id}-${idx}`}
                    onClick={() => onSelectRelated(rel)}
                    className="flex items-center gap-3 p-3 bg-black text-white rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors border border-zinc-800 shadow-xs"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white/20"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-2">
                        {artLang === 'en' && rel.titleEn ? rel.titleEn : rel.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400 mt-1 block font-mono">
                        {rel.category} • {rel.readTimeMinutes} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Reporter Public Profile Modal */}
      <ReporterPublicProfileModal
        isOpen={showReporterModal}
        onClose={() => setShowReporterModal(false)}
        reporterName={cleanReporterName}
        reporterDistrict={reporterDistrict}
        reporterAvatar={reporterAvatar}
        writerProfile={matchedWriter}
        allArticles={allArticles.length > 0 ? allArticles : relatedArticles}
        onSelectArticle={(art) => {
          setShowReporterModal(false);
          onSelectRelated(art);
        }}
      />
    </div>
  );
};
