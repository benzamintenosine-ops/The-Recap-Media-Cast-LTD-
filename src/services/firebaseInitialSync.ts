import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  NewsArticle,
  SiteSettings,
  CategoryConfig,
  WriterProfile,
  ManagerProfile,
  WithdrawalRequest,
  SystemNotification,
  DynamicAdSettings
} from '../types';
import { INITIAL_NEWS } from '../data/initialNews';

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { id: 'cat-1', name: 'জাতীয়', showIcon: true, isHidden: false },
  { id: 'cat-2', name: 'রাজনীতি', showIcon: true, isHidden: false },
  { id: 'cat-3', name: 'অর্থনীতি', showIcon: true, isHidden: false },
  { id: 'cat-4', name: 'আন্তর্জাতিক', showIcon: true, isHidden: false },
  { id: 'cat-5', name: 'খেলাধুলো', showIcon: true, isHidden: false },
  { id: 'cat-6', name: 'বিনোদন', showIcon: true, isHidden: false },
  { id: 'cat-7', name: 'প্রযুক্তি', showIcon: true, isHidden: false },
  { id: 'cat-8', name: 'লাইফস্টাইল', showIcon: true, isHidden: false },
  { id: 'cat-9', name: 'মতামত', showIcon: true, isHidden: false },
];

export const DEFAULT_DYNAMIC_ADS: DynamicAdSettings = {
  popunder: {
    enabled: true,
    scriptUrl: 'https://pl31159237.profitableratecpmnetwork.com/29/a8/67/29a8676045a7e37ef249372b2fa46d3c.js',
    onlyOnHeadlineOrCoverClick: true
  },
  socialBar: {
    enabled: true,
    scriptUrl: 'https://pl31159238.profitableratecpmnetwork.com/27/65/fa/2765fa033dbdb8258da4afcb4fde947e.js',
    intervalSeconds: 45,
    position: 'bottom' as const,
    height: 'auto'
  },
  nativeBanner: {
    enabled: true,
    scriptUrl: 'https://pl31159239.profitableratecpmnetwork.com/521fd3d07f58a510c8b2fa24d6fac606/invoke.js',
    containerId: 'container-521fd3d07f58a510c8b2fa24d6fac606',
    width: '100%',
    minHeight: '90px',
    showInWriterPanel: true,
    showInManagingPanel: true,
    hideDuringPostCreation: true
  }
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'The Recap Media Cast LTD',
  siteTagline: 'বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ মাধ্যম',
  logoUrl: '',
  contactEmail: 'news@therecapmedia.com',
  contactPhone: '+880 9612-888999',
  officeAddress: 'রেকাপ মিডিয়া কাস্ট লিমিটেড টাওয়ার, গুলশান-২, ঢাকা-১২১২।',
  writerSecretCode: 'RECAP2026',
  adminSecretCode: 'ADMIN2026',
  adBanners: [
    {
      id: 'ad-1',
      title: 'হেডার ব্যানার অ্যাড',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      targetUrl: 'https://therecapmedia.com',
      position: 'header',
      isActive: true
    }
  ],
  dynamicAds: DEFAULT_DYNAMIC_ADS,
  socialWidgets: [
    { id: 'soc-fb', platform: 'facebook', name: 'Facebook Page', url: 'https://facebook.com/therecapmediacast', badge: 'ফলো', isActive: true },
    { id: 'soc-yt', platform: 'youtube', name: 'YouTube Channel', url: 'https://youtube.com/@therecapmediacast', badge: 'সাবস্ক্রাইব', isActive: true },
    { id: 'soc-ig', platform: 'instagram', name: 'Instagram Profile', url: 'https://instagram.com/therecapmediacast', badge: 'ফলো', isActive: true }
  ],
  staticPages: {
    aboutUs: '<h2>আমাদের সম্পর্কে (About Us)</h2><p>The Recap Media Cast LTD একটি আধুনিক বাংলা অনলাইন সংবাদ মাধ্যম...</p>',
    privacyPolicy: '<h2>গোপনীয়তা নীতি (Privacy Policy)</h2><p>আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করা আমাদের অঙ্গীকার...</p>',
    termsConditions: '<h2>ব্যবহারের শর্তাবলী (Terms & Conditions)</h2><p>এই ওয়েবসাইট ব্যবহারের ক্ষেত্রে নিয়মাবলি প্রযোজ্য...</p>'
  }
};

export interface InitialCloudState {
  articles: NewsArticle[];
  siteSettings: SiteSettings;
  categories: CategoryConfig[];
  writers: WriterProfile[];
  managers: ManagerProfile[];
  withdrawals: WithdrawalRequest[];
  notifications: SystemNotification[];
}

/**
 * Robust initial state fetch from Firebase Firestore.
 * Executed when component mounts to guarantee state is correctly restored
 * even if LocalStorage is empty or stale after a deployment.
 */
export async function fetchInitialStateFromFirestore(): Promise<InitialCloudState> {
  console.log('[Firestore] Fetching initial cloud state on mount...');

  // 1. ARTICLES
  let resolvedArticles: NewsArticle[] = [];
  try {
    const articlesCol = collection(db, 'articles');
    const q = query(articlesCol, orderBy('publishedAt', 'desc'));
    const snap = await getDocs(q).catch(() => getDocs(articlesCol));

    if (!snap.empty) {
      resolvedArticles = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          titleEn: data.titleEn || '',
          summary: data.summary || '',
          summaryEn: data.summaryEn || '',
          content: data.content || '',
          contentEn: data.contentEn || '',
          category: data.category || 'জাতীয়',
          tags: Array.isArray(data.tags) ? data.tags : [],
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
          videoUrl: data.videoUrl || '',
          author: data.author || 'THE RECAP MEDIA',
          source: data.source || '',
          publishedAt: data.publishedAt || new Date().toISOString(),
          isBreaking: !!data.isBreaking,
          isTrending: !!data.isTrending,
          viewsCount: typeof data.viewsCount === 'number' ? data.viewsCount : 0,
          readTimeMinutes: typeof data.readTimeMinutes === 'number' ? data.readTimeMinutes : 3,
          comments: Array.isArray(data.comments) ? data.comments : [],
          isAiGenerated: !!data.isAiGenerated,
          postType: data.postType || 'written',
          hasVideo: !!data.hasVideo,
          aiFlagged: !!data.aiFlagged,
          aiIssues: Array.isArray(data.aiIssues) ? data.aiIssues : [],
          aiCredibilityScore: typeof data.aiCredibilityScore === 'number' ? data.aiCredibilityScore : undefined,
          aiOffensiveReason: data.aiOffensiveReason || '',
          isUnpublished: !!data.isUnpublished,
          unpublishReason: data.unpublishReason || '',
          seoMeta: data.seoMeta || undefined,
        } as NewsArticle;
      });
    }

    // If Firestore has no articles, persist and seed INITIAL_NEWS immediately
    if (resolvedArticles.length === 0) {
      resolvedArticles = INITIAL_NEWS;
      // Seed to Firestore asynchronously so future sessions/tabs find them in cloud
      for (const art of INITIAL_NEWS) {
        setDoc(doc(db, 'articles', art.id), art).catch(() => {});
      }
    }

    try {
      localStorage.setItem('recap_news_cache', JSON.stringify(resolvedArticles));
    } catch {}
  } catch (err) {
    console.warn('[Firestore] Articles initial fetch note:', err);
    try {
      const cached = localStorage.getItem('recap_news_cache');
      if (cached) resolvedArticles = JSON.parse(cached);
    } catch {}
    if (!resolvedArticles || resolvedArticles.length === 0) {
      resolvedArticles = INITIAL_NEWS;
    }
  }

  // 2. SITE SETTINGS
  let resolvedSettings: SiteSettings = DEFAULT_SITE_SETTINGS;
  try {
    const settingsDocRef = doc(db, 'settings', 'site_settings');
    const settingsSnap = await getDoc(settingsDocRef);
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      resolvedSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...data,
        dynamicAds: {
          popunder: {
            ...DEFAULT_DYNAMIC_ADS.popunder,
            ...(data.dynamicAds?.popunder || {})
          },
          socialBar: {
            ...DEFAULT_DYNAMIC_ADS.socialBar,
            ...(data.dynamicAds?.socialBar || {})
          },
          nativeBanner: {
            ...DEFAULT_DYNAMIC_ADS.nativeBanner,
            ...(data.dynamicAds?.nativeBanner || {})
          }
        },
        socialWidgets: Array.isArray(data.socialWidgets) && data.socialWidgets.length > 0
          ? data.socialWidgets
          : DEFAULT_SITE_SETTINGS.socialWidgets,
        adBanners: Array.isArray(data.adBanners) && data.adBanners.length > 0
          ? data.adBanners
          : DEFAULT_SITE_SETTINGS.adBanners
      };
    } else {
      // Seed default settings to Firestore
      setDoc(settingsDocRef, DEFAULT_SITE_SETTINGS).catch(() => {});
    }
    try {
      localStorage.setItem('recap_site_settings', JSON.stringify(resolvedSettings));
    } catch {}
  } catch (err) {
    console.warn('[Firestore] Site settings initial fetch note:', err);
  }

  // 3. CATEGORIES
  let resolvedCategories: CategoryConfig[] = DEFAULT_CATEGORIES;
  try {
    const catDocRef = doc(db, 'settings', 'categories_list');
    const catSnap = await getDoc(catDocRef);
    if (catSnap.exists() && Array.isArray(catSnap.data()?.items) && catSnap.data().items.length > 0) {
      resolvedCategories = catSnap.data().items;
    } else {
      // Seed default categories to Firestore
      setDoc(catDocRef, { items: DEFAULT_CATEGORIES }).catch(() => {});
    }
    try {
      localStorage.setItem('recap_categories', JSON.stringify(resolvedCategories));
    } catch {}
  } catch (err) {
    console.warn('[Firestore] Categories initial fetch note:', err);
  }

  // 4. WRITERS
  let resolvedWriters: WriterProfile[] = [];
  try {
    const writersSnap = await getDocs(collection(db, 'writers'));
    if (!writersSnap.empty) {
      resolvedWriters = writersSnap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as WriterProfile[];
      try {
        localStorage.setItem('recap_writers', JSON.stringify(resolvedWriters));
      } catch {}
    } else {
      // If Firestore is empty, check if localStorage had any previously registered writers and sync them up
      try {
        const saved = localStorage.getItem('recap_writers');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            resolvedWriters = parsed;
            for (const w of parsed) {
              setDoc(doc(db, 'writers', w.id), w).catch(() => {});
            }
          }
        }
      } catch {}
    }
  } catch (err) {
    console.warn('[Firestore] Writers initial fetch note:', err);
    try {
      const saved = localStorage.getItem('recap_writers');
      if (saved) resolvedWriters = JSON.parse(saved);
    } catch {}
  }

  // 5. MANAGERS
  let resolvedManagers: ManagerProfile[] = [];
  try {
    const managersSnap = await getDocs(collection(db, 'managers'));
    if (!managersSnap.empty) {
      resolvedManagers = managersSnap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as ManagerProfile[];
      try {
        localStorage.setItem('recap_managers', JSON.stringify(resolvedManagers));
      } catch {}
    } else {
      try {
        const saved = localStorage.getItem('recap_managers');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            resolvedManagers = parsed;
            for (const m of parsed) {
              setDoc(doc(db, 'managers', m.id), m).catch(() => {});
            }
          }
        }
      } catch {}
    }
  } catch (err) {
    console.warn('[Firestore] Managers initial fetch note:', err);
    try {
      const saved = localStorage.getItem('recap_managers');
      if (saved) resolvedManagers = JSON.parse(saved);
    } catch {}
  }

  // 6. WITHDRAWALS
  let resolvedWithdrawals: WithdrawalRequest[] = [];
  try {
    const wdCol = collection(db, 'withdrawals');
    const wdQuery = query(wdCol, orderBy('createdAt', 'desc'));
    const wdSnap = await getDocs(wdQuery).catch(() => getDocs(wdCol));
    if (!wdSnap.empty) {
      resolvedWithdrawals = wdSnap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as WithdrawalRequest[];
      try {
        localStorage.setItem('recap_withdrawals', JSON.stringify(resolvedWithdrawals));
      } catch {}
    }
  } catch (err) {
    console.warn('[Firestore] Withdrawals initial fetch note:', err);
    try {
      const saved = localStorage.getItem('recap_withdrawals');
      if (saved) resolvedWithdrawals = JSON.parse(saved);
    } catch {}
  }

  // 7. NOTIFICATIONS
  let resolvedNotifications: SystemNotification[] = [];
  try {
    const notifCol = collection(db, 'notifications');
    const notifQuery = query(notifCol, orderBy('createdAt', 'desc'));
    const notifSnap = await getDocs(notifQuery).catch(() => getDocs(notifCol));
    if (!notifSnap.empty) {
      resolvedNotifications = notifSnap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as SystemNotification[];
      try {
        localStorage.setItem('recap_notifications', JSON.stringify(resolvedNotifications));
      } catch {}
    } else {
      const defaultNotif: SystemNotification = {
        id: 'notif-1',
        title: 'অফিশিয়াল প্রতিবেদক প্যানেলে স্বাগতম',
        message: 'The Recap Media Cast LTD-এর প্রতিবেদক প্যানেলে সংবাদ প্রকাশ শুরু করুন। বস্তুনিষ্ঠ সংবাদ প্রকাশে আমরা অঙ্গীকারবদ্ধ।',
        senderName: 'The Recap Media Cast LTD',
        recipientWriterId: 'ALL',
        createdAt: new Date().toISOString(),
        read: false
      };
      resolvedNotifications = [defaultNotif];
      setDoc(doc(db, 'notifications', defaultNotif.id), defaultNotif).catch(() => {});
      try {
        localStorage.setItem('recap_notifications', JSON.stringify(resolvedNotifications));
      } catch {}
    }
  } catch (err) {
    console.warn('[Firestore] Notifications initial fetch note:', err);
    try {
      const saved = localStorage.getItem('recap_notifications');
      if (saved) resolvedNotifications = JSON.parse(saved);
    } catch {}
  }

  console.log('[Firestore] Initial cloud state successfully synchronized:', {
    articles: resolvedArticles.length,
    writers: resolvedWriters.length,
    managers: resolvedManagers.length,
    withdrawals: resolvedWithdrawals.length,
    categories: resolvedCategories.length
  });

  return {
    articles: resolvedArticles,
    siteSettings: resolvedSettings,
    categories: resolvedCategories,
    writers: resolvedWriters,
    managers: resolvedManagers,
    withdrawals: resolvedWithdrawals,
    notifications: resolvedNotifications
  };
}
