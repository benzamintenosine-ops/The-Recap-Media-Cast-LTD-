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
  adminSecretCode: 'ADMIN-RECAP-9824',
  managingSecretCode: 'MANAGING2026',
  telegramReferralUrl: 'https://t.me/TheRecapMediaCast',
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

function withCloudTimeout<T>(promise: Promise<T>, timeoutMs = 2000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Cloud fetch timeout')), timeoutMs))
  ]);
}

/**
 * Robust initial state fetch from Firebase Firestore.
 * Executed in parallel with Promise.allSettled to guarantee the website loads instantly
 * without blocking or hanging on sequential network roundtrips.
 */
export async function fetchInitialStateFromFirestore(): Promise<InitialCloudState> {
  console.log('[Firestore] Fetching initial cloud state in parallel...');

  // Pre-load from localStorage cache if available for instantaneous rendering
  let resolvedArticles: NewsArticle[] = INITIAL_NEWS;
  let resolvedSettings: SiteSettings = DEFAULT_SITE_SETTINGS;
  let resolvedCategories: CategoryConfig[] = DEFAULT_CATEGORIES;
  let resolvedWriters: WriterProfile[] = [];
  let resolvedManagers: ManagerProfile[] = [];
  let resolvedWithdrawals: WithdrawalRequest[] = [];
  let resolvedNotifications: SystemNotification[] = [];

  try {
    const cachedArticles = localStorage.getItem('recap_news_cache');
    if (cachedArticles) resolvedArticles = JSON.parse(cachedArticles);
  } catch {}

  try {
    const cachedSettings = localStorage.getItem('recap_site_settings');
    if (cachedSettings) resolvedSettings = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(cachedSettings) };
  } catch {}

  try {
    const cachedCategories = localStorage.getItem('recap_categories');
    if (cachedCategories) resolvedCategories = JSON.parse(cachedCategories);
  } catch {}

  try {
    const cachedWriters = localStorage.getItem('recap_writers');
    if (cachedWriters) resolvedWriters = JSON.parse(cachedWriters);
  } catch {}

  try {
    const cachedManagers = localStorage.getItem('recap_managers');
    if (cachedManagers) resolvedManagers = JSON.parse(cachedManagers);
  } catch {}

  try {
    const cachedWithdrawals = localStorage.getItem('recap_withdrawals');
    if (cachedWithdrawals) resolvedWithdrawals = JSON.parse(cachedWithdrawals);
  } catch {}

  try {
    const cachedNotifications = localStorage.getItem('recap_notifications');
    if (cachedNotifications) resolvedNotifications = JSON.parse(cachedNotifications);
  } catch {}

  // Fetch all 7 Firestore collections in parallel
  const [
    articlesResult,
    settingsResult,
    categoriesResult,
    writersResult,
    managersResult,
    withdrawalsResult,
    notificationsResult
  ] = await Promise.allSettled([
    // 1. Articles
    (async () => {
      const articlesCol = collection(db, 'articles');
      const q = query(articlesCol, orderBy('publishedAt', 'desc'));
      const snap = await withCloudTimeout(getDocs(q).catch(() => getDocs(articlesCol)));
      if (!snap.empty) {
        return snap.docs.map((docSnap) => {
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
      return [];
    })(),

    // 2. Settings
    (async () => {
      const settingsDocRef = doc(db, 'settings', 'site_settings');
      const settingsSnap = await withCloudTimeout(getDoc(settingsDocRef));
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        return {
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
      }
      return null;
    })(),

    // 3. Categories
    (async () => {
      const catDocRef = doc(db, 'settings', 'categories_list');
      const catSnap = await withCloudTimeout(getDoc(catDocRef));
      if (catSnap.exists() && Array.isArray(catSnap.data()?.items) && catSnap.data().items.length > 0) {
        return catSnap.data().items as CategoryConfig[];
      }
      return [];
    })(),

    // 4. Writers
    (async () => {
      const writersSnap = await withCloudTimeout(getDocs(collection(db, 'writers')));
      if (!writersSnap.empty) {
        return writersSnap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as WriterProfile[];
      }
      return [];
    })(),

    // 5. Managers
    (async () => {
      const managersSnap = await withCloudTimeout(getDocs(collection(db, 'managers')));
      if (!managersSnap.empty) {
        return managersSnap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as ManagerProfile[];
      }
      return [];
    })(),

    // 6. Withdrawals
    (async () => {
      const wdCol = collection(db, 'withdrawals');
      const wdQuery = query(wdCol, orderBy('createdAt', 'desc'));
      const wdSnap = await withCloudTimeout(getDocs(wdQuery).catch(() => getDocs(wdCol)));
      if (!wdSnap.empty) {
        return wdSnap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as WithdrawalRequest[];
      }
      return [];
    })(),

    // 7. Notifications
    (async () => {
      const notifCol = collection(db, 'notifications');
      const notifQuery = query(notifCol, orderBy('createdAt', 'desc'));
      const notifSnap = await withCloudTimeout(getDocs(notifQuery).catch(() => getDocs(notifCol)));
      if (!notifSnap.empty) {
        return notifSnap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as SystemNotification[];
      }
      return [];
    })()
  ]);

  // Process Articles result
  if (articlesResult.status === 'fulfilled' && articlesResult.value && articlesResult.value.length > 0) {
    resolvedArticles = articlesResult.value;
    try {
      localStorage.setItem('recap_news_cache', JSON.stringify(resolvedArticles));
    } catch {}
  } else if (!resolvedArticles || resolvedArticles.length === 0) {
    resolvedArticles = INITIAL_NEWS;
  }

  // Process Settings result
  if (settingsResult.status === 'fulfilled' && settingsResult.value) {
    resolvedSettings = settingsResult.value;
    try {
      localStorage.setItem('recap_site_settings', JSON.stringify(resolvedSettings));
    } catch {}
  }

  // Process Categories result
  if (categoriesResult.status === 'fulfilled' && categoriesResult.value && categoriesResult.value.length > 0) {
    resolvedCategories = categoriesResult.value;
    try {
      localStorage.setItem('recap_categories', JSON.stringify(resolvedCategories));
    } catch {}
  }

  // Process Writers result
  if (writersResult.status === 'fulfilled' && writersResult.value && writersResult.value.length > 0) {
    resolvedWriters = writersResult.value;
    try {
      localStorage.setItem('recap_writers', JSON.stringify(resolvedWriters));
    } catch {}
  }

  // Process Managers result
  if (managersResult.status === 'fulfilled' && managersResult.value && managersResult.value.length > 0) {
    resolvedManagers = managersResult.value;
    try {
      localStorage.setItem('recap_managers', JSON.stringify(resolvedManagers));
    } catch {}
  }

  // Process Withdrawals result
  if (withdrawalsResult.status === 'fulfilled' && withdrawalsResult.value && withdrawalsResult.value.length > 0) {
    resolvedWithdrawals = withdrawalsResult.value;
    try {
      localStorage.setItem('recap_withdrawals', JSON.stringify(resolvedWithdrawals));
    } catch {}
  }

  // Process Notifications result
  if (notificationsResult.status === 'fulfilled' && notificationsResult.value && notificationsResult.value.length > 0) {
    resolvedNotifications = notificationsResult.value;
    try {
      localStorage.setItem('recap_notifications', JSON.stringify(resolvedNotifications));
    } catch {}
  } else if (!resolvedNotifications || resolvedNotifications.length === 0) {
    resolvedNotifications = [
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
