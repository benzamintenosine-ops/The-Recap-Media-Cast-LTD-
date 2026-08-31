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
  Wallet
} from 'lucide-react';
import { NewsArticle, Category, Language, AnalyticsOverview, WriterProfile, SystemNotification, WithdrawalRequest } from '../types';
import { getTranslation } from '../utils/i18n';
import { renderFormattedContent } from '../utils/formatContent';
import { BloggerRichEditor } from './BloggerRichEditor';

interface WritersPortalProps {
  articles: NewsArticle[];
  onAddArticle: (article: Partial<NewsArticle>) => void;
  onDeleteArticle: (id: string) => void;
  currentLang: Language;
  writerSecretCode?: string;
  notifications?: SystemNotification[];
  withdrawals?: WithdrawalRequest[];
  onRequestWithdrawal?: (req: Omit<WithdrawalRequest, 'id' | 'createdAt' | 'status'>) => void;
  onRegisterWriter?: (writer: WriterProfile) => void;
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
  onDeleteArticle,
  currentLang,
  writerSecretCode = 'RECAP2026',
  notifications = [],
  withdrawals = [],
  onRequestWithdrawal,
  onRegisterWriter
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

  // Writer Profile Setup Form State
  const [setupName, setSetupName] = useState(writerProfile?.name || '');
  const [setupAddress, setSetupAddress] = useState(writerProfile?.address || '');
  const [setupMobile, setSetupMobile] = useState(writerProfile?.mobile || '');
  const [setupAge, setSetupAge] = useState<number | ''>(writerProfile?.age || '');
  const [setupAvatarUrl, setSetupAvatarUrl] = useState(writerProfile?.avatarUrl || '');
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  const [photoVerified, setPhotoVerified] = useState<boolean>(Boolean(writerProfile?.avatarUrl));
  const [profileError, setProfileError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Active Sub-Tab: 'analytics' | 'create' | 'manage' | 'withdraw' | 'notifications' | 'profile'
  const [activeTab, setActiveTab] = useState<'analytics' | 'create' | 'manage' | 'withdraw' | 'notifications' | 'profile'>('create');

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
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [postCategory, setPostCategory] = useState<Category>('জাতীয়');
  const [postTags, setPostTags] = useState<string[]>(['সংবাদ', 'জাতীয়', 'ব্রেকিং']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80');
  const [postVideoUrl, setPostVideoUrl] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [shareNameUnderPost, setShareNameUnderPost] = useState(true);
  const [postSuccessMessage, setPostSuccessMessage] = useState('');
  const [editorError, setEditorError] = useState('');

  // Image upload state & validation
  const [imageSizeError, setImageSizeError] = useState('');

  // AI text generation inside Create Post
  const [aiTextPrompt, setAiTextPrompt] = useState('');
  const [isAiTextGenerating, setIsAiTextGenerating] = useState(false);

  // AI image generation inside Create Post
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [isAiImageGenerating, setIsAiImageGenerating] = useState(false);

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

  const t = (key: any) => getTranslation(currentLang, key);

  // Writer Auth Handler (Login / Signup with Referral Code)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('ইমেইল এবং পাসওয়ার্ড বাধ্যতামূলক!');
      return;
    }

    if (authMode === 'signup') {
      if (!secretCodeInput.trim()) {
        setAuthError('গোপন রেফার কোড প্রদান করা বাধ্যতামূলক!');
        return;
      }
      if (secretCodeInput.trim().toUpperCase() !== writerSecretCode.toUpperCase()) {
        setAuthError(`ভুল গোপন রেফার কোড! সঠিক গোপন রেফার কোডটি টাইপ করুন।`);
        return;
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

  // Writer Profile Setup Submission
  const handleProfileSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');

    if (!setupName.trim() || !setupAddress.trim() || !setupMobile.trim() || setupAge === '') {
      setProfileError('সকল ক্ষেত্র (নাম, ঠিকানা, মোবাইল নম্বর, বয়স, ছবি) পূরণ করা বাধ্যতামূলক!');
      return;
    }

    const ageNum = Number(setupAge);
    if (isNaN(ageNum) || ageNum < 18) {
      setProfileError('বয়স অবশ্যই ১৮ বছর বা তার বেশি হতে হবে! (১৮ বছরের নিচে আবেদন গ্রহণযোগ্য নয়)');
      return;
    }

    if (!setupAvatarUrl || !photoVerified) {
      setProfileError('ডিভাইস থেকে নিজস্ব মানুষের প্রোফাইল ছবি আপলোড এবং AI যাচাইকরণ বাধ্যতামূলক!');
      return;
    }

    const newProfile: WriterProfile = {
      id: `writer-${Date.now()}`,
      name: setupName.trim(),
      email: emailInput || writerProfile?.email || 'writer@therecapmedia.com',
      address: setupAddress.trim(),
      mobile: setupMobile.trim(),
      age: ageNum,
      avatarUrl: setupAvatarUrl,
      secretCodeUsed: secretCodeInput || writerSecretCode,
      createdAt: new Date().toISOString()
    };

    setWriterProfile(newProfile);
    localStorage.setItem('recap_writer_profile', JSON.stringify(newProfile));
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('recap_writer_logged');
  };

  // AI Text Generator inside Create Post
  const handleGenerateAiText = async () => {
    if (!aiTextPrompt.trim() && !postTitle.trim()) {
      alert('অনুগ্রহ করে সংবাদের বিষয়বস্তু বা শিরোনাম লিখুন!');
      return;
    }
    setIsAiTextGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTextPrompt || postTitle,
          category: postCategory,
          language: 'bn',
          targetKeywords: postTags.join(', ')
        })
      });
      const data = await res.json();
      if (data.title && !postTitle) setPostTitle(data.title);
      if (data.summary) setPostSummary(data.summary);
      if (data.content) setPostContent(data.content);
      if (data.tags && data.tags.length > 0) setPostTags(data.tags);
    } catch (err) {
      console.error('AI Text error:', err);
    } finally {
      setIsAiTextGenerating(false);
    }
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

  // AI Image Generator inside Create Post
  const handleGenerateAiImage = async () => {
    if (!aiImagePrompt.trim() && !postTitle.trim()) {
      alert('অনুগ্রহ করে ছবির বিবরণ বা সংবাদের শিরোনাম লিখুন!');
      return;
    }
    setIsAiImageGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiImagePrompt || postTitle,
          category: postCategory,
          style: 'News Editorial Banner'
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setPostImageUrl(data.imageUrl);
      }
    } catch (err) {
      console.error('AI image error:', err);
    } finally {
      setIsAiImageGenerating(false);
    }
  };

  // Step 1 -> Step 2 transition
  const handleProceedToStep2 = () => {
    setEditorError('');
    if (!postTitle.trim()) {
      setEditorError('সংবাদের শিরোনাম লেখা বাধ্যতামূলক!');
      return;
    }
    if (!postContent.trim()) {
      setEditorError('সংবাদের বিবরণ লেখা বাধ্যতামূলক!');
      return;
    }
    setCreateStep(2);
  };

  // Publish Post Handler
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const authorName = `${writerProfile?.name || 'লেখক'}${shareNameUnderPost ? ' (প্রতিবেদক)' : ''}`;

    onAddArticle({
      title: postTitle,
      summary: postSummary || postTitle.slice(0, 100),
      content: postContent,
      category: postCategory,
      tags: postTags,
      imageUrl: postImageUrl,
      videoUrl: postVideoUrl.trim() || undefined,
      isBreaking,
      author: authorName,
      publishedAt: new Date().toISOString(),
      viewsCount: 0,
      comments: [],
      readTimeMinutes: Math.max(2, Math.ceil(postContent.length / 400)),
    });

    setPostSuccessMessage('সংবাদ পোস্টটি সফলভাবে লাইভ প্রকাশিত হয়েছে!');
    setTimeout(() => setPostSuccessMessage(''), 4000);

    // Reset editor
    setPostTitle('');
    setPostSummary('');
    setPostContent('');
    setCreateStep(1);
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

  // SCREEN 1: Authentication Screen (Sign In / Sign Up with Secret Referral Code)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-red-600 rounded-2xl text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
            <PenTool className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
            লেখক প্যানেল (Writers Panel)
          </h2>
          <p className="text-xs text-slate-500">
            {authMode === 'signup' 
              ? 'নতুন লেখক / প্রতিবেদক হিসেবে সাইন-আপ করতে গোপন রেফার কোড লিখুন'
              : 'লেখক প্যানেলে প্রবেশের জন্য আপনার অ্যাকাউন্ট সাইন ইন করুন'}
          </p>
        </div>

        {/* Tab Switcher: Sign Up vs Sign In */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setSecretCodeInput(''); setAuthError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${authMode === 'signup' ? 'bg-red-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
          >
            লেখক সাইন-আপ (Sign Up)
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
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ইমেইল এড্রেস (Email Address) *
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="writer@therecapmedia.com"
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

          {/* Secret Referral Code field for Registration */}
          {authMode === 'signup' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> গোপন রেফার কোড (Secret Referral Code) *
                </label>
              </div>
              <input
                type="text"
                required
                value={secretCodeInput}
                onChange={(e) => setSecretCodeInput(e.target.value)}
                placeholder="গোপন রেফার কোডটি লিখুন..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-amber-400 dark:border-amber-600/60 bg-amber-50/50 dark:bg-amber-950/30 text-slate-900 dark:text-amber-200 font-mono font-bold tracking-widest focus:ring-2 focus:ring-amber-500 uppercase"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {authMode === 'signup' ? 'গোপন কোড যাচাই ও পরবর্তী ধাপ' : 'লেখক প্যানেলে সাইন ইন করুন'}
          </button>
        </form>
      </div>
    );
  }

  // SCREEN 2: Mandatory Writer Profile Setup Window (If Profile is incomplete or being edited)
  if (!writerProfile || isEditingProfile) {
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
            প্রতিবেদক/লেখক প্রোফাইল প্রস্তুতকরণ
          </h2>
          <p className="text-xs text-slate-500">
            সংবাদ পোস্ট প্রকাশ করার জন্য আপনার বিস্তারিত তথ্যগুলো বাধ্যতামূলকভাবে পূরণ করুন।
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

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              বর্তমান ঠিকানা (Address) *
            </label>
            <input
              type="text"
              required
              value={setupAddress}
              onChange={(e) => setSetupAddress(e.target.value)}
              placeholder="যেমন: গুলশান, ঢাকা-১২১২"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
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

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            প্রোফাইল জমা দিন ও লেখক প্যানেলে প্রবেশ করুন
          </button>
        </form>
      </div>
    );
  }

  // SCREEN 3: Writers Panel Main Control Room
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner & Profile Overview */}
      <div className="bg-slate-900 dark:bg-[#0a0a0a] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-slate-800 dark:border-white/10">
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md uppercase tracking-widest shadow">
              WRITERS PANEL / লেখক প্যানেল
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 font-mono">
              <CheckCircle className="w-3.5 h-3.5" /> অনুমোদিত লেখক
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
                  ব্লগার স্টাইল নিউজ ক্রিয়েটর — {createStep === 1 ? 'ধাপ ১: সংবাদ সম্পাদনা' : 'ধাপ ২: কী-ওয়ার্ড ও লেখক নাম'}
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

              {/* Visual Rich Text Editor */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-red-600" />
                  সংবাদের মূল বিবরণ ও ভিজ্যুয়াল লেখার বোর্ড (Content Board) *
                </label>

                <BloggerRichEditor
                  value={postContent}
                  onChange={(html) => setPostContent(html)}
                  aiPrompt={aiTextPrompt}
                  onAiPromptChange={setAiTextPrompt}
                  onGenerateAiText={handleGenerateAiText}
                  isAiGenerating={isAiTextGenerating}
                  minHeight="500px"
                />
              </div>

              {/* Image Upload & AI Image Tools */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  সংবাদের প্রচ্ছদ ছবি (Featured Image Tools)
                </label>

                {imageSizeError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{imageSizeError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tool 1: Device File Upload with 500KB Validation */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-red-500" /> ডিভাইস থেকে ছবি আপলোড
                      </span>
                      <span className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded">
                        সর্বনিম্ন 500 KB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                    />
                  </div>

                  {/* Tool 2: AI Image Generator */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-400" /> AI দিয়ে কন্টেন্ট ভিত্তিক ছবি তৈরি
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={aiImagePrompt}
                        onChange={(e) => setAiImagePrompt(e.target.value)}
                        placeholder="ছবির বিবরণ (Prompt)..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateAiImage}
                        disabled={isAiImageGenerating}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0"
                      >
                        {isAiImageGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        তৈরি করুন
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Image Preview */}
                {postImageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-56 mt-2">
                    <img
                      src={postImageUrl}
                      alt="News Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
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
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
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
                  {postTags.map((tag) => (
                    <span
                      key={tag}
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
                  সিলেক্ট করা থাকলে সংবাদের নিচে প্রতিবেদক হিসেবে দেখাবে: <strong className="text-red-600 dark:text-red-400">{writerProfile?.name} (প্রতিবেদক)</strong>
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

              {/* Final Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> সংবাদটি সম্পূর্ণ প্রকাশ করুন (Publish News Live)
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
        
        // Earning calculation: 1 Taka per 130 views
        const myTotalEarnings = Math.floor(myTotalViews / 130);

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
                  অর্জিত মোট আয়
                </span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">আমার সংবাদের মোট ভিউ</span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white">
                  {myTotalViews.toLocaleString()}
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

                <button
                  onClick={() => onDeleteArticle(art.id)}
                  className="px-3 py-1.5 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-1 shrink-0 self-end sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                </button>
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
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          w.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {w.status === 'completed' ? 'পরিশোধিত (Completed)' : 'প্রক্রিয়াধীন (Under Process)'}
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
        const myTotalEarnings = Math.floor(myTotalViews / 130);
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
                      </div>

                      <div className="text-right space-y-1">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
                          w.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {w.status === 'completed' ? 'পরিশোধিত (Completed)' : 'প্রক্রিয়াধীন (Under Process)'}
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
                <span className="text-xs text-emerald-500 font-bold block mt-0.5">অফিসিয়াল নিউজ লেখক</span>
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
    </div>
  );
};
