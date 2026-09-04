import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  PenTool, 
  Sparkles, 
  Image as ImageIcon, 
  ShieldCheck, 
  Lock, 
  Users, 
  Eye, 
  MessageSquare, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  Video,
  FileText,
  Tag as TagIcon,
  User,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Heading2,
  Highlighter,
  List,
  Quote,
  Palette,
  Check,
  UploadCloud,
  AlertCircle,
  CheckSquare,
  Square,
  LogOut,
  Edit3,
  DollarSign,
  Bell,
  X,
  History,
  CreditCard,
  Wallet,
  AlertTriangle,
  Globe,
  Upload,
  Mail
} from 'lucide-react';
import { NewsArticle, Category, Language, AnalyticsOverview, WriterProfile, SystemNotification, WithdrawalRequest, ArticleAuthenticityResult, SiteSettings } from '../types';
import { getTranslation } from '../utils/i18n';
import { renderFormattedContent } from '../utils/formatContent';
import { RichContentEditor } from './BloggerRichEditor';
import { BotProtectionModal } from './BotProtection';
import { BANGLADESH_GEO_DATA } from '../data/bangladeshGeoData';
import { NativeBannerAd } from './DynamicAdServices';
import { formatReporterName } from '../utils/authorHelper';

interface WritersPortalProps {
  articles: NewsArticle[];
  onAddArticle: (article: Partial<NewsArticle>) => void;
  onUpdateArticle?: (id: string, updatedArticle: Partial<NewsArticle>) => void;
  onDeleteArticle: (id: string) => void;
  currentLang: Language;
  writerSecretCode?: string;
  notifications?: SystemNotification[];
  onSendNotification?: (notification: Omit<SystemNotification, 'id' | 'createdAt' | 'read'>) => void;
  withdrawals?: WithdrawalRequest[];
  onRequestWithdrawal?: (req: Omit<WithdrawalRequest, 'id' | 'createdAt' | 'status'>) => void;
  onRegisterWriter?: (writer: WriterProfile) => void;
  writers?: WriterProfile[];
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

export const AdminPortal: React.FC<WritersPortalProps> = ({
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  currentLang,
  writerSecretCode = 'RECAP2026',
  notifications = [],
  onSendNotification,
  withdrawals = [],
  onRequestWithdrawal,
  onRegisterWriter,
  writers = [],
  siteSettings
}) => {
  // Auth state for Writer
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('recap_writer_logged') === 'true';
  });
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Saved Writer Profile
  const [writerProfile, setWriterProfile] = useState<WriterProfile | null>(() => {
    const saved = localStorage.getItem('recap_writer_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Email Verification Flow State
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');
  const [verificationSuccess, setVerificationSuccess] = useState<string>('');
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Writer / Reporter Profile Setup Form State
  const [setupName, setSetupName] = useState(writerProfile?.name || '');
  const [setupPostOffice, setSetupPostOffice] = useState(writerProfile?.postOffice || '');
  const [setupPostCode, setSetupPostCode] = useState(writerProfile?.postCode || '');
  const [setupThana, setSetupThana] = useState(writerProfile?.thana || '');
  const [setupDistrict, setSetupDistrict] = useState(writerProfile?.district || '');
  const [setupDivision, setSetupDivision] = useState(writerProfile?.division || '');
  const [setupNidNumber, setSetupNidNumber] = useState(writerProfile?.nidNumber || '');
  const [setupAddress, setSetupAddress] = useState(writerProfile?.address || '');
  const [setupMobile, setSetupMobile] = useState(writerProfile?.mobile || '');
  const [setupAge, setSetupAge] = useState<number | ''>(writerProfile?.age || '');
  const [setupAvatarUrl, setSetupAvatarUrl] = useState(writerProfile?.avatarUrl || '');
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  const [photoVerified, setPhotoVerified] = useState<boolean>(Boolean(writerProfile?.avatarUrl));
  const [profileError, setProfileError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Referral Code Window State (Screen 3 after profile setup)
  const [showReferralWindow, setShowReferralWindow] = useState<boolean>(false);
  const [referralSecretInput, setReferralSecretInput] = useState<string>('');
  const [referralSecretError, setReferralSecretError] = useState<string>('');

  // Active Sub-Tab: 'analytics' | 'create' | 'manage' | 'withdraw' | 'notifications' | 'profile'
  const [activeTab, setActiveTab] = useState<'analytics' | 'create' | 'manage' | 'withdraw' | 'notifications' | 'profile'>('create');

  // Article Edit Mode State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Withdrawal form & Modal states
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [selectedGateway, setSelectedGateway] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'TAP' | ''>('');
  const [withdrawPhoneInput, setWithdrawPhoneInput] = useState<string>('');
  const [withdrawCustomAmount, setWithdrawCustomAmount] = useState<number | ''>('');
  const [transactionNoticeMsg, setTransactionNoticeMsg] = useState<string>('');

  // Payment History modal state (accessible from Notifications tab)
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState<boolean>(false);

  // Blogger-style Multi-step Editor State
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [postTitle, setPostTitle] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSource, setPostSource] = useState('');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [postCategory, setPostCategory] = useState<Category>('জাতীয়');
  const [postTags, setPostTags] = useState<string[]>(['সংবাদ', 'জাতীয়', 'ব্রেকিং']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80');
  const [isBreaking, setIsBreaking] = useState(false);
  const [shareNameUnderPost, setShareNameUnderPost] = useState(true);
  const [postSuccessMessage, setPostSuccessMessage] = useState('');
  const [editorError, setEditorError] = useState('');

  // Reporter Sign Up Terms Agreement State
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [imageSizeError, setImageSizeError] = useState('');

  // Cascading Location Helpers from BANGLADESH_GEO_DATA
  const selectedDivisionObj = BANGLADESH_GEO_DATA.find(
    (d) => d.name === setupDivision || d.nameEn?.toLowerCase() === setupDivision.toLowerCase()
  );
  const availableDistricts = selectedDivisionObj ? selectedDivisionObj.districts : [];

  const selectedDistrictObj = availableDistricts.find(
    (d) => d.name === setupDistrict || d.nameEn?.toLowerCase() === setupDistrict.toLowerCase()
  );
  const availableUpazilas = selectedDistrictObj ? selectedDistrictObj.upazilas : [];

  const selectedUpazilaObj = availableUpazilas.find(
    (u) => u.name === setupThana || u.nameEn?.toLowerCase() === setupThana.toLowerCase()
  );
  const availablePostOffices = selectedUpazilaObj ? selectedUpazilaObj.postOffices : [];

  // Unverified / Doubtful News Affirmation Modal State ("আপনার পোস্ট করা নিউজের বিষয়বস্তু কি সত্য? (হ্যাঁ/না)")
  const [doubtModalOpen, setDoubtModalOpen] = useState<boolean>(false);

  // Helper function to count words from HTML content
  const countWords = (html: string) => {
    const plain = html.replace(/<[^>]*>?/gm, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  };

  // Daily Post Limit: Maximum 10 posts per day per writer
  const DAILY_POST_LIMIT = 10;

  const getTodayPostsCount = () => {
    if (!writerProfile?.name) return 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const writerNameLower = writerProfile.name.trim().toLowerCase();
    
    // Count from live articles list
    const fromArticles = articles.filter(a => {
      if (!a.publishedAt) return false;
      const artDate = a.publishedAt.split('T')[0];
      const artAuthor = (a.author || '').toLowerCase();
      return artDate === todayStr && artAuthor.includes(writerNameLower);
    }).length;

    try {
      const stored = parseInt(localStorage.getItem(`recap_daily_posts_${writerNameLower}_${todayStr}`) || '0', 10);
      return Math.max(fromArticles, stored);
    } catch {
      return fromArticles;
    }
  };

  const todayPostsCount = getTodayPostsCount();
  const isDailyLimitReached = todayPostsCount >= DAILY_POST_LIMIT;

  // Gemini Fact-Checking & Duplicate / Social Media Copy Verification State
  const [authenticityResult, setAuthenticityResult] = useState<ArticleAuthenticityResult | null>(null);
  const [isVerifyingAuthenticity, setIsVerifyingAuthenticity] = useState<boolean>(false);
  const [authenticityError, setAuthenticityError] = useState<string>('');
  const [ruleCheckboxes, setRuleCheckboxes] = useState<boolean[]>([false, false, false, false, false, false]);

  // Cloudflare & reCAPTCHA Bot Protection modal state
  const [showBotModal, setShowBotModal] = useState<boolean>(false);
  const [botModalActionTitle, setBotModalActionTitle] = useState<string>('নিরাপত্তা ও বট প্রতিরোধ যাচাই');
  const [botSuccessCallback, setBotSuccessCallback] = useState<(() => void) | null>(null);

  // Real-time Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsOverview>({
    totalViews: 14890,
    todayReaders: 4120,
    activeVisitors: 158,
    totalArticles: articles.length,
    totalComments: 45,
    categoryDistribution: [],
    hourlyTraffic: [
      { time: '08:00', count: 420 },
      { time: '10:00', count: 980 },
      { time: '12:00', count: 1850 },
      { time: '14:00', count: 1420 },
      { time: '16:00', count: 2100 },
      { time: '18:00', count: 2890 },
      { time: '20:00', count: 3450 },
    ]
  });

  // Real-time visitors ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setAnalytics((prev) => ({
        ...prev,
        activeVisitors: Math.max(80, prev.activeVisitors + (Math.floor(Math.random() * 7) - 3)),
        totalViews: prev.totalViews + Math.floor(Math.random() * 2),
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Cooldown countdown for resending verification code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const t = (key: any) => getTranslation(currentLang, key);

  // Send 6-digit Email Verification Code
  const handleSendVerificationCode = async () => {
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setAuthError('সঠিক জিমেইল / ইমেইল এড্রেস লিখুন!');
      return;
    }
    setIsSendingCode(true);
    setAuthError('');
    setVerificationError('');
    setVerificationSuccess('');
    try {
      const res = await fetch('/api/send-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          name: setupName.trim() || 'প্রতিবেদক',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowVerifyModal(true);
        setVerificationSuccess(data.message || 'আপনার জিমেইলে ৬ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে!');
        setResendCooldown(60);
      } else {
        setAuthError(data.error || 'কোড পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
      }
    } catch (err: any) {
      setAuthError('সার্ভারের সাথে সংযোগ করা যায়নি। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify 6-digit Code Submission
  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCodeInput.trim().length !== 6) {
      setVerificationError('দয়া করে আপনার জিমেইলে প্রেরিত ৬ ডিজিটের কোডটি লিখুন!');
      return;
    }

    setIsVerifyingCode(true);
    setVerificationError('');
    try {
      const res = await fetch('/api/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          code: verificationCodeInput.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setIsEmailVerified(true);
        setShowVerifyModal(false);

        const cleanEmail = emailInput.trim().toLowerCase();
        const initialProfile: WriterProfile = {
          id: `writer-${Date.now()}`,
          name: setupName.trim() || 'প্রতিবেদক',
          email: cleanEmail,
          address: '',
          mobile: '',
          age: 0,
          createdAt: new Date().toISOString(),
          secretCodeUsed: '',
        };
        setWriterProfile(initialProfile);
      } else {
        setVerificationError(data.error || 'ভেরিফিকেশন কোডটি সঠিক নয়! পুনরায় চেষ্টা করুন।');
      }
    } catch (err) {
      setVerificationError('কোড যাচাইয়ে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Writer Auth Handler (Login / Signup)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('ইমেইল এবং পাসওয়ার্ড প্রদান করা বাধ্যতামূলক!');
      return;
    }

    if (authMode === 'signup') {
      if (!setupName.trim()) {
        setAuthError('আপনার পূর্ণ নাম প্রদান করুন!');
        return;
      }
      if (!isEmailVerified) {
        await handleSendVerificationCode();
        return;
      }
    }

    if (authMode === 'login') {
      const cleanEmail = emailInput.trim().toLowerCase();
      const existing = writers?.find((w) => w.email.trim().toLowerCase() === cleanEmail);
      if (existing) {
        if (existing.isBanned) {
          setAuthError('আপনার অ্যাকাউন্টটি অ্যাডমিন প্যানেল থেকে সাময়িকভাবে বন্ধ (Banned) করা হয়েছে।');
          return;
        }
        setWriterProfile(existing);
        localStorage.setItem('recap_writer_profile', JSON.stringify(existing));
        setSetupName(existing.name || '');
        setIsEmailVerified(true);
        setIsAuthenticated(true);
        localStorage.setItem('recap_writer_logged', 'true');
        return;
      } else if (!writerProfile || writerProfile.email.toLowerCase() !== cleanEmail) {
        const newTemp: WriterProfile = {
          id: `writer-${Date.now()}`,
          name: cleanEmail.split('@')[0] || 'প্রতিবেদক',
          email: cleanEmail,
          address: '',
          mobile: '',
          age: 0,
          createdAt: new Date().toISOString(),
          secretCodeUsed: 'DIRECT_LOGIN',
        };
        setWriterProfile(newTemp);
        localStorage.setItem('recap_writer_profile', JSON.stringify(newTemp));
      }
    }

    // Check if writer profile is banned by admin
    if (writerProfile && writerProfile.isBanned) {
      setAuthError('আপনার অ্যাকাউন্টটি অ্যাডমিন প্যানেল থেকে সাময়িকভাবে বন্ধ (Banned) করা হয়েছে। যোগাযোগের জন্য সাপোর্ট টিমকে জানান।');
      return;
    }

    // Success Auth
    setIsAuthenticated(true);
    localStorage.setItem('recap_writer_logged', 'true');
  };

  // Profile Picture Upload and AI Human Verification
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;

      setIsVerifyingPhoto(true);
      try {
        const res = await fetch('/api/verify-human-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 })
        });
        const data = await res.json();
        if (data.isHuman) {
          setSetupAvatarUrl(base64);
          setPhotoVerified(true);
        } else {
          setPhotoVerified(false);
          setSetupAvatarUrl('');
          setProfileError(data.reason || 'শুধুমাত্র মানুষের ছবি গ্রহণযোগ্য! (প্রাণী, বস্তু বা কৃত্রিম ছবি অগ্রহণযোগ্য)');
        }
      } catch (err) {
        // Fallback
        setSetupAvatarUrl(base64);
        setPhotoVerified(true);
      } finally {
        setIsVerifyingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reporter / Writer Profile Setup Submission
  const handleProfileSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');

    if (
      !setupName.trim() ||
      !setupPostOffice.trim() ||
      !setupPostCode.trim() ||
      !setupThana.trim() ||
      !setupDistrict.trim() ||
      !setupDivision.trim() ||
      !setupNidNumber.trim() ||
      !setupMobile.trim() ||
      setupAge === ''
    ) {
      setProfileError('সকল ক্ষেত্র (নাম, পোস্ট অফিস, পোস্ট কোড, থানা, জেলা, বিভাগ, NID নম্বর, মোবাইল নম্বর, বয়স, ছবি) পূরণ করা বাধ্যতামূলক!');
      return;
    }

    const cleanMobile = setupMobile.trim().replace(/\D/g, '');
    if (cleanMobile.length !== 11) {
      setProfileError('মোবাইল নম্বরটি অবশ্যই সঠিক ১১ ডিজিটের হতে হবে (যেমন: 01712345678)!');
      return;
    }

    const ageNum = Number(setupAge);
    if (isNaN(ageNum) || ageNum < 18) {
      setProfileError('বয়স অবশ্যই ১৮ বছর বা তার বেশি হতে হবে! (১৮ বছরের নিচে আবেদন গ্রহণযোগ্য নয়)');
      return;
    }

    const nidDigits = setupNidNumber.trim().replace(/\D/g, '');
    if (nidDigits.length < 10) {
      setProfileError('NID নম্বরটি সঠিক নয়! সর্বনিম্ন ১০ বা ১৩ ডিজিটের জাতীয় পরিচয়পত্র (NID) নম্বর লিখুন।');
      return;
    }

    if (!setupAvatarUrl || !photoVerified) {
      setProfileError('ডিভাইস থেকে নিজস্ব মানুষের প্রোফাইল ছবি আপলোড এবং AI যাচাইকরণ বাধ্যতামূলক!');
      return;
    }

    if (!ruleCheckboxes.every(Boolean) || !agreedToTerms) {
      setProfileError('প্রতিবেদক হিসেবে নীতিমালার ৬টি বক্সে এবং স্বীকারোক্তিতে টিক চিহ্ন দেওয়া বাধ্যতামূলক!');
      return;
    }

    const formattedAddress = `পোস্ট অফিস: ${setupPostOffice.trim()}, পোস্ট কোড: ${setupPostCode.trim()}, থানা: ${setupThana.trim()}, জেলা: ${setupDistrict.trim()}, বিভাগ: ${setupDivision.trim()}`;

    const newProfile: WriterProfile = {
      id: writerProfile?.id || `writer-${Date.now()}`,
      name: setupName.trim(),
      email: emailInput || writerProfile?.email || 'reporter@therecapmedia.com',
      address: formattedAddress,
      postOffice: setupPostOffice.trim(),
      postCode: setupPostCode.trim(),
      thana: setupThana.trim(),
      district: setupDistrict.trim(),
      division: setupDivision.trim(),
      nidNumber: nidDigits,
      mobile: setupMobile.trim(),
      age: ageNum,
      avatarUrl: setupAvatarUrl,
      secretCodeUsed: writerProfile?.secretCodeUsed || '',
      createdAt: writerProfile?.createdAt || new Date().toISOString()
    };

    setWriterProfile(newProfile);
    setIsEditingProfile(false);

    // If already has secret code verified (or editing existing profile), save directly
    if (newProfile.secretCodeUsed && newProfile.secretCodeUsed.trim().length > 0 && newProfile.secretCodeUsed !== 'DIRECT_SIGNUP') {
      localStorage.setItem('recap_writer_profile', JSON.stringify(newProfile));
      if (onRegisterWriter) {
        onRegisterWriter(newProfile);
      }
    } else {
      // Open Screen 3: Secret Referral Code Window
      setShowReferralWindow(true);
    }
  };

  // Dedicated Secret Referral Code Verification Handler
  const handleReferralCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReferralSecretError('');

    const targetCode = (writerSecretCode || siteSettings?.writerSecretCode || 'RECAP2026').trim().toUpperCase();
    if (referralSecretInput.trim().toUpperCase() !== targetCode) {
      setReferralSecretError('ভুল গোপন রেফার কোড! সঠিক রেফার কোডের জন্য নিচে ইনবক্স করুন।');
      return;
    }

    if (writerProfile) {
      const finalProfile: WriterProfile = {
        ...writerProfile,
        secretCodeUsed: referralSecretInput.trim().toUpperCase()
      };
      setWriterProfile(finalProfile);
      localStorage.setItem('recap_writer_profile', JSON.stringify(finalProfile));
      localStorage.setItem('recap_writer_logged', 'true');
      if (onRegisterWriter) {
        onRegisterWriter(finalProfile);
      }
    } else {
      localStorage.setItem('recap_writer_logged', 'true');
    }

    setShowReferralWindow(false);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('recap_writer_logged');
    localStorage.removeItem('recap_writer_profile');
    setWriterProfile(null);
    setEmailInput('');
    setPasswordInput('');
    setSetupName('');
    setSetupMobile('');
    setSetupNidNumber('');
    setSetupDivision('');
    setSetupDistrict('');
    setSetupThana('');
    setSetupPostOffice('');
    setSetupPostCode('');
    setSetupAvatarUrl('');
    setPhotoVerified(false);
    setIsEmailVerified(false);
    setShowReferralWindow(false);
    setReferralSecretInput('');
    setReferralSecretError('');
    setAuthError('');
  };

  // Image Upload handler with 500KB Minimum File Size Validation
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageSizeError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const minSizeInBytes = 500 * 1024; // 500 KB
    if (file.size < minSizeInBytes) {
      const actualKb = Math.round(file.size / 1024);
      setImageSizeError(`ছবিটি সাইজে খুবই ছোট (${actualKb} KB)। সর্বনিম্ন 500 KB হাই-কোয়ালিটি ছবি আপলোড করা আবশ্যক!`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPostImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Gemini AI Fact-Checking & Duplicate / Social Media Copy Verification (Manual run if needed)
  const handleRunAuthenticityCheck = async () => {
    if (!postTitle.trim() || !postContent.trim()) {
      setAuthenticityError('যাচাই করার জন্য সংবাদের শিরোনাম ও বিবরণ লেখা প্রয়োজন।');
      return;
    }

    const words = countWords(postContent);
    if (words < 50) {
      setAuthenticityError(`সংবাদটি সর্বনিম্ন ৫০ শব্দের হতে হবে। বর্তমানে শব্দ সংখ্যা: ${words}।`);
      return;
    }

    setIsVerifyingAuthenticity(true);
    setAuthenticityError('');
    try {
      const res = await fetch('/api/gemini/verify-article-authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          summary: postSummary,
          content: postContent,
          category: postCategory,
          imageUrl: postImageUrl,
          source: postSource.trim() || undefined,
          articleId: editingArticleId || undefined,
          authorName: writerProfile?.name || 'প্রতিবেদক',
          existingArticles: articles.slice(0, 20).map(a => ({
            id: a.id,
            title: a.title,
            summary: a.summary,
            imageUrl: a.imageUrl,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Verification request failed');
      }

      const data: ArticleAuthenticityResult = await res.json();
      setAuthenticityResult(data);
    } catch (err: any) {
      console.error('Authenticity check error:', err);
      setAuthenticityError('এআই যাচাই সম্পন্ন করতে সমস্যা হয়েছে।');
    } finally {
      setIsVerifyingAuthenticity(false);
    }
  };

  // Helper to extract top-most image URL from HTML content for Cover Image
  const extractTopImageFromHtml = (html: string): string | null => {
    if (!html) return null;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const img = doc.querySelector('img');
      return img ? img.getAttribute('src') : null;
    } catch {
      return null;
    }
  };

  // Helper to check if post content contains embedded video or iframe
  const checkHasVideoInHtml = (html: string, videoUrl?: string): boolean => {
    if (videoUrl && videoUrl.trim().length > 0) return true;
    if (!html) return false;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const hasIframe = doc.querySelector('iframe') !== null;
      const hasVideo = doc.querySelector('video') !== null;
      return hasIframe || hasVideo;
    } catch {
      return false;
    }
  };

  // Step 1 -> Step 2 transition with 50-Word Minimum & Mandatory Cover Image Validation
  const handleProceedToStep2 = () => {
    setEditorError('');
    if (!editingArticleId && todayPostsCount >= DAILY_POST_LIMIT) {
      setEditorError(`আপনি আজকের জন্য সর্বোচ্চ ${DAILY_POST_LIMIT}টি পোস্টের কোটা পূর্ণ করেছেন। নতুন পোস্টের জন্য অনুগ্রহ করে আগামীকাল চেষ্টা করুন।`);
      return;
    }
    if (!postTitle.trim()) {
      setEditorError('সংবাদের শিরোনাম লেখা বাধ্যতামূলক!');
      return;
    }
    if (!postContent.trim()) {
      setEditorError('সংবাদের বিবরণ লেখা বাধ্যতামূলক!');
      return;
    }

    // 50-Word Minimum Validation
    const wordCount = countWords(postContent);
    if (wordCount < 50) {
      setEditorError(`সংবাদটি সর্বনিম্ন ৫০ শব্দের হতে হবে। বর্তমানে আপনার লেখায় রয়েছে ${wordCount}টি শব্দ। অনুগ্রহ করে আরও বিস্তারিত লিখুন (ন্যূনতম ৫০ শব্দ আবশ্যক)।`);
      return;
    }

    // Mandatory Cover Image Validation (Must have at least 1 image in post board)
    const coverImg = extractTopImageFromHtml(postContent) || postImageUrl;
    if (!coverImg) {
      setEditorError('📷 পোস্টে অন্তত একটি ছবি যোগ করা বাধ্যতামূলক! ওপরের টেক্সট এডিটিং টুলস থেকে ছবির আইকনে ক্লিক করে সংবাদ বোর্ডে অন্তত একটি ছবি যুক্ত করুন (যা সংবাদটির প্রচ্ছদ হিসেবে থাকবে)।');
      return;
    }

    setCreateStep(2);
  };

  // Start Editing an existing article
  const handleStartEditArticle = (art: NewsArticle) => {
    setEditingArticleId(art.id);
    setPostTitle(art.title);
    setPostSummary(art.summary || '');
    setPostContent(art.content);
    setPostCategory(art.category);
    setPostTags(art.tags || ['সংবাদ', 'জাতীয়']);
    setPostImageUrl(art.imageUrl);
    setPostSource(art.source || '');
    setIsBreaking(!!art.isBreaking);
    setAuthenticityResult(null);
    setEditorError('');
    setActiveTab('create');
    setCreateStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingArticleId(null);
    setPostTitle('');
    setPostSummary('');
    setPostContent('');
    setPostSource('');
    setAuthenticityResult(null);
    setEditorError('');
    setCreateStep(1);
  };

  // Core Publishing Execution with Background AI Verification
  const executePublishFlow = async () => {
    const currentTodayCount = getTodayPostsCount();
    if (!editingArticleId && currentTodayCount >= DAILY_POST_LIMIT) {
      setEditorError(`আপনি আজকের জন্য সর্বোচ্চ ${DAILY_POST_LIMIT}টি পোস্টের কোটা পূর্ণ করেছেন। নতুন পোস্টের জন্য অনুগ্রহ করে আগামীকাল চেষ্টা করুন।`);
      return;
    }

    const effectiveContent = postContent;
    const cleanReporterName = writerProfile?.name?.trim() || 'প্রতিবেদক';
    const reporterDistrict = writerProfile?.district?.trim();
    const authorName = shareNameUnderPost 
      ? formatReporterName(cleanReporterName, reporterDistrict)
      : 'প্রতিবেদক';

    // Extract top-most image as cover image
    const coverImg = extractTopImageFromHtml(effectiveContent) || postImageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
    const hasVideo = false;

    // Silent background AI verification
    let isAiFlagged = false;
    let issuesFound: string[] = [];
    let offensiveReason = '';
    let credibilityScore = 95;

    try {
      const res = await fetch('/api/gemini/verify-article-authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          summary: postSummary || postTitle.slice(0, 100),
          content: effectiveContent,
          category: postCategory,
          imageUrl: coverImg,
          source: postSource.trim() || undefined,
          articleId: editingArticleId || undefined,
          authorName: writerProfile?.name || 'প্রতিবেদক',
          existingArticles: articles.slice(0, 20).map(a => ({
            id: a.id,
            title: a.title,
            summary: a.summary,
            imageUrl: a.imageUrl,
          })),
        }),
      });

      if (res.ok) {
        const aiData: ArticleAuthenticityResult = await res.json();
        if (
          aiData.isOffensiveOrHarmful ||
          aiData.status === 'REJECTED_OFFENSIVE' ||
          aiData.isDuplicate ||
          aiData.status === 'FLAGGED_DUPLICATE' ||
          (aiData.issuesFound && aiData.issuesFound.length > 0) ||
          (aiData.credibilityScore && aiData.credibilityScore < 60)
        ) {
          isAiFlagged = true;
          issuesFound = aiData.issuesFound || [];
          offensiveReason = aiData.offensiveReason || 'AI বিশ্লেষণে অসঙ্গতি পরিলক্ষিত হয়েছে।';
          credibilityScore = aiData.credibilityScore || 50;
        }
      }
    } catch (err) {
      console.warn('Background AI check silent error:', err);
    }

    const articlePayload: Partial<NewsArticle> = {
      title: postTitle,
      summary: postSummary || postTitle.slice(0, 120),
      content: effectiveContent,
      source: postSource.trim() || undefined,
      category: postCategory,
      tags: postTags,
      imageUrl: coverImg,
      videoUrl: undefined,
      hasVideo: false,
      postType: 'written',
      isBreaking,
      author: authorName,
      authorDistrict: reporterDistrict || undefined,
      publishedAt: new Date().toISOString(),
      viewsCount: 0,
      comments: [],
      readTimeMinutes: Math.max(2, Math.ceil(effectiveContent.length / 400)),
      aiFlagged: isAiFlagged,
      aiIssues: issuesFound.length > 0 ? issuesFound : undefined,
      aiCredibilityScore: credibilityScore,
      aiOffensiveReason: offensiveReason || undefined,
    };

    // If AI detected issues, notify Managing Panel immediately with reason
    if (isAiFlagged && onSendNotification) {
      onSendNotification({
        title: '⚠️ AI ফ্ল্যাগযুক্ত সংবাদ রিভিউ প্রয়োজন',
        message: `প্রতিবেদক "${writerProfile?.name || authorName}" এর সংবাদটি ("${postTitle.slice(0, 30)}...") AI বিশ্লেষণে সমস্যাযুক্ত বলে ফ্ল্যাগ করা হয়েছে। ম্যানাজিং প্যানেলে রিভিউ বা আনপাবলিশ করার অনুরোধ।`,
        senderName: writerProfile?.name || authorName,
        recipientWriterId: 'MANAGING',
      });
    }

    if (editingArticleId) {
      if (onUpdateArticle) {
        onUpdateArticle(editingArticleId, articlePayload);
      } else {
        onAddArticle({ ...articlePayload, id: editingArticleId });
      }
      setPostSuccessMessage('সংবাদটি সফলভাবে আপডেট / সংশোধিত হয়েছে!');
    } else {
      onAddArticle(articlePayload);
      // Update today's post quota counter
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const writerNameLower = (writerProfile?.name || 'writer').trim().toLowerCase();
        localStorage.setItem(`recap_daily_posts_${writerNameLower}_${todayStr}`, (currentTodayCount + 1).toString());
      } catch {}
      setPostSuccessMessage('সংবাদ পোস্টটি সফলভাবে লাইভ প্রকাশিত হয়েছে!');
    }

    setTimeout(() => setPostSuccessMessage(''), 4000);

    // Reset editor state
    setEditingArticleId(null);
    setPostTitle('');
    setPostSummary('');
    setPostContent('');
    setPostSource('');
    setAuthenticityResult(null);
    setCreateStep(1);
  };

  // Publish Written Post Handler
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    setEditorError('');
    if (!postTitle.trim() || !postContent.trim()) return;

    if (!editingArticleId && getTodayPostsCount() >= DAILY_POST_LIMIT) {
      setEditorError(`আপনি আজকের জন্য সর্বোচ্চ ${DAILY_POST_LIMIT}টি পোস্টের কোটা পূর্ণ করেছেন।`);
      return;
    }

    // 50-Word Minimum check
    const wordCount = countWords(postContent);
    if (wordCount < 50) {
      setEditorError(`সংবাদটি সর্বনিম্ন ৫০ শব্দের হতে হবে। বর্তমানে আপনার লেখায় রয়েছে ${wordCount}টি শব্দ।`);
      return;
    }

    // Check if human verification is required
    const isHumanVerified = sessionStorage.getItem('recap_human_verified') === 'true';
    if (!isHumanVerified) {
      setBotModalActionTitle('সংবাদ প্রকাশের জন্য Cloudflare & reCAPTCHA মানবীয় যাচাই');
      setBotSuccessCallback(() => () => {
        executePublishFlow();
      });
      setShowBotModal(true);
      return;
    }

    executePublishFlow();
  };

  // Affirmation callback when writer chooses 'হ্যাঁ' (Yes) for unverified news
  const handleConfirmDoubtfulPublish = () => {
    setDoubtModalOpen(false);
    executePublishFlow();
  };

  // Affirmation callback when writer chooses 'না' (No) for unverified news
  const handleRejectDoubtfulPublish = () => {
    setDoubtModalOpen(false);
    setPostTitle('');
    setPostSummary('');
    setPostContent('');
    setPostSource('');
    setAuthenticityResult(null);
    setCreateStep(1);
    setEditorError('পোস্টটি বাতিল করা হয়েছে। অনুগ্রহ করে সঠিক, নির্ভরযোগ্য ও তথ্যবহুল সংবাদ লিখুন।');
  };

  // Add custom tag
  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !postTags.includes(customTagInput.trim())) {
      setPostTags([...postTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setPostTags(postTags.filter(t => t !== tagToRemove));
  };

  // SCREEN 1: Authentication Screen (Sign In / Sign Up with Email Verification)
  if (!isAuthenticated && !isEmailVerified) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-red-600 rounded-2xl text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
            <PenTool className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
            প্রতিবেদক প্যানেল (Reporters Panel)
          </h2>
          <p className="text-xs text-slate-500">
            {authMode === 'signup' 
              ? 'নতুন প্রতিবেদক হিসেবে রেজিস্ট্রেশনের জন্য জিমেইল ভেরিফিকেশন সম্পন্ন করুন'
              : 'প্রতিবেদক প্যানেলে প্রবেশের জন্য আপনার অ্যাকাউন্ট সাইন ইন করুন'}
          </p>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setAuthError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${authMode === 'signup' ? 'bg-red-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
          >
            প্রতিবেদক সাইন-আপ (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setAuthError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${authMode === 'login' ? 'bg-red-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
          >
            সাইন-ইন (Sign In)
          </button>
        </div>

        {authError && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                আপনার পূর্ণ নাম (Full Name) *
              </label>
              <input
                type="text"
                required
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              জিমেইল / ইমেইল এড্রেস (Gmail Address) *
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>

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
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSendingCode}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSendingCode ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                কোড পাঠানো হচ্ছে...
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{authMode === 'signup' ? 'ভেরিফিকেশন কোড পাঠান ও সাইন-আপ' : 'প্রতিবেদক প্যানেলে সাইন ইন করুন'}</span>
              </>
            )}
          </button>
        </form>

        {/* 6-Digit Email Verification Code Modal */}
        {showVerifyModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-red-600 dark:text-red-400 font-serif">
                  The Recap Media Cast Ltd
                </h3>
                <p className="text-xs text-slate-500">বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ মাধ্যম</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Hey! Dear... <span className="text-red-600 dark:text-red-400">{setupName || 'প্রতিবেদক'}</span>
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Your Verification Code for Sign up
                </p>
                <p className="text-[11px] text-slate-500">
                  {emailInput} ঠিকানায় প্রেরিত ৬ ডিজিটের কোডটি নিচে লিখুন:
                </p>

                <form onSubmit={handleVerifyCodeSubmit} className="pt-2 space-y-4">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={verificationCodeInput}
                      onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder=". . . . . ."
                      className="w-full py-3 px-4 text-center font-mono text-2xl font-black tracking-[0.5em] rounded-2xl border-2 border-red-500 bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 focus:ring-4 focus:ring-red-500/20 focus:outline-none"
                    />
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    at "The Recap Media Cast Ltd"
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Enter your verification code and go ahead
                  </p>

                  {verificationError && (
                    <div className="p-2.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 text-left">
                      ⚠️ {verificationError}
                    </div>
                  )}

                  {verificationSuccess && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-900 text-left">
                      ✓ {verificationSuccess}
                    </div>
                  )}

                  {/* SPAM FOLDER NOTICE */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 font-semibold text-left">
                    ⚠️ <strong>জরুরি নির্দেশ:</strong> ইনবক্সে মেসেজ না পেলে অনুগ্রহ করে আপনার জিমেইল-এর <strong>স্প্যাম ফোল্ডার (Spam)</strong> চেক করুন।
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowVerifyModal(false)}
                      className="w-1/3 py-2.5 text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingCode || verificationCodeInput.length !== 6}
                      className="w-2/3 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isVerifyingCode ? (
                        <span>যাচাই হচ্ছে...</span>
                      ) : (
                        <span>কোড যাচাই ও প্রবেশ করুন</span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isSendingCode}
                    onClick={handleSendVerificationCode}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    {resendCooldown > 0
                      ? `পুনরায় কোড পাঠান (${resendCooldown}s অপেক্ষা করুন)`
                      : 'কোড পাননি? পুনরায় কোড পাঠান'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SCREEN 3: Dedicated Secret Referral Code Verification Window (After Profile Setup)
  if (showReferralWindow || (!isAuthenticated && isEmailVerified && writerProfile && (!writerProfile.secretCodeUsed || writerProfile.secretCodeUsed === ''))) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-amber-600 rounded-2xl text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
            গোপন রেফার কোড যাচাই
          </h2>
          <p className="text-xs text-slate-500">
            আপনার প্রতিবেদক অ্যাকাউন্ট সক্রিয় করতে ম্যানেজমেন্ট কর্তৃক প্রদত্ত গোপন রেফার কোডটি লিখুন।
          </p>
        </div>

        {referralSecretError && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{referralSecretError}</span>
          </div>
        )}

        <form onSubmit={handleReferralCodeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              গোপন রেফার কোড (Secret Referral Code) *
            </label>
            <input
              type="text"
              required
              value={referralSecretInput}
              onChange={(e) => setReferralSecretInput(e.target.value)}
              placeholder="রেফার কোড লিখুন..."
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>রেফার কোড যাচাই ও অ্যাকাউন্ট সক্রিয় করুন</span>
          </button>

          {/* Telegram Referral Contact Link / Widget */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              রেফার কোডের জন্য ইনবক্স করুন
            </p>
            <a
              href={siteSettings?.telegramReferralUrl || 'https://t.me/TheRecapMediaCast'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>টেলিগ্রাম ইনবক্স: The Recap Media Cast</span>
            </a>
          </div>
        </form>
      </div>
    );
  }

  // SCREEN 2: Mandatory Reporter Profile Setup Window (If Profile is incomplete or being edited)
  if (!writerProfile || !writerProfile.nidNumber || isEditingProfile) {
    return (
      <div className="max-w-xl mx-auto my-10 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-amber-500 rounded-full text-white flex items-center justify-center mx-auto shadow-lg p-1">
            <img
              src={setupAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt="Profile Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
            প্রতিবেদক প্রোফাইল প্রস্তুতকরণ
          </h2>
          <p className="text-xs text-slate-500">
            সংবাদ পোস্ট প্রকাশ করার জন্য আপনার বিস্তারিত ব্যক্তিগত তথ্যগুলো বাধ্যতামূলকভাবে পূরণ করুন।
          </p>
        </div>

        {profileError && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleProfileSetupSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              পূর্ণ নাম (Full Name) *
            </label>
            <input
              type="text"
              required
              value={setupName}
              onChange={(e) => setSetupName(e.target.value)}
              placeholder="যেমন: তানভীর আহমেদ"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  বয়স (Age) *
                </label>
                <span className="text-[10px] text-red-500 font-bold">(১৮ এর নিচে প্রযোজ্য নয়)</span>
              </div>
              <input
                type="number"
                required
                min={18}
                value={setupAge}
                onChange={(e) => setSetupAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="যেমন: 25"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* NID Number Input Box */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                জাতীয় পরিচয়পত্র নম্বর (NID Number) *
              </label>
              <span className="text-[10px] text-red-500 font-bold">(সর্বনিম্ন ১০ বা ১৩ ডিজিটের NID নম্বর)</span>
            </div>
            <input
              type="text"
              required
              value={setupNidNumber}
              onChange={(e) => setSetupNidNumber(e.target.value)}
              placeholder="১০ বা ১৩ ডিজিটের এনআইডি (NID) নম্বর লিখুন..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-mono font-bold"
            />
          </div>

          {/* Address Breakdown Grid (Cascading Division -> District -> Thana/Upazila -> Post Office -> Auto Post Code) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" /> বর্তমান ঠিকানার বিবরণ (Address Breakdown) *
            </label>

            <div className="space-y-3">
              {/* 1. বিভাগ (Division) - Top Level */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ১. বিভাগ (Division) *
                </label>
                <select
                  required
                  value={setupDivision}
                  onChange={(e) => {
                    setSetupDivision(e.target.value);
                    setSetupDistrict('');
                    setSetupThana('');
                    setSetupPostOffice('');
                    setSetupPostCode('');
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-bold"
                >
                  <option value="">-- বিভাগ নির্বাচন করুন --</option>
                  {BANGLADESH_GEO_DATA.map((div) => (
                    <option key={div.name} value={div.name}>
                      {div.name} {div.nameEn ? `(${div.nameEn})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid for District and Thana/Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 2. জেলা (District) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ২. জেলা (District) *
                  </label>
                  <select
                    required
                    disabled={!setupDivision || availableDistricts.length === 0}
                    value={setupDistrict}
                    onChange={(e) => {
                      setSetupDistrict(e.target.value);
                      setSetupThana('');
                      setSetupPostOffice('');
                      setSetupPostCode('');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                  >
                    <option value="">
                      {!setupDivision ? 'প্রথমে বিভাগ সিলেক্ট করুন' : '-- জেলা নির্বাচন করুন --'}
                    </option>
                    {availableDistricts.map((dist) => (
                      <option key={dist.name} value={dist.name}>
                        {dist.name} {dist.nameEn ? `(${dist.nameEn})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. থানা / উপজেলা (Thana / Upazila) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ৩. থানা / উপজেলা (Thana / Upazila) *
                  </label>
                  <select
                    required
                    disabled={!setupDistrict || availableUpazilas.length === 0}
                    value={setupThana}
                    onChange={(e) => {
                      setSetupThana(e.target.value);
                      setSetupPostOffice('');
                      setSetupPostCode('');
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                  >
                    <option value="">
                      {!setupDistrict ? 'প্রথমে জেলা সিলেক্ট করুন' : '-- থানা/উপজেলা নির্বাচন করুন --'}
                    </option>
                    {availableUpazilas.map((upa) => (
                      <option key={upa.name} value={upa.name}>
                        {upa.name} {upa.nameEn ? `(${upa.nameEn})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid for Post Office and Auto Post Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 4. পোস্ট অফিস (Post Office) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ৪. পোস্ট অফিস (Post Office) *
                  </label>
                  <select
                    required
                    disabled={!setupThana || availablePostOffices.length === 0}
                    value={setupPostOffice}
                    onChange={(e) => {
                      const poName = e.target.value;
                      setSetupPostOffice(poName);
                      const matched = availablePostOffices.find((p) => p.name === poName);
                      if (matched) {
                        setSetupPostCode(matched.code);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 font-medium"
                  >
                    <option value="">
                      {!setupThana ? 'প্রথমে থানা সিলেক্ট করুন' : '-- পোস্ট অফিস নির্বাচন করুন --'}
                    </option>
                    {availablePostOffices.map((po, idx) => (
                      <option key={`${po.name}-${idx}`} value={po.name}>
                        {po.name} ({po.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. পোস্ট কোড (Post Code) - Auto-filled */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      ৫. পোস্ট কোড (Post Code) *
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      (অটো-ফিল হবে)
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={setupPostCode}
                    onChange={(e) => setSetupPostCode(e.target.value)}
                    placeholder={setupPostOffice ? 'অটো-ফিল্ড পোস্ট কোড' : 'পোস্ট অফিস সিলেক্ট করুন'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              প্রোফাইল ছবি (ডিভাইস থেকে নিজস্ব ছবি আপলোড করুন) *
            </label>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-red-500" /> ডিভাইস থেকে ছবি নির্বাচন করুন
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                  শুধুমাত্র প্রকৃত মানুষের ছবি গ্রহণযোগ্য
                </span>
              </div>

              <input
                type="file"
                accept="image/*"
                required={!setupAvatarUrl}
                onChange={handleProfilePictureUpload}
                disabled={isVerifyingPhoto}
                className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer w-full"
              />

              {isVerifyingPhoto && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 border border-amber-200 dark:border-amber-900">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500 shrink-0" />
                  <span>AI ভিশন দিয়ে নিশ্চিত করা হচ্ছে ছবিতে মানুষ আছে কিনা...</span>
                </div>
              )}

              {photoVerified && setupAvatarUrl && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 border border-emerald-200 dark:border-emerald-900">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>যাচাইকৃত প্রকৃত মানুষের প্রোফাইল ছবি গৃহীত হয়েছে!</span>
                </div>
              )}
            </div>
          </div>

          {/* Reporter Commitment Checklist / Mandatory Rules Box */}
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-3">
            <label className="block text-xs font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              আমি প্রতিবেদক হিসেবে নিম্নোক্ত বিষয়গুলো মানতে বাধ্য থাকবো (৬টি শর্তে টিক চিহ্ন দিন): *
            </label>
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pl-1">
              {[
                "উস্কানি মূলক, অশালীন, ভিত্তিহীন কোন পোস্ট করবো না।",
                "পোস্টের মাধ্যমে কারো ধর্মীয় অনুভূতিতে আঘাত দেওয়ার চেষ্টা করবো না।",
                "গুজব ও মিথ্যাচার রটানো থেকে বিরত থাকবো।",
                "কারো লেখা বা ছবি কপি করে পোস্ট দেবো না।",
                "ব্যক্তিগত আক্রমন ও মানহানি মূলক পোস্ট করবো না।",
                "সদা সত্য সংবাদ প্রচার করবো।"
              ].map((ruleText, idx) => (
                <label key={idx} className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ruleCheckboxes[idx] || false}
                    onChange={(e) => {
                      const updated = [...ruleCheckboxes];
                      updated[idx] = e.target.checked;
                      setRuleCheckboxes(updated);
                      setAgreedToTerms(updated.every(Boolean));
                    }}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer shrink-0 mt-0.5"
                  />
                  <span className={ruleCheckboxes[idx] ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}>
                    ⚪ {ruleText}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-2 border-t border-amber-200 dark:border-amber-900/60">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-extrabold text-amber-950 dark:text-amber-200 select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgreedToTerms(checked);
                    setRuleCheckboxes([checked, checked, checked, checked, checked, checked]);
                  }}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                />
                <span>আমি বর্ণিত সকল ৬টি নিয়মাবলী সজ্ঞানে স্বীকার করছি ও বাস্তবায়নে বাধ্য থাকবো।</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            প্রোফাইল সংরক্ষণ ও পরবর্তী ধাপ (গোপন কোড যাচাই) &rarr;
          </button>
        </form>
      </div>
    );
  }

  // SCREEN 3: Reporters Panel Main Control Room
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner & Profile Overview */}
      <div className="bg-slate-900 dark:bg-[#0a0a0a] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-slate-800 dark:border-white/10">
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md uppercase tracking-widest shadow">
              REPORTERS PANEL / প্রতিবেদক প্যানেল
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 font-mono">
              <CheckCircle className="w-3.5 h-3.5" /> অনুমোদিত প্রতিবেদক
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={writerProfile.avatarUrl}
              alt={writerProfile.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500 shadow-md"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white font-serif flex items-center gap-2">
                {writerProfile.name}
              </h1>
              <p className="text-xs text-gray-300 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-500" /> {writerProfile.address}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {writerProfile.mobile}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono">বয়স: {writerProfile.age} বছর</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="z-10 flex items-center gap-3">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" /> প্রোফাইল এডিট
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-200 text-xs font-bold rounded-xl border border-red-500/30 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> লগআউট
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'create'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <PenTool className="w-4 h-4 text-amber-300" /> নতুন পোস্ট লিখুন (Create Post)
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'analytics'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> {t('realtimeAnalytics')}
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'manage'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" /> {t('managePosts')} ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'withdraw'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" /> টাকা উত্তোলন (Withdraw)
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'notifications'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" /> নোটিফিকেশন
          {notifications.filter(n => n.recipientWriterId === writerProfile?.id || n.recipientWriterId === 'ALL').length > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {notifications.filter(n => n.recipientWriterId === writerProfile?.id || n.recipientWriterId === 'ALL').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'profile'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4 text-emerald-400" /> আমার প্রোফাইল
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {postSuccessMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>{postSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActiveTab('manage')}
            className="px-3 py-1 bg-emerald-600 text-white text-[11px] rounded-lg hover:bg-emerald-700"
          >
            পোস্টসমূহ দেখুন &rarr;
          </button>
        </div>
      )}

      {/* Native Banner Ad for Writer Panel (Automatically hidden when activeTab is 'create' or post editing) */}
      <NativeBannerAd
        settings={siteSettings?.dynamicAds?.nativeBanner}
        isPostWriting={activeTab === 'create' || editingArticleId !== null}
        panelLabel="লেখক প্যানেল"
      />

      {/* TAB 1: BLOGGER-STYLE POST CREATOR (Multi-Step Window) */}
      {activeTab === 'create' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden space-y-0">
          {/* Blogger Header Header Bar */}
          <div className="p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-sm text-white">
                {createStep}
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  সংবাদ ক্রিয়েটর — {createStep === 1 ? 'ধাপ ১: সংবাদ সম্পাদনা' : 'ধাপ ২: কী-ওয়ার্ড ও লেখক নাম'}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {createStep === 1 ? 'হেডলাইন, মুল বিবরণ, টেক্সট এডিটিং টুলস ও ছবি যুক্ত করুন' : 'কিওয়ার্ড সিলেক্ট করুন এবং পোস্টের নিচে নিজের নাম প্রচার করুন'}
                </p>
              </div>
            </div>

            {/* Step 1 vs Step 2 Control */}
            <div className="flex items-center gap-2">
              {createStep === 2 && (
                <button
                  type="button"
                  onClick={() => setCreateStep(1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> পূর্ববর্তী ধাপ
                </button>
              )}

              {createStep === 1 && (
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
                >
                  পরবর্তী ধাপ (Next) <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {editorError && (
            <div className="mx-6 mt-4 p-3.5 bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{editorError}</span>
            </div>
          )}

          {/* STEP 1: Main Content Editor Canvas */}
          {createStep === 1 && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Edit Mode Notice Banner */}
              {editingArticleId && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/70 border-2 border-amber-300 dark:border-amber-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                    <Edit3 className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="block font-black text-sm">সংবাদ সম্পাদনা মোড (Edit Mode)</span>
                      <span className="text-[11px] font-normal text-amber-800 dark:text-amber-300">
                        আপনি পূর্বে প্রকাশিত সংবাদটি পরিমার্জন / সম্পাদনা করছেন।
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
                  >
                    সম্পাদনা বাতিল করুন
                  </button>
                </div>
              )}

              {/* Daily Post Quota Counter Card */}
              <div className={`p-4 rounded-2xl border ${
                isDailyLimitReached 
                  ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300' 
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${isDailyLimitReached ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                    <span>দৈনিক পোস্ট কোটা (Daily Post Quota):</span>
                    <span className="font-extrabold text-sm px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                      {todayPostsCount} / {DAILY_POST_LIMIT} টি
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isDailyLimitReached 
                      ? '⚠️ আজকের সীমা পূর্ণ! অনুগ্রহ করে আগামীকাল পোস্ট করুন।' 
                      : `আপনি আজ আরও ${DAILY_POST_LIMIT - todayPostsCount}টি পোস্ট করতে পারবেন`}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isDailyLimitReached 
                        ? 'bg-red-500' 
                        : todayPostsCount >= 8 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (todayPostsCount / DAILY_POST_LIMIT) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Headline Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  সংবাদের হেডলাইন / শিরোনাম (Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="যেমন: জাতীয় অর্থনীতিতে মেগাপ্রকল্পের প্রভাব ও নতুন কর্মসংস্থান সৃষ্টি"
                  className="w-full px-4 py-3 text-sm sm:text-base font-bold rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-serif"
                />
              </div>

              {/* Visual Rich Text Editor with Live Word Count Badge */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-red-600" />
                    সংবাদের মূল বিবরণ ও ভিজ্যুয়াল লেখার বোর্ড (Content Board) *
                  </label>
                  {(() => {
                    const words = countWords(postContent);
                    const isMinReached = words >= 50;
                    return (
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                        isMinReached
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-sm'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      }`}>
                        {isMinReached ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        )}
                        শব্দ সংখ্যা: <strong>{words}</strong> / ৫০ (ন্যূনতম ৫০ শব্দ প্রয়োজন)
                      </span>
                    );
                  })()}
                </div>

                <RichContentEditor
                  value={postContent}
                  onChange={(html) => setPostContent(html)}
                  minHeight="500px"
                />
              </div>

              {/* Sources / তথ্যসূত্র input field (Optional) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-red-500" />
                    তথ্যসূত্র (Sources) — ঐচ্ছিক
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold">
                    ঐচ্ছিক (Optional)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  লেখক চাইলে এখানে তথ্যসূত্র দিতে পারেন আবার নাও দিতে পারেন। যদি তথ্যসূত্র দেন তবে পাঠকের সামনে প্রতিবেদকের নামের পাশে তথ্যসূত্র প্রদর্শিত হবে।
                </p>
                <input
                  type="text"
                  value={postSource}
                  onChange={(e) => setPostSource(e.target.value)}
                  placeholder="যেমন: রয়টার্স, বিবিসি বাংলা, স্থানীয় প্রতিনিধি, প্রেস রিলিজ ইত্যাদি..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Cover Image Auto-Extraction Notice & Preview */}
              {(() => {
                const detectedCover = extractTopImageFromHtml(postContent) || postImageUrl;
                return (
                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        সংবাদের কভার ছবি (Cover Image Status)
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                        স্বয়ংক্রিয় প্রচ্ছদ
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      সংবাদ বোর্ডের ভেতর থাকা <strong>প্রথম/ওপরের ছবিকে স্বয়ংক্রিয়ভাবে Cover Image হিসেবে সেট করা হবে</strong>। বোর্ডে যদি একাধিক ছবি যুক্ত করেন, তবে ওপরে থাকা ছবিটিই ওয়েবসাইটে সংবাদের প্রচ্ছদ হিসেবে দর্শকরা দেখতে পাবেন।
                    </p>
                    {detectedCover ? (
                      <div className="pt-2 flex items-center gap-3">
                        <div className="w-20 h-14 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700 shrink-0 bg-slate-900">
                          <img
                            src={detectedCover}
                            alt="Detected Cover"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs text-emerald-900 dark:text-emerald-200">
                          <span className="font-bold block text-emerald-700 dark:text-emerald-400">✓ প্রচ্ছদ ছবি সনাক্ত হয়েছে</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs block">
                            {detectedCover}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-1 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>সংবাদ বোর্ডে এখনও কোনো ছবি যুক্ত করা হয়নি (ছবি যুক্ত করা বাধ্যতামূলক)</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP 2: Publishing Details, Keywords & Reporter Attribution */}
          {createStep === 2 && (
            <form onSubmit={handlePublishPost} className="p-6 sm:p-8 space-y-6">
              {/* Category & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি/বিভাগ নির্বাচন করুন *
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {Array.from(new Set(CATEGORIES)).map((cat, idx) => (
                      <option key={`opt-cat-${cat}-${idx}`} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সংক্ষিপ্ত সারসংক্ষেপ (Short Summary)
                  </label>
                  <input
                    type="text"
                    value={postSummary}
                    onChange={(e) => setPostSummary(e.target.value)}
                    placeholder="সংবাদের সংক্ষেপ বিবরণ"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Keywords & Tag Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  কী-ওয়ার্ড ও ট্যাগসমূহ (Key Words / Tags)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    placeholder="নতুন ট্যাগ লিখুন..."
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700"
                  >
                    + ট্যাগ যোগ করুন
                  </button>
                </div>

                {/* Tags List */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {postTags.map((tag, idx) => (
                    <span
                      key={`post-tag-${tag}-${idx}`}
                      className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1 border border-red-200 dark:border-red-900"
                    >
                      #{tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-800">&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Name Under Post Box Requirement */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="shareNameCheck"
                    checked={shareNameUnderPost}
                    onChange={(e) => setShareNameUnderPost(e.target.checked)}
                    className="w-5 h-5 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="shareNameCheck" className="text-xs font-extrabold text-slate-900 dark:text-amber-200 cursor-pointer">
                    "Share your name under post" (ওয়েবসাইটে পোস্টের নিচে প্রতিবেদক হিসেবে আমার নাম দেখান)
                  </label>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-8">
                  সিলেক্ট করা থাকলে সংবাদের নিচে প্রতিবেদক হিসেবে দেখাবে: <strong className="text-red-600 dark:text-red-400">{formatReporterName(writerProfile?.name || 'প্রতিবেদক', writerProfile?.district)}</strong>
                </p>
              </div>

              {/* Breaking News Check */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="step2BreakingCheck"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600"
                />
                <label htmlFor="step2BreakingCheck" className="text-xs font-bold text-red-600 dark:text-red-400">
                  ব্রেকিং নিউজ হিসেবে সাইটের টপ মার্কিতে দেখান
                </label>
              </div>

              {/* Gemini AI Fact-Checking, Plagiarism & Social Media Copy Inspection Box */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                      <h4 className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                        Gemini AI ফ্যাক্ট-চেকিং ও ডুপ্লিকেট কনটেন্ট যাচাই
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      প্রকাশের পূর্বে ডুপ্লিকেট লেখা, সোশ্যাল মিডিয়া (Facebook/YouTube/TikTok) কপি ও সংবাদের সত্যতা যাচাই করুন।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAuthenticityCheck}
                    disabled={isVerifyingAuthenticity}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isVerifyingAuthenticity ? 'animate-spin' : ''}`} />
                    {isVerifyingAuthenticity ? 'যাচাই চলছে...' : 'এআই দিয়ে পোস্ট যাচাই করুন'}
                  </button>
                </div>

                {authenticityError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authenticityError}</span>
                  </div>
                )}

                {authenticityResult && (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-3.5 shadow-sm animate-fade-in">
                    {/* Score and Status Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm text-white ${
                          authenticityResult.credibilityScore >= 75
                            ? 'bg-emerald-600'
                            : authenticityResult.credibilityScore >= 50
                            ? 'bg-amber-600'
                            : 'bg-red-600'
                        }`}>
                          {authenticityResult.credibilityScore}%
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">নির্ভরযোগ্যতা স্কোর</span>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {authenticityResult.credibilityScore >= 75 ? 'উচ্চ গ্রহণযোগ্যতা (High Credibility)' : 'সতর্কতা সহ গ্রহণযোগ্য (Review Required)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {authenticityResult.status === 'APPROVED' && (
                          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> প্রকাশের জন্য অনুমোদিত
                          </span>
                        )}
                        {(authenticityResult.status === 'REJECTED_OFFENSIVE' || authenticityResult.isOffensiveOrHarmful) && (
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-xs rounded-lg border border-red-300 dark:border-red-800 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" /> আপত্তিকর/অশালীন (আনপাবলিশ)
                          </span>
                        )}
                        {(authenticityResult.status === 'FLAGGED_DUPLICATE' || authenticityResult.isDuplicate) && !authenticityResult.isOffensiveOrHarmful && (
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-xs rounded-lg border border-red-300 dark:border-red-800 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" /> ডুপ্লিকেট বা কপি কনটেন্ট
                          </span>
                        )}
                        {authenticityResult.status === 'NEEDS_REVIEW' && !authenticityResult.isOffensiveOrHarmful && !authenticityResult.isDuplicate && (
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-lg border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> পুনর্বিবেচনা প্রয়োজন
                          </span>
                        )}
                        {authenticityResult.status === 'REJECTED' && (
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-xs rounded-lg border border-red-300 dark:border-red-800 flex items-center gap-1">
                            <X className="w-3.5 h-3.5 text-red-600" /> প্রকাশ অনুপযুক্ত
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Offensive Alert Banner if detected */}
                    {(authenticityResult.isOffensiveOrHarmful || authenticityResult.status === 'REJECTED_OFFENSIVE') && (
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border-2 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>অশালীন, উস্কানিমূলক, ব্যক্তিগত আক্রমণ বা যৌন হয়রানিমূলক কনটেন্ট আনপাবলিশ রাখা হয়েছে</span>
                        </div>
                        <p className="text-[11px] leading-relaxed pl-6">
                          {authenticityResult.offensiveReason || 'এই পোস্টে আপত্তিকর ভাষা বা উস্কানিমূলক বক্তব্য রয়েছে। অনুগ্রহ করে লেখাটি পরিবর্তন বা এডিট করে পুনরায় যাচাই করুন।'}
                        </p>
                        {authenticityResult.editorialAdvice && (
                          <div className="text-[11px] font-semibold bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-red-200 dark:border-red-900 mt-1">
                            💡 এডিট করার জন্য পরামর্শ: {authenticityResult.editorialAdvice}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Unverified / Doubtful Notice */}
                    {authenticityResult.isUnverifiedOrDoubtful && !authenticityResult.isOffensiveOrHarmful && !authenticityResult.isDuplicate && (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold text-[11px]">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>ইন্টারনেটে পর্যাপ্ত তথ্যসূত্র বা নির্ভরযোগ্য মিল পাওয়া যায়নি (অসমর্থিত সংবাদ)</span>
                        </div>
                        <p className="text-[11px] leading-relaxed pl-6 text-amber-800 dark:text-amber-300">
                          প্রকাশের বাটনে ক্লিক করার পর আপনাকে সংবাদের সত্যতা নিশ্চিতকরণ প্রশ্নের উত্তর দিতে হবে।
                        </p>
                      </div>
                    )}

                    {/* Duplicate & Social Rips Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        authenticityResult.isDuplicate 
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200' 
                          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                      }`}>
                        <span className="font-bold block text-[11px] uppercase tracking-wider mb-1">
                          📋 ডুপ্লিকেট কনটেন্ট স্ট্যাটাস:
                        </span>
                        {authenticityResult.isDuplicate ? (
                          <p className="text-[11px] leading-relaxed">
                            ⚠️ মিল পাওয়া গেছে: <strong>{authenticityResult.duplicateMatchTitle || 'পূর্বের প্রকাশিত সংবাদের সাথে মিল রয়েছে'}</strong> ({authenticityResult.duplicateConfidencePercent}% সাদৃশ্য)। ওয়েবসাইটে একই লেখা দ্বিতীয়বার পোস্ট করা নিষিদ্ধ।
                          </p>
                        ) : (
                          <p className="text-[11px] leading-relaxed">
                            ✅ কোনো ডুপ্লিকেট বা পূর্বের লেখার হুবহু মিল পাওয়া যায়নি (অনন্য সংবাদ)।
                          </p>
                        )}
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        authenticityResult.isSocialMediaRipped 
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200' 
                          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                      }`}>
                        <span className="font-bold block text-[11px] uppercase tracking-wider mb-1">
                          🌐 সোশ্যাল মিডিয়া সোর্স স্ট্যাটাস:
                        </span>
                        {authenticityResult.isSocialMediaRipped ? (
                          <p className="text-[11px] leading-relaxed">
                            ⚠️ সোশ্যাল মিডিয়া ({authenticityResult.socialMediaPlatformDetected || 'Facebook/YouTube'}) থেকে সংগৃহীত। সঠিক ক্রেডিট ও তথ্যের সত্যতা নিশ্চিত করুন।
                          </p>
                        ) : (
                          <p className="text-[11px] leading-relaxed">
                            ✅ সোশ্যাল মিডিয়া থেকে সরাসরি কপি করা নয় অথবা যথাযথ সূত্র সংযোজিত।
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Editorial Advice & Fact-Checking Points */}
                    {authenticityResult.issuesFound?.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs space-y-1.5">
                        <span className="font-bold text-red-600 dark:text-red-400 block text-[11px]">
                          সংশোধনযোগ্য বিষয়সমূহ:
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                          {authenticityResult.issuesFound.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {authenticityResult.editorialAdvice && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 italic bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                        <strong>চিফ এডিটরিয়াল মন্তব্য:</strong> "{authenticityResult.editorialAdvice}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {editingArticleId 
                  ? 'সংবাদটি আপডেট করুন (Update News Live)' 
                  : 'সংবাদটি সম্পূর্ণ প্রকাশ করুন (Publish News Live)'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: Real-Time Writer-Specific Analytics */}
      {activeTab === 'analytics' && (() => {
        const myArticles = articles.filter(art => {
          if (!writerProfile?.name) return false;
          const authorLower = (art.author || '').toLowerCase();
          const writerNameLower = writerProfile.name.toLowerCase();
          return authorLower.includes(writerNameLower);
        });

        const myTotalViews = myArticles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
        const myTotalComments = myArticles.reduce((acc, a) => acc + (a.comments?.length || 0), 0);
        const myEstimatedReach = Math.round(myTotalViews * 1.42) + (myArticles.length * 85);
        const myActiveLiveVisitors = myArticles.length > 0 ? Math.max(3, Math.floor(analytics.activeVisitors * 0.35)) : 0;
        
        // Reporter Widget View Calculation: 30% fewer views shown if views >= 50
        const myReportedWidgetViews = myTotalViews >= 50 ? Math.round(myTotalViews * 0.7) : myTotalViews;

        // Earning calculation: 1 Taka per 257 views (257 views = 1 BDT)
        const myTotalEarnings = Math.floor(myReportedWidgetViews / 257);

        return (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {writerProfile?.name}-এর নিজস্ব সংবাদের অ্যানালিটিক্স ও পারফরম্যান্স
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    এখানে শুধুমাত্র আপনার প্রকাশিত নিজস্ব সংবাদসমূহের মোট ভিউ, অর্জিত আয় ও পাঠক ট্রাফিকের রিয়েল-টাইম ডাটা।
                  </p>
                </div>
              </div>

              {myArticles.length > 0 && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold rounded-xl border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  সক্রিয় রিডার: {myActiveLiveVisitors} জন
                </span>
              )}
            </div>

            {/* Writer Stats Grid - includes My Earning / আমার আয় Widget */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* My Earning Widget */}
              <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg shadow-emerald-600/20 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-emerald-100 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-emerald-200" /> My Earning / আমার আয়
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                  ৳ {myTotalEarnings.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-200 font-bold block">
                  প্রতি ২৫৭ ভিউ = ১ টাকা
                </span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">আমার সংবাদের মোট ভিউ</span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white">
                  {myReportedWidgetViews.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" /> রিয়েল-টাইম লাইভ ভিউ
                </span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">আমার সংবাদের পাঠক রিচ</span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white">
                  {myEstimatedReach.toLocaleString()}
                </div>
                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1 font-mono">
                  <Eye className="w-3 h-3" /> আনুমানিক পাঠক ইম্প্রেশন
                </span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">আমার প্রকাশিত সংবাদ</span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white">
                  {myArticles.length}
                </div>
                <span className="text-[10px] text-red-500 font-semibold uppercase tracking-wider">
                  নিজস্ব সংবাদ নিবন্ধ
                </span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">আমার পোস্টে মোট কমেন্ট</span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white">
                  {myTotalComments}
                </div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  পাঠকদের রেসপন্স
                </span>
              </div>
            </div>

            {/* Per-Article Breakdown Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <span>আমার সংবাদ সমূহের পারফরম্যান্স ব্রেকডাউন ({myArticles.length})</span>
                <span className="text-xs text-slate-400 font-normal">রিয়েল-টাইম ভিউ ট্র্যাকিং</span>
              </h4>

              {myArticles.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto opacity-80" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                    আপনি এখনও কোনো নিবন্ধ প্রকাশ করেননি।
                  </p>
                  <p className="text-[11px] text-slate-400">
                    "নতুন পোস্ট লিখুন" ট্যাবে গিয়ে আপনার প্রথম সংবাদ প্রকাশ করুন এবং এখানে ভিউ ট্র্যাকিং দেখুন।
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myArticles.map((art) => (
                    <div key={art.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {art.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            বিভাগ: <strong className="text-red-600 dark:text-red-400">{art.category}</strong> • প্রকাশ: {new Date(art.publishedAt).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-red-500" /> {art.viewsCount || 0} ভিউ
                        </span>
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> {art.comments?.length || 0} কমেন্ট
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 3: Manage Posts */}
      {activeTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            প্রকাশিত সকল সংবাদ নিবন্ধ তালিকা ({articles.length})
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {articles.map((art) => (
              <div key={art.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {art.category} • {art.author || 'THE RECAP MEDIA'} • {new Date(art.publishedAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleStartEditArticle(art)}
                    className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-xl hover:bg-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> সম্পাদনা
                  </button>
                  <button
                    onClick={() => onDeleteArticle(art.id)}
                    className="px-3 py-1.5 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: WITHDRAW MONEY */}
      {activeTab === 'withdraw' && (() => {
        const myArticles = articles.filter(art => {
          if (!writerProfile?.name) return false;
          return (art.author || '').toLowerCase().includes(writerProfile.name.toLowerCase());
        });
        const myTotalViews = myArticles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
        const myTotalEarnings = Math.floor(myTotalViews / 130);
        
        const myWriterWithdrawals = withdrawals.filter(w => w.writerId === writerProfile?.id);
        const totalWithdrawn = myWriterWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
        
        // Net balance deduction after withdrawal
        const currentBalance = Math.max(0, myTotalEarnings - totalWithdrawn);
        const canWithdraw = currentBalance >= 500;

        return (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  টাকা উত্তোলন (Withdraw Earnings)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  সর্বনিম্ন ৫০০ টাকা অর্জিত হলে উত্তোলন বাটনে ক্লিক করে টাকা তুলুন।
                </p>
              </div>

              {/* Quick Status Pill */}
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">চলতি অবশিষ্ট ব্যালেন্স</span>
                  <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                    ৳ {currentBalance.toLocaleString()}
                  </span>
                </div>
                <div className="border-l border-slate-300 dark:border-slate-700 pl-4">
                  <span className="text-[10px] text-slate-400 block font-bold">মোট উত্তোলিত</span>
                  <span className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">
                    ৳ {totalWithdrawn.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Under Process Message Display if active */}
            {transactionNoticeMsg && (
              <div className="p-5 bg-amber-50 dark:bg-amber-950/80 border-2 border-amber-400 dark:border-amber-700 rounded-2xl text-amber-900 dark:text-amber-100 space-y-2 shadow-lg animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                    উইথড্রয়াল আবেদন জমা সম্পন্ন হয়েছে
                  </span>
                  <button
                    onClick={() => setTransactionNoticeMsg('')}
                    className="text-amber-700 dark:text-amber-300 hover:text-amber-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs font-bold whitespace-pre-line leading-relaxed">
                  {transactionNoticeMsg}
                </p>
              </div>
            )}

            {/* Main Withdraw Button Area */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                <Wallet className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  আপনার একাউন্ট ব্যালেন্স: <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black text-xl">৳{currentBalance}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {canWithdraw
                    ? 'আপনার কাছে উত্তোলনের জন্য পর্যাপ্ত ৫০০+ টাকা রয়েছে। নিচের Withdraw বাটনে ক্লিক করুন।'
                    : `উত্তোলনের জন্য সর্বনিম্ন ৫০০ টাকা প্রয়োজন। (আপনার বাকি প্রয়োজন ৳${500 - currentBalance})`}
                </p>
              </div>

              {/* Primary Withdraw Trigger Button */}
              <button
                type="button"
                disabled={!canWithdraw}
                onClick={() => {
                  setSelectedGateway('');
                  setWithdrawPhoneInput('');
                  setWithdrawCustomAmount(currentBalance >= 500 ? currentBalance : '');
                  setShowWithdrawModal(true);
                }}
                className={`px-10 py-4 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 mx-auto ${
                  canWithdraw
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 cursor-pointer hover:scale-105'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Withdraw (উত্তোলন করুন)</span>
              </button>

              {!canWithdraw && (
                <span className="text-[11px] text-red-500 dark:text-red-400 font-bold block pt-1">
                  (সর্বনিম্ন উত্তোলন ৫০০ টাকা)
                </span>
              )}
            </div>

            {/* Withdraw History Section */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <span>আমার উইথড্রয়াল হিস্টোরি ({myWriterWithdrawals.length})</span>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline"
                >
                  নোটিফিকেশনে সম্পূর্ণ হিস্টোরি দেখুন &rarr;
                </button>
              </h4>

              {myWriterWithdrawals.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">এখনও কোনো উইথড্রয়াল আবেদন করা হয়নি।</p>
              ) : (
                <div className="space-y-2">
                  {myWriterWithdrawals.map(w => (
                    <div key={w.id} className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700">
                      <div>
                        <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">৳{w.amount}</strong>
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          গেটওয়ে: <strong className="text-slate-800 dark:text-slate-200">{w.paymentMethod}</strong> ({w.accountNumber})
                        </span>
                        {w.transactionId && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            TrxID: {w.transactionId}
                          </span>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono border ${
                          w.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        }`}>
                          {w.status === 'completed' ? 'done (পরিশোধিত)' : 'pending (অপেক্ষমাণ)'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {new Date(w.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB: WRITER NOTIFICATIONS & PAYMENT HISTORY */}
      {activeTab === 'notifications' && (() => {
        const myWriterWithdrawals = withdrawals.filter(w => w.writerId === writerProfile?.id);
        const myNotifications = notifications.filter(n => n.recipientWriterId === writerProfile?.id || n.recipientWriterId === 'ALL');

        return (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Bell className="w-5 h-5 text-amber-500" />
                  অফিশিয়াল নোটিফিকেশন বক্স
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  অ্যাডমিন প্যানেল থেকে <strong>The Recap Media Cast LTD</strong> কর্তৃক পাঠানো সমস্ত নোটিফিকেশন ও বার্তা।
                </p>
              </div>

              {/* Payment History Trigger Button in Notifications */}
              <button
                type="button"
                onClick={() => setShowPaymentHistoryModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-2xl shadow transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <History className="w-4 h-4" />
                <span>পেমেন্ট হিস্টোরি (Payment History)</span>
                <span className="bg-slate-950 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {myWriterWithdrawals.length}
                </span>
              </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {myNotifications.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">কোনো নোটিফিকেশন পাওয়া যায়নি।</p>
                </div>
              ) : (
                myNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {n.senderName || 'The Recap Media Cast LTD'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleString('bn-BD')}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {n.title}
                    </h4>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}

      {/* MODAL 1: WITHDRAW WINDOW MODAL (FOR SELECTING GATEWAY & PHONE NUMBER) */}
      {showWithdrawModal && (() => {
        const myArticles = articles.filter(art => {
          if (!writerProfile?.name) return false;
          return (art.author || '').toLowerCase().includes(writerProfile.name.toLowerCase());
        });
        const myTotalViews = myArticles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
        const myReportedWidgetViews = myTotalViews >= 50 ? Math.round(myTotalViews * 0.7) : myTotalViews;
        const myTotalEarnings = Math.floor(myReportedWidgetViews / 257);
        const myWriterWithdrawals = withdrawals.filter(w => w.writerId === writerProfile?.id);
        const totalWithdrawn = myWriterWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
        const currentBalance = Math.max(0, myTotalEarnings - totalWithdrawn);

        // Dynamic Placeholder determination
        const getGatewayPlaceholder = (gateway: string) => {
          switch (gateway) {
            case 'bKash': return 'Enter Your Valid Bkash Number';
            case 'Nagad': return 'Enter your valid Nagad Number';
            case 'Upay': return 'Enter your valid Upay Number';
            case 'Rocket': return 'Enter your valid Rocket Number';
            case 'TAP': return 'Enter your valid TAP number';
            default: return 'প্রথমে পেমেন্ট গেটওয়ে সিলেক্ট করুন...';
          }
        };

        const isPhoneValid = withdrawPhoneInput.trim().length === 11;
        const numericAmount = typeof withdrawCustomAmount === 'number' ? withdrawCustomAmount : 0;
        const isAmountValid = numericAmount >= 500 && numericAmount <= currentBalance;
        const canSubmitModal = selectedGateway !== '' && isPhoneValid && isAmountValid;

        const handleModalWithdrawSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!canSubmitModal || !writerProfile) return;

          if (onRequestWithdrawal) {
            onRequestWithdrawal({
              writerId: writerProfile.id,
              writerName: writerProfile.name,
              writerMobile: writerProfile.mobile,
              writerAvatar: writerProfile.avatarUrl,
              amount: numericAmount,
              paymentMethod: selectedGateway,
              accountNumber: withdrawPhoneInput.trim()
            });
          }

          setTransactionNoticeMsg(
            "Your transaction is under process, please wait up to the next 3 working days.\nআপনার Withdraw প্রক্রিয়াধীন রয়েছে, অনুগ্রহ করে আগামী ৩ কর্মদিবস পর্যন্ত অপেক্ষা করুন"
          );

          setShowWithdrawModal(false);
          setSelectedGateway('');
          setWithdrawPhoneInput('');
        };

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif">
                      টাকা উত্তোলন উইন্ডো (Withdrawal Window)
                    </h3>
                    <p className="text-xs text-slate-500">
                      উত্তোলনের মোট পরিমাণ: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">৳{currentBalance}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleModalWithdrawSubmit} className="space-y-5">
                {/* Withdrawal Amount Box */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      উত্তোলনের পরিমাণ (৳) *
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      সর্বোচ্চ: ৳{currentBalance}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={500}
                    max={currentBalance}
                    required
                    value={withdrawCustomAmount}
                    onChange={(e) => setWithdrawCustomAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder={`যেমন: 500, 1000, ${currentBalance}...`}
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border font-mono font-bold transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 shadow-sm"
                  />
                  {numericAmount > 0 && numericAmount < 500 && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">
                      ⚠️ উত্তোলনের জন্য সর্বনিম্ন ৫০০ টাকা লিখতে হবে।
                    </p>
                  )}
                  {numericAmount > currentBalance && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">
                      ⚠️ আপনার মোট ব্যালেন্স (৳{currentBalance})-এর চেয়ে বেশি উত্তোলন সম্ভব নয়।
                    </p>
                  )}
                </div>

                {/* Gateway Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
                    পেমেন্ট গেটওয়ে নির্বাচন করুন (Payment Gateway) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'bKash', label: '🔸 বিকাশ', color: 'bg-pink-500' },
                      { id: 'Nagad', label: '🔸 নগদ', color: 'bg-orange-500' },
                      { id: 'Rocket', label: '🔸 রকেট', color: 'bg-purple-600' },
                      { id: 'Upay', label: '🔸 উপায়', color: 'bg-yellow-500' },
                      { id: 'TAP', label: '🔸 ট্যাপ', color: 'bg-blue-600' },
                    ].map((gw) => (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setSelectedGateway(gw.id as any)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          selectedGateway === gw.id
                            ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-red-400'
                        }`}
                      >
                        <span>{gw.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 11-digit Phone Number Box */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      ১১ সংখ্যার পার্সোনাল মোবাইল নম্বর *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {withdrawPhoneInput.length}/11 সংখ্যা
                    </span>
                  </div>
                  
                  <input
                    type="tel"
                    maxLength={11}
                    disabled={!selectedGateway}
                    value={withdrawPhoneInput}
                    onChange={(e) => setWithdrawPhoneInput(e.target.value.replace(/\D/g, ''))}
                    placeholder={getGatewayPlaceholder(selectedGateway)}
                    className={`w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border font-mono font-bold transition-all ${
                      !selectedGateway
                        ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-red-500 focus:ring-2 focus:ring-red-500 shadow-sm'
                    }`}
                  />
                  {!selectedGateway && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                      ⚠️ প্রথমে উপরের যেকোনো একটি গেটওয়ে ক্লিক করে সিলেক্ট করুন।
                    </p>
                  )}
                  {selectedGateway && !isPhoneValid && (
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      💡 ঠিক ১১ সংখ্যার মোবাইল নম্বরটি প্রবেশ করান (যেমন: 017XXXXXXXX)
                    </p>
                  )}
                </div>

                {/* Modal Submit Withdraw Button */}
                <button
                  type="submit"
                  disabled={!canSubmitModal}
                  className={`w-full py-3.5 text-xs font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    canSubmitModal
                      ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer hover:scale-[1.02]'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Withdraw (উত্তোলন নিশ্চিত করুন)</span>
                </button>
              </form>
            </div>
          </div>
        );
      })()}

      {/* MODAL 2: PAYMENT HISTORY MODAL (OPENED FROM NOTIFICATIONS TAB) */}
      {showPaymentHistoryModal && (() => {
        const myWriterWithdrawals = withdrawals.filter(w => w.writerId === writerProfile?.id);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-fadeIn max-h-[85vh] flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif">
                      💳 পূর্ববর্তী উইথড্রয়াল পেমেন্ট হিস্টোরি
                    </h3>
                    <p className="text-xs text-slate-500">
                      আপনার সমস্ত পূর্ববর্তী উত্তোলনের আবেদনের অবস্থা দেখুন।
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentHistoryModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {myWriterWithdrawals.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    এখনও কোনো উত্তোলনের রেকর্ড পাওয়া যায়নি।
                  </div>
                ) : (
                  myWriterWithdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs space-y-0"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                            ৳{w.amount}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-[10px] font-bold">
                            {w.paymentMethod}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] font-mono">
                          মোবাইল/একাউন্ট: <strong>{w.accountNumber}</strong>
                        </p>
                        {w.senderAccount && (
                          <p className="text-[10px] text-slate-400 font-mono">
                            Sender Account: {w.senderAccount} | TrxID: {w.transactionId}
                          </p>
                        )}
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono border inline-block ${
                          w.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        }`}>
                          {w.status === 'completed' ? 'done (পরিশোধিত)' : 'pending (অপেক্ষমাণ)'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          📅 {new Date(w.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowPaymentHistoryModal(false)}
                  className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 4: Writer Profile Details */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              লেখক প্রোফাইল ও পরিচিতি
            </h3>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors"
            >
              প্রোফাইল সংশোধন করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={writerProfile.avatarUrl}
                alt={writerProfile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500"
              />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">প্রতিবেদক নাম</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{writerProfile.name}</span>
                <span className="text-xs text-emerald-500 font-bold block mt-0.5">অফিসিয়াল নিউজ প্রতিবেদক</span>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 font-semibold">ইমেইল:</span>
                <span className="font-bold text-slate-900 dark:text-white">{writerProfile.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 font-semibold">মোবাইল নম্বর:</span>
                <span className="font-bold text-slate-900 dark:text-white">{writerProfile.mobile}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 font-semibold">NID নম্বর:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{writerProfile.nidNumber || 'তথ্য দেওয়া হয়নি'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 font-semibold">বয়স:</span>
                <span className="font-bold text-slate-900 dark:text-white">{writerProfile.age} বছর</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">ঠিকানা:</span>
                <span className="font-bold text-slate-900 dark:text-white">{writerProfile.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doubtful / Unverified News User Affirmation Modal */}
      {doubtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-serif font-black text-slate-900 dark:text-white">
                সংবাদের সত্যতা ও তথ্যসূত্র যাচাই এলার্ট
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                আপনার পোস্ট করা সংবাদের তথ্যসূত্র বা নির্ভরযোগ্য মিল ইন্টারনেটে খুঁজে পাওয়া যায়নি অথবা এটি অসমর্থিত মনে হচ্ছে।
              </p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-center">
              <p className="text-sm font-bold text-amber-950 dark:text-amber-200">
                "আপনার পোস্ট করা নিউজের বিষয়বস্তু কি সত্য?"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmDoubtfulPublish}
                className="px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> হ্যাঁ (তথ্যের দায়ভার আমার, প্রকাশ করুন)
              </button>

              <button
                type="button"
                onClick={handleRejectDoubtfulPublish}
                className="px-4 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" /> না (পোস্ট বাতিল / এডিট করুন)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Native Banner Ad 2 for Reporter Panel (Bottom) */}
      <NativeBannerAd
        settings={siteSettings?.dynamicAds?.nativeBanner}
        isPostWriting={activeTab === 'create' || editingArticleId !== null}
        panelLabel="প্রতিবেদক প্যানেল (ব্যানার ২)"
      />

      {/* Cloudflare & reCAPTCHA Bot Protection Modal */}
      <BotProtectionModal
        isOpen={showBotModal}
        actionTitle={botModalActionTitle}
        onSuccess={() => {
          setShowBotModal(false);
          if (botSuccessCallback) {
            botSuccessCallback();
            setBotSuccessCallback(null);
          }
        }}
        onClose={() => {
          setShowBotModal(false);
          setBotSuccessCallback(null);
        }}
      />
    </div>
  );
};
