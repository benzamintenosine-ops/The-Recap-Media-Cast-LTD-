import React, { useState } from 'react';
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
  Video,
  Sparkles,
  Volume2,
  Globe
} from 'lucide-react';
import { NewsArticle, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { renderFormattedContent } from '../utils/formatContent';
import { AdPanel } from './AdPanel';

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
  onSelectRelated
}) => {
  if (!article) return null;

  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [copied, setCopied] = useState(false);
  const [artLang, setArtLang] = useState<Language>(currentLang);

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
    if (!commentText.trim()) return;
    onAddComment(article.id, commentAuthor.trim() || 'অনামী পাঠক (Anonymous)', commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 dark:bg-[#050505]/95 backdrop-blur-md p-2 sm:p-4 md:p-6 flex justify-center items-start pt-6 sm:pt-10">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col my-auto transition-colors">
        
        {/* Top Header Actions */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 rounded text-xs font-bold border border-red-200 dark:border-red-600/30 uppercase tracking-widest">
              {article.category}
            </span>
            {article.isAiGenerated && (
              <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold flex items-center gap-1 border border-purple-500/30">
                <Sparkles className="w-3 h-3" /> {t('aiGenerated')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle in Modal */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-medium border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setArtLang('bn')}
                className={`px-2 py-0.5 rounded ${artLang === 'bn' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setArtLang('en')}
                className={`px-2 py-0.5 rounded ${artLang === 'en' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}
              >
                EN
              </button>
            </div>

            {/* Offline Save */}
            <button
              onClick={() => onToggleOffline(article)}
              className={`p-2 rounded-full border transition-all ${
                isOfflineSaved
                  ? 'bg-amber-500 text-white border-amber-600 shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title={isOfflineSaved ? t('savedOffline') : t('saveForOffline')}
            >
              <WifiOff className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-full border transition-all ${
                isBookmarked
                  ? 'bg-red-600 text-white border-red-700 shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title={isBookmarked ? t('bookmarked') : t('addBookmark')}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Scroll Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Article Title */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle / Summary */}
          {summary && (
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-red-600 pl-4 py-1 bg-red-50/50 dark:bg-red-950/20 rounded-r-xl">
              {summary}
            </p>
          )}

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 py-3 border-y border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <User className="w-4 h-4 text-red-600" />
                {article.author}
              </span>
              {article.source && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800/60 shadow-xs">
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>তথ্যসূত্র: <strong>{article.source}</strong></span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString(artLang === 'bn' ? 'bn-BD' : 'en-US', {
                  dateStyle: 'medium'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTimeMinutes} {t('readTime')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-600 dark:text-red-400">
                {article.viewsCount} {t('views')}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
            <img
              src={article.imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[450px] object-cover"
            />
          </div>

          {/* Embedded Video Player if present */}
          {article.videoUrl && (
            <div className="rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-800">
              <div className="p-3 bg-slate-900 text-white text-xs font-semibold flex items-center gap-2 border-b border-slate-800">
                <Video className="w-4 h-4 text-red-500" />
                <span>ভিডিও ক্লিপ ও সরাসরি প্রতিবেদন (Video Report)</span>
              </div>
              <video controls className="w-full max-h-[380px]" src={article.videoUrl}>
                Your browser does not support video playback.
              </video>
            </div>
          )}

          {/* Social Share Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-red-600" />
              {t('share')}:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShareSocial('facebook')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Facebook className="w-3.5 h-3.5" /> Facebook
              </button>
              <button
                onClick={() => handleShareSocial('twitter')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1"
              >
                <Twitter className="w-3.5 h-3.5" /> X
              </button>
              <button
                onClick={() => handleShareSocial('whatsapp')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-300 transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('linkCopied') : t('copyLink')}
              </button>
            </div>
          </div>

          {/* Article Main Formatted Content */}
          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-base sm:text-lg">
            {renderFormattedContent(content)}
          </div>

          {/* Tags List */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ট্যাগসমূহ:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* In-Article Advertisement Space */}
          <AdPanel placement="in_article" />

          {/* Comments Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-600" />
              {t('comments')} ({article.comments.length})
            </h3>

            {/* Write Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="আপনার নাম (Name)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t('leaveComment')}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1.5 ml-auto shadow"
              >
                <Send className="w-3.5 h-3.5" />
                {t('submitComment')}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {article.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">এখনো কোন মন্তব্য নেই। প্রথম মন্তব্যটি করুন!</p>
              ) : (
                article.comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-red-500" />
                        {comment.authorName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related News Carousel */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('relatedNews')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {artLang === 'en' && rel.titleEn ? rel.titleEn : rel.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 mt-1 block">
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
    </div>
  );
};
