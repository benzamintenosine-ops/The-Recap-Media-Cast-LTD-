export type Language = 'bn' | 'en';

export type Category = string;

export interface CategoryConfig {
  id: string;
  name: string;
  nameEn?: string;
  iconName?: string;
  showIcon?: boolean;
  isHidden?: boolean;
}

export type CategoryEn = 
  | 'National'
  | 'Politics'
  | 'Economy'
  | 'International'
  | 'Tech'
  | 'Science'
  | 'Sports'
  | 'Entertainment'
  | 'Lifestyle';

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  category: Category;
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  hasVideo?: boolean;
  author: string;
  authorDistrict?: string;
  source?: string; // তথ্যসূত্র / Reference source
  publishedAt: string;
  isBreaking?: boolean;
  isTrending?: boolean;
  viewsCount: number;
  comments: Comment[];
  readTimeMinutes: number;
  isAiGenerated?: boolean;
  postType?: 'written' | 'video';
  aiFlagged?: boolean;
  aiIssues?: string[];
  aiCredibilityScore?: number;
  aiOffensiveReason?: string;
  isUnpublished?: boolean;
  unpublishReason?: string;
  seoMeta?: {
    title: string;
    metaDescription: string;
  };
}

export interface AdBanner {
  id: string;
  title: string;
  sponsorName?: string;
  imageUrl: string;
  targetUrl: string;
  placement?: 'header_top' | 'sidebar' | 'in_article';
  position?: 'header' | 'sidebar' | 'in_article';
  active?: boolean;
  isActive?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: 'admin' | 'viewer';
  avatar?: string;
  bio?: string;
  bookmarks: string[]; // article IDs
  offlineSaved: string[]; // article IDs saved for offline reading
  joinedAt: string;
}

export interface WriterProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  postOffice?: string;
  postCode?: string;
  thana?: string;
  district?: string;
  division?: string;
  nidNumber?: string;
  mobile: string;
  age: number;
  avatarUrl?: string;
  password?: string;
  secretCodeUsed: string;
  managerId?: string;
  managerName?: string;
  status?: 'pending' | 'approved' | 'active' | 'banned' | 'restricted' | 'rejected' | 'suspended';
  isBanned?: boolean;
  isRestricted?: boolean;
  postLimitPerDay?: number;
  rejectionReason?: string;
  createdAt: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  designation?: string;
  bio?: string;
  password?: string;
  postOffice?: string;
  postCode?: string;
  thana?: string;
  district?: string;
  division?: string;
  nidNumber?: string;
  mobile: string;
  age: number;
  avatarUrl?: string;
  secretCodeUsed: string;
  createdAt: string;
}

export interface ManagerProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatarUrl?: string;
  address?: string;
  designation?: string;
  password?: string;
  age?: number;
  bio?: string;
  secretCodeUsed: string;
  referralCode?: string; // Manager's unique referral code for their reporters
  maxReportersLimit?: number; // Default 10
  createdAt: string;
}

export interface SocialWidget {
  id: string;
  name: string;
  url: string;
  badge?: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'whatsapp' | 'telegram' | 'tiktok' | 'custom';
  color?: string;
  isActive?: boolean;
}

export interface DynamicAdSettings {
  popunder: {
    enabled: boolean;
    scriptUrl: string;
    onlyOnHeadlineOrCoverClick: boolean;
  };
  socialBar: {
    enabled: boolean;
    scriptUrl: string;
    intervalSeconds: number; // e.g. 45
    position?: 'bottom' | 'top';
    height?: string; // e.g. 'auto', '60px'
  };
  nativeBanner: {
    enabled: boolean;
    scriptUrl: string;
    containerId: string;
    width?: string;
    height?: string;
    minHeight?: string;
    showInWriterPanel: boolean;
    showInManagingPanel: boolean;
    hideDuringPostCreation: boolean;
  };
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  officeAddress?: string;
  writerSecretCode: string;
  adminSecretCode: string;
  managingSecretCode?: string;
  telegramReferralUrl?: string;
  aboutUsHtml?: string;
  privacyPolicyHtml?: string;
  contactUsHtml?: string;
  aboutUsData?: {
    title?: string;
    subtitle?: string;
    intro?: string;
    card1Title?: string;
    card1Desc?: string;
    card2Title?: string;
    card2Desc?: string;
    card3Title?: string;
    card3Desc?: string;
    missionTitle?: string;
    missionPoints?: string[];
    footerNotice?: string;
    regNo?: string;
  };
  privacyPolicyData?: {
    title?: string;
    subtitle?: string;
    securityTitle?: string;
    securityDesc?: string;
    sec1Title?: string;
    sec1Desc?: string;
    sec2Title?: string;
    sec2Desc?: string;
    sec3Title?: string;
    sec3Desc?: string;
    sec4Title?: string;
    sec4Desc?: string;
  };
  contactUsData?: {
    title?: string;
    subtitle?: string;
    headOfficeLabel?: string;
    headOfficeAddress?: string;
    phoneLabel?: string;
    phoneNumbers?: string;
    emailLabel?: string;
    emailAddress?: string;
    webLabel?: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
  };
  socialWidgets: SocialWidget[];
  adBanners: AdBanner[];
  dynamicAds?: DynamicAdSettings;
  staticPages?: {
    aboutUs?: string;
    privacyPolicy?: string;
    termsConditions?: string;
  };
}

export interface SystemNotification {
  id: string;
  recipientWriterId: string; // writer ID or 'ALL'
  senderName: string; // Always 'The Recap Media Cast LTD'
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type?: 'general' | 'payment_done' | 'post_deleted';
  amount?: number;
  reason?: string;
}

export interface WithdrawalRequest {
  id: string;
  writerId: string;
  writerName: string;
  writerMobile: string;
  writerAvatar?: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'TAP' | 'Bank' | string;
  accountNumber: string;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
  senderAccount?: string;
  transactionId?: string;
}

export interface AnalyticsOverview {
  totalViews: number;
  todayReaders: number;
  activeVisitors: number;
  totalArticles: number;
  totalComments: number;
  categoryDistribution: { category: string; count: number; percentage: number }[];
  hourlyTraffic: { time: string; count: number }[];
}

export interface AgentLog {
  id: string;
  timestamp: string;
  articleId: string;
  title: string;
  status: 'success' | 'failed' | 'generating';
  details: string;
}

export interface ArticleAuthenticityResult {
  isDuplicate: boolean;
  duplicateMatchTitle?: string;
  duplicateConfidencePercent: number;
  isSocialMediaRipped: boolean;
  socialMediaPlatformDetected?: string;
  factCheckVerdict: 'VERIFIED' | 'QUESTIONABLE' | 'UNVERIFIED_RUMOR' | 'MISLEADING' | 'PLAGIARIZED';
  credibilityScore: number; // 0 - 100
  status: 'APPROVED' | 'NEEDS_REVIEW' | 'FLAGGED_DUPLICATE' | 'REJECTED' | 'REJECTED_OFFENSIVE';
  issuesFound: string[];
  positivePoints: string[];
  editorialAdvice: string;
  checkedAt: string;
  isOffensiveOrHarmful?: boolean;
  offensiveType?: string;
  offensiveReason?: string;
  isUnverifiedOrDoubtful?: boolean;
  doubtReason?: string;
  wordCount?: number;
  canProceedWithAffirmation?: boolean;
}
