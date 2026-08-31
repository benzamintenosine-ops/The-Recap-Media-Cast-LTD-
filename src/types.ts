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
  author: string;
  publishedAt: string;
  isBreaking?: boolean;
  isTrending?: boolean;
  viewsCount: number;
  comments: Comment[];
  readTimeMinutes: number;
  isAiGenerated?: boolean;
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
  mobile: string;
  age: number;
  avatarUrl?: string;
  secretCodeUsed: string;
  createdAt: string;
  isBanned?: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  mobile: string;
  age: number;
  avatarUrl?: string;
  secretCodeUsed: string;
  createdAt: string;
}

export interface SocialWidget {
  id: string;
  name: string;
  url: string;
  badge?: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'custom';
  color?: string;
  isActive?: boolean;
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
  aboutUsHtml?: string;
  privacyPolicyHtml?: string;
  contactUsHtml?: string;
  socialWidgets: SocialWidget[];
  adBanners: AdBanner[];
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
  status: 'APPROVED' | 'NEEDS_REVIEW' | 'FLAGGED_DUPLICATE' | 'REJECTED';
  issuesFound: string[];
  positivePoints: string[];
  editorialAdvice: string;
  checkedAt: string;
}
