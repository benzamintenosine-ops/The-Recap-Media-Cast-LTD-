/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * THE RECAP MEDIA CAST LTD - Real-Time News Portal & AI Admin Management System
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ViewerSite } from './components/ViewerSite';
import { AdminPortal } from './components/AdminPortal';
import { SystemAdminPortal } from './components/SystemAdminPortal';
import { ManagingPanel } from './components/ManagingPanel';
import { ArticleModal } from './components/ArticleModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdBlockerDetector } from './components/AdBlockerDetector';
import { CloudflareSecurityBadge, BotProtectionModal } from './components/BotProtection';
import { FooterStats } from './components/FooterStats';
import { NewsArticle, Category, Language, UserProfile, SiteSettings, WriterProfile, ManagerProfile, AdminProfile, WithdrawalRequest, SystemNotification, CategoryConfig, SocialWidget, DynamicAdSettings } from './types';
import {
  fetchInitialStateFromFirestore,
  DEFAULT_CATEGORIES,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_DYNAMIC_ADS
} from './services/firebaseInitialSync';
import { INITIAL_NEWS } from './data/initialNews';
import { getTranslation } from './utils/i18n';
import {
  subscribeToArticles,
  addArticleToFirebase,
  updateArticleInFirebase,
  deleteArticleFromFirebase,
  addCommentToFirebase,
  incrementArticleViewsInFirebase
} from './services/firebaseNewsService';
import {
  subscribeToSiteSettings,
  saveSiteSettingsToFirebase
} from './services/firebaseSettingsService';
import {
  subscribeToWriters,
  saveWriterToFirebase,
  deleteWriterFromFirebase,
  updateWriterInFirebase,
  subscribeToManagers,
  saveManagerToFirebase,
  deleteManagerFromFirebase,
  updateManagerInFirebase,
  subscribeToAdmins,
  saveAdminToFirebase,
  subscribeToCategories,
  saveCategoriesToFirebase,
  subscribeToWithdrawals,
  saveWithdrawalToFirebase,
  updateWithdrawalInFirebase,
  subscribeToNotifications,
  saveNotificationToFirebase
} from './services/firebaseDataService';
import { triggerPopunder } from './components/DynamicAdServices';

const DEFAULT_SOCIAL_WIDGETS: SocialWidget[] = [
  { id: 'soc-fb', platform: 'facebook', name: 'Facebook Page', url: 'https://facebook.com/therecapmediacast', badge: 'ফলো', isActive: true },
  { id: 'soc-yt', platform: 'youtube', name: 'YouTube Channel', url: 'https://youtube.com/@therecapmediacast', badge: 'সাবস্ক্রাইব', isActive: true },
  { id: 'soc-ig', platform: 'instagram', name: 'Instagram Profile', url: 'https://instagram.com/therecapmediacast', badge: 'ফলো', isActive: true }
];

export default function App() {
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);
  const [currentMode, setCurrentMode] = useState<'viewer' | 'writer' | 'managing' | 'systemAdmin'>('viewer');
  const [currentLang, setCurrentLang] = useState<Language>('bn');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  // Dynamic Categories list with deduplication
  const [categories, setCategories] = useState<CategoryConfig[]>(() => {
    const saved = localStorage.getItem('recap_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seenNames = new Set<string>();
          const seenIds = new Set<string>();
          const deduplicated: CategoryConfig[] = [];
          for (const item of parsed) {
            if (item && item.name && !seenNames.has(item.name) && !seenIds.has(item.id)) {
              seenNames.add(item.name);
              seenIds.add(item.id);
              deduplicated.push(item);
            }
          }
          if (deduplicated.length > 0) return deduplicated;
        }
      } catch (e) {
        console.error('Failed to parse saved categories:', e);
      }
    }
    return DEFAULT_CATEGORIES;
  });

  const handleUpdateCategories = (newCats: CategoryConfig[]) => {
    const seenNames = new Set<string>();
    const seenIds = new Set<string>();
    const deduplicated: CategoryConfig[] = [];
    for (const item of newCats) {
      if (item && item.name && !seenNames.has(item.name) && !seenIds.has(item.id)) {
        seenNames.add(item.name);
        seenIds.add(item.id);
        deduplicated.push(item);
      }
    }
    setCategories(deduplicated);
    localStorage.setItem('recap_categories', JSON.stringify(deduplicated));
    saveCategoriesToFirebase(deduplicated).catch((err) =>
      console.warn('Failed to save categories to Firestore:', err)
    );
  };

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('recap_site_settings');
    if (!saved) return DEFAULT_SITE_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        dynamicAds: {
          popunder: {
            ...DEFAULT_DYNAMIC_ADS.popunder,
            ...(parsed.dynamicAds?.popunder || {})
          },
          socialBar: {
            ...DEFAULT_DYNAMIC_ADS.socialBar,
            ...(parsed.dynamicAds?.socialBar || {})
          },
          nativeBanner: {
            ...DEFAULT_DYNAMIC_ADS.nativeBanner,
            ...(parsed.dynamicAds?.nativeBanner || {})
          }
        },
        socialWidgets: (parsed.socialWidgets && Array.isArray(parsed.socialWidgets) && parsed.socialWidgets.length > 0)
          ? parsed.socialWidgets
          : DEFAULT_SOCIAL_WIDGETS,
        adBanners: (parsed.adBanners && Array.isArray(parsed.adBanners) && parsed.adBanners.length > 0)
          ? parsed.adBanners
          : DEFAULT_SITE_SETTINGS.adBanners
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  // Registered Writers list
  const [writers, setWriters] = useState<WriterProfile[]>(() => {
    const saved = localStorage.getItem('recap_writers');
    return saved ? JSON.parse(saved) : [];
  });

  // Registered Managers list
  const [managers, setManagers] = useState<ManagerProfile[]>(() => {
    const saved = localStorage.getItem('recap_managers');
    return saved ? JSON.parse(saved) : [];
  });

  const handleUpdateManagers = (newManagers: ManagerProfile[]) => {
    setManagers(newManagers);
    localStorage.setItem('recap_managers', JSON.stringify(newManagers));
    newManagers.forEach((m) => saveManagerToFirebase(m).catch(() => {}));
  };

  // Registered Admins list
  const [admins, setAdmins] = useState<AdminProfile[]>(() => {
    const saved = localStorage.getItem('recap_admins');
    return saved ? JSON.parse(saved) : [];
  });

  const handleUpdateAdmins = (newAdmins: AdminProfile[]) => {
    setAdmins(newAdmins);
    localStorage.setItem('recap_admins', JSON.stringify(newAdmins));
    newAdmins.forEach((a) => saveAdminToFirebase(a).catch(() => {}));
  };

  // Withdrawal Requests list
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('recap_withdrawals');
    return saved ? JSON.parse(saved) : [];
  });

  // System Notifications list
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('recap_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        title: 'অফিশিয়াল প্রতিবেদক প্যানেলে স্বাগতম',
        message: 'The Recap Media Cast LTD-এর প্রতিবেদক প্যানেলে সংবাদ প্রকাশ শুরু করুন। বস্তুনিষ্ঠ সংবাদ প্রকাশে আমরা অঙ্গীকারবদ্ধ।',
        senderName: 'The Recap Media Cast LTD',
        recipientWriterId: 'ALL',
        createdAt: new Date().toISOString(),
        read: false
      }
    ];
  });

  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const cached = localStorage.getItem('recap_news_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_NEWS;
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // User state (Regular Reader)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('the_recap_media_reader_user') || localStorage.getItem('recap_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('the_recap_media_reader_user', JSON.stringify(user));
      localStorage.setItem('recap_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('the_recap_media_reader_user');
      localStorage.removeItem('recap_user');
    }
  }, [user]);

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Bookmarks & Offline saved IDs
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('recap_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [offlineSaved, setOfflineSaved] = useState<string[]>(() => {
    const saved = localStorage.getItem('recap_offline');
    return saved ? JSON.parse(saved) : [];
  });

  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showOfflineOnly, setShowOfflineOnly] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initial site load reCAPTCHA / Bot Protection state (site loads immediately without blocking visitors)
  const [showSiteBotProtection, setShowSiteBotProtection] = useState<boolean>(false);

  // Synchronize Dark Mode Class on Document Root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch initial state from Firestore on mount if LocalStorage is empty or stale
  useEffect(() => {
    fetchInitialStateFromFirestore()
      .then((cloudState) => {
        if (cloudState) {
          if (cloudState.articles && cloudState.articles.length > 0) {
            setArticles(cloudState.articles);
          }
          if (cloudState.siteSettings) {
            setSiteSettings(cloudState.siteSettings);
          }
          if (cloudState.categories && cloudState.categories.length > 0) {
            setCategories(cloudState.categories);
          }
          if (cloudState.writers && cloudState.writers.length > 0) {
            setWriters(cloudState.writers);
          }
          if (cloudState.managers && cloudState.managers.length > 0) {
            setManagers(cloudState.managers);
          }
          if (cloudState.withdrawals && cloudState.withdrawals.length > 0) {
            setWithdrawals(cloudState.withdrawals);
          }
          if (cloudState.notifications && cloudState.notifications.length > 0) {
            setNotifications(cloudState.notifications);
          }
          setIsCloudLoaded(true);
        }
      })
      .catch((err) => {
        console.warn('Initial cloud sync error:', err);
        setIsCloudLoaded(true);
      });
  }, []);

  // Subscribe to real-time Firebase Firestore news updates, Site Settings, Writers, Managers, Categories, Withdrawals, Notifications
  useEffect(() => {
    const unsubscribeArticles = subscribeToArticles((liveArticles) => {
      setArticles(liveArticles || []);
    });

    const unsubscribeSettings = subscribeToSiteSettings((liveSettings) => {
      if (liveSettings) {
        setSiteSettings((prev) => ({
          ...prev,
          ...liveSettings
        }));
      }
    });

    const unsubscribeWriters = subscribeToWriters((liveWriters) => {
      if (Array.isArray(liveWriters)) {
        setWriters(liveWriters);
      }
    });

    const unsubscribeManagers = subscribeToManagers((liveManagers) => {
      if (Array.isArray(liveManagers)) {
        setManagers(liveManagers);
      }
    });

    const unsubscribeAdmins = subscribeToAdmins((liveAdmins) => {
      if (Array.isArray(liveAdmins)) {
        setAdmins(liveAdmins);
      }
    });

    const unsubscribeCategories = subscribeToCategories((liveCategories) => {
      if (Array.isArray(liveCategories) && liveCategories.length > 0) {
        setCategories(liveCategories);
      }
    });

    const unsubscribeWithdrawals = subscribeToWithdrawals((liveWithdrawals) => {
      if (Array.isArray(liveWithdrawals)) {
        setWithdrawals(liveWithdrawals);
      }
    });

    const unsubscribeNotifications = subscribeToNotifications((liveNotifications) => {
      if (Array.isArray(liveNotifications)) {
        setNotifications(liveNotifications);
      }
    });

    return () => {
      unsubscribeArticles();
      unsubscribeSettings();
      unsubscribeWriters();
      unsubscribeManagers();
      unsubscribeAdmins();
      unsubscribeCategories();
      unsubscribeWithdrawals();
      unsubscribeNotifications();
    };
  }, []);

  // Sync Bookmarks to LocalStorage
  useEffect(() => {
    localStorage.setItem('recap_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync Offline Articles to LocalStorage
  useEffect(() => {
    localStorage.setItem('recap_offline', JSON.stringify(offlineSaved));
  }, [offlineSaved]);

  // Sync User to LocalStorage
  useEffect(() => {
    if (user) localStorage.setItem('recap_user', JSON.stringify(user));
    else localStorage.removeItem('recap_user');
  }, [user]);

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Toggle Offline Reading Item
  const handleToggleOffline = (article: NewsArticle) => {
    setOfflineSaved((prev) =>
      prev.includes(article.id)
        ? prev.filter((id) => id !== article.id)
        : [...prev, article.id]
    );
  };

  // Add Article (Admin - saves directly to Firebase Firestore & local state)
  const handleAddArticle = async (newArt: Partial<NewsArticle>) => {
    const created: NewsArticle = {
      id: newArt.id || `news-${Date.now()}`,
      title: newArt.title || 'শিরোনামহীন সংবাদ',
      titleEn: newArt.titleEn || '',
      summary: newArt.summary || '',
      summaryEn: newArt.summaryEn || '',
      content: newArt.content || '',
      contentEn: newArt.contentEn || '',
      category: newArt.category || 'জাতীয়',
      tags: newArt.tags || [],
      imageUrl: newArt.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
      videoUrl: newArt.videoUrl,
      hasVideo: newArt.hasVideo,
      author: newArt.author || 'THE RECAP MEDIA',
      source: newArt.source || '',
      publishedAt: newArt.publishedAt || new Date().toISOString(),
      isBreaking: newArt.isBreaking || false,
      isTrending: newArt.isTrending || false,
      viewsCount: 0,
      readTimeMinutes: newArt.readTimeMinutes || 3,
      comments: [],
      aiFlagged: newArt.aiFlagged,
      aiIssues: newArt.aiIssues,
      aiCredibilityScore: newArt.aiCredibilityScore,
      aiOffensiveReason: newArt.aiOffensiveReason,
    };

    try {
      await addArticleToFirebase(created);
      fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      }).catch(() => {});
    } catch (err) {
      console.warn('Firebase add fallback to local:', err);
    }

    setArticles((prev) => {
      const updated = [created, ...prev.filter((a) => a.id !== created.id)];
      try {
        localStorage.setItem('recap_news_cache', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Delete Article (Admin - deletes from Firebase Firestore)
  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticleFromFirebase(id);
      fetch(`/api/news/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (err) {
      console.warn('Firebase delete fallback:', err);
    }
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('recap_news_cache', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Update Article (Writer / Admin / Manager)
  const handleUpdateArticle = async (id: string, updatedArt: Partial<NewsArticle>) => {
    try {
      await updateArticleInFirebase(id, updatedArt);
      fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArt),
      }).catch(() => {});
    } catch (err) {
      console.warn('Firebase update fallback:', err);
    }
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updatedArt } : a));
      try {
        localStorage.setItem('recap_news_cache', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Add Comment to Article (Saves to Firebase Firestore)
  const handleAddComment = async (articleId: string, authorName: string, text: string) => {
    try {
      const comment = await addCommentToFirebase(articleId, authorName, text);
      fetch(`/api/news/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, text }),
      }).catch(() => {});

      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle((prev) =>
          prev ? { ...prev, comments: [comment, ...(prev.comments || [])] } : null
        );
      }
    } catch (err) {
      console.error('Firebase comment error:', err);
    }
  };

  // View Article detail & increment view count in Firebase
  const handleSelectArticle = (art: NewsArticle) => {
    setSelectedArticle(art);
    incrementArticleViewsInFirebase(art.id);
    fetch(`/api/news/${art.id}/view`, { method: 'POST' }).catch(() => {});
    setArticles((prev) =>
      prev.map((a) => (a.id === art.id ? { ...a, viewsCount: (a.viewsCount || 0) + 1 } : a))
    );

    // Trigger Popunder when clicking on news cover / headline if enabled
    const popunderConfig = siteSettings?.dynamicAds?.popunder;
    if (popunderConfig?.enabled ?? true) {
      triggerPopunder(popunderConfig?.scriptUrl);
    }
  };

  // Persistence effects - Protected against empty cache overwrites on initial boot
  useEffect(() => {
    if (isCloudLoaded || siteSettings !== DEFAULT_SITE_SETTINGS) {
      localStorage.setItem('recap_site_settings', JSON.stringify(siteSettings));
    }
  }, [siteSettings, isCloudLoaded]);

  useEffect(() => {
    if (isCloudLoaded || writers.length > 0) {
      localStorage.setItem('recap_writers', JSON.stringify(writers));
    }
  }, [writers, isCloudLoaded]);

  useEffect(() => {
    if (isCloudLoaded || withdrawals.length > 0) {
      localStorage.setItem('recap_withdrawals', JSON.stringify(withdrawals));
    }
  }, [withdrawals, isCloudLoaded]);

  useEffect(() => {
    if (isCloudLoaded || notifications.length > 0) {
      localStorage.setItem('recap_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isCloudLoaded]);

  // Admin state management handlers
  const handleUpdateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      try {
        localStorage.setItem('recap_site_settings', JSON.stringify(merged));
      } catch {}
      saveSiteSettingsToFirebase(merged).catch((err) =>
        console.warn('Failed to sync settings to Firestore:', err)
      );
      return merged;
    });
  };

  const handleUpdateWriters = (newWriters: WriterProfile[]) => {
    setWriters(newWriters);
    newWriters.forEach((w) => saveWriterToFirebase(w).catch(() => {}));
  };

  const handleUpdateWithdrawalStatus = (
    id: string, 
    status: 'pending' | 'completed', 
    senderAccount?: string, 
    transactionId?: string
  ) => {
    const updates = {
      status,
      completedAt: new Date().toISOString(),
      ...(senderAccount ? { senderAccount } : {}),
      ...(transactionId ? { transactionId } : {}),
    };
    updateWithdrawalInFirebase(id, updates).catch(() => {});
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              ...updates,
            }
          : w
      )
    );
  };

  const handleSendNotification = (notif: Omit<SystemNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    saveNotificationToFirebase(newNotif).catch(() => {});
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleRequestWithdrawal = (req: Omit<WithdrawalRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: WithdrawalRequest = {
      ...req,
      id: `wd-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    saveWithdrawalToFirebase(newReq).catch(() => {});
    setWithdrawals((prev) => [newReq, ...prev]);
  };

  const handleRegisterWriter = (writer: WriterProfile) => {
    saveWriterToFirebase(writer).catch(() => {});
    setWriters((prev) => {
      if (prev.some((w) => w.id === writer.id || w.email === writer.email)) {
        return prev.map((w) => (w.id === writer.id || w.email === writer.email ? writer : w));
      }
      return [writer, ...prev];
    });
  };

  const breakingArticles = articles.filter((a) => a.isBreaking);

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-[#050505] text-slate-900 dark:text-[#e5e7eb] flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      
      {/* Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        currentMode={currentMode}
        onModeSwitch={setCurrentMode}
        breakingArticles={breakingArticles}
        articles={articles}
        onSelectArticle={handleSelectArticle}
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          setShowBookmarksOnly(false);
          setShowOfflineOnly(false);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bookmarksCount={bookmarks.length}
        offlineCount={offlineSaved.length}
        onOpenBookmarks={() => {
          setShowBookmarksOnly(true);
          setShowOfflineOnly(false);
          setCurrentMode('viewer');
        }}
        onOpenOffline={() => {
          setShowOfflineOnly(true);
          setShowBookmarksOnly(false);
          setCurrentMode('viewer');
        }}
        onOpenProfile={() => setShowProfileModal(true)}
        user={user}
        isOnline={isOnline}
        categories={categories}
        siteSettings={siteSettings}
      />

      {/* Main Body Content Switcher */}
      <main className="flex-1">
        {currentMode === 'viewer' && (
          <ViewerSite
            articles={articles}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            currentLang={currentLang}
            onSelectArticle={handleSelectArticle}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            offlineSaved={offlineSaved}
            onToggleOffline={handleToggleOffline}
            showBookmarksOnly={showBookmarksOnly}
            setShowBookmarksOnly={setShowBookmarksOnly}
            showOfflineOnly={showOfflineOnly}
            setShowOfflineOnly={setShowOfflineOnly}
            siteSettings={siteSettings}
          />
        )}

        {currentMode === 'writer' && (
          <AdminPortal
            articles={articles}
            onAddArticle={handleAddArticle}
            onUpdateArticle={handleUpdateArticle}
            onDeleteArticle={handleDeleteArticle}
            currentLang={currentLang}
            writerSecretCode={siteSettings.writerSecretCode}
            notifications={notifications}
            onSendNotification={handleSendNotification}
            withdrawals={withdrawals}
            onRequestWithdrawal={handleRequestWithdrawal}
            onRegisterWriter={handleRegisterWriter}
            writers={writers}
            managers={managers}
            siteSettings={siteSettings}
          />
        )}

        {currentMode === 'managing' && (
          <ManagingPanel
            articles={articles}
            onDeleteArticle={handleDeleteArticle}
            onUpdateArticle={handleUpdateArticle}
            currentLang={currentLang}
            siteSettings={siteSettings}
            onUpdateSiteSettings={handleUpdateSiteSettings}
            writers={writers}
            onUpdateWriters={handleUpdateWriters}
            notifications={notifications}
            onSendNotification={handleSendNotification}
            managers={managers}
            onUpdateManagers={handleUpdateManagers}
          />
        )}

        {currentMode === 'systemAdmin' && (
          <SystemAdminPortal
            articles={articles}
            onDeleteArticle={handleDeleteArticle}
            siteSettings={siteSettings}
            onUpdateSiteSettings={handleUpdateSiteSettings}
            writers={writers}
            onUpdateWriters={handleUpdateWriters}
            withdrawals={withdrawals}
            onUpdateWithdrawalStatus={handleUpdateWithdrawalStatus}
            notifications={notifications}
            onSendNotification={handleSendNotification}
            categories={categories}
            onUpdateCategories={handleUpdateCategories}
            managers={managers}
            onUpdateManagers={handleUpdateManagers}
            admins={admins}
            onUpdateAdmins={handleUpdateAdmins}
          />
        )}
      </main>

      {/* Article Detail View Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          currentLang={currentLang}
          isBookmarked={bookmarks.includes(selectedArticle.id)}
          onToggleBookmark={handleToggleBookmark}
          isOfflineSaved={offlineSaved.includes(selectedArticle.id)}
          onToggleOffline={handleToggleOffline}
          onAddComment={handleAddComment}
          relatedArticles={articles.filter(
            (a) => a.category === selectedArticle.category && a.id !== selectedArticle.id
          )}
          onSelectRelated={handleSelectArticle}
          siteSettings={siteSettings}
          user={user}
          onRequireLogin={() => setShowProfileModal(true)}
        />
      )}

      {/* User Profile / Auth Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onLogin={setUser}
          onLogout={() => setUser(null)}
          currentLang={currentLang}
          bookmarksCount={bookmarks.length}
          offlineCount={offlineSaved.length}
          onOpenBookmarks={() => {
            setShowBookmarksOnly(true);
            setShowOfflineOnly(false);
            setCurrentMode('viewer');
          }}
          onOpenOffline={() => {
            setShowOfflineOnly(true);
            setShowBookmarksOnly(false);
            setCurrentMode('viewer');
          }}
        />
      )}

      {/* Live Readers & Reporters Statistics Grid */}
      <FooterStats />

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 dark:bg-[#0a0a0a] text-slate-400 dark:text-gray-400 border-t border-slate-800 dark:border-white/10 text-xs py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-extrabold text-white tracking-tight uppercase">
              THE RECAP <span className="text-red-500 font-sans">MEDIA CAST</span> LTD
            </h3>
            <p className="text-slate-400 leading-relaxed text-xs">
              সত্যনিষ্ঠ বস্তুনিষ্ঠ সংবাদ পরিবেশনায় অঙ্গীকারবদ্ধ আন্তর্জাতিক ডিজিটাল তথ্যমাধ্যম। 
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest pt-2">
              © 2026 THE RECAP MEDIA CAST LTD. ALL RIGHTS RESERVED.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">বিভাগসমূহ</h4>
            <ul className="space-y-1">
              {Array.from(
                new Set(
                  (categories && categories.length > 0
                    ? categories.filter(c => !c.isHidden).map(c => c.name)
                    : ['জাতীয়', 'রাজনীতি', 'অর্থনীতি', 'আন্তর্জাতিক', 'প্রযুক্তি']
                  )
                )
              ).slice(0, 6).map((catName, idx) => (
                <li key={`footer-cat-${catName}-${idx}`}>
                  <button
                    onClick={() => {
                      setSelectedCategory(catName as Category);
                      setCurrentMode('viewer');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-red-400"
                  >
                    {catName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">বিশেষ সেবা</h4>
            <ul className="space-y-1">
              <li><button onClick={() => { setShowOfflineOnly(true); setCurrentMode('viewer'); }} className="hover:text-amber-400">অফলাইন রিডিং সুবিধা</button></li>
              <li><button onClick={() => { setShowBookmarksOnly(true); setCurrentMode('viewer'); }} className="hover:text-red-400">সংরক্ষিত বুকমার্ক লিস্ট</button></li>
              <li><button onClick={() => setCurrentMode('writer')} className="hover:text-white font-bold text-amber-400">লেখক ও অ্যাডমিন স্টুডিও</button></li>
              <li><span>ডিজিটাল বিজ্ঞাপন প্যানেল</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">প্রধান কার্যালয়</h4>
            <p className="leading-relaxed">
              {siteSettings?.officeAddress || 'রেকাপ মিডিয়া কাস্ট লিমিটেড টাওয়ার, গুলশান-২, ঢাকা-১২১২।'}<br />
              ইমেইল: {siteSettings?.contactEmail || 'news@therecapmedia.com'}<br />
              হটলাইন: {siteSettings?.contactPhone || '+880 9612-888999'}
            </p>
          </div>
        </div>
      </footer>

      {/* Global AdBlocker & Private DNS Detection Overlay */}
      <AdBlockerDetector />

      {/* Global Cloudflare & reCAPTCHA Bot Protection Badge */}
      <CloudflareSecurityBadge />

      {/* Initial Site-Load reCAPTCHA / Bot Protection Modal */}
      <BotProtectionModal
        isOpen={showSiteBotProtection}
        actionTitle="ওয়েবসাইটে প্রবেশের নিরাপত্তা যাচাই (Site Entry Verification)"
        onSuccess={() => setShowSiteBotProtection(false)}
      />
    </div>
  );
}
