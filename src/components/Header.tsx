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
  PenTool,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Home
} from 'lucide-react';
import { Language, NewsArticle, Category, UserProfile, CategoryConfig, SiteSettings } from '../types';
import { getTranslation } from '../utils/i18n';
import { InfoModals } from './InfoModals';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  currentMode: 'viewer' | 'writer' | 'systemAdmin';
  onModeSwitch: (mode: 'viewer' | 'writer' | 'systemAdmin') => void;
  breakingArticles: NewsArticle[];
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
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-white/10 shadow-md transition-colors duration-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 dark:bg-[#050505] text-slate-200 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 dark:border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-wider text-red-500 flex items-center gap-1.5 text-[11px] uppercase">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE
          </span>
          <span className="hidden sm:inline text-gray-400 text-[11px] tracking-wide">
            {new Date().toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <div className="flex items-center gap-2 text-gray-400">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]" title="Online mode active">
                <Wifi className="w-3.5 h-3.5" /> <span className="hidden md:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 text-[11px]" title="Offline reading mode enabled">
                <WifiOff className="w-3.5 h-3.5" /> <span>Offline Mode</span>
              </span>
            )}
            <span className="hidden lg:flex items-center gap-1 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30" title="Firebase Firestore Realtime Database Connected">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              Firebase Live
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-white/5 rounded-full p-0.5 border border-white/10">
            <button
              onClick={() => onLanguageChange('bn')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                currentLang === 'bn'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🇧🇩 BN
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                currentLang === 'en'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onDarkModeToggle}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title={t(darkMode ? 'lightMode' : 'darkMode')}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Breaking News Marquee Banner (Right to Left Animation) */}
      {breakingArticles.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-600/20 text-xs py-2 px-4 flex items-center overflow-hidden">
          <div className="flex items-center gap-2 bg-red-600 text-white font-bold px-3 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 shadow-sm animate-pulse">
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
            {t('breakingNews')}
          </div>

          <div className="overflow-hidden whitespace-nowrap ml-3 relative flex-1">
            <div className="inline-block animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
              {breakingArticles.map((art) => (
                <span
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="inline-flex items-center gap-2 mr-8 hover:underline text-slate-900 dark:text-gray-100 font-bold text-xs sm:text-sm transition-colors hover:text-red-600 dark:hover:text-red-400"
                >
                  <span className="text-red-600 dark:text-red-500 font-black">•</span>
                  {currentLang === 'en' && art.titleEn ? art.titleEn : art.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Left Drawer Menu Button */}
          <button
            onClick={() => setLeftMenuOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/10 transition-all shadow-sm"
            title="বামপাশের মেনু খুলুন"
          >
            <Menu className="w-5 h-5 text-red-600 dark:text-red-500" />
            <span className="hidden sm:inline">মেনু</span>
          </button>

          {/* Logo */}
          <div 
            onClick={() => { onCategorySelect('ALL'); onModeSwitch('viewer'); }}
            className="cursor-pointer group flex items-center gap-3"
          >
            {siteSettings?.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName || "Website Logo"}
                className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80"
                  alt="Website Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="font-bold text-xl sm:text-2xl tracking-tighter uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                {siteSettings?.siteName || 'THE RECAP MEDIA CAST'} <span className="text-xs tracking-normal font-sans font-semibold text-gray-400 border border-white/10 px-1.5 py-0.5 rounded">LTD</span>
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                {siteSettings?.siteTagline || t('tagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Pill */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>

          <button
            onClick={() => setShowSearchModal(true)}
            className="sm:hidden p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-700 dark:text-gray-200"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            title={t('bookmarks')}
          >
            <Bookmark className="w-4 h-4 text-red-500" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Offline Saved Articles */}
          <button
            onClick={onOpenOffline}
            className="relative p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            title={t('offlineSaved')}
          >
            <WifiOff className="w-4 h-4 text-amber-500" />
            {offlineCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {offlineCount}
              </span>
            )}
          </button>

          {/* Profile / Auth Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold border border-slate-200 dark:border-white/10 transition-all"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-slate-600 dark:text-gray-300" />
            )}
            <span className="hidden md:inline">{user ? user.name : t('signUpLogin')}</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#0a0a0a]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => onCategorySelect('ALL')}
            className={`px-3.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'text-white border-b-2 border-red-600 pb-0.5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('allCategories')}
          </button>
          {(categories && categories.length > 0
            ? categories.filter((c) => !c.isHidden).map((c) => c.name)
            : CATEGORIES
          ).map((catName) => (
            <button
              key={catName}
              onClick={() => onCategorySelect(catName)}
              className={`px-3.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === catName
                  ? 'text-red-600 dark:text-red-500 border-b-2 border-red-600 font-extrabold'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {catName}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => { onCategorySelect('ALL'); setMobileMenuOpen(false); }}
              className="p-2 text-left bg-slate-100 dark:bg-slate-800 rounded-md font-semibold text-red-600 dark:text-red-400"
            >
              {t('allCategories')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { onCategorySelect(cat); setMobileMenuOpen(false); }}
                className="p-2 text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 rounded-md text-slate-800 dark:text-slate-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Left Sliding Drawer Menu Overlay */}
      {leftMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex justify-start animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setLeftMenuOpen(false)} />

          {/* Sliding Menu Panel */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl p-5 border-r border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between z-10">
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
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-amber-600 text-white flex items-center justify-center font-black text-base shadow overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=100&q=80"
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-tight">
                      {siteSettings?.siteName || 'THE RECAP MEDIA'}
                    </h3>
                    <span className="text-[10px] text-slate-400 block">মেনু সার্ভিসেস</span>
                  </div>
                </div>
                <button
                  onClick={() => setLeftMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. HOME, WRITER'S PANEL & ADMIN PANEL BUTTONS */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  প্যানেল অ্যাক্সেস
                </span>

                {/* Home (Viewer Site) Button */}
                <button
                  onClick={() => {
                    onCategorySelect('ALL');
                    onModeSwitch('viewer');
                    setLeftMenuOpen(false);
                  }}
                  className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                      <Home className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold flex items-center gap-1.5">
                        🏠 Home
                      </h4>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Writer Panel Button */}
                <button
                  onClick={() => {
                    onModeSwitch('writer');
                    setLeftMenuOpen(false);
                  }}
                  className="w-full p-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-2xl shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                      <PenTool className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold flex items-center gap-1.5">
                        ✍️ লেখক প্যানেল (Writers Panel)
                      </h4>
                      <p className="text-[10px] text-white/80">
                        সংবাদ ও রিপোর্ট প্রকাশ প্যানেলে যান
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Admin Panel Button */}
                <button
                  onClick={() => {
                    onModeSwitch('systemAdmin');
                    setLeftMenuOpen(false);
                  }}
                  className="w-full p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 hover:from-slate-800 hover:to-red-900 text-white rounded-2xl shadow-md border border-red-500/30 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold flex items-center gap-1.5 text-white">
                        🛡️ Admin Panel (অ্যাডমিন প্যানেল)
                      </h4>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 2. ABOUT, PRIVACY & CONTACT LINKS */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  প্রতিষ্ঠান ও সাপোর্ট
                </span>
                <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setActiveInfoModal('about');
                      setLeftMenuOpen(false);
                    }}
                    className="w-full p-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-red-500" /> About us (আমাদের কথা)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveInfoModal('privacy');
                      setLeftMenuOpen(false);
                    }}
                    className="w-full p-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy & Policy (প্রাইভেসি পলিসি)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveInfoModal('contact');
                      setLeftMenuOpen(false);
                    }}
                    className="w-full p-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-amber-500" /> Contact with us (যোগাযোগ)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* 3. SOCIAL WIDGETS (Facebook, Instagram, YouTube) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  সোশ্যাল মিডিয়া পেজ (Social Widgets)
                </span>
                <div className="space-y-2">
                  {/* Facebook Widget */}
                  <a
                    href="https://facebook.com/therecapmediacast"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 flex items-center justify-between hover:scale-[1.02] transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <Facebook className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          Facebook Page
                        </h5>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-600 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                      ফলো <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>

                  {/* Instagram Widget */}
                  <a
                    href="https://instagram.com/therecapmediacast"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-pink-50 dark:bg-pink-950/40 rounded-2xl border border-pink-200 dark:border-pink-900 flex items-center justify-between hover:scale-[1.02] transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          Instagram Profile
                        </h5>
                      </div>
                    </div>
                    <span className="text-[10px] bg-pink-600 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                      ফলো <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>

                  {/* YouTube Widget */}
                  <a
                    href="https://youtube.com/@therecapmediacast"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900 flex items-center justify-between hover:scale-[1.02] transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                        <Youtube className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          YouTube Channel
                        </h5>
                      </div>
                    </div>
                    <span className="text-[10px] bg-red-600 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                      সাবস্ক্রাইব <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                </div>
              </div>

              {/* 4. NEWS CATEGORIES */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  সংবাদ ক্যাটাগরি (Categories)
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {(categories && categories.length > 0
                    ? categories.filter(c => !c.isHidden).map(c => c.name as Category)
                    : CATEGORIES
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onCategorySelect(cat);
                        onModeSwitch('viewer');
                        setLeftMenuOpen(false);
                      }}
                      className={`p-2 rounded-xl text-left font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
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
      />
    </header>
  );
};
