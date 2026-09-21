import React, { useState } from 'react';
import { 
  Search, 
  Bookmark, 
  Moon, 
  Sun, 
  User, 
  Globe, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Flame,
  Menu,
  X,
  Volume2,
  Bell,
  Info,
  ShieldCheck,
  PhoneCall,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Send,
  MessageCircle,
  PenTool,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Home,
  Building2
} from 'lucide-react';
import { Language, NewsArticle, Category, UserProfile, CategoryConfig, SiteSettings } from '../types';
import { getTranslation } from '../utils/i18n';
import { InfoModals } from './InfoModals';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  currentMode: 'viewer' | 'writer' | 'managing' | 'systemAdmin';
  onModeSwitch: (mode: 'viewer' | 'writer' | 'managing' | 'systemAdmin') => void;
  breakingArticles: NewsArticle[];
  articles?: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  selectedCategory: Category | 'ALL';
  onCategorySelect: (cat: Category | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  bookmarksCount: number;
  offlineCount: number;
  onOpenBookmarks: () => void;
  onOpenOffline: () => void;
  onOpenProfile: () => void;
  user: UserProfile | null;
  isOnline: boolean;
  categories?: CategoryConfig[];
  siteSettings?: SiteSettings;
}

const CATEGORIES: Category[] = [
  'জাতীয়',
  'রাজনীতি',
  'অর্থনীতি',
  'আন্তর্জাতিক',
  'প্রযুক্তি',
  'বিজ্ঞান',
  'খেলাধুলা',
  'বিনোদন',
  'জীবনযাপন'
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  darkMode,
  onDarkModeToggle,
  currentMode,
  onModeSwitch,
  breakingArticles,
  articles,
  onSelectArticle,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
  bookmarksCount,
  offlineCount,
  onOpenBookmarks,
  onOpenOffline,
  onOpenProfile,
  user,
  isOnline,
  categories,
  siteSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<'about' | 'privacy' | 'contact' | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [audioAnnounce, setAudioAnnounce] = useState(false);

  const t = (key: any) => getTranslation(currentLang, key);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 dark:bg-[#050505] text-slate-200 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 dark:border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-wider text-slate-300 flex items-center gap-1.5 text-[11px] uppercase">
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></span>
            LIVE
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px] tracking-wide">
            {new Date().toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center gap-2 text-slate-400">
            {isOnline ? (
              <span className="flex items-center gap-1 text-slate-300 text-[11px]" title="Online mode active">
                <Wifi className="w-3.5 h-3.5" /> <span className="hidden md:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400 text-[11px]" title="Offline reading mode enabled">
                <WifiOff className="w-3.5 h-3.5" /> <span>Offline Mode</span>
              </span>
            )}
            <span className="hidden lg:flex items-center gap-1 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/20" title="Firebase Firestore Realtime Database Connected">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-ping"></span>
              Firebase Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/10">
            <button
              onClick={() => onLanguageChange('bn')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                currentLang === 'bn'
                  ? 'bg-slate-800 text-white shadow border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇧🇩 BN
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                currentLang === 'en'
                  ? 'bg-slate-800 text-white shadow border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onDarkModeToggle}
            className="p-1.5 rounded-full bg-white/10 border border-white/15 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
            title={t(darkMode ? 'lightMode' : 'darkMode')}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-slate-200" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Breaking News Marquee Banner (Right to Left Animation) */}
      {breakingArticles.length > 0 && (
        <div className="bg-black border-b border-zinc-800 text-xs py-1 px-3 sm:px-4 flex items-center overflow-hidden text-white">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/20 text-white font-bold px-2.5 py-0.5 rounded text-[9px] tracking-wider uppercase shrink-0 shadow-sm">
            <Flame className="w-3 h-3 text-white fill-white" />
            {t('breakingNews')}
          </div>

          <div className="overflow-hidden whitespace-nowrap ml-2.5 relative flex-1">
            <div className="inline-block animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
              {breakingArticles.map((art) => (
                <span
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="inline-flex items-center gap-2 mr-6 hover:underline text-white font-semibold text-xs transition-colors hover:text-white/80"
                >
                  <span className="text-white/60 font-black">•</span>
                  {currentLang === 'en' && art.titleEn ? art.titleEn : art.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Notice Marquee Banner (জরুরি নির্দেশনা) */}
      {((siteSettings?.emergencyNotices && siteSettings.emergencyNotices.length > 0) ? siteSettings.emergencyNotices : [
        'জরুরি আবহাওয়া বার্তা: উপকূলীয় ও নদী অববাহিকা অঞ্চলগুলোতে সতর্কতামূলক ব্যবস্থা গ্রহণের নির্দেশ।',
        'জরুরি নিরাপত্তা বার্তা: সামাজিক মাধ্যমে প্রচারিত কোনো গুজবে কান না দিয়ে নির্ভরযোগ্য তথ্য যাচাই করুন।',
        'ডিজিটাল সুরক্ষা সতর্কতা: অনলাইন ব্যাংকিং বা আর্থিক সেবার গোপন ওটিপি (OTP) ও পিন কারো সাথে শেয়ার করবেন না।',
        'জরুরি স্বাস্থ্য বার্তা: মৌসুমি রোগ প্রতিরোধে বাড়ির আঙিনা পরিষ্কার রাখুন এবং স্বাস্থ্যবিধি মেনে চলুন।',
        'জাতীয় জরুরি সেবা নম্বর: যেকোনো সংকটকালে ৯৯৯ (জাতীয় জরুরি সেবা) ও ৩৩৩ (তথ্য বাতায়ন)-এ যোগাযোগ করুন।'
      ]).length > 0 && (
        <div className="bg-black border-b border-zinc-800 text-xs py-1 px-3 sm:px-4 flex items-center overflow-hidden text-white">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/20 text-white font-bold px-2.5 py-0.5 rounded text-[9px] tracking-wider uppercase shrink-0 shadow-sm">
            <ShieldAlert className="w-3 h-3 text-white" />
            <span>জরুরি নির্দেশনা</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap ml-2.5 relative flex-1">
            <div className="inline-block animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
              {((siteSettings?.emergencyNotices && siteSettings.emergencyNotices.length > 0) ? siteSettings.emergencyNotices : [
                'জরুরি আবহাওয়া বার্তা: উপকূলীয় ও নদী অববাহিকা অঞ্চলগুলোতে সতর্কতামূলক ব্যবস্থা গ্রহণের নির্দেশ।',
                'জরুরি নিরাপত্তা বার্তা: সামাজিক মাধ্যমে প্রচারিত কোনো গুজবে কান না দিয়ে নির্ভরযোগ্য তথ্য যাচাই করুন।',
                'ডিজিটাল সুরক্ষা সতর্কতা: অনলাইন ব্যাংকিং বা আর্থিক সেবার গোপন ওটিপি (OTP) ও পিন কারো সাথে শেয়ার করবেন না।',
                'জরুরি স্বাস্থ্য বার্তা: মৌসুমি রোগ প্রতিরোধে বাড়ির আঙিনা পরিষ্কার রাখুন এবং স্বাস্থ্যবিধি মেনে চলুন।',
                'জাতীয় জরুরি সেবা নম্বর: যেকোনো সংকটকালে ৯৯৯ (জাতীয় জরুরি সেবা) ও ৩৩৩ (তথ্য বাতায়ন)-এ যোগাযোগ করুন।'
              ]).map((notice, idx) => (
                <span
                  key={`notice-${idx}`}
                  className="inline-flex items-center gap-2 mr-6 text-white font-semibold text-xs transition-colors hover:text-white/80"
                >
                  <span className="text-white/60 font-black">•</span>
                  {notice}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Brand Bar (Prevents Squeezing & Line Breaking on Mobile) */}
      <div className="sm:hidden px-3 py-1.5 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#080808]">
        <div 
          onClick={() => { onCategorySelect('ALL'); onModeSwitch('viewer'); }}
          className="cursor-pointer flex items-center justify-center gap-2 mx-auto"
        >
          {siteSettings?.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings.siteName || "Website Logo"}
              className="w-7 h-7 rounded-lg object-contain shrink-0 shadow-sm border border-slate-200 dark:border-slate-800"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80"
                alt="Website Logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-left leading-tight">
            <h1 className="font-extrabold text-xs uppercase tracking-tight text-black dark:text-white flex items-center gap-1">
              <span className="whitespace-nowrap">{siteSettings?.siteName || 'THE RECAP MEDIA CAST'}</span>
              <span className="text-[8px] tracking-normal font-sans font-bold text-black dark:text-white border border-black dark:border-white px-1 rounded shrink-0">LTD</span>
            </h1>
            <p className="text-[9px] text-black dark:text-zinc-300 font-semibold tracking-wide truncate max-w-[220px]">
              {siteSettings?.siteTagline || t('tagline')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Header Toolbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          {/* Left Drawer Menu Button */}
          <button
            onClick={() => setLeftMenuOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs border border-black transition-all shadow-sm shrink-0 cursor-pointer"
            title="মেনু খুলুন"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="text-xs text-white">মেনু</span>
          </button>

          {/* Desktop Logo & Title */}
          <div 
            onClick={() => { onCategorySelect('ALL'); onModeSwitch('viewer'); }}
            className="hidden sm:flex cursor-pointer group items-center gap-3"
          >
            {siteSettings?.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName || "Website Logo"}
                className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80"
                  alt="Website Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="font-extrabold text-xl sm:text-2xl tracking-tighter uppercase text-black dark:text-white flex items-center gap-1.5">
                {siteSettings?.siteName || 'THE RECAP MEDIA CAST'} <span className="text-xs tracking-normal font-sans font-bold text-black dark:text-white border border-black dark:border-white px-1.5 py-0.5 rounded">LTD</span>
              </h1>
              <p className="text-[11px] text-black dark:text-zinc-300 font-semibold tracking-wide">
                {siteSettings?.siteTagline || t('tagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Search Trigger Pill */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-black dark:text-white cursor-pointer transition-colors"
              title="বিস্তারিত অনুসন্ধান করুন"
            >
              <Search className="w-4 h-4 text-black dark:text-white" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSearchModal(true);
                }
              }}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-full border border-black bg-white text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-text font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-black hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 rounded-xl bg-black border border-black text-white hover:bg-zinc-800 cursor-pointer transition-colors shadow-sm"
            title="সংবাদ অনুসন্ধান (Search)"
          >
            <Search className="w-4 h-4 text-white" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-xl bg-black border border-black text-white hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
            title={t('bookmarks')}
          >
            <Bookmark className="w-4 h-4 text-white" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-xs">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Offline Saved Articles */}
          <button
            onClick={onOpenOffline}
            className="relative p-2 rounded-xl bg-black border border-black text-white hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
            title={t('offlineSaved')}
          >
            <WifiOff className="w-4 h-4 text-white" />
            {offlineCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-xs">
                {offlineCount}
              </span>
            )}
          </button>

          {/* Regular Reader Profile / Auth Button */}
          <button
            onClick={onOpenProfile}
            title={user ? `নিয়মিত পাঠক: ${user.name}` : 'নিয়মিত পাঠক একাউন্ট (সাইন-ইন / সাইন-আপ)'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold border border-black transition-all cursor-pointer shadow-sm"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
            ) : (
              <User className="w-4 h-4 text-white shrink-0" />
            )}
            <span className="hidden md:inline text-white">{user ? user.name : 'নিয়মিত পাঠক'}</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none">
          <button
            onClick={() => onCategorySelect('ALL')}
            className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm ${
              selectedCategory === 'ALL'
                ? 'bg-black text-white border-2 border-zinc-700 ring-1 ring-black font-black'
                : 'bg-black text-white hover:bg-zinc-800 border border-black'
            }`}
          >
            {t('allCategories')}
          </button>
          {Array.from(
            new Set(
              categories && categories.length > 0
                ? categories.filter((c) => !c.isHidden).map((c) => c.name)
                : CATEGORIES
            )
          ).map((catName, idx) => (
            <button
              key={`nav-cat-${catName}-${idx}`}
              onClick={() => onCategorySelect(catName as Category)}
              className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === catName
                  ? 'bg-black text-white border-2 border-zinc-700 ring-1 ring-black font-black'
                  : 'bg-black text-white hover:bg-zinc-800 border border-black'
              }`}
            >
              {catName}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => { onCategorySelect('ALL'); setMobileMenuOpen(false); }}
              className="p-2 text-left bg-black text-white rounded-md font-bold"
            >
              {t('allCategories')}
            </button>
            {Array.from(new Set(CATEGORIES)).map((cat, idx) => (
              <button
                key={`mobile-cat-${cat}-${idx}`}
                onClick={() => { onCategorySelect(cat); setMobileMenuOpen(false); }}
                className="p-2 text-left bg-black hover:bg-zinc-800 rounded-md text-white font-bold transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Left Sliding Drawer Menu Overlay */}
      {leftMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setLeftMenuOpen(false)} />

          {/* Sliding Menu Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-[#0a0a0a] h-full overflow-y-auto shadow-2xl p-5 border-r border-slate-200 dark:border-zinc-800 space-y-6 flex flex-col justify-between z-10">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  {siteSettings?.logoUrl ? (
                    <img
                      src={siteSettings.logoUrl}
                      alt="Logo"
                      className="w-8 h-8 rounded-lg object-cover shadow border border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-base shadow overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80"
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-xs text-black dark:text-white uppercase tracking-tight">
                      {siteSettings?.siteName || 'THE RECAP MEDIA'}
                    </h3>
                    <span className="text-[10px] text-black dark:text-zinc-400 font-semibold block">মেনু সার্ভিসেস</span>
                  </div>
                </div>
                <button
                  onClick={() => setLeftMenuOpen(false)}
                  className="p-1.5 text-white bg-black hover:bg-zinc-800 rounded-full border border-black transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. HOME, WRITER'S PANEL & ADMIN PANEL BUTTONS */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-black dark:text-white uppercase tracking-wider block px-1">
                  প্যানেল অ্যাক্সেস
                </span>

                {/* Home (Viewer Site) Button */}
                <button
                  onClick={() => {
                    onCategorySelect('ALL');
                    onModeSwitch('viewer');
                    setLeftMenuOpen(false);
                  }}
                  className="w-full p-3 bg-black hover:bg-zinc-800 text-white rounded-2xl shadow-sm border border-black transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold flex items-center gap-1.5 text-white">
                        🏠 Home
                      </h4>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Writer Panel Button */}
                <button
                  onClick={() => {
                    onModeSwitch('writer');
                    setLeftMenuOpen(false);
                  }}
                  className="w-full p-3 bg-black hover:bg-zinc-800 text-white rounded-2xl shadow-sm border border-black transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold">
                      <PenTool className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold flex items-center gap-1.5 text-white">
                        ✍️ প্রতিবেদক প্যানেল (Reporters Panel)
                      </h4>
                      <p className="text-[10px] text-zinc-300">
                        সংবাদ ও রিপোর্ট প্রকাশ প্যানেলে যান
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Managing Panel Button */}
                <button
                  onClick={() => {
                    onModeSwitch('managing');
                    setLeftMenuOpen(false);
                  }}
                  className="w-full p-3 bg-black hover:bg-zinc-800 text-white rounded-2xl shadow-sm border border-black transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold flex items-center gap-1.5 text-white">
                        🏢 Managing Panel (ব্যবস্থাপনা প্যানেল)
                      </h4>
                      <p className="text-[10px] text-zinc-300">
                        প্রতিবেদক নিয়ন্ত্রণ ও কন্টেন্ট মডারেশন
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Admin Panel Button */}
                <button
                  onClick={() => {
                    onModeSwitch('systemAdmin');
                    setLeftMenuOpen(false);
                  }}
                  className="w-full p-3 bg-black hover:bg-zinc-800 text-white rounded-2xl shadow-sm border border-black transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold flex items-center gap-1.5 text-white">
                        🛡️ Admin Panel (অ্যাডমিন প্যানেল)
                      </h4>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 2. ABOUT, PRIVACY & CONTACT LINKS */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-black dark:text-white uppercase tracking-wider block px-1">
                  প্রতিষ্ঠান ও সাপোর্ট
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setActiveInfoModal('about');
                      setLeftMenuOpen(false);
                    }}
                    className="w-full p-2.5 text-left text-xs font-bold bg-black text-white hover:bg-zinc-800 rounded-xl border border-black flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <Info className="w-4 h-4 text-white" /> About us (আমাদের কথা)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveInfoModal('privacy');
                      setLeftMenuOpen(false);
                    }}
                    className="w-full p-2.5 text-left text-xs font-bold bg-black text-white hover:bg-zinc-800 rounded-xl border border-black flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <ShieldCheck className="w-4 h-4 text-white" /> Privacy & Policy (প্রাইভেসি পলিসি)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveInfoModal('contact');
                      setLeftMenuOpen(false);
                    }}
                    className="w-full p-2.5 text-left text-xs font-bold bg-black text-white hover:bg-zinc-800 rounded-xl border border-black flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-white">
                      <PhoneCall className="w-4 h-4 text-white" /> Contact with us (যোগাযোগ)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>

              {/* 3. SOCIAL WIDGETS (Facebook, Instagram, YouTube, Telegram, etc.) */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-black dark:text-white uppercase tracking-wider block px-1">
                  সোশ্যাল মিডিয়া পেজ (Social Widgets)
                </span>
                <div className="space-y-2">
                  {(siteSettings?.socialWidgets && siteSettings.socialWidgets.length > 0 ? siteSettings.socialWidgets : [
                    { id: 'soc-fb', name: 'Facebook Page', platform: 'facebook' as const, url: 'https://facebook.com/therecapmediacast', badge: 'ফলো', isActive: true },
                    { id: 'soc-yt', name: 'YouTube Channel', platform: 'youtube' as const, url: 'https://youtube.com/@therecapmediacast', badge: 'সাবস্ক্রাইব', isActive: true },
                    { id: 'soc-ig', name: 'Instagram Profile', platform: 'instagram' as const, url: 'https://instagram.com/therecapmediacast', badge: 'ফলো', isActive: true },
                  ]).filter(s => s.isActive !== false).map((soc) => {
                    let IconComponent = Globe;
                    const plat = soc.platform || '';
                    const n = soc.name.toLowerCase();

                    if (plat === 'facebook' || n.includes('facebook')) {
                      IconComponent = Facebook;
                    } else if (plat === 'youtube' || n.includes('youtube')) {
                      IconComponent = Youtube;
                    } else if (plat === 'instagram' || n.includes('instagram')) {
                      IconComponent = Instagram;
                    } else if (plat === 'twitter' || n.includes('twitter') || n.includes(' x')) {
                      IconComponent = Twitter;
                    } else if (plat === 'whatsapp' || n.includes('whatsapp')) {
                      IconComponent = MessageCircle;
                    } else if (plat === 'telegram' || n.includes('telegram')) {
                      IconComponent = Send;
                    }

                    return (
                      <a
                        key={soc.id}
                        href={soc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-2xl border border-zinc-800 bg-black text-white flex items-center justify-between hover:bg-zinc-900 transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-zinc-900 text-white border border-zinc-700 shadow-xs">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">
                              {soc.name}
                            </h5>
                            <p className="text-[10px] text-zinc-300 truncate max-w-[130px] font-mono">
                              {soc.url.replace(/^https?:\/\//, '')}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shrink-0 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white">
                          {soc.badge || 'ভিজিট'} <ExternalLink className="w-3 h-3 text-white" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* 4. NEWS CATEGORIES */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-black dark:text-white uppercase tracking-wider block px-1">
                  সংবাদ ক্যাটাগরি (Categories)
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {Array.from(
                    new Set(
                      categories && categories.length > 0
                        ? categories.filter(c => !c.isHidden).map(c => c.name as Category)
                        : CATEGORIES
                    )
                  ).map((cat, idx) => (
                    <button
                      key={`drawer-cat-${cat}-${idx}`}
                      onClick={() => {
                        onCategorySelect(cat);
                        onModeSwitch('viewer');
                        setLeftMenuOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left font-bold transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-black text-white border-2 border-white/60 ring-2 ring-black'
                          : 'bg-black text-white hover:bg-zinc-800 border border-black'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-black dark:text-zinc-300 font-bold text-center">
              THE RECAP MEDIA CAST LTD © ২০২৬
            </div>
          </div>
        </div>
      )}

      {/* Info Modals (About, Privacy, Contact) */}
      <InfoModals
        activeModal={activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
        currentLang={currentLang}
        siteSettings={siteSettings}
      />

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        articles={articles && articles.length > 0 ? articles : (breakingArticles || [])}
        onSelectArticle={onSelectArticle}
        initialQuery={searchQuery}
        onCategorySelect={onCategorySelect}
        currentLang={currentLang}
      />
    </header>
  );
};
