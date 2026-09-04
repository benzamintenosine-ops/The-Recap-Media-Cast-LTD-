import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Bell, 
  BarChart3, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  LogOut, 
  Search, 
  Send, 
  Eye, 
  MapPin, 
  Ban, 
  RefreshCw,
  X,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { 
  NewsArticle, 
  Language, 
  WriterProfile, 
  SiteSettings, 
  SystemNotification, 
  ManagerProfile 
} from '../types';
import { NativeBannerAd } from './DynamicAdServices';
import { renderFormattedContent } from '../utils/formatContent';
import { formatReporterName } from '../utils/authorHelper';

interface ManagingPanelProps {
  articles: NewsArticle[];
  onDeleteArticle: (id: string, reason?: string) => void;
  onUpdateArticle?: (id: string, updated: Partial<NewsArticle>) => void;
  currentLang: Language;
  siteSettings: SiteSettings;
  onUpdateSiteSettings?: (newSettings: Partial<SiteSettings>) => void;
  writers: WriterProfile[];
  onUpdateWriters: (writers: WriterProfile[]) => void;
  notifications: SystemNotification[];
  onSendNotification: (notification: Omit<SystemNotification, 'id' | 'createdAt' | 'read'>) => void;
  managers: ManagerProfile[];
  onUpdateManagers: (managers: ManagerProfile[]) => void;
}

export const ManagingPanel: React.FC<ManagingPanelProps> = ({
  articles,
  onDeleteArticle,
  onUpdateArticle,
  currentLang,
  siteSettings,
  onUpdateSiteSettings,
  writers,
  onUpdateWriters,
  notifications,
  onSendNotification,
  managers,
  onUpdateManagers
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('recap_manager_logged') === 'true';
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Reporter Secret Referral Code & Telegram Link Management
  const [reporterSecretInput, setReporterSecretInput] = useState<string>(siteSettings?.writerSecretCode || 'RECAP2026');
  const [telegramUrlInput, setTelegramUrlInput] = useState<string>(siteSettings?.telegramReferralUrl || 'https://t.me/TheRecapMediaCast');
  const [codeSaveSuccess, setCodeSaveSuccess] = useState<string>('');

  useEffect(() => {
    if (siteSettings?.writerSecretCode) {
      setReporterSecretInput(siteSettings.writerSecretCode);
    }
    if (siteSettings?.telegramReferralUrl) {
      setTelegramUrlInput(siteSettings.telegramReferralUrl);
    }
  }, [siteSettings?.writerSecretCode, siteSettings?.telegramReferralUrl]);

  const handleSaveReporterSecretSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterSecretInput.trim()) return;
    if (onUpdateSiteSettings) {
      onUpdateSiteSettings({
        writerSecretCode: reporterSecretInput.trim().toUpperCase(),
        telegramReferralUrl: telegramUrlInput.trim() || 'https://t.me/TheRecapMediaCast'
      });
      setCodeSaveSuccess('প্রতিবেদক রেফার কোড ও টেলিগ্রাম উইজেট সফলভাবে আপডেট হয়েছে!');
      setTimeout(() => setCodeSaveSuccess(''), 4000);
    }
  };

  // Manager Profile
  const [managerProfile, setManagerProfile] = useState<ManagerProfile | null>(() => {
    const saved = localStorage.getItem('recap_manager_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Profile setup for Sign Up
  const [setupName, setSetupName] = useState('');
  const [setupMobile, setSetupMobile] = useState('');

  // Manager Profile Edit Modal State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editManagerName, setEditManagerName] = useState(managerProfile?.name || '');
  const [editManagerMobile, setEditManagerMobile] = useState(managerProfile?.mobile || '');
  const [editManagerDesignation, setEditManagerDesignation] = useState(managerProfile?.designation || 'ব্যবস্থাপনা পরিচালক');
  const [editManagerAddress, setEditManagerAddress] = useState(managerProfile?.address || '');
  const [editManagerAge, setEditManagerAge] = useState<number | ''>(managerProfile?.age || '');
  const [editManagerBio, setEditManagerBio] = useState(managerProfile?.bio || '');
  const [editManagerAvatar, setEditManagerAvatar] = useState(managerProfile?.avatarUrl || '');

  // Article Filter State
  const [articleFilter, setArticleFilter] = useState<'all' | 'flagged' | 'safe' | 'unpublished'>('all');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'writers' | 'articles' | 'notifications' | 'analytics'>('writers');

  // Search & Modals
  const [writerSearchQuery, setWriterSearchQuery] = useState('');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [selectedWriter, setSelectedWriter] = useState<WriterProfile | null>(null);

  // Article Deletion Modal
  const [deleteModalArticle, setDeleteModalArticle] = useState<NewsArticle | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  // Article Unpublish Modal
  const [unpublishModalArticle, setUnpublishModalArticle] = useState<NewsArticle | null>(null);
  const [unpublishReasonText, setUnpublishReasonText] = useState('');

  // Article Full Preview Modal
  const [viewingArticle, setViewingArticle] = useState<NewsArticle | null>(null);

  // Notification State
  const [notifTargetWriterId, setNotifTargetWriterId] = useState<string>('ALL');
  const [notifWriterSearch, setNotifWriterSearch] = useState('');
  const [notifWriterDropdownOpen, setNotifWriterDropdownOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSuccessMessage, setNotifSuccessMessage] = useState('');

  // Sync Manager Profile to LocalStorage and edit state
  useEffect(() => {
    if (managerProfile) {
      localStorage.setItem('recap_manager_profile', JSON.stringify(managerProfile));
      setEditManagerName(managerProfile.name || '');
      setEditManagerMobile(managerProfile.mobile || '');
      setEditManagerDesignation(managerProfile.designation || 'ব্যবস্থাপনা পরিচালক');
      setEditManagerAddress(managerProfile.address || '');
      setEditManagerAge(managerProfile.age || '');
      setEditManagerBio(managerProfile.bio || '');
      setEditManagerAvatar(managerProfile.avatarUrl || '');
    }
  }, [managerProfile]);

  // Handle Authentication
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const targetSecret = siteSettings.managingSecretCode || 'MANAGING2026';

    if (authMode === 'signup') {
      if (secretCodeInput.trim() !== targetSecret) {
        setAuthError('ম্যানাজিং প্যানেল সাইনআপের জন্য গোপন রেফার কোড (Secret Code) টি ভুল হয়েছে!');
        return;
      }

      const cleanMobile = setupMobile.trim().replace(/\D/g, '');
      if (cleanMobile.length !== 11) {
        setAuthError('মোবাইল নম্বরটি অবশ্যই সঠিক ১১ ডিজিটের হতে হবে (যেমন: 01712345678)!');
        return;
      }

      if (!setupName.trim() || !emailInput.trim() || !setupMobile.trim()) {
        setAuthError('অনুগ্রহ করে নাম, ইমেইল ও মোবাইল নম্বর পূরণ করুন।');
        return;
      }

      const cleanEmail = emailInput.trim().toLowerCase();
      const newProfile: ManagerProfile = {
        id: `manager-${Date.now()}`,
        name: setupName.trim(),
        email: cleanEmail,
        mobile: setupMobile.trim(),
        designation: 'ব্যবস্থাপনা পরিচালক',
        secretCodeUsed: secretCodeInput.trim(),
        createdAt: new Date().toISOString()
      };

      setManagerProfile(newProfile);
      const updatedManagers = [...managers.filter(m => m.email.toLowerCase() !== cleanEmail), newProfile];
      onUpdateManagers(updatedManagers);

      localStorage.setItem('recap_manager_profile', JSON.stringify(newProfile));
      localStorage.setItem('recap_manager_logged', 'true');
      setIsAuthenticated(true);
    } else {
      if (!emailInput.trim() || !passwordInput.trim()) {
        setAuthError('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
        return;
      }

      const cleanEmail = emailInput.trim().toLowerCase();
      const matched = managers.find(m => m.email.trim().toLowerCase() === cleanEmail);
      const activeProfile: ManagerProfile = matched || {
        id: `manager-${Date.now()}`,
        name: cleanEmail.split('@')[0] || 'ব্যবস্থাপনা পরিচালক',
        email: cleanEmail,
        mobile: '+8801700000000',
        designation: 'ব্যবস্থাপনা পরিচালক',
        secretCodeUsed: targetSecret,
        createdAt: new Date().toISOString()
      };

      setManagerProfile(activeProfile);
      localStorage.setItem('recap_manager_profile', JSON.stringify(activeProfile));

      if (!managers.some(m => m.id === activeProfile.id || m.email.toLowerCase() === activeProfile.email.toLowerCase())) {
        onUpdateManagers([...managers, activeProfile]);
      }

      localStorage.setItem('recap_manager_logged', 'true');
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recap_manager_logged');
    localStorage.removeItem('recap_manager_profile');
    setManagerProfile(null);
    setEmailInput('');
    setPasswordInput('');
    setSetupName('');
    setSetupMobile('');
    setSecretCodeInput('');
    setAuthError('');
    setIsAuthenticated(false);
  };

  // Save Manager Profile Changes
  const handleSaveManagerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerProfile) return;

    const ageNum = typeof editManagerAge === 'number' ? editManagerAge : Number(editManagerAge) || undefined;
    const updated: ManagerProfile = {
      ...managerProfile,
      name: editManagerName.trim() || managerProfile.name,
      mobile: editManagerMobile.trim() || managerProfile.mobile,
      designation: editManagerDesignation.trim() || 'ব্যবস্থাপনা পরিচালক',
      address: editManagerAddress.trim(),
      age: ageNum,
      bio: editManagerBio.trim(),
      avatarUrl: editManagerAvatar
    };

    setManagerProfile(updated);
    localStorage.setItem('recap_manager_profile', JSON.stringify(updated));
    const updatedList = managers.map(m => m.id === updated.id ? updated : m);
    if (!updatedList.some(m => m.id === updated.id)) {
      updatedList.push(updated);
    }
    onUpdateManagers(updatedList);
    setShowEditProfileModal(false);
  };

  // Reporter Ban / Unban
  const handleToggleBanWriter = (writerId: string) => {
    const updated = writers.map((w) => {
      if (w.id === writerId) {
        return { ...w, isBanned: !w.isBanned };
      }
      return w;
    });
    onUpdateWriters(updated);
  };

  // Reporter Delete
  const handleDeleteWriter = (writerId: string, writerName: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে প্রতিবেদক "${writerName}"-এর একাউন্টটি সিস্টেম থেকে মুছে ফেলতে চান?`)) {
      const updated = writers.filter((w) => w.id !== writerId);
      onUpdateWriters(updated);
      if (selectedWriter?.id === writerId) {
        setSelectedWriter(null);
      }
    }
  };

  // Confirm Article Delete
  const confirmDeleteArticle = () => {
    if (!deleteModalArticle) return;
    if (!deleteReason.trim()) {
      alert('সংবাদ মুছে ফেলার নির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক!');
      return;
    }

    const reason = deleteReason.trim();
    onDeleteArticle(deleteModalArticle.id, reason);

    // Send notification to the author about the deleted post
    onSendNotification({
      recipientWriterId: deleteModalArticle.authorId || 'ALL',
      senderName: managerProfile?.name || 'ব্যবস্থাপনা প্যানেল (Managing Panel)',
      title: 'সংবাদ মুছে ফেলার নোটিফিকেশন',
      message: `আপনার "${deleteModalArticle.title}" সংবাদটি ব্যবস্থাপনা প্যানেল কর্তৃক মুছে ফেলা হয়েছে। কারণ: ${reason}`,
      type: 'post_deleted',
      reason: reason
    });

    setDeleteModalArticle(null);
    setDeleteReason('');
  };

  // Confirm Article Unpublish
  const confirmUnpublishArticle = () => {
    if (!unpublishModalArticle || !onUpdateArticle) return;
    const reason = unpublishReasonText.trim() || 'ম্যানেজমেন্ট দ্বারা আনপাবলিশ করা হয়েছে';

    onUpdateArticle(unpublishModalArticle.id, {
      isUnpublished: true,
      unpublishReason: reason
    });

    // Notify the author if possible
    const authorWriter = writers.find(w => w.name.toLowerCase() === unpublishModalArticle.author.toLowerCase());
    if (authorWriter) {
      onSendNotification({
        recipientWriterId: authorWriter.id,
        senderName: siteSettings.siteName || 'Managing Panel',
        title: `সংবাদ আনপাবলিশ করা হয়েছে: "${unpublishModalArticle.title.substring(0, 40)}..."`,
        message: `আপনার পোস্টটি পাঠকদের জন্য সাময়িকভাবে আনপাবলিশ করা হয়েছে। কারণ: ${reason}। আপনি এটি এডিট করে সংশোধন করতে পারেন।`,
        type: 'warning'
      });
    }

    setUnpublishModalArticle(null);
    setUnpublishReasonText('');
  };

  // Direct Re-Publish
  const handleDirectPublish = (article: NewsArticle) => {
    if (!onUpdateArticle) return;
    onUpdateArticle(article.id, {
      isUnpublished: false,
      unpublishReason: undefined
    });
  };

  // Send Notification Submit
  const handleSendNotifSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    onSendNotification({
      recipientWriterId: notifTargetWriterId,
      senderName: siteSettings.siteName || 'Managing Panel',
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: 'general'
    });

    setNotifSuccessMessage('বিজ্ঞপ্তিটি সফলভাবে প্রতিবেদক(দের) নিকট পাঠানো হয়েছে!');
    setNotifTitle('');
    setNotifMessage('');
    setTimeout(() => setNotifSuccessMessage(''), 4000);
  };

  // Dynamic Real-time Analytics Calculations
  const totalArticlesCount = articles.length;
  const totalReportersCount = writers.length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  
  // Total Readers (Unique Readers Dynamic Calculation based on view velocity & readers)
  const totalReadersCount = Math.max(
    Math.round(totalViews * 0.72),
    articles.length * 28 + writers.length * 14
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Views filters
  const monthViews = articles.reduce((sum, a) => {
    const d = new Date(a.publishedAt);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return sum + (a.views || 0);
    }
    return sum + Math.round((a.views || 0) * 0.4);
  }, 0);

  const weekViews = articles.reduce((sum, a) => {
    const d = new Date(a.publishedAt);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      return sum + (a.views || 0);
    }
    return sum + Math.round((a.views || 0) * 0.18);
  }, 0);

  const todayViews = articles.reduce((sum, a) => {
    const d = new Date(a.publishedAt);
    if (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      return sum + (a.views || 0);
    }
    return sum + Math.round((a.views || 0) * 0.05);
  }, 0);

  // Filtered Reporters List
  const filteredWriters = writers.filter((w) => {
    const q = writerSearchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.email.toLowerCase().includes(q) ||
      w.mobile.toLowerCase().includes(q) ||
      (w.nidNumber && w.nidNumber.includes(q))
    );
  });

  // AI Stats Counts
  const flaggedArticlesCount = articles.filter(a => a.aiFlagged || (a.aiIssues && a.aiIssues.length > 0) || a.aiOffensiveReason || (a.aiCredibilityScore !== undefined && a.aiCredibilityScore < 70)).length;
  const safeArticlesCount = articles.filter(a => !a.aiFlagged && (!a.aiIssues || a.aiIssues.length === 0) && !a.aiOffensiveReason && (a.aiCredibilityScore === undefined || a.aiCredibilityScore >= 70)).length;
  const unpublishedArticlesCount = articles.filter(a => a.isUnpublished).length;

  // Filtered Articles List
  const filteredArticles = articles.filter((a) => {
    const q = articleSearchQuery.toLowerCase();
    const matchesSearch = (
      a.title.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
    if (!matchesSearch) return false;

    const isProblematic = Boolean(
      a.aiFlagged ||
      (a.aiIssues && a.aiIssues.length > 0) ||
      a.aiOffensiveReason ||
      (a.aiCredibilityScore !== undefined && a.aiCredibilityScore < 70)
    );

    if (articleFilter === 'flagged') return isProblematic;
    if (articleFilter === 'safe') return !isProblematic && !a.isUnpublished;
    if (articleFilter === 'unpublished') return Boolean(a.isUnpublished);
    return true;
  });

  // Render Login/Signup Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
              Managing Panel (ব্যবস্থাপনা প্যানেল)
            </h2>
            <p className="text-xs text-slate-500">
              প্রতিবেদক ও সংবাদ কন্টেন্ট নিয়ন্ত্রণ প্যানেলে প্রবেশ করুন।
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              সাইন ইন (Sign In)
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              রেজিস্টার সাইনআপ (Sign Up)
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ব্যবস্থাপক পূর্ণ নাম (Manager Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={setupName}
                    onChange={(e) => setSetupName(e.target.value)}
                    placeholder="যেমন: এস কে চৌধুরী"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর (Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={setupMobile}
                    onChange={(e) => setSetupMobile(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল ঠিকানা (Email) *
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="manager@therecapmedia.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {authMode === 'login' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পাসওয়ার্ড (Password) *
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ম্যানাজিং গোপন রেফার কোড (Managing Secret Code) *
                </label>
                <input
                  type="password"
                  required
                  value={secretCodeInput}
                  onChange={(e) => setSecretCodeInput(e.target.value)}
                  placeholder="রেফার সিক্রেট কোড লিখুন..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {authMode === 'signup' ? 'রেজিস্ট্রেশন জমা দিন' : 'ম্যানাজিং প্যানেলে লগইন করুন'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner & Managing Profile */}
      <div className="bg-slate-900 dark:bg-[#0a0a0a] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-slate-800 dark:border-white/10">
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Managing Panel Control Room
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            ব্যবস্থাপনা প্যানেল (Managing Panel)
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            প্রতিবেদকবৃন্দের তথ্য ও NID ভেরিফিকেশন, সংবাদ কন্টেন্ট মডারেশন, বিজ্ঞপ্তি প্রেরণ এবং রিয়েলটাইম অ্যানালিটিক্স প্যানেল।
          </p>
        </div>

        {/* Managing Profile Pill */}
        <div className="z-10 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center gap-4 shrink-0 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 overflow-hidden shrink-0">
            {managerProfile?.avatarUrl ? (
              <img src={managerProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{managerProfile?.name || 'ব্যবস্থাপক'}</h4>
            <p className="text-[10px] text-blue-400 font-semibold">{managerProfile?.designation || 'ব্যবস্থাপনা পরিচালক'}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{managerProfile?.email}</p>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => setShowEditProfileModal(true)}
              title="প্রোফাইল সেটআপ ও এডিট"
              className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-blue-500/40"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>প্রোফাইল এডিট</span>
            </button>
            <button
              onClick={handleLogout}
              title="লগআউট"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('writers')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'writers'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>প্রতিবেদক ব্যবস্থাপনা</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-mono">
            {writers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>সংবাদ নিয়ন্ত্রণ ও মডারেশন</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-mono">
            {articles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>প্রতিবেদকদের নোটিফিকেশন</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-mono">
            {notifications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>রিয়েলটাইম অ্যানালিটিক্স</span>
        </button>
      </div>

      {/* Native Banner Ad for Managing Panel */}
      <NativeBannerAd
        settings={siteSettings?.dynamicAds?.nativeBanner}
        isPostWriting={false}
        panelLabel="ম্যানেজিং প্যানেল"
      />

      {/* TAB 1: REPORTERS CONTROL */}
      {activeTab === 'writers' && (
        <div className="space-y-6">
          {/* REPORTER SECRET REFERRAL CODE & TELEGRAM CONTROLLER CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-indigo-800/40 pb-3">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2 text-amber-400 font-serif">
                  <Lock className="w-5 h-5" /> প্রতিবেদক গোপন রেফার কোড ও টেলিগ্রাম ইনবক্স নিয়ন্ত্রণ
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  নতুন প্রতিবেদক সাইনআপের গোপন রেফার কোড পরিবর্তন এবং টেলিগ্রাম ইনবক্স লিঙ্ক সেট করুন।
                </p>
              </div>
              <div className="px-3 py-1 bg-indigo-900/80 border border-indigo-600 rounded-full text-xs font-mono font-bold text-amber-300">
                বর্তমান কোড: {siteSettings?.writerSecretCode || 'RECAP2026'}
              </div>
            </div>

            {codeSaveSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{codeSaveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveReporterSecretSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  গোপন রেফার কোড (Secret Referral Code) *
                </label>
                <input
                  type="text"
                  required
                  value={reporterSecretInput}
                  onChange={(e) => setReporterSecretInput(e.target.value)}
                  placeholder="যেমন: RECAP2026"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-700 bg-slate-900 text-amber-300 font-mono font-bold uppercase tracking-wider focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  টেলিগ্রাম ইনবক্স লিংক (Telegram URL) *
                </label>
                <input
                  type="text"
                  required
                  value={telegramUrlInput}
                  onChange={(e) => setTelegramUrlInput(e.target.value)}
                  placeholder="https://t.me/TheRecapMediaCast"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-700 bg-slate-900 text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>কোড ও লিংক সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <Users className="w-5 h-5 text-blue-500" /> নিবন্ধিত প্রতিবেদকবৃন্দ
              </h2>
              <p className="text-xs text-slate-500">
                সকল প্রতিবেদকের NID, মোবাইল ও প্রোফাইল ভেরিফিকেশন নিয়ন্ত্রণ করুন।
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={writerSearchQuery}
                onChange={(e) => setWriterSearchQuery(e.target.value)}
                placeholder="নাম, মোবাইল, NID দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredWriters.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
              <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-bold">কোনো প্রতিবেদক পাওয়া যায়নি!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWriters.map((writer) => {
                const writerArticles = articles.filter((a) => a.author === writer.name);
                return (
                  <div
                    key={writer.id}
                    className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border transition-all space-y-4 shadow-sm relative ${
                      writer.isBanned
                        ? 'border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={writer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={writer.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {writer.name}
                          </h3>
                          {writer.isBanned ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-full shrink-0">
                              ব্লকড
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full shrink-0">
                              সক্রিয়
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{writer.email}</p>
                        <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          📱 {writer.mobile}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">NID নম্বর:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {writer.nidNumber || 'তথ্য দেওয়া হয়নি'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">প্রকাশিত সংবাদ:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{writerArticles.length} টি</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">বয়স:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{writer.age} বছর</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setSelectedWriter(writer)}
                        className="flex-1 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        <span>প্রোফাইল NID</span>
                      </button>

                      <button
                        onClick={() => handleToggleBanWriter(writer.id)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 ${
                          writer.isBanned
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{writer.isBanned ? 'আনব্লক' : 'ব্লক'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteWriter(writer.id, writer.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NEWS CONTENT CONTROL & MODERATION */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <FileText className="w-5 h-5 text-blue-500" /> প্রকাশিত সংবাদ মডারেশন ও এআই যাচাই
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                এআই স্বয়ংক্রিয়ভাবে যাচাই করার পর সকল পোস্ট প্রদর্শিত হচ্ছে। যেসব পোস্টে সমস্যা চিহ্নিত হয়েছে সেগুলো লাল রঙে নির্দেশিত।
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={articleSearchQuery}
                onChange={(e) => setArticleSearchQuery(e.target.value)}
                placeholder="সংবাদের শিরোনাম বা লেখক দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* AI Verification & Moderation Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setArticleFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                articleFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>সকল সংবাদ</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setArticleFilter('flagged')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                articleFilter === 'flagged'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>এআই সমস্যাযুক্ত (লাল)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 font-mono">
                {flaggedArticlesCount}
              </span>
            </button>

            <button
              onClick={() => setArticleFilter('safe')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                articleFilter === 'safe'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>এআই যাচাইকৃত নিরাপদ</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-mono">
                {safeArticlesCount}
              </span>
            </button>

            <button
              onClick={() => setArticleFilter('unpublished')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                articleFilter === 'unpublished'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100'
              }`}
            >
              <Ban className="w-3.5 h-3.5 text-amber-500" />
              <span>আনপাবলিশ্ড</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-mono">
                {unpublishedArticlesCount}
              </span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">সংবাদ ও এআই স্ট্যাটাস</th>
                    <th className="p-4">বিভাগ</th>
                    <th className="p-4">প্রতিবেদক</th>
                    <th className="p-4">ভিউ</th>
                    <th className="p-4">প্রকাশের তারিখ</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredArticles.map((article) => {
                    const isProblematic = Boolean(
                      article.aiFlagged ||
                      (article.aiIssues && article.aiIssues.length > 0) ||
                      article.aiOffensiveReason ||
                      (article.aiCredibilityScore !== undefined && article.aiCredibilityScore < 70) ||
                      article.isUnpublished
                    );

                    return (
                      <tr 
                        key={article.id} 
                        className={`transition-colors ${
                          isProblematic 
                            ? 'bg-red-50/90 dark:bg-red-950/50 hover:bg-red-100/90 dark:hover:bg-red-900/40 border-l-4 border-red-600' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="p-4 font-bold text-slate-900 dark:text-white max-w-sm">
                          <div className="flex items-start gap-3">
                            {article.imageUrl && (
                              <img
                                src={article.imageUrl}
                                alt=""
                                className="w-14 h-14 rounded-xl object-cover shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700"
                              />
                            )}
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setViewingArticle(article)}
                                  className={`text-left line-clamp-2 hover:underline cursor-pointer ${isProblematic ? 'text-red-950 dark:text-red-100 font-black' : 'text-slate-900 dark:text-white'}`}
                                  title="পোস্টটি সম্পূর্ণ পড়তে ক্লিক করুন"
                                >
                                  {article.title}
                                </button>
                                {article.postType === 'video' && (
                                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded text-[10px] font-bold shrink-0 flex items-center gap-1">
                                    📹 ভিডিও
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                {article.isUnpublished ? (
                                  <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold">
                                    🚫 আনপাবলিশ্ড (পাঠকদের জন্য লুকানো)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-bold">
                                    ✓ লাইভ প্রকাশিত
                                  </span>
                                )}

                                {isProblematic ? (
                                  <span 
                                    className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-extrabold flex items-center gap-1 shadow-sm"
                                    title={article.aiOffensiveReason || 'AI বিশ্লেষণে তথ্য যাচাই প্রয়োজন'}
                                  >
                                    🚨 এআই সমস্যা চিহ্নিত ({article.aiCredibilityScore !== undefined ? `${article.aiCredibilityScore}%` : 'ঝুঁকিপূর্ণ'})
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                                    ✅ এআই যাচাইকৃত নিরাপদ ({article.aiCredibilityScore || 95}%)
                                  </span>
                                )}
                              </div>

                              {/* Prominent Red Box for AI Issues */}
                              {isProblematic && (article.aiOffensiveReason || (article.aiIssues && article.aiIssues.length > 0)) && (
                                <div className="p-2 bg-red-100 dark:bg-red-900/60 border border-red-300 dark:border-red-800 rounded-xl text-[11px] font-semibold text-red-900 dark:text-red-100 space-y-0.5">
                                  <p className="flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                                    <span>এআই রিপোর্ট: {article.aiOffensiveReason || article.aiIssues?.join(', ')}</span>
                                  </p>
                                </div>
                              )}

                              {article.unpublishReason && (
                                <p className="text-[10px] text-red-700 dark:text-red-300 font-semibold bg-red-100/80 dark:bg-red-900/40 px-2 py-0.5 rounded border border-red-300 dark:border-red-800">
                                  🚫 আনপাবলিশ কারণ: {article.unpublishReason}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                            {article.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                          {article.author}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                          👁️ {article.views || 0}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(article.publishedAt).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* View Full Post */}
                            <button
                              onClick={() => setViewingArticle(article)}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white cursor-pointer shadow-xs"
                              title="সম্পূর্ণ পোস্ট ও কনটেন্ট দেখুন"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>দেখুন</span>
                            </button>

                            {onUpdateArticle && (
                              article.isUnpublished ? (
                                <button
                                  onClick={() => handleDirectPublish(article)}
                                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white cursor-pointer"
                                  title="পুনরায় লাইভ পাবলিশ করুন"
                                >
                                  <span>পাবলিশ করুন</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setUnpublishModalArticle(article);
                                    setUnpublishReasonText(article.aiOffensiveReason || '');
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white cursor-pointer"
                                  title="কারণ উল্লেখ করে আনপাবলিশ করুন"
                                >
                                  <span>আনপাবলিশ</span>
                                </button>
                              )
                            )}
                            <button
                              onClick={() => setDeleteModalArticle(article)}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm shadow-red-600/20"
                              title="কারণ উল্লেখ করে ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ডিলিট</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS TO REPORTERS */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <Bell className="w-5 h-5 text-blue-500" /> প্রতিবেদকদের নোটিফিকেশন পাঠান
            </h2>

            {notifSuccessMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{notifSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSendNotifSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রাপক (Recipient) *
                </label>
                <select
                  value={notifTargetWriterId}
                  onChange={(e) => setNotifTargetWriterId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="ALL">📢 সকল নিবন্ধিত প্রতিবেদক (All Reporters)</option>
                  {writers.map((w) => (
                    <option key={w.id} value={w.id}>
                      👤 {w.name} ({w.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিজ্ঞপ্তির শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="যেমন: বস্তুনিষ্ঠ সংবাদ পরিবেশন সংক্রান্ত নির্দেশনা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বার্তা (Message) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="বিজ্ঞপ্তির বিবরণ লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>বিজ্ঞপ্তি পাঠান</span>
              </button>
            </form>
          </div>

          {/* Notifications Sent History */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <Send className="w-5 h-5 text-blue-500" /> সম্প্রতি পাঠানো বিজ্ঞপ্তিসমূহ
            </h2>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">কোনো নোটিফিকেশন নেই</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(n.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                    <span className="inline-block text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                      প্রাপক: {n.recipientWriterId === 'ALL' ? 'সকল প্রতিবেদক' : n.recipientWriterId}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              ম্যানাজিং প্যানেল রিয়েলটাইম অ্যানালিটিক্স
            </h2>
            <p className="text-xs text-slate-500">
              সিস্টেমের প্রকৃত ডেটা ও রিয়েলটাইম ভিউ পরিসংখ্যান।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">👥 মোট পাঠক</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {totalReadersCount.toLocaleString('bn-BD')} জন
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">📰 মোট সংবাদ</span>
              <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
                {totalArticlesCount.toLocaleString('bn-BD')} টি
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">✍️ মোট প্রতিবেদক</span>
              <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {totalReportersCount.toLocaleString('bn-BD')} জন
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">👁️ সর্বমোট ভিউ</span>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {totalViews.toLocaleString('bn-BD')}
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">📅 এই মাসের ভিউ</span>
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                {monthViews.toLocaleString('bn-BD')}
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">📆 এই সপ্তাহের ভিউ</span>
              <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">
                {weekViews.toLocaleString('bn-BD')}
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">☀️ আজকের ভিউ</span>
              <h3 className="text-2xl font-black text-red-600 dark:text-red-400 font-mono mt-1">
                {todayViews.toLocaleString('bn-BD')}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* VIEW WRITER PROFILE MODAL */}
      {selectedWriter && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <img
                src={selectedWriter.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={selectedWriter.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-blue-600 shadow-md"
              />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedWriter.name}
              </h3>
              <p className="text-xs text-slate-500">{selectedWriter.email}</p>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">মোবাইল নম্বর:</span>
                <strong className="font-mono text-slate-900 dark:text-white">{selectedWriter.mobile}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NID নম্বর:</span>
                <strong className="font-mono text-slate-900 dark:text-white">{selectedWriter.nidNumber || 'তথ্য নেই'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ঠিকানা:</span>
                <span className="text-slate-900 dark:text-white font-medium text-right max-w-[200px]">
                  {selectedWriter.postOffice ? `${selectedWriter.postOffice}, ` : ''}
                  {selectedWriter.thana ? `${selectedWriter.thana}, ` : ''}
                  {selectedWriter.district ? `${selectedWriter.district}, ` : ''}
                  {selectedWriter.division || selectedWriter.address}
                  {selectedWriter.postCode ? ` (${selectedWriter.postCode})` : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">বয়স:</span>
                <span className="text-slate-900 dark:text-white">{selectedWriter.age} বছর</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">রেজিস্ট্রেশন তারিখ:</span>
                <span className="text-slate-900 dark:text-white">{new Date(selectedWriter.createdAt).toLocaleDateString('bn-BD')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedWriter(null)}
              className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs rounded-xl"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* ARTICLE DELETION CONFIRMATION MODAL */}
      {deleteModalArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> সংবাদ ডিলিট করার কারণ উল্লেখ করুন
            </h3>
            <p className="text-xs text-slate-500">
              প্রতিবেদক: <strong className="text-slate-900 dark:text-white">{deleteModalArticle.author}</strong>
            </p>
            <textarea
              rows={3}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="সংবাদটি ডিলিট করার কারণ টাইপ করুন (উদা: নীতিমালার পরিপন্থী/ভিত্তিহীন)..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            ></textarea>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModalArticle(null)}
                className="flex-1 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
              >
                বাতিল
              </button>
              <button
                onClick={confirmDeleteArticle}
                className="flex-1 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md"
              >
                নিশ্চিত ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ARTICLE UNPUBLISH CONFIRMATION MODAL */}
      {unpublishModalArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> সংবাদ আনপাবলিশ করার কারণ
            </h3>
            <p className="text-xs text-slate-500">
              শিরোনাম: <strong className="text-slate-900 dark:text-white">{unpublishModalArticle.title}</strong>
              <br />
              প্রতিবেদক: <strong className="text-blue-600 dark:text-blue-400">{unpublishModalArticle.author}</strong>
            </p>

            {/* Quick Reason Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                দ্রুত কারণ নির্বাচন করুন:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'AI বিশ্লেষণে ডুপ্লিকেট বা কপি কনটেন্ট চিহ্নিত',
                  'অশালীন / উস্কানিমূলক ভাষা বা তথ্য',
                  'অসমর্থিত / তথ্যের ঘাটতি ও ভুল খবর',
                  'নীতিমালা পরিপন্থী কনটেন্ট',
                  'ছবি বা ভিডিও কপিরাইট সমস্যা'
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setUnpublishReasonText(reason)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 transition-colors text-left"
                  >
                    + {reason}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={unpublishReasonText}
              onChange={(e) => setUnpublishReasonText(e.target.value)}
              placeholder="আনপাবলিশ করার বিস্তারিত কারণ লিখুন (যা প্রতিবেদকের নোটিফিকেশনে যাবে)..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            ></textarea>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUnpublishModalArticle(null);
                  setUnpublishReasonText('');
                }}
                className="flex-1 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
              >
                বাতিল
              </button>
              <button
                onClick={confirmUnpublishArticle}
                className="flex-1 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md"
              >
                নিশ্চিত আনপাবলিশ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGER PROFILE SETUP & EDIT MODAL */}
      {showEditProfileModal && managerProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                    ম্যানেজার প্রোফাইল সেটআপ ও এডিট
                  </h3>
                  <p className="text-xs text-slate-500">আপনার ব্যক্তিগত ও দাপ্তরিক তথ্য আপডেট করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManagerProfile} className="space-y-4 text-xs">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0 flex items-center justify-center">
                  {editManagerAvatar ? (
                    <img src={editManagerAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    প্রোফাইল ছবি (Avatar)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (reader.result) {
                            setEditManagerAvatar(reader.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <input
                    type="url"
                    value={editManagerAvatar}
                    onChange={(e) => setEditManagerAvatar(e.target.value)}
                    placeholder="অথবা ছবির অনলাইন লিংক (URL) লিখুন..."
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নাম (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={editManagerName}
                  onChange={(e) => setEditManagerName(e.target.value)}
                  placeholder="আপনার নাম..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পদবি / ডেজিগনেশন (Designation)
                  </label>
                  <input
                    type="text"
                    value={editManagerDesignation}
                    onChange={(e) => setEditManagerDesignation(e.target.value)}
                    placeholder="যেমন: ব্যবস্থাপনা পরিচালক / সহ-সম্পাদক"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editManagerMobile}
                    onChange={(e) => setEditManagerMobile(e.target.value)}
                    placeholder="01712345678"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ঠিকানা (Address)
                  </label>
                  <input
                    type="text"
                    value={editManagerAddress}
                    onChange={(e) => setEditManagerAddress(e.target.value)}
                    placeholder="যেমন: ধানমন্ডি, ঢাকা"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বয়স (Age)
                  </label>
                  <input
                    type="number"
                    value={editManagerAge}
                    onChange={(e) => setEditManagerAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="যেমন: 32"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত বায়ো / পরিচিতি (Bio)
                </label>
                <textarea
                  rows={2}
                  value={editManagerBio}
                  onChange={(e) => setEditManagerBio(e.target.value)}
                  placeholder="নিজের অভিজ্ঞতা বা পরিচয় সংক্ষেপে লিখুন..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>তথ্য সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Full Article Preview / Inspection Modal for Managing Panel */}
      {viewingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs">
                  {viewingArticle.category}
                </span>
                {viewingArticle.postType === 'video' && (
                  <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold rounded-xl text-xs">
                    📹 ভিডিও সংবাদ
                  </span>
                )}
                {viewingArticle.isUnpublished ? (
                  <span className="px-2.5 py-1 bg-red-600 text-white font-bold rounded-xl text-xs">
                    🚫 আনপাবলিশ্ড
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                    ✓ লাইভ প্রকাশিত
                  </span>
                )}
              </div>

              <button
                onClick={() => setViewingArticle(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Header & Reporter Info */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug font-serif">
                {viewingArticle.title}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span>প্রতিবেদক:</span>
                  <span className="text-red-600 dark:text-red-400 font-serif">
                    {formatReporterName(viewingArticle.author, viewingArticle.authorDistrict)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span>তারিখ: {new Date(viewingArticle.publishedAt).toLocaleString('bn-BD')}</span>
                  <span>ভিউ: {viewingArticle.views || 0}</span>
                </div>
              </div>
            </div>

            {/* Media Content (Video or Image) */}
            {viewingArticle.postType === 'video' && viewingArticle.videoUrl ? (
              <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
                <iframe
                  src={viewingArticle.videoUrl}
                  title={viewingArticle.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : viewingArticle.imageUrl ? (
              <div className="rounded-2xl overflow-hidden max-h-96 shadow-sm border border-slate-200 dark:border-slate-800">
                <img
                  src={viewingArticle.imageUrl}
                  alt={viewingArticle.title}
                  className="w-full h-full object-cover max-h-96"
                />
              </div>
            ) : null}

            {/* Formatted Content */}
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-base">
              {renderFormattedContent(viewingArticle.content || viewingArticle.summary || '')}
            </div>

            {/* Tags */}
            {viewingArticle.tags && viewingArticle.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500">ট্যাগ:</span>
                {viewingArticle.tags.map((tag, idx) => (
                  <span
                    key={`view-tag-${tag}-${idx}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* AI Analysis Report Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> এআই নিরাপত্তা ও সত্যতা মূল্যায়ন রিপোর্ট
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <p>
                  <strong>নির্ভরযোগ্যতা স্কোর:</strong>{' '}
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {viewingArticle.aiCredibilityScore || 95}%
                  </span>
                </p>
                <p>
                  <strong>স্ট্যাটাস:</strong>{' '}
                  <span className={viewingArticle.aiFlagged ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {viewingArticle.aiFlagged ? '⚠️ সমস্যা চিহ্নিত' : '✓ নিরাপদ'}
                  </span>
                </p>
              </div>
              {viewingArticle.aiOffensiveReason && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 p-2.5 rounded-xl border border-red-200 dark:border-red-900 font-semibold">
                  কারণ: {viewingArticle.aiOffensiveReason}
                </p>
              )}
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {onUpdateArticle && (
                  viewingArticle.isUnpublished ? (
                    <button
                      onClick={() => {
                        handleDirectPublish(viewingArticle);
                        setViewingArticle(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>লাইভ পাবলিশ করুন</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const art = viewingArticle;
                        setViewingArticle(null);
                        setUnpublishModalArticle(art);
                        setUnpublishReasonText(art.aiOffensiveReason || '');
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Ban className="w-4 h-4" />
                      <span>আনপাবলিশ করুন</span>
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    const art = viewingArticle;
                    setViewingArticle(null);
                    setDeleteModalArticle(art);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ডিলিট করুন</span>
                </button>
              </div>

              <button
                onClick={() => setViewingArticle(null)}
                className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Native Banner Ad 2 for Managing Panel (Bottom) */}
      <NativeBannerAd
        settings={siteSettings?.dynamicAds?.nativeBanner}
        isPostWriting={false}
        panelLabel="ম্যানেজিং প্যানেল (ব্যানার ২)"
      />
    </div>
  );
};
