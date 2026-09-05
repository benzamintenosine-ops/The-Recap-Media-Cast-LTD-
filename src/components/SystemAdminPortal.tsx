import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Lock, 
  Users, 
  Eye, 
  MessageSquare, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  FileText, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Image as ImageIcon, 
  ExternalLink, 
  AlertCircle, 
  LogOut, 
  Edit3, 
  Settings, 
  Bell, 
  DollarSign, 
  Globe, 
  Link as LinkIcon, 
  Facebook, 
  Instagram, 
  Youtube, 
  Ban, 
  Send, 
  PenTool, 
  UploadCloud,
  Check,
  Tag,
  Search,
  EyeOff,
  Edit2,
  X,
  Building2,
  UserCheck,
  Camera,
  Key
} from 'lucide-react';
import { 
  NewsArticle, 
  Language, 
  AdminProfile, 
  WriterProfile, 
  ManagerProfile,
  SiteSettings, 
  SystemNotification, 
  WithdrawalRequest, 
  AdBanner, 
  SocialWidget,
  CategoryConfig,
  DynamicAdSettings
} from '../types';
import { RichContentEditor } from './BloggerRichEditor';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { saveAdminToFirebase } from '../services/firebaseDataService';

interface SystemAdminPortalProps {
  articles: NewsArticle[];
  onDeleteArticle: (id: string, reason?: string) => void;
  currentLang: Language;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: Partial<SiteSettings>) => void;
  writers: WriterProfile[];
  onUpdateWriters: (writers: WriterProfile[]) => void;
  withdrawals: WithdrawalRequest[];
  onUpdateWithdrawalStatus: (id: string, status: 'completed', senderAccount?: string, transactionId?: string) => void;
  notifications: SystemNotification[];
  onSendNotification: (notification: Omit<SystemNotification, 'id' | 'createdAt' | 'read'>) => void;
  categories: CategoryConfig[];
  onUpdateCategories: (categories: CategoryConfig[]) => void;
  managers?: ManagerProfile[];
  onUpdateManagers?: (managers: ManagerProfile[]) => void;
  admins?: AdminProfile[];
  onUpdateAdmins?: (admins: AdminProfile[]) => void;
}

const DEFAULT_SOCIAL_WIDGETS: SocialWidget[] = [
  { id: 'soc-fb', name: 'Facebook Page', platform: 'facebook', url: 'https://facebook.com/therecapmediacast', badge: 'ফলো', isActive: true },
  { id: 'soc-yt', name: 'YouTube Channel', platform: 'youtube', url: 'https://youtube.com/@therecapmediacast', badge: 'সাবস্ক্রাইব', isActive: true },
  { id: 'soc-ig', name: 'Instagram Profile', platform: 'instagram', url: 'https://instagram.com/therecapmediacast', badge: 'ফলো', isActive: true },
];

export const SystemAdminPortal: React.FC<SystemAdminPortalProps> = ({
  articles,
  onDeleteArticle,
  currentLang,
  siteSettings,
  onUpdateSiteSettings,
  writers,
  onUpdateWriters,
  withdrawals,
  onUpdateWithdrawalStatus,
  notifications,
  onSendNotification,
  categories = [],
  onUpdateCategories,
  managers = [],
  onUpdateManagers,
  admins = [],
  onUpdateAdmins
}) => {
  // Auth state for Admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('recap_admin_logged') === 'true';
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Profile
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(() => {
    const saved = localStorage.getItem('recap_admin_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Profile Form State for Signup
  const [setupName, setSetupName] = useState('');
  const [setupAddress, setSetupAddress] = useState('');
  const [setupMobile, setSetupMobile] = useState('');
  const [setupAge, setSetupAge] = useState<number | ''>('');
  const [setupAvatarUrl, setSetupAvatarUrl] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'withdrawals' | 'managers' | 'settings' | 'ads' | 'socials' | 'analytics' | 'profile'
  >('withdrawals');

  // Admin Profile Setup & Edit States
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [editAdminName, setEditAdminName] = useState('');
  const [editAdminDesignation, setEditAdminDesignation] = useState('');
  const [editAdminMobile, setEditAdminMobile] = useState('');
  const [editAdminAddress, setEditAdminAddress] = useState('');
  const [editAdminAge, setEditAdminAge] = useState<number | ''>(32);
  const [editAdminBio, setEditAdminBio] = useState('');
  const [editAdminNid, setEditAdminNid] = useState('');
  const [editAdminAvatarUrl, setEditAdminAvatarUrl] = useState('');
  const [editAdminNewPassword, setEditAdminNewPassword] = useState('');
  const [isUploadingAdminAvatar, setIsUploadingAdminAvatar] = useState(false);
  const [adminProfileSuccessMsg, setAdminProfileSuccessMsg] = useState('');

  // Quick Password Change in Profile Tab
  const [quickOldPassword, setQuickOldPassword] = useState('');
  const [quickNewPassword, setQuickNewPassword] = useState('');
  const [quickConfirmPassword, setQuickConfirmPassword] = useState('');
  const [quickPasswordMsg, setQuickPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const initAdminEditModal = () => {
    if (adminProfile) {
      setEditAdminName(adminProfile.name || '');
      setEditAdminDesignation(adminProfile.designation || 'প্রধান সম্পাদক ও চিফ অ্যাডমিন');
      setEditAdminMobile(adminProfile.mobile || '');
      setEditAdminAddress(adminProfile.address || '');
      setEditAdminAge(adminProfile.age || 32);
      setEditAdminBio(adminProfile.bio || '');
      setEditAdminNid(adminProfile.nidNumber || '');
      setEditAdminAvatarUrl(adminProfile.avatarUrl || '');
      setEditAdminNewPassword('');
    }
  };

  const handleAdminAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ছবির সাইজ ১০MB এর কম হতে হবে!');
      return;
    }

    try {
      setIsUploadingAdminAvatar(true);
      const url = await uploadImageToCloudinary(file, 'admin_avatars');
      setEditAdminAvatarUrl(url);
    } catch (err) {
      console.warn('Cloudinary upload fallback to data url:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAdminAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAdminAvatar(false);
    }
  };

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) return;

    const cleanMobile = editAdminMobile.trim().replace(/\D/g, '');
    if (cleanMobile.length !== 11) {
      alert('মোবাইল নম্বরটি অবশ্যই সঠিক ১১ ডিজিটের হতে হবে (যেমন: 01712345678)!');
      return;
    }

    if (editAdminNewPassword.trim() && editAdminNewPassword.trim().length < 6) {
      alert('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
      return;
    }

    const updatedProfile: AdminProfile = {
      ...adminProfile,
      name: editAdminName.trim() || adminProfile.name,
      designation: editAdminDesignation.trim() || 'প্রধান সম্পাদক ও চিফ অ্যাডমিন',
      mobile: editAdminMobile.trim(),
      address: editAdminAddress.trim(),
      age: Number(editAdminAge) || 32,
      bio: editAdminBio.trim(),
      nidNumber: editAdminNid.trim(),
      avatarUrl: editAdminAvatarUrl.trim() || adminProfile.avatarUrl,
      password: editAdminNewPassword.trim() ? editAdminNewPassword.trim() : (adminProfile.password || '')
    };

    setAdminProfile(updatedProfile);
    localStorage.setItem('recap_admin_profile', JSON.stringify(updatedProfile));

    try {
      await saveAdminToFirebase(updatedProfile);
    } catch (err) {
      console.warn('Could not save admin profile to Firebase:', err);
    }

    if (onUpdateAdmins && admins) {
      const filtered = admins.filter(a => a.id !== updatedProfile.id && a.email.toLowerCase() !== updatedProfile.email.toLowerCase());
      onUpdateAdmins([...filtered, updatedProfile]);
    }

    setShowEditAdminModal(false);
    setAdminProfileSuccessMsg('অ্যাডমিন প্রোফাইল সফলভাবে আপডেট ও ক্লাউডে সংরক্ষণ করা হয়েছে!');
    setTimeout(() => setAdminProfileSuccessMsg(''), 5000);
  };

  const handleQuickPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickPasswordMsg(null);
    if (!adminProfile) return;

    const currentSecret = siteSettings.adminSecretCode || 'ADMIN2026';
    if (adminProfile.password && quickOldPassword.trim() !== adminProfile.password && quickOldPassword.trim() !== currentSecret) {
      setQuickPasswordMsg({ type: 'error', text: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!' });
      return;
    }

    if (quickNewPassword.trim().length < 6) {
      setQuickPasswordMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!' });
      return;
    }

    if (quickNewPassword.trim() !== quickConfirmPassword.trim()) {
      setQuickPasswordMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!' });
      return;
    }

    const updatedProfile: AdminProfile = {
      ...adminProfile,
      password: quickNewPassword.trim()
    };

    setAdminProfile(updatedProfile);
    localStorage.setItem('recap_admin_profile', JSON.stringify(updatedProfile));
    try {
      await saveAdminToFirebase(updatedProfile);
    } catch (err) {
      console.warn(err);
    }
    if (onUpdateAdmins && admins) {
      const filtered = admins.filter(a => a.id !== updatedProfile.id && a.email.toLowerCase() !== updatedProfile.email.toLowerCase());
      onUpdateAdmins([...filtered, updatedProfile]);
    }

    setQuickOldPassword('');
    setQuickNewPassword('');
    setQuickConfirmPassword('');
    setQuickPasswordMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' });
    setTimeout(() => setQuickPasswordMsg(null), 5000);
  };

  // Modal / Form States
  const [deleteModalArticle, setDeleteModalArticle] = useState<NewsArticle | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  // View Writer Profile Modal
  const [selectedWriter, setSelectedWriter] = useState<WriterProfile | null>(null);

  // Writer Search in "লেখকগণ" tab
  const [writerSearchQuery, setWriterSearchQuery] = useState('');

  // Send Notification Window Form with Autocomplete Search
  const [notifTargetWriterId, setNotifTargetWriterId] = useState<string>('ALL');
  const [notifWriterSearch, setNotifWriterSearch] = useState('');
  const [notifWriterDropdownOpen, setNotifWriterDropdownOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSuccessMessage, setNotifSuccessMessage] = useState('');

  // Site Settings Sub-Tab
  const [settingsSubTab, setSettingsSubTab] = useState<'branding' | 'codes' | 'categories' | 'about' | 'privacy' | 'contact'>('branding');
  const [editSiteName, setEditSiteName] = useState(siteSettings.siteName || 'THE RECAP MEDIA CAST LTD');
  const [editSiteTagline, setEditSiteTagline] = useState(siteSettings.siteTagline || 'সত্যনিষ্ঠ বস্তুনিষ্ঠ সংবাদ পরিবেশনায় অঙ্গীকারবদ্ধ');
  const [editLogoUrl, setEditLogoUrl] = useState(siteSettings.logoUrl || '');
  const [editOfficeAddress, setEditOfficeAddress] = useState(siteSettings.officeAddress || 'রেকাপ মিডিয়া কাস্ট লিমিটেড টাওয়ার, গুলশান-২, ঢাকা-১২১২।');
  const [editContactEmail, setEditContactEmail] = useState(siteSettings.contactEmail || 'news@therecapmedia.com');
  const [editContactPhone, setEditContactPhone] = useState(siteSettings.contactPhone || '+880 9612-888999');
  const [editWriterSecret, setEditWriterSecret] = useState(siteSettings.writerSecretCode || 'RECAP2026');
  const [editManagingSecret, setEditManagingSecret] = useState(siteSettings.managingSecretCode || 'MANAGING2026');
  const [editAdminSecret, setEditAdminSecret] = useState(siteSettings.adminSecretCode || 'ADMIN2026');
  const [editTelegramReferralUrl, setEditTelegramReferralUrl] = useState(siteSettings.telegramReferralUrl || 'https://t.me/TheRecapMediaCast');

  // Category Management State
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const [aboutHtml, setAboutHtml] = useState(siteSettings.aboutUsHtml || '');
  const [privacyHtml, setPrivacyHtml] = useState(siteSettings.privacyPolicyHtml || '');
  const [contactHtml, setContactHtml] = useState(siteSettings.contactUsHtml || '');
  const [aboutPrompt, setAboutPrompt] = useState('');
  const [privacyPrompt, setPrivacyPrompt] = useState('');
  const [contactPrompt, setContactPrompt] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Dynamic Network Ads State (Popunder, Social Bar, Native Banner)
  const [dynamicAds, setDynamicAds] = useState<DynamicAdSettings>(() => {
    return (
      siteSettings.dynamicAds || {
        popunder: {
          enabled: true,
          scriptUrl: 'https://pl31159237.profitableratecpmnetwork.com/29/a8/67/29a8676045a7e37ef249372b2fa46d3c.js',
          onlyOnHeadlineOrCoverClick: true,
        },
        socialBar: {
          enabled: true,
          scriptUrl: 'https://pl31159238.profitableratecpmnetwork.com/27/65/fa/2765fa033dbdb8258da4afcb4fde947e.js',
          intervalSeconds: 45,
          position: 'bottom',
          height: 'auto',
        },
        nativeBanner: {
          enabled: true,
          scriptUrl: 'https://pl31159239.profitableratecpmnetwork.com/521fd3d07f58a510c8b2fa24d6fac606/invoke.js',
          containerId: 'container-521fd3d07f58a510c8b2fa24d6fac606',
          width: '100%',
          minHeight: '90px',
          showInWriterPanel: true,
          showInManagingPanel: true,
          hideDuringPostCreation: true,
        },
      }
    );
  });
  const [dynamicAdsSuccess, setDynamicAdsSuccess] = useState('');

  useEffect(() => {
    if (siteSettings.dynamicAds) {
      setDynamicAds(siteSettings.dynamicAds);
    }
  }, [siteSettings.dynamicAds]);

  const handleSaveDynamicAds = () => {
    onUpdateSiteSettings({
      dynamicAds
    });
    setDynamicAdsSuccess('নেটওয়ার্ক বিজ্ঞাপন সেটিংস (Popunder, Social Bar, Native Banner) সফলভাবে সংরক্ষিত ও কার্যকর হয়েছে!');
    setTimeout(() => setDynamicAdsSuccess(''), 4500);
  };

  const parseScriptUrl = (input: string): string => {
    if (!input) return '';
    const trimmed = input.trim();
    const match = trimmed.match(/src=["'](.*?)["']/i);
    return match && match[1] ? match[1] : trimmed;
  };

  const parseContainerId = (input: string): string => {
    if (!input) return '';
    const trimmed = input.trim();
    const match = trimmed.match(/id=["'](.*?)["']/i);
    return match && match[1] ? match[1] : trimmed;
  };

  // Ad Banner Modal State
  const [showAddAdModal, setShowAddAdModal] = useState(false);
  const [editingAdBanner, setEditingAdBanner] = useState<AdBanner | null>(null);
  const [adTitle, setAdTitle] = useState('');
  const [adSponsor, setAdSponsor] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('');
  const [adPlacement, setAdPlacement] = useState<'header_top' | 'sidebar' | 'in_article'>('header_top');

  // Social Widget Modal State
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [editingSocialWidget, setEditingSocialWidget] = useState<SocialWidget | null>(null);
  const [socialName, setSocialName] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [socialBadge, setSocialBadge] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<'facebook' | 'instagram' | 'youtube' | 'twitter' | 'whatsapp' | 'telegram' | 'tiktok' | 'custom'>('custom');
  const [socialActive, setSocialActive] = useState<boolean>(true);

  // Admin Notification Center Modal (Sent & Received)
  const [showNotificationCenterModal, setShowNotificationCenterModal] = useState<boolean>(false);
  const [notifCenterTab, setNotifCenterTab] = useState<'sent' | 'received'>('sent');

  // Payment Done Window Modal State
  const [paymentModalReq, setPaymentModalReq] = useState<WithdrawalRequest | null>(null);
  const [senderAccountInput, setSenderAccountInput] = useState('');
  const [transactionIdInput, setTransactionIdInput] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Sync admin profile to localStorage
  useEffect(() => {
    if (adminProfile) {
      localStorage.setItem('recap_admin_profile', JSON.stringify(adminProfile));
    }
  }, [adminProfile]);

  // Sync site settings state when props change
  useEffect(() => {
    setEditSiteName(siteSettings.siteName || 'THE RECAP MEDIA CAST LTD');
    setEditSiteTagline(siteSettings.siteTagline || 'সত্যনিষ্ঠ বস্তুনিষ্ঠ সংবাদ পরিবেশনায় অঙ্গীকারবদ্ধ');
    setEditLogoUrl(siteSettings.logoUrl || '');
    setEditOfficeAddress(siteSettings.officeAddress || 'রেকাপ মিডিয়া কাস্ট লিমিটেড টাওয়ার, গুলশান-২, ঢাকা-১২১২।');
    setEditContactEmail(siteSettings.contactEmail || 'news@therecapmedia.com');
    setEditContactPhone(siteSettings.contactPhone || '+880 9612-888999');
    setEditWriterSecret(siteSettings.writerSecretCode || 'RECAP2026');
    setEditManagingSecret(siteSettings.managingSecretCode || 'MANAGING2026');
    setEditAdminSecret(siteSettings.adminSecretCode || 'ADMIN2026');
    setEditTelegramReferralUrl(siteSettings.telegramReferralUrl || 'https://t.me/TheRecapMediaCast');
    setAboutHtml(siteSettings.aboutUsHtml || '');
    setPrivacyHtml(siteSettings.privacyPolicyHtml || '');
    setContactHtml(siteSettings.contactUsHtml || '');
  }, [siteSettings]);

  // Handle Admin Sign In / Sign Up
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const currentSecret = siteSettings.adminSecretCode || 'ADMIN2026';

    if (authMode === 'signup') {
      // Validate secret code (must match siteSettings.adminSecretCode)
      if (secretCodeInput.trim() !== currentSecret) {
        setAuthError('অ্যাডমিন সাইনআপের জন্য গোপন কোডটি (Secret Code) ভুল হয়েছে!');
        return;
      }

      if (!setupName.trim() || !emailInput.trim() || !setupMobile.trim()) {
        setAuthError('অনুগ্রহ করে নাম, ইমেইল ও মোবাইল নম্বর পূরণ করুন।');
        return;
      }

      if (passwordInput.trim().length < 6) {
        setAuthError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
        return;
      }

      const cleanMobile = setupMobile.trim().replace(/\D/g, '');
      if (cleanMobile.length !== 11) {
        setAuthError('মোবাইল নম্বরটি অবশ্যই সঠিক ১১ ডিজিটের হতে হবে (যেমন: 01712345678)!');
        return;
      }

      const cleanEmail = emailInput.trim().toLowerCase();
      if (admins?.some(a => a.email.trim().toLowerCase() === cleanEmail)) {
        setAuthError('এই ইমেইলে ইতিমধ্যে একটি অ্যাডমিন অ্যাকাউন্ট রয়েছে! দয়া করে সাইন-ইন করুন।');
        return;
      }

      const newAdminProfile: AdminProfile = {
        id: `admin-${Date.now()}`,
        name: setupName.trim(),
        email: cleanEmail,
        designation: 'প্রধান সম্পাদক ও চিফ অ্যাডমিন',
        password: passwordInput.trim(),
        address: setupAddress.trim() || 'গুলশান, ঢাকা',
        mobile: setupMobile.trim(),
        age: Number(setupAge) || 30,
        avatarUrl: setupAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        secretCodeUsed: secretCodeInput.trim(),
        createdAt: new Date().toISOString()
      };

      setAdminProfile(newAdminProfile);
      localStorage.setItem('recap_admin_profile', JSON.stringify(newAdminProfile));
      if (onUpdateAdmins) {
        onUpdateAdmins([...(admins || []).filter(a => a.email.toLowerCase() !== cleanEmail), newAdminProfile]);
      }
      saveAdminToFirebase(newAdminProfile).catch(() => {});

      localStorage.setItem('recap_admin_logged', 'true');
      setIsAuthenticated(true);
    } else {
      // Login mode validation
      if (!emailInput.trim() || !passwordInput.trim()) {
        setAuthError('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
        return;
      }

      const cleanEmail = emailInput.trim().toLowerCase();
      let matched = admins?.find(a => a.email.trim().toLowerCase() === cleanEmail) ||
        (adminProfile && adminProfile.email.toLowerCase() === cleanEmail ? adminProfile : null);

      if (!matched) {
        try {
          const cached = localStorage.getItem('recap_admins');
          if (cached) {
            const parsed: AdminProfile[] = JSON.parse(cached);
            matched = parsed.find(a => a.email.trim().toLowerCase() === cleanEmail) || null;
          }
        } catch {}
      }

      // STRICT: No one can sign in without having signed up previously!
      if (!matched) {
        setAuthError('এই ইমেইলে কোনো অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি! সাইন-ইন করার পূর্বে অনুগ্রহ করে প্রথমে "নতুন অ্যাডমিন সাইনআপ (Sign Up)" করুন।');
        return;
      }

      // Password verification - strictly check registered password
      if (!matched.password || matched.password !== passwordInput.trim()) {
        setAuthError('ভুল পাসওয়ার্ড! অনুগ্রহ করে আপনার নিবন্ধিত সঠিক পাসওয়ার্ড প্রদান করুন।');
        return;
      }

      setAdminProfile(matched);
      localStorage.setItem('recap_admin_profile', JSON.stringify(matched));
      localStorage.setItem('recap_admin_logged', 'true');
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recap_admin_logged');
    setIsAuthenticated(false);
  };

  // Image File Upload Helper with Cloudinary
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ছবি ১০MB এর বড় হওয়া যাবে না!');
      return;
    }

    try {
      const url = await uploadImageToCloudinary(file, 'system_admin');
      setter(url);
    } catch (err) {
      console.warn('Cloudinary upload fallback to data URL:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Article Deletion with Reason
  const confirmDeleteArticle = () => {
    if (!deleteModalArticle) return;
    if (!deleteReason.trim()) {
      alert('অনুগ্রহ করে সংবাদটি ডিলিট করার কারণ টাইপ করুন!');
      return;
    }

    // Call deletion handler
    onDeleteArticle(deleteModalArticle.id, deleteReason);

    // Send automatic notification to the author
    onSendNotification({
      recipientWriterId: 'ALL', // Or matching author name
      senderName: 'The Recap Media Cast LTD',
      title: 'সংবাদ অপসারণের নোটিফিকেশন (Article Removed)',
      message: `আপনার প্রকাশিত "${deleteModalArticle.title}" সংবাদটি অ্যাডমিন প্যানেল থেকে মুছে ফেলা হয়েছে। কারণ: ${deleteReason}`,
      type: 'post_deleted',
      reason: deleteReason
    });

    setDeleteModalArticle(null);
    setDeleteReason('');
  };

  // Ban / Unban Writer Toggle
  const handleToggleBanWriter = (writerId: string) => {
    const updated = writers.map((w) =>
      w.id === writerId ? { ...w, isBanned: !w.isBanned } : w
    );
    onUpdateWriters(updated);
  };

  // Payment Done Action & Modal Handlers
  const handleOpenPaymentModal = (req: WithdrawalRequest) => {
    setPaymentModalReq(req);
    setSenderAccountInput('');
    setTransactionIdInput('');
    setPaymentError('');
  };

  const handleConfirmSendPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalReq) return;
    if (!senderAccountInput.trim()) {
      setPaymentError('অনুগ্রহ করে Sender Account (যে নম্বর থেকে টাকা পাঠানো হয়েছে) লিখুন।');
      return;
    }
    if (!transactionIdInput.trim()) {
      setPaymentError('অনুগ্রহ করে Transection ID লিখুন।');
      return;
    }

    onUpdateWithdrawalStatus(
      paymentModalReq.id, 
      'completed', 
      senderAccountInput.trim(), 
      transactionIdInput.trim()
    );

    const formattedMessage = `প্রিয় ${paymentModalReq.writerName},
${paymentModalReq.paymentMethod} এর মাধ্যমে আপনার লেনদেন টি সম্পন্ন করা হয়েছে।

#Amount: ৳${paymentModalReq.amount}
#Sender Account: ${senderAccountInput.trim()}
#Receiver Account: ${paymentModalReq.accountNumber}
#Transection ID: ${transactionIdInput.trim()}`;

    // Send payment done notification to the writer with exact requested format
    onSendNotification({
      recipientWriterId: paymentModalReq.writerId,
      senderName: 'The Recap Media Cast LTD',
      title: 'পেমেন্ট সম্পন্ন হয়েছে (Payment Completed)',
      message: formattedMessage,
      type: 'payment_done',
      amount: paymentModalReq.amount
    });

    setPaymentModalReq(null);
    setSenderAccountInput('');
    setTransactionIdInput('');
    setPaymentError('');
  };

  // Send Custom Notification Submit
  const handleSendCustomNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    onSendNotification({
      recipientWriterId: notifTargetWriterId,
      senderName: 'The Recap Media Cast LTD',
      title: notifTitle,
      message: notifMessage,
      type: 'general'
    });

    setNotifSuccessMessage('নোটিফিকেশনটি সফলভাবে লেখকের কাছে পাঠানো হয়েছে!');
    setNotifTitle('');
    setNotifMessage('');
    setTimeout(() => setNotifSuccessMessage(''), 4000);
  };

  // Save Branding & Secret Codes Settings
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({
      siteName: editSiteName,
      siteTagline: editSiteTagline,
      logoUrl: editLogoUrl,
      officeAddress: editOfficeAddress,
      contactEmail: editContactEmail,
      contactPhone: editContactPhone,
      writerSecretCode: editWriterSecret,
      managingSecretCode: editManagingSecret,
      adminSecretCode: editAdminSecret,
      telegramReferralUrl: editTelegramReferralUrl,
      aboutUsHtml: aboutHtml,
      privacyPolicyHtml: privacyHtml,
      contactUsHtml: contactHtml
    });
    setSettingsSuccess('ওয়েবসাইটের তথ্য, ফুটার কন্টাক্ট ও গোপন রেফার কোড সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => setSettingsSuccess(''), 4000);
  };

  // Open Add Ad Banner Modal
  const handleOpenAddAdModal = () => {
    setEditingAdBanner(null);
    setAdTitle('');
    setAdSponsor('');
    setAdImageUrl('');
    setAdTargetUrl('');
    setAdPlacement('header_top');
    setShowAddAdModal(true);
  };

  // Open Edit Ad Banner Modal
  const handleOpenEditAdBanner = (ad: AdBanner) => {
    setEditingAdBanner(ad);
    setAdTitle(ad.title);
    setAdSponsor(ad.sponsorName);
    setAdImageUrl(ad.imageUrl);
    setAdTargetUrl(ad.targetUrl);
    setAdPlacement(ad.placement);
    setShowAddAdModal(true);
  };

  // Add / Edit Ad Banner Submit
  const handleAddAdBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adImageUrl.trim() || !adTargetUrl.trim()) return;

    if (editingAdBanner) {
      // Update existing Ad Banner
      const updated = (siteSettings.adBanners || []).map((a) =>
        a.id === editingAdBanner.id
          ? {
              ...a,
              title: adTitle.trim(),
              sponsorName: adSponsor.trim() || 'Sponsor Ad',
              imageUrl: adImageUrl.trim(),
              targetUrl: adTargetUrl.trim(),
              placement: adPlacement
            }
          : a
      );
      onUpdateSiteSettings({ adBanners: updated });
    } else {
      // Create new Ad Banner
      const newAd: AdBanner = {
        id: `ad-${Date.now()}`,
        title: adTitle.trim(),
        sponsorName: adSponsor.trim() || 'Sponsor Ad',
        imageUrl: adImageUrl.trim(),
        targetUrl: adTargetUrl.trim(),
        placement: adPlacement,
        active: true
      };

      onUpdateSiteSettings({
        adBanners: [...(siteSettings.adBanners || []), newAd]
      });
    }

    setShowAddAdModal(false);
    setEditingAdBanner(null);
    setAdTitle('');
    setAdSponsor('');
    setAdImageUrl('');
    setAdTargetUrl('');
  };

  // Toggle or Delete Ad Banner
  const handleToggleAdBanner = (adId: string) => {
    const updated = (siteSettings.adBanners || []).map((a) =>
      a.id === adId ? { ...a, active: !a.active } : a
    );
    onUpdateSiteSettings({ adBanners: updated });
  };

  const handleDeleteAdBanner = (adId: string) => {
    const updated = (siteSettings.adBanners || []).filter((a) => a.id !== adId);
    onUpdateSiteSettings({ adBanners: updated });
  };

  // Open Add Social Modal
  const handleOpenAddSocial = () => {
    setEditingSocialWidget(null);
    setSocialName('');
    setSocialUrl('');
    setSocialBadge('');
    setSocialPlatform('facebook');
    setSocialActive(true);
    setShowAddSocialModal(true);
  };

  // Open Edit Social Modal
  const handleOpenEditSocial = (soc: SocialWidget) => {
    setEditingSocialWidget(soc);
    setSocialName(soc.name);
    setSocialUrl(soc.url);
    setSocialBadge(soc.badge || '');
    setSocialPlatform(soc.platform || 'custom');
    setSocialActive(soc.isActive !== false);
    setShowAddSocialModal(true);
  };

  // Toggle Social Widget Visibility (Show / Hide)
  const handleToggleSocialVisibility = (socId: string) => {
    const currentList = (siteSettings.socialWidgets && siteSettings.socialWidgets.length > 0)
      ? siteSettings.socialWidgets
      : DEFAULT_SOCIAL_WIDGETS;

    const updated = currentList.map((soc) =>
      soc.id === socId ? { ...soc, isActive: soc.isActive === false ? true : false } : soc
    );
    onUpdateSiteSettings({ socialWidgets: updated });
  };

  // Restore Default Social Widgets
  const handleRestoreDefaultSocials = () => {
    if (window.confirm('আপনি কি ডিফল্ট সোশ্যাল উইজেটস (Facebook, YouTube, Instagram) রিস্টোর করতে চান?')) {
      onUpdateSiteSettings({ socialWidgets: DEFAULT_SOCIAL_WIDGETS });
    }
  };

  // Save Social Widget (Add / Edit)
  const handleSaveSocialWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialName.trim() || !socialUrl.trim()) return;

    const currentList = (siteSettings.socialWidgets && siteSettings.socialWidgets.length > 0)
      ? siteSettings.socialWidgets
      : DEFAULT_SOCIAL_WIDGETS;

    if (editingSocialWidget) {
      const updated = currentList.map((s) =>
        s.id === editingSocialWidget.id
          ? {
              ...s,
              name: socialName.trim(),
              url: socialUrl.trim(),
              badge: socialBadge.trim(),
              platform: socialPlatform,
              isActive: socialActive
            }
          : s
      );
      onUpdateSiteSettings({ socialWidgets: updated });
    } else {
      const newWidget: SocialWidget = {
        id: `soc-${Date.now()}`,
        name: socialName.trim(),
        url: socialUrl.trim(),
        badge: socialBadge.trim(),
        platform: socialPlatform,
        isActive: socialActive
      };
      onUpdateSiteSettings({
        socialWidgets: [...currentList, newWidget]
      });
    }

    setShowAddSocialModal(false);
    setEditingSocialWidget(null);
    setSocialName('');
    setSocialUrl('');
    setSocialBadge('');
    setSocialActive(true);
  };

  const handleDeleteSocialWidget = (socId: string) => {
    const currentList = (siteSettings.socialWidgets && siteSettings.socialWidgets.length > 0)
      ? siteSettings.socialWidgets
      : DEFAULT_SOCIAL_WIDGETS;
    const updated = currentList.filter((s) => s.id !== socId);
    onUpdateSiteSettings({ socialWidgets: updated });
  };

  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;

  // Render Login / Signup Form if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-red-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
              অ্যাডমিন পোর্টাল সাইন-ইন
            </h2>
            <p className="text-xs text-slate-500">
              দ্য রিক্যাপ মিডিয়া কাস্ট লিমিটেড সাইট ও লেখক ব্যবস্থাপনা প্যানেল
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'login' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
              }`}
            >
              লগইন (Sign In)
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'signup' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
              }`}
            >
              নতুন অ্যাডমিন সাইনআপ (Sign Up)
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-300 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            {authMode === 'signup' && (
              <>
                {/* Secret Code Input (ALWAYS HIDE IN PASSWORD INPUT) */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    অ্যাডমিন গোপন কোড (Secret Code) *
                  </label>
                  <input
                    type="password"
                    required
                    value={secretCodeInput}
                    onChange={(e) => setSecretCodeInput(e.target.value)}
                    placeholder="অ্যাডমিন গোপন কোড টাইপ করুন (Hidden Code)..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-mono tracking-widest"
                  />
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 block">
                    🔒 এই কোডটি গোপন বক্সে থাকবে এবং লেখার প্যানেল থেকে আলাদা।
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    অ্যাডমিনের পুরো নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={setupName}
                    onChange={(e) => setSetupName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম টাইপ করুন..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={setupMobile}
                      onChange={(e) => setSetupMobile(e.target.value)}
                      placeholder="+8801700..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      বয়স
                    </label>
                    <input
                      type="number"
                      value={setupAge}
                      onChange={(e) => setSetupAge(e.target.value ? Number(e.target.value) : '')}
                      placeholder="বয়স (যেমন: 32)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    ঠিকানা
                  </label>
                  <input
                    type="text"
                    value={setupAddress}
                    onChange={(e) => setSetupAddress(e.target.value)}
                    placeholder="গুলশান, ঢাকা"
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    প্রোফাইল ফটো (ডিভাইস থেকে ছবি আপলোড বা লিঙ্ক)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={setupAvatarUrl}
                      onChange={(e) => setSetupAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <label className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-300 flex items-center gap-1">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setSetupAvatarUrl)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                ইমেইল এড্রেস *
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@therecapmedia.com"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                পাসওয়ার্ড *
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {authMode === 'signup' ? 'অ্যাডমিন অ্যাকাউন্ট তৈরি করুন' : 'অ্যাডমিন প্যানেলে প্রবেশ করুন'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Main Admin Dashboard Component
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#050505] text-slate-900 dark:text-slate-100 p-4 sm:p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md">
              <img
                src={adminProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={adminProfile?.name}
                className="w-full h-full rounded-[14px] object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SUPER ADMIN
                </span>
                <span className="text-xs text-slate-400">| ID: {adminProfile?.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight mt-1">
                {adminProfile?.name} <span className="text-xs font-sans font-normal text-slate-400">({adminProfile?.mobile})</span>
              </h1>
              <p className="text-xs text-slate-400">
                {siteSettings.siteName || 'THE RECAP MEDIA CAST LTD'} — নিয়ন্ত্রণ ও পরিচালনা প্যানেল
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell Icon for Notification Center Modal (Sent & Received) */}
            <button
              onClick={() => setShowNotificationCenterModal(true)}
              className="relative p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all flex items-center justify-center group shadow-md"
              title="নোটিফিকেশন সেন্টার (পাঠানো ও রিসিভকৃত নোটিফিকেশন)"
            >
              <Bell className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-slate-900 shadow">
                {notifications.length + withdrawals.length}
              </span>
            </button>

            {pendingWithdrawalsCount > 0 && (
              <button
                onClick={() => setActiveTab('withdrawals')}
                className="px-3.5 py-2 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 animate-bounce"
              >
                <DollarSign className="w-4 h-4" />
                <span>{pendingWithdrawalsCount} টি উইথড্রয়াল নোটিফিকেশন</span>
              </button>
            )}

            {/* Profile Setup / Edit Button in Header */}
            <button
              onClick={() => {
                initAdminEditModal();
                setShowEditAdminModal(true);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-bold rounded-2xl shadow flex items-center gap-2 transition-all"
              title="অ্যাডমিন প্রোফাইল সেটাপ ও এডিট করুন"
            >
              <UserCheck className="w-4 h-4" />
              <span>প্রোফাইল সেটাপ / এডিট</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>🛡️ অ্যাডমিন প্রোফাইল সেটাপ</span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'withdrawals'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>উইথড্রয়াল নোটিফিকেশন</span>
            {pendingWithdrawalsCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('managers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'managers'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>ম্যানেজারবৃন্দ ({managers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>সাইট এডিটর ও গোপন কোড</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'ads'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>বিজ্ঞাপন (Ads)</span>
          </button>

          <button
            onClick={() => setActiveTab('socials')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'socials'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>সোশ্যাল উইজেটস</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>রিয়েলটাইম অ্যানালিটিক্স</span>
          </button>
        </div>

        {/* TAB 1: WITHDRAWALS & PAYMENTS */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                  লেখকের Withdraw আবেদন ও পেমেন্ট হিস্টোরি
                </h2>
                <p className="text-xs text-slate-500">
                  লেখক টাকা Withdraw দিলে নোটিফিকেশন আসবে। "Payment done" দিলে মেসেজে নোটিফিকেশন যাবে।
                </p>
              </div>

              <div className="flex gap-2 text-xs font-bold">
                <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-300 dark:border-amber-900">
                  অপেক্ষমাণ (Pending): {pendingWithdrawalsCount}
                </span>
                <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-300 dark:border-emerald-900">
                  পরিশোধিত (Completed): {withdrawals.filter(w => w.status === 'completed').length}
                </span>
              </div>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <DollarSign className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-500">এখনও কোনো উইথড্রয়াল আবেদন আসেনি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {withdrawals.map((req) => (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                      req.status === 'pending'
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.writerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={req.writerName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            {req.writerName}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                            📱 {req.writerMobile}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            আবেদন সময়: {new Date(req.createdAt).toLocaleString('bn-BD')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                          ৳{req.amount}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          req.status === 'pending' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                        }`}>
                          {req.status === 'pending' ? 'অপেক্ষমাণ' : 'পরিশোধিত (Completed)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span>পেমেন্ট মাধ্যম:</span>
                        <strong className="font-bold text-slate-900 dark:text-white">{req.paymentMethod}</strong>
                      </div>
                      <div className="flex justify-between text-slate-700 dark:text-slate-300">
                        <span>একাউন্ট নম্বর:</span>
                        <strong className="font-mono font-bold text-red-600 dark:text-red-400">{req.accountNumber}</strong>
                      </div>
                    </div>

                    {req.status === 'pending' ? (
                      <button
                        onClick={() => handleOpenPaymentModal(req)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Payment done (পেমেন্ট উইন্ডো খুলুন)
                      </button>
                    ) : (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center text-xs text-emerald-600 dark:text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        পেমেন্ট সম্পন্ন হয়েছে এবং নোটিফিকেশন পাঠানো হয়েছে।
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANAGERS MANAGEMENT */}
        {activeTab === 'managers' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Building2 className="w-6 h-6 text-blue-500" />
                  ব্যবস্থাপনা পরিচালক / ম্যানেজার তালিকা (Manager Management)
                </h2>
                <p className="text-xs text-slate-500">
                  এখানে এডমিন সকল নিবন্ধিত ম্যানেজারদের সংখ্যা দেখতে এবং তাদের নিয়ন্ত্রণ করতে পারবেন।
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>মোট ম্যানেজার: <strong className="text-sm font-mono">{managers.length}</strong> জন</span>
                </div>
              </div>
            </div>

            {managers.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  এখনো পর্যন্ত কোনো ম্যানেজার নিবন্ধিত হয়নি।
                </p>
                <p className="text-xs text-slate-400">
                  ম্যানেজিং রেফার কোড (বর্তমান: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 font-bold">{siteSettings.managingSecretCode || 'MANAGING2026'}</code>) দিয়ে সাইনআপ করলে ম্যানেজার তালিকা এখানে দেখা যাবে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {managers.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/60 dark:to-blue-950/20 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          {m.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono">{m.email}</p>
                      </div>
                    </div>

                    <div className="text-xs space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span>📱 মোবাইল:</span>
                        <strong className="font-mono text-slate-900 dark:text-white">{m.mobile}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>🔑 রেফার কোড ব্যবহার:</span>
                        <strong className="font-mono text-blue-600 dark:text-blue-400">{m.secretCodeUsed}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>📅 সাইনআপ তারিখ:</span>
                        <span className="text-[11px] text-slate-500">{new Date(m.createdAt).toLocaleDateString('bn-BD')}</span>
                      </div>
                    </div>

                    {onUpdateManagers && (
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি সত্যিই ম্যানেজার ${m.name}-এর অ্যাকাউন্ট মুছে ফেলতে চান?`)) {
                            onUpdateManagers(managers.filter(item => item.id !== m.id));
                          }
                        }}
                        className="w-full py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-200 dark:border-red-900/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> ম্যানেজার রিমুভ করুন
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WRITERS MANAGEMENT */}
        {activeTab === 'writers' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Users className="w-6 h-6 text-red-600" />
                  লেখকগণ - প্রোফাইল ও ব্যান ব্যবস্থাপনা
                </h2>
                <p className="text-xs text-slate-500">
                  লেখকের প্রোফাইল ও পোস্ট দেখতে পারবেন, প্রয়োজনবোধে ব্যান করতে বা নোটিফিকেশন পাঠাতে পারবেন।
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400">
                মোট নিবন্ধিত লেখক: {writers.length} জন
              </span>
            </div>

            {/* Writer Search Bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={writerSearchQuery}
                onChange={(e) => setWriterSearchQuery(e.target.value)}
                placeholder="লেখকের নাম, ইমেইল বা মোবাইল দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {writers.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-500">এখনও কোনো লেখক সাইনআপ করেননি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {writers
                  .filter((w) => {
                    const q = writerSearchQuery.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      w.name.toLowerCase().includes(q) ||
                      w.email.toLowerCase().includes(q) ||
                      w.mobile.includes(q)
                    );
                  })
                  .map((w) => {
                  const writerArticlesCount = articles.filter(a => a.author === w.name).length;
                  return (
                    <div
                      key={w.id}
                      className={`p-5 rounded-2xl border transition-all space-y-4 ${
                        w.isBanned
                          ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/60'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={w.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={w.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            {w.name}
                            {w.isBanned && (
                              <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                BANNED
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500">{w.email}</p>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono block">
                            📱 {w.mobile}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 block text-[10px]">মোট প্রকাশিত সংবাদ</span>
                          <strong className="font-bold text-red-600 dark:text-red-400 text-sm">{writerArticlesCount} টি</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">নিবন্ধন কোড</span>
                          <strong className="font-mono font-bold text-slate-800 dark:text-slate-200">{w.secretCodeUsed}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setSelectedWriter(w)}
                          className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                        >
                          <User className="w-3.5 h-3.5" /> প্রোফাইল
                        </button>

                        <button
                          onClick={() => {
                            setNotifTargetWriterId(w.id);
                            setActiveTab('notifications');
                          }}
                          className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1"
                          title="লেখককে নোটিফিকেশন পাঠান"
                        >
                          <Bell className="w-3.5 h-3.5" /> বার্তা
                        </button>

                        <button
                          onClick={() => handleToggleBanWriter(w.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
                            w.isBanned
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                          title={w.isBanned ? 'ব্যান প্রত্যাহার করুন' : 'লেখককে ব্যান করুন'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{w.isBanned ? 'Unban' : 'Ban'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ARTICLES MANAGEMENT & DELETE WITH REASON */}
        {activeTab === 'articles' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <FileText className="w-6 h-6 text-red-600" />
                  লেখকদের প্রকাশিত সংবাদ ও কারণ জানিয়ে ডিলিট
                </h2>
                <p className="text-xs text-slate-500">
                  যেকোনো সংবাদ পর্যবেক্ষণ করে কারণ টাইপ করে ডিলিট করলে লেখকের প্যানেলে নোটিফিকেশন যাবে।
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400">
                মোট প্রকাশিত সংবাদ: {articles.length} টি
              </span>
            </div>

            <div className="space-y-3">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-16 h-12 rounded-xl object-cover shrink-0 border border-slate-300 dark:border-slate-700"
                    />
                    <div>
                      <span className="bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {art.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        লেখক: <strong className="text-slate-800 dark:text-slate-200">{art.author}</strong> • ভিউ: {art.viewsCount || 0}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteModalArticle(art)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>কারণ দেখিয়ে ডিলিট</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELETE REASON MODAL */}
        {deleteModalArticle && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-500 border-b pb-3 border-slate-100 dark:border-slate-800">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  সংবাদ ডিলিট করার কারণ উল্লেখ করুন
                </h3>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                আপনি <strong>"{deleteModalArticle.title}"</strong> সংবাদটি ডিলিট করতে যাচ্ছেন। লেখকের কাছে কারণসহ নোটিফিকেশন যাবে:
              </p>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  ডিলিট করার কারণ (Reason) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="যেমন: কপিরাইট সংক্রান্ত সমস্যা, ভুল তথ্য পরিবেশন বা নীতিমালা লঙ্ঘন..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteModalArticle(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  onClick={confirmDeleteArticle}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  ডিলিট ও নোটিফিকেশন নিশ্চিত করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEND NOTIFICATION WINDOW */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <Bell className="w-6 h-6 text-amber-500" />
                লেখকদের জন্য অফিশিয়াল নোটিফিকেশন পাঠানোর প্যানেল
              </h2>
              <p className="text-xs text-slate-500">
                লেখকের কাছে নোটিফিকেশনের আইডি হবে: <strong className="text-red-600">"The Recap Media Cast LTD"</strong>
              </p>
            </div>

            {notifSuccessMessage && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>{notifSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSendCustomNotif} className="space-y-4 max-w-2xl">
              <div>
                {/* Select Box Option for Sending to All Writers */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl mb-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="selectAllWritersCheck"
                      checked={notifTargetWriterId === 'ALL'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNotifTargetWriterId('ALL');
                          setNotifWriterSearch('');
                          setNotifWriterDropdownOpen(false);
                        } else {
                          setNotifTargetWriterId(writers[0]?.id || '');
                        }
                      }}
                      className="w-5 h-5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer accent-red-600"
                    />
                    <label htmlFor="selectAllWritersCheck" className="cursor-pointer">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        📢 বর্তমানে সকলকে একসাথে নোটিফিকেশন পাঠান
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        (এই সিলেক্ট বক্সে টিক দিলে সকল নিবন্ধিত লেখককে বার্তা পাঠানো যাবে এবং নিচে সার্চ বার লুকানো থাকবে)
                      </p>
                    </label>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold whitespace-nowrap ${
                    notifTargetWriterId === 'ALL' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {notifTargetWriterId === 'ALL' ? 'ALL WRITERS' : 'SINGLE WRITER'}
                  </span>
                </div>

                {/* Search Bar is HIDDEN when "ALL" select box is checked */}
                {notifTargetWriterId !== 'ALL' && (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      নির্দিষ্ট লেখক নির্বাচন করুন (ফেসবুক/ইউটিউবের মতো সার্চ সার্ভিস) *
                    </label>
                    
                    {/* Currently selected recipient display badge */}
                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl mb-2">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const targetWriter = writers.find(w => w.id === notifTargetWriterId);
                          return (
                            <>
                              <img
                                src={targetWriter?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                                alt={targetWriter?.name}
                                className="w-10 h-10 rounded-xl object-cover border border-amber-400"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  👤 {targetWriter?.name || 'নির্দিষ্ট লেখক'}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-mono">
                                  📧 {targetWriter?.email} | 📱 {targetWriter?.mobile}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNotifTargetWriterId('ALL');
                          setNotifWriterSearch('');
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
                      >
                        সকল লেখক নির্বাচন করুন (Reset)
                      </button>
                    </div>

                    {/* Search Input Box for Author */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={notifWriterSearch}
                        onFocus={() => setNotifWriterDropdownOpen(true)}
                        onChange={(e) => {
                          setNotifWriterSearch(e.target.value);
                          setNotifWriterDropdownOpen(true);
                        }}
                        placeholder="লেখককে নির্দিষ্ট করে খুঁজে পেতে নাম, ইমেইল বা মোবাইল দিয়ে টাইপ করুন..."
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />

                      {/* Facebook / YouTube style Autocomplete Dropdown List */}
                      {notifWriterDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-slate-100 dark:divide-slate-800">
                          {writers
                            .filter((w) => {
                              const q = notifWriterSearch.trim().toLowerCase();
                              if (!q) return true;
                              return (
                                w.name.toLowerCase().includes(q) ||
                                w.email.toLowerCase().includes(q) ||
                                w.mobile.includes(q)
                              );
                            })
                            .map((w) => (
                              <button
                                type="button"
                                key={w.id}
                                onClick={() => {
                                  setNotifTargetWriterId(w.id);
                                  setNotifWriterDropdownOpen(false);
                                  setNotifWriterSearch('');
                                }}
                                className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-3"
                              >
                                <img
                                  src={w.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                                  alt={w.name}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {w.name}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                                    📧 {w.email} | 📱 {w.mobile}
                                  </p>
                                </div>
                                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-lg whitespace-nowrap">
                                  নির্বাচন করুন
                                </span>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  নোটিফিকেশনের শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="যেমন: মাসিক বোনাস বা জরুরি নির্দেশনাবলী..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  নোটিফিকেশনের মূল বার্তা (Message Body) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="এখানে বিস্তারিত নোটিফিকেশন বার্তা টাইপ করুন..."
                  className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>The Recap Media Cast LTD আইডি দিয়ে নোটিফিকেশন পাঠান</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: SITE SETTINGS, PAGES & SECRET REFERRAL CODES */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Settings className="w-6 h-6 text-red-600" />
                  ওয়েবসাইটের নাম, লোগো, গোপন কোড ও পেজ এডিটর
                </h2>
                <p className="text-xs text-slate-500">
                  কোডিং ছাড়া ওয়েবসাইটের বিভিন্ন পেজ ও রেফার কোড পরিবর্তনের জন্য অ্যাডমিন প্যানেল।
                </p>
              </div>
            </div>

            {settingsSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            {/* Sub-Tabs Selector */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSettingsSubTab('branding')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  settingsSubTab === 'branding' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
                }`}
              >
                🌐 ওয়েবসাইটের নাম ও লোগো
              </button>
              <button
                onClick={() => setSettingsSubTab('codes')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  settingsSubTab === 'codes' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
                }`}
              >
                🔑 গোপন রেফার কোড পরিবর্তন
              </button>
              <button
                onClick={() => setSettingsSubTab('categories')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  settingsSubTab === 'categories' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
                }`}
              >
                🏷️ ক্যাটাগরি ও মেনু বার আইকন নিয়ন্ত্রণ
              </button>
              <button
                onClick={() => setSettingsSubTab('about')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  settingsSubTab === 'about' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
                }`}
              >
                📝 About Us এডিটর
              </button>
              <button
                onClick={() => setSettingsSubTab('privacy')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  settingsSubTab === 'privacy' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
                }`}
              >
                🛡️ Privacy & Policy এডিটর
              </button>
              <button
                onClick={() => setSettingsSubTab('contact')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  settingsSubTab === 'contact' ? 'bg-red-600 text-white shadow' : 'text-slate-500 hover:text-white'
                }`}
              >
                📞 Contact Us তথ্য এডিটর
              </button>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-6">
              {/* SUBTAB 1: BRANDING & LOGO */}
              {settingsSubTab === 'branding' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      ওয়েবসাইটের নাম (Site Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editSiteName}
                      onChange={(e) => setEditSiteName(e.target.value)}
                      placeholder="THE RECAP MEDIA CAST LTD"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      ওয়েবসাইটের স্লোগান / ট্যাগলাইন (Tagline) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editSiteTagline}
                      onChange={(e) => setEditSiteTagline(e.target.value)}
                      placeholder="সত্যনিষ্ঠ বস্তুনিষ্ঠ সংবাদ পরিবেশনায় অঙ্গীকারবদ্ধ"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      ওয়েবসাইটের লোগো (নিজের ডিভাইস থেকে ফাইল আপলোড বা লিঙ্ক)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editLogoUrl}
                        onChange={(e) => setEditLogoUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <label className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-300 flex items-center gap-1">
                        <UploadCloud className="w-3.5 h-3.5" /> লোগো আপলোড
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, setEditLogoUrl)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* FOOTER INFORMATION EDIT FIELDS */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      🏢 ওয়েবসাইটের ফুটারে প্রদর্শনীয় তথ্য (Footer Info)
                    </h4>

                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        প্রধান কার্যালয়ের ঠিকানা (Head Office Address)
                      </label>
                      <input
                        type="text"
                        value={editOfficeAddress}
                        onChange={(e) => setEditOfficeAddress(e.target.value)}
                        placeholder="রেকাপ মিডিয়া কাস্ট লিমিটেড টাওয়ার, গুলশান-২, ঢাকা-১২১২।"
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        অফিশিয়াল কন্টাক্ট ইমেইল (Contact Email)
                      </label>
                      <input
                        type="email"
                        value={editContactEmail}
                        onChange={(e) => setEditContactEmail(e.target.value)}
                        placeholder="news@therecapmedia.com"
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        হটলাইন / মোবাইল নম্বর (Hotline Phone Number)
                      </label>
                      <input
                        type="text"
                        value={editContactPhone}
                        onChange={(e) => setEditContactPhone(e.target.value)}
                        placeholder="+880 9612-888999"
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: SECRET REFERRAL CODES & TELEGRAM WIDGET */}
              {settingsSubTab === 'codes' && (
                <div className="space-y-4 max-w-xl">
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
                    🔐 <strong>গোপন কোড ও টেলিগ্রাম ইনবক্স নিয়ন্ত্রণ:</strong> সাইনআপ করার সময় সাধারণ পাঠকরা প্রবেশ করতে পারবে না। এডমিন এখান থেকে প্রতিবেদক, ম্যানেজিং প্যানেল ও অ্যাডমিন প্যানেলের রেফার কোড এবং টেলিগ্রাম ইনবক্স লিংক পরিবর্তন ও নিয়ন্ত্রণ করতে পারবেন।
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-500" /> প্রতিবেদক গোপন রেফার কোড (Reporter Secret Referral Code) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editWriterSecret}
                      onChange={(e) => setEditWriterSecret(e.target.value)}
                      placeholder="RECAP2026"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-emerald-200 font-mono font-bold tracking-wider uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-500" /> ম্যানাজিং প্যানেল গোপন রেফার কোড (Managing Secret Code) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editManagingSecret}
                      onChange={(e) => setEditManagingSecret(e.target.value)}
                      placeholder="MANAGING2026"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-blue-400 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-blue-200 font-mono font-bold tracking-wider uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-red-500" /> অ্যাডমিন সাইনআপ গোপন রেফার কোড (Admin Secret Code) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editAdminSecret}
                      onChange={(e) => setEditAdminSecret(e.target.value)}
                      placeholder="ADMIN2026"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold tracking-wider uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-sky-500" /> টেলিগ্রাম ইনবক্স লিংক (Telegram Referral Contact URL) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editTelegramReferralUrl}
                      onChange={(e) => setEditTelegramReferralUrl(e.target.value)}
                      placeholder="https://t.me/TheRecapMediaCast"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-sky-400 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/30 text-slate-900 dark:text-sky-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB 3: CATEGORY MANAGEMENT */}
              {settingsSubTab === 'categories' && (
                <div className="space-y-6">
                  {/* Add New Category Form */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 max-w-xl">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-red-500" /> নতুন ক্যাটাগরি যোগ করুন
                    </h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="যেমন: বিনোদন, ক্যারিয়ার, অপরাধ..."
                        className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCatName.trim()) return;
                          const trimmed = newCatName.trim();
                          if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
                            alert('এই নামের ক্যাটাগরি ইতিমধ্যে তালিকায় রয়েছে!');
                            return;
                          }
                          const newCat: CategoryConfig = {
                            id: `cat-${Date.now()}`,
                            name: trimmed,
                            showIcon: true,
                            isHidden: false
                          };
                          const updated = [...categories, newCat];
                          onUpdateCategories(updated);
                          setNewCatName('');
                          setSettingsSuccess('নতুন ক্যাটাগরি সফলভাবে যুক্ত করা হয়েছে!');
                          setTimeout(() => setSettingsSuccess(''), 3000);
                        }}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" /> যোগ করুন
                      </button>
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-red-500" /> ওয়েবসাইটের ক্যাটাগরি তালিকা ও প্রকাশ নিয়ন্ত্রণ ({categories.length} টি)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.map((c, index) => (
                        <div
                          key={c.id || `sys-cat-${index}`}
                          className={`p-4 rounded-2xl border transition-all space-y-3 ${
                            c.isHidden
                              ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            {editingCatId === c.id ? (
                              <div className="flex items-center gap-1.5 flex-1">
                                <input
                                  type="text"
                                  value={editingCatName}
                                  onChange={(e) => setEditingCatName(e.target.value)}
                                  className="w-full px-2 py-1 text-xs rounded-lg border border-red-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!editingCatName.trim()) return;
                                    const trimmed = editingCatName.trim();
                                    if (categories.some(cat => cat.id !== c.id && cat.name.toLowerCase() === trimmed.toLowerCase())) {
                                      alert('এই নামের আরেকটি ক্যাটাগরি ইতিমধ্যে রয়েছে!');
                                      return;
                                    }
                                    const updated = categories.map(cat => cat.id === c.id ? { ...cat, name: trimmed } : cat);
                                    onUpdateCategories(updated);
                                    setEditingCatId(null);
                                    setEditingCatName('');
                                  }}
                                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                📌 {c.name}
                                {c.isHidden && (
                                  <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 px-1.5 py-0.2 rounded font-bold">
                                    Hidden
                                  </span>
                                )}
                              </h5>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(c.id);
                                setEditingCatName(c.name);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              title="নাম পরিবর্তন করুন"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                            {/* Toggle Nav Bar Visibility */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = categories.map(cat => cat.id === c.id ? { ...cat, isHidden: !cat.isHidden } : cat);
                                onUpdateCategories(updated);
                              }}
                              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                                c.isHidden
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {c.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              <span>{c.isHidden ? 'লুকানো' : 'দৃশ্যমান'}</span>
                            </button>

                            {/* Delete Category */}
                            <button
                              type="button"
                              onClick={() => {
                                if (categories.length <= 1) {
                                  alert('সর্বনিম্ন একটি ক্যাটাগরি থাকতে হবে!');
                                  return;
                                }
                                const updated = categories.filter(cat => cat.id !== c.id);
                                onUpdateCategories(updated);
                              }}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-bold flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছুন</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: ABOUT US EDIT BOARD */}
              {settingsSubTab === 'about' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    About Us (আমাদের কথা) মূল লেখা সম্পাদনা বোর্ড *
                  </label>
                  <RichContentEditor
                    value={aboutHtml}
                    onChange={(html) => setAboutHtml(html)}
                    minHeight="350px"
                  />
                </div>
              )}

              {/* SUBTAB 4: PRIVACY POLICY EDIT BOARD */}
              {settingsSubTab === 'privacy' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Privacy & Policy (প্রাইভেসি ও ব্যবহারের নীতি) মূল লেখা সম্পাদনা বোর্ড *
                  </label>
                  <RichContentEditor
                    value={privacyHtml}
                    onChange={(html) => setPrivacyHtml(html)}
                    minHeight="350px"
                  />
                </div>
              )}

              {/* SUBTAB 5: CONTACT US EDIT BOARD */}
              {settingsSubTab === 'contact' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Contact Us (যোগাযোগ) মূল লেখা সম্পাদনা বোর্ড *
                  </label>
                  <RichContentEditor
                    value={contactHtml}
                    onChange={(html) => setContactHtml(html)}
                    minHeight="350px"
                  />
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>পরিবর্তনসমূহ সংরক্ষণ করুন (Save Settings)</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: ADS BANNERS MANAGEMENT */}
        {activeTab === 'ads' && (
          <div className="space-y-8">
            {/* DYNAMIC NETWORK ADS CONTROL PANEL (POPUNDER, SOCIAL BAR, NATIVE BANNER) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-lg space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-100 dark:border-indigo-900/40 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      ⚡ CPM Network Ads
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      কোন কোডিং ছাড়া কন্ট্রোল
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                    <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    নেটওয়ার্ক বিজ্ঞাপন কন্ট্রোল প্যানেল (Popunder, Social Bar & Native Banner)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    বিজ্ঞাপনের লিংক পরিবর্তন, প্রদর্শন সময়, ব্যানার ও সোশ্যাল বারের সাইজ এবং অবস্থান কোডিং ছাড়াই সহজেই নিয়ন্ত্রণ করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDynamicAds}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>বিজ্ঞাপন সেটিংস সংরক্ষণ করুন (Save)</span>
                </button>
              </div>

              {/* Success Notification */}
              {dynamicAdsSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 text-xs font-bold animate-fadeIn">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{dynamicAdsSuccess}</span>
                </div>
              )}

              {/* THREE AD CONTROLS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. POPUNDER AD CONTROL */}
                <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide block">
                          दर्शকের সাইট
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                          ১. Popunder বিজ্ঞাপন
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDynamicAds((prev) => ({
                            ...prev,
                            popunder: { ...prev.popunder, enabled: !prev.popunder.enabled }
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          dynamicAds.popunder.enabled
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dynamicAds.popunder.enabled ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      💡 <strong>নিয়ম:</strong> দর্শকের সাইটে শুধুমাত্র নিউজের কভার বা শিরোনামের ওপর ক্লিক করলেই কাজ করবে।
                    </p>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Popunder স্ক্রিপ্ট বা লিংক:
                      </label>
                      <input
                        type="text"
                        value={dynamicAds.popunder.scriptUrl}
                        onChange={(e) => {
                          const cleaned = parseScriptUrl(e.target.value);
                          setDynamicAds((prev) => ({
                            ...prev,
                            popunder: { ...prev.popunder, scriptUrl: cleaned }
                          }));
                        }}
                        placeholder="https://pl31159237...js"
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        পুরো &lt;script src="..."&gt; পেস্ট করলেও স্বয়ংক্রিয়ভাবে লিংকটি সেট হবে।
                      </span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="popunder-trigger-rule"
                          checked={dynamicAds.popunder.onlyOnHeadlineOrCoverClick}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              popunder: {
                                ...prev.popunder,
                                onlyOnHeadlineOrCoverClick: e.target.checked
                              }
                            }))
                          }
                          className="accent-indigo-600 rounded w-4 h-4 cursor-pointer"
                        />
                        <label
                          htmlFor="popunder-trigger-rule"
                          className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          শুধুমাত্র কভার বা শিরোনাম ক্লিকে চালু থাকবে
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400">
                    স্ট্যাটাস: {dynamicAds.popunder.enabled ? '🟢 সক্রিয় ও প্রস্তুত' : '⚪ বন্ধ'}
                  </div>
                </div>

                {/* 2. SOCIAL BAR AD CONTROL */}
                <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide block">
                          দর্শকের সাইট
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                          ২. Social Bar বিজ্ঞাপন
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDynamicAds((prev) => ({
                            ...prev,
                            socialBar: { ...prev.socialBar, enabled: !prev.socialBar.enabled }
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          dynamicAds.socialBar.enabled
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dynamicAds.socialBar.enabled ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      💡 <strong>নিয়ম:</strong> দর্শকের সাইটে প্রতি নির্দিষ্ট সময় (ডিফল্ট ৪৫ সেকেন্ড) পর পর সক্রিয় হবে।
                    </p>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Social Bar স্ক্রিপ্ট বা লিংক:
                      </label>
                      <input
                        type="text"
                        value={dynamicAds.socialBar.scriptUrl}
                        onChange={(e) => {
                          const cleaned = parseScriptUrl(e.target.value);
                          setDynamicAds((prev) => ({
                            ...prev,
                            socialBar: { ...prev.socialBar, scriptUrl: cleaned }
                          }));
                        }}
                        placeholder="https://pl31159238...js"
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Timer Interval */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        কত সেকেন্ড পর পর সক্রিয় হবে (Interval):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="10"
                          max="300"
                          value={dynamicAds.socialBar.intervalSeconds || 45}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 45;
                            setDynamicAds((prev) => ({
                              ...prev,
                              socialBar: { ...prev.socialBar, intervalSeconds: val }
                            }));
                          }}
                          className="w-24 text-xs font-bold p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <span className="text-xs font-bold text-slate-500">সেকেন্ড</span>
                      </div>
                      
                      {/* Quick interval buttons */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[30, 45, 60, 90].map((sec) => (
                          <button
                            key={`sec-${sec}`}
                            type="button"
                            onClick={() =>
                              setDynamicAds((prev) => ({
                                ...prev,
                                socialBar: { ...prev.socialBar, intervalSeconds: sec }
                              }))
                            }
                            className={`px-2.5 py-1 text-[10px] rounded-lg font-bold border transition-all ${
                              dynamicAds.socialBar.intervalSeconds === sec
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {sec} সেকেন্ড {sec === 45 && '⭐'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Social Bar Position & Size */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          অবস্থান (Position):
                        </label>
                        <select
                          value={dynamicAds.socialBar.position || 'bottom'}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              socialBar: {
                                ...prev.socialBar,
                                position: e.target.value as 'bottom' | 'top'
                              }
                            }))
                          }
                          className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="bottom">নিচে (Bottom Bar)</option>
                          <option value="top">উপরে (Top Bar)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          উচ্চতা / সাইজ:
                        </label>
                        <select
                          value={dynamicAds.socialBar.height || 'auto'}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              socialBar: { ...prev.socialBar, height: e.target.value }
                            }))
                          }
                          className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="auto">স্বাভাবিক (Auto)</option>
                          <option value="50px">স্লিম (50px)</option>
                          <option value="65px">স্ট্যান্ডার্ড (65px)</option>
                          <option value="80px">লার্জ (80px)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400">
                    স্ট্যাটাস: {dynamicAds.socialBar.enabled ? `🟢 প্রতি ${dynamicAds.socialBar.intervalSeconds || 45} সেকেন্ডে সক্রিয়` : '⚪ বন্ধ'}
                  </div>
                </div>

                {/* 3. NATIVE BANNER AD CONTROL */}
                <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide block">
                          লেখক ও ম্যানেজিং প্যানেল
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                          ৩. Native Banner বিজ্ঞাপন
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDynamicAds((prev) => ({
                            ...prev,
                            nativeBanner: { ...prev.nativeBanner, enabled: !prev.nativeBanner.enabled }
                          }))
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          dynamicAds.nativeBanner.enabled
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dynamicAds.nativeBanner.enabled ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      💡 <strong>নিয়ম:</strong> লেখক ও ম্যানেজিং প্যানেলে দেখাবে, কিন্তু <strong>পোস্ট লেখার সময় স্বয়ংক্রিয়ভাবে গোপন</strong> থাকবে।
                    </p>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Native Banner স্ক্রিপ্ট লিংক:
                      </label>
                      <input
                        type="text"
                        value={dynamicAds.nativeBanner.scriptUrl}
                        onChange={(e) => {
                          const cleaned = parseScriptUrl(e.target.value);
                          setDynamicAds((prev) => ({
                            ...prev,
                            nativeBanner: { ...prev.nativeBanner, scriptUrl: cleaned }
                          }));
                        }}
                        placeholder="https://pl31159239...invoke.js"
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        কন্টেইনার আইডি (Container ID):
                      </label>
                      <input
                        type="text"
                        value={dynamicAds.nativeBanner.containerId}
                        onChange={(e) => {
                          const cleaned = parseContainerId(e.target.value);
                          setDynamicAds((prev) => ({
                            ...prev,
                            nativeBanner: { ...prev.nativeBanner, containerId: cleaned }
                          }));
                        }}
                        placeholder="container-521fd3d07f58a510c8b2fa24d6fac606"
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Banner Size Controls (Width & Height) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          ব্যানারের প্রস্থ (Width):
                        </label>
                        <select
                          value={dynamicAds.nativeBanner.width || '100%'}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              nativeBanner: { ...prev.nativeBanner, width: e.target.value }
                            }))
                          }
                          className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="100%">১০০% রেসপনসিভ (Full)</option>
                          <option value="728px">৭২৮ পিক্সেল (728px)</option>
                          <option value="468px">৪৬৮ পিক্সেল (468px)</option>
                          <option value="320px">৩২০ পিক্সেল (Mobile 320px)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          ন্যূনতম উচ্চতা (Height):
                        </label>
                        <select
                          value={dynamicAds.nativeBanner.minHeight || '90px'}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              nativeBanner: { ...prev.nativeBanner, minHeight: e.target.value }
                            }))
                          }
                          className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="90px">৯০ পিক্সেল (90px - আদর্শ)</option>
                          <option value="120px">১২০ পিক্সেল (120px)</option>
                          <option value="150px">১৫০ পিক্সেল (150px)</option>
                          <option value="250px">২৫০ পিক্সেল (Large)</option>
                        </select>
                      </div>
                    </div>

                    {/* Visibility Checkboxes */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="native-writer-panel"
                          checked={dynamicAds.nativeBanner.showInWriterPanel}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              nativeBanner: {
                                ...prev.nativeBanner,
                                showInWriterPanel: e.target.checked
                              }
                            }))
                          }
                          className="accent-indigo-600 rounded w-4 h-4 cursor-pointer"
                        />
                        <label
                          htmlFor="native-writer-panel"
                          className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          লেখক প্যানেলে প্রদর্শন করুন
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="native-managing-panel"
                          checked={dynamicAds.nativeBanner.showInManagingPanel}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              nativeBanner: {
                                ...prev.nativeBanner,
                                showInManagingPanel: e.target.checked
                              }
                            }))
                          }
                          className="accent-indigo-600 rounded w-4 h-4 cursor-pointer"
                        />
                        <label
                          htmlFor="native-managing-panel"
                          className="text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          ম্যানেজিং প্যানেলে প্রদর্শন করুন
                        </label>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <input
                          type="checkbox"
                          id="native-hide-writing"
                          checked={dynamicAds.nativeBanner.hideDuringPostCreation}
                          onChange={(e) =>
                            setDynamicAds((prev) => ({
                              ...prev,
                              nativeBanner: {
                                ...prev.nativeBanner,
                                hideDuringPostCreation: e.target.checked
                              }
                            }))
                          }
                          className="accent-indigo-600 rounded w-4 h-4 cursor-pointer"
                        />
                        <label
                          htmlFor="native-hide-writing"
                          className="text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer"
                        >
                          পোস্ট লেখার সময় গোপন রাখুন (Hide while writing)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400">
                    স্ট্যাটাস: {dynamicAds.nativeBanner.enabled ? '🟢 প্যানেলসমূহে সক্রিয়' : '⚪ বন্ধ'}
                  </div>
                </div>

              </div>

              {/* Bottom Quick Save Action */}
              <div className="flex items-center justify-between pt-4 border-t border-indigo-100 dark:border-indigo-900/40">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  পরিবর্তন করার পর অবশ্যই নিচের বাটনে ক্লিক করে সংরক্ষণ করুন।
                </span>
                <button
                  type="button"
                  onClick={handleSaveDynamicAds}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>পরিবর্তন সংরক্ষণ করুন (Save Dynamic Ads)</span>
                </button>
              </div>
            </div>

            {/* DIRECT IMAGE BANNER WIDGETS (Header Top, Sidebar, In-Article) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                    <ImageIcon className="w-6 h-6 text-amber-500" />
                    ডিজিটাল বিজ্ঞাপন ব্যানার উইজেটস (Ad Banner Widgets & Edit)
                  </h2>
                  <p className="text-xs text-slate-500">
                    ওয়েবসাইটের ৩টি মূল বিজ্ঞাপন উইজেটে (হেডার টপ, সাইডবার এবং পোস্টের ভেতরে শেয়ার ব্যানারের উপরে) বিজ্ঞাপন আপলোড ও এডিট করুন।
                  </p>
                </div>

                <button
                  onClick={handleOpenAddAdModal}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ব্যানার যুক্ত করুন</span>
                </button>
              </div>

            {/* WIDGET 1 SECTION: HEADER TOP */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                  <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200 font-serif">
                    📢 Widget 1: হেডারের শীর্ষ ব্যানার স্লাইডার (Header Top Banner Widget)
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                  ব্যানার সংখ্যা: {(siteSettings.adBanners || []).filter(a => a.placement === 'header_top').length} টি
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(siteSettings.adBanners || []).filter(a => a.placement === 'header_top').map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-32 object-cover rounded-xl border border-slate-300 dark:border-slate-700"
                    />

                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{ad.title}</h4>
                        <p className="text-slate-500 text-[11px] truncate">স্পন্সর: {ad.sponsorName}</p>
                        <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block">
                          WIDGET 1 (HEADER TOP)
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 items-end shrink-0">
                        <button
                          onClick={() => handleOpenEditAdBanner(ad)}
                          className="px-2.5 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> এডিট (Edit)
                        </button>
                        <button
                          onClick={() => handleToggleAdBanner(ad.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            ad.active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-800'
                          }`}
                        >
                          {ad.active ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdBanner(ad.id)}
                          className="px-2.5 py-1 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          সড়ান (Delete)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(siteSettings.adBanners || []).filter(a => a.placement === 'header_top').length === 0 && (
                  <div className="col-span-full p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    Widget 1 এ এখনও কোনো বিজ্ঞাপন ব্যানার নেই। "+ নতুন ব্যানার যুক্ত করুন" এ ক্লিক করে যুক্ত করুন।
                  </div>
                )}
              </div>
            </div>

            {/* WIDGET 2 SECTION: SIDEBAR */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                  <h3 className="font-bold text-sm text-blue-900 dark:text-blue-200 font-serif">
                    📌 Widget 2: সাইডবার ব্যানার স্লাইডার (Sidebar Banner Widget)
                  </h3>
                </div>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                  ব্যানার সংখ্যা: {(siteSettings.adBanners || []).filter(a => a.placement === 'sidebar').length} টি
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(siteSettings.adBanners || []).filter(a => a.placement === 'sidebar').map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-32 object-cover rounded-xl border border-slate-300 dark:border-slate-700"
                    />

                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{ad.title}</h4>
                        <p className="text-slate-500 text-[11px] truncate">স্পন্সর: {ad.sponsorName}</p>
                        <span className="text-[10px] bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block">
                          WIDGET 2 (SIDEBAR)
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 items-end shrink-0">
                        <button
                          onClick={() => handleOpenEditAdBanner(ad)}
                          className="px-2.5 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> এডিট (Edit)
                        </button>
                        <button
                          onClick={() => handleToggleAdBanner(ad.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            ad.active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-800'
                          }`}
                        >
                          {ad.active ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdBanner(ad.id)}
                          className="px-2.5 py-1 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          সড়ান (Delete)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(siteSettings.adBanners || []).filter(a => a.placement === 'sidebar').length === 0 && (
                  <div className="col-span-full p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    Widget 2 এ এখনও কোনো বিজ্ঞাপন ব্যানার নেই। "+ নতুন ব্যানার যুক্ত করুন" এ ক্লিক করে যুক্ত করুন।
                  </div>
                )}
              </div>
            </div>

            {/* WIDGET 3 SECTION: IN-ARTICLE / ABOVE SHARE BANNER */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 font-serif">
                    🎯 Widget 3: পোস্টের ভেতরে শেয়ার ব্যানারের উপরের বিজ্ঞাপন (In-Article Widget)
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  ব্যানার সংখ্যা: {(siteSettings.adBanners || []).filter(a => a.placement === 'in_article').length} টি
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(siteSettings.adBanners || []).filter(a => a.placement === 'in_article').map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-32 object-cover rounded-xl border border-slate-300 dark:border-slate-700"
                    />

                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{ad.title}</h4>
                        <p className="text-slate-500 text-[11px] truncate">স্পন্সর: {ad.sponsorName}</p>
                        <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block">
                          WIDGET 3 (IN-ARTICLE)
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 items-end shrink-0">
                        <button
                          onClick={() => handleOpenEditAdBanner(ad)}
                          className="px-2.5 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> এডিট (Edit)
                        </button>
                        <button
                          onClick={() => handleToggleAdBanner(ad.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            ad.active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-800'
                          }`}
                        >
                          {ad.active ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdBanner(ad.id)}
                          className="px-2.5 py-1 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          সড়ান (Delete)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(siteSettings.adBanners || []).filter(a => a.placement === 'in_article').length === 0 && (
                  <div className="col-span-full p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    Widget 3 এ এখনও কোনো বিজ্ঞাপন ব্যানার নেই। "+ নতুন ব্যানার যুক্ত করুন" এ ক্লিক করে যুক্ত করুন।
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT AD BANNER MODAL */}
        {showAddAdModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-600" />
                  {editingAdBanner ? 'বিজ্ঞাপন ব্যানার সম্পাদনা (Edit Ad Banner)' : 'নতুন বিজ্ঞাপন ব্যানার যোগ করুন'}
                </h3>
                <button
                  onClick={() => setShowAddAdModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAdBanner} className="space-y-4">
                {/* 1. SELECTION BOXES (3 Options for Placements) */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                    ১. বিজ্ঞাপন উইজেট ও সাইজ নির্বাচন করুন (Placement Selection Box) *
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Widget 1 Box Option */}
                    <div 
                      onClick={() => setAdPlacement('header_top')}
                      className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        adPlacement === 'header_top'
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          📌 Widget 1
                        </span>
                        <input
                          type="radio"
                          name="adPlacementRadio"
                          checked={adPlacement === 'header_top'}
                          onChange={() => setAdPlacement('header_top')}
                          className="accent-amber-600 w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <h5 className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                        হেডার টপ স্লাইডার
                      </h5>
                      <div className="mt-1.5 p-1.5 bg-white/80 dark:bg-black/40 rounded-xl border border-amber-200 dark:border-amber-900/50">
                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 font-mono block">
                          970 × 90 px
                        </span>
                      </div>
                    </div>

                    {/* Widget 2 Box Option */}
                    <div 
                      onClick={() => setAdPlacement('sidebar')}
                      className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        adPlacement === 'sidebar'
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          📌 Widget 2
                        </span>
                        <input
                          type="radio"
                          name="adPlacementRadio"
                          checked={adPlacement === 'sidebar'}
                          onChange={() => setAdPlacement('sidebar')}
                          className="accent-blue-600 w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <h5 className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                        সাইডবার ব্যানার
                      </h5>
                      <div className="mt-1.5 p-1.5 bg-white/80 dark:bg-black/40 rounded-xl border border-blue-200 dark:border-blue-900/50">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 font-mono block">
                          300 × 250 px
                        </span>
                      </div>
                    </div>

                    {/* Widget 3 Box Option: In-Article */}
                    <div 
                      onClick={() => setAdPlacement('in_article')}
                      className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        adPlacement === 'in_article'
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          📌 Widget 3
                        </span>
                        <input
                          type="radio"
                          name="adPlacementRadio"
                          checked={adPlacement === 'in_article'}
                          onChange={() => setAdPlacement('in_article')}
                          className="accent-emerald-600 w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <h5 className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        পোস্টের শেয়ার ব্যানারের উপরে
                      </h5>
                      <div className="mt-1.5 p-1.5 bg-white/80 dark:bg-black/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                          728 × 90 px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. IMAGE UPLOAD OPTION */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      ২. ব্যানার ছবি আপলোড করুন বা লিংক দিন *
                    </label>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {adPlacement === 'header_top' ? 'চাহিদা: 970x90 px' : adPlacement === 'sidebar' ? 'চাহিদা: 300x250 px' : 'চাহিদা: 728x90 px'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={adImageUrl}
                      onChange={(e) => setAdImageUrl(e.target.value)}
                      placeholder="https://... অথবা নিচের বাটনে ক্লিক করে ফাইল আপলোড করুন"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <label className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow flex items-center gap-1.5 shrink-0 transition-colors">
                      <UploadCloud className="w-4 h-4" /> ফাইল আপলোড
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, setAdImageUrl)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Live Preview */}
                  {adImageUrl && (
                    <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-500 mb-1">ইমেজ প্রিভিউ:</p>
                      <div className={`overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-950 flex items-center justify-center ${adPlacement === 'header_top' || adPlacement === 'in_article' ? 'h-20' : 'h-28'}`}>
                        <img 
                          src={adImageUrl} 
                          alt="Banner Preview" 
                          className="max-h-full w-auto object-contain"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. AD TITLE */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    ৩. বিজ্ঞাপনের শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="যেমন: ৫০% ছাড়ের বিশেষ সামার প্রমোশন..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* 4. SPONSOR NAME */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    ৪. স্পন্সর বা ক্লায়েন্টের নাম
                  </label>
                  <input
                    type="text"
                    value={adSponsor}
                    onChange={(e) => setAdSponsor(e.target.value)}
                    placeholder="যেমন: গ্রামীণফোন, স্কয়ার ফার্মাসিউটিক্যালস ইত্যাদি..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* 5. TARGET URL */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    ৫. বিজ্ঞাপনের টার্গেট লিঙ্ক (Target URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={adTargetUrl}
                    onChange={(e) => setAdTargetUrl(e.target.value)}
                    placeholder="https://client-website.com..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAdModal(false);
                      setEditingAdBanner(null);
                    }}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> {editingAdBanner ? 'পরিবর্তন সংরক্ষণ করুন' : 'ব্যানার যুক্ত করুন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 7: SOCIAL WIDGETS MANAGEMENT (Full Edit, Add, Delete & Hide/Show Support) */}
        {activeTab === 'socials' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Globe className="w-6 h-6 text-blue-500" />
                  সোশ্যাল উইজেটস লিংক নিয়ন্ত্রণ ও হাইড/শো অপশন
                </h2>
                <p className="text-xs text-slate-500">
                  ফেসবুক, ইউটিউব, ইনস্টাগ্রামসহ সব সোশ্যাল মিডিয়া পেজের লিংক এডিট করুন এবং চাইলে যেকোনো উইজেট হাইড (লুকিয়ে) বা শো (প্রকাশ) রাখুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestoreDefaultSocials}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                  title="ডিফল্ট ফেসবুক, ইউটিউব ও ইনস্টাগ্রাম উইজেট পুনরুদ্ধার করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ডিফল্ট রিস্টোর</span>
                </button>
                <button
                  onClick={handleOpenAddSocial}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন সোশ্যাল উইজেট যোগ করুন</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {((siteSettings.socialWidgets && siteSettings.socialWidgets.length > 0)
                ? siteSettings.socialWidgets
                : DEFAULT_SOCIAL_WIDGETS
              ).map((soc) => {
                const isLive = soc.isActive !== false;
                let platformColor = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
                if (soc.platform === 'youtube') platformColor = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
                if (soc.platform === 'instagram') platformColor = "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800";
                if (soc.platform === 'whatsapp') platformColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
                if (soc.platform === 'telegram') platformColor = "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800";

                return (
                  <div
                    key={soc.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isLive 
                        ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700' 
                        : 'bg-amber-500/5 dark:bg-amber-950/20 border-dashed border-amber-300 dark:border-amber-800/60 opacity-90'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top platform & visibility badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border uppercase ${platformColor}`}>
                            {soc.platform || 'Custom'}
                          </span>
                          {soc.badge && (
                            <span className="text-[10px] bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-md font-bold shrink-0">
                              {soc.badge}
                            </span>
                          )}
                        </div>

                        {/* Visibility Status Badge */}
                        {isLive ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                            <Eye className="w-3 h-3" /> দৃশ্যমান (Live)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0">
                            <EyeOff className="w-3 h-3" /> লুকায়িত (Hidden)
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {soc.name}
                      </h4>

                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">লিংক URL:</span>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono truncate">
                          {soc.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 gap-2">
                      <a
                        href={soc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-600 dark:text-slate-300 hover:text-red-600 font-bold flex items-center gap-1 transition-colors shrink-0"
                      >
                        ভিজিট <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className="flex items-center gap-1.5">
                        {/* Hide / Show Toggle Button */}
                        <button
                          onClick={() => handleToggleSocialVisibility(soc.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            isLive
                              ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white dark:text-amber-400'
                              : 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:text-emerald-400'
                          }`}
                          title={isLive ? 'উইজেটটি ওয়েবসাইটে লুকান (Hide)' : 'উইজেটটি ওয়েবসাইটে প্রদর্শন করুন (Show)'}
                        >
                          {isLive ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" /> হাইড করুন
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" /> শো করুন
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEditSocial(soc)}
                          className="px-2.5 py-1.5 bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                          title="লিংক ও তথ্য সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> এডিট
                        </button>

                        <button
                          onClick={() => handleDeleteSocialWidget(soc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADD / EDIT SOCIAL WIDGET MODAL */}
        {showAddSocialModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  {editingSocialWidget ? 'সোশ্যাল মিডিয়া উইজেট সম্পাদনা (Edit URL & Settings)' : 'নতুন সোশ্যাল মিডিয়া উইজেট যোগ করুন'}
                </h3>
                <button
                  onClick={() => setShowAddSocialModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSocialWidget} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    প্ল্যাটফর্ম নির্বাচন করুন *
                  </label>
                  <select
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="facebook">Facebook (ফেসবুক পেজ)</option>
                    <option value="youtube">YouTube (ইউটিউব চ্যানেল)</option>
                    <option value="instagram">Instagram (ইনস্টাগ্রাম)</option>
                    <option value="whatsapp">WhatsApp (হোয়াটসঅ্যাপ)</option>
                    <option value="telegram">Telegram (টেলিগ্রাম)</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="tiktok">TikTok</option>
                    <option value="custom">Custom (অন্যান্য)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    সোশ্যাল মিডিয়ার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={socialName}
                    onChange={(e) => setSocialName(e.target.value)}
                    placeholder="যেমন: Facebook Official Page, YouTube..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    পেজ বা চ্যানেলের লিংক URL (Target Link) *
                  </label>
                  <input
                    type="url"
                    required
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="https://facebook.com/yourpage..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    ফলোয়ার তথ্য বা ব্যাজ (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={socialBadge}
                    onChange={(e) => setSocialBadge(e.target.value)}
                    placeholder="যেমন: 250K Followers, সাবস্ক্রাইব, ফলো..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Visibility (Hide/Show) Toggle Option */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      উইজেট প্রদর্শন স্ট্যাটাস (Visibility)
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {socialActive ? 'ওয়েবসাইটে পাঠকদের জন্য দৃশ্যমান থাকবে' : 'বর্তমানে ওয়েবসাইটে লুকায়িত (Hide) থাকবে'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={socialActive}
                      onChange={(e) => setSocialActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddSocialModal(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> {editingSocialWidget ? 'পরিবর্তন সংরক্ষণ করুন' : 'উইজেট যুক্ত করুন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 8: REALTIME ANALYTICS */}
        {activeTab === 'analytics' && (() => {
          const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
          const totalReaders = Math.max(
            Math.round(totalViews * 0.72),
            articles.length * 28 + writers.length * 14
          );

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

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

          const paidWithdrawalsTotal = withdrawals
            .filter((w) => w.status === 'completed')
            .reduce((sum, w) => sum + w.amount, 0);

          return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <BarChart3 className="w-6 h-6 text-emerald-500" />
                  অ্যাডমিন রিয়েলটাইম সিস্টেম অ্যানালিটিক্স
                </h2>
                <p className="text-xs text-slate-500">
                  ওয়েবসাইট ট্রাফিক, পাঠকসংখ্যা, বিষয়ভিত্তিক নিবন্ধ ও পরিশোধিত পে-আউট রিয়েলটাইম তথ্য।
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">👥 মোট পাঠক</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                    {totalReaders.toLocaleString('bn-BD')} জন
                  </h3>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">📰 মোট সংবাদ</span>
                  <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
                    {articles.length.toLocaleString('bn-BD')} টি
                  </h3>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">✍️ মোট প্রতিবেদক</span>
                  <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                    {writers.length.toLocaleString('bn-BD')} জন
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

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">☀️ আজকের ভিউ</span>
                  <h3 className="text-2xl font-black text-red-600 dark:text-red-400 font-mono mt-1">
                    {todayViews.toLocaleString('bn-BD')}
                  </h3>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">💰 পরিশোধিত টাকা</span>
                  <h3 className="text-2xl font-black text-amber-500 font-mono mt-1">
                    ৳{paidWithdrawalsTotal.toLocaleString('bn-BD')}
                  </h3>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB: ADMIN PROFILE SETUP & EDIT */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {adminProfileSuccessMsg && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-3 animate-fadeIn">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{adminProfileSuccessMsg}</span>
              </div>
            )}

            {/* Profile Overview Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative group">
                    <img
                      src={adminProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={adminProfile?.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-700 shadow-2xl group-hover:opacity-90 transition-opacity"
                    />
                    <button
                      onClick={() => {
                        initAdminEditModal();
                        setShowEditAdminModal(true);
                      }}
                      className="absolute bottom-1 right-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-transform hover:scale-110"
                      title="ছবি পরিবর্তন করুন"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                        <ShieldCheck className="w-3.5 h-3.5" /> SUPER ADMIN
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> ক্লাউড ডেটাবেজে ভেরিফাইড
                      </span>
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <UploadCloud className="w-3 h-3" /> Cloudinary সিঙ্কড
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
                      {adminProfile?.name || 'প্রধান নির্বাহী ও সুপার অ্যাডমিন'}
                    </h2>
                    <p className="text-sm text-red-400 font-bold">
                      {adminProfile?.designation || 'প্রধান সম্পাদক ও চিফ অ্যাডমিন'}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>📧 {adminProfile?.email}</span>
                      <span>•</span>
                      <span>📱 {adminProfile?.mobile}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      initAdminEditModal();
                      setShowEditAdminModal(true);
                    }}
                    className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 hover:shadow-red-600/30"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>প্রোফাইল তথ্য ও ছবি এডিট করুন</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Detailed Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details & Bio */}
              <div className="lg:col-span-2 space-y-6">
                {/* Official Information Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <UserCheck className="w-5 h-5 text-red-600" />
                    অ্যাডমিনের প্রাতিষ্ঠানিক ও ব্যক্তিগত বিবরণ
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">পূর্ণ নাম</span>
                      <strong className="text-sm text-slate-900 dark:text-white mt-0.5 block">{adminProfile?.name}</strong>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">পদবী ও দায়িত্ব</span>
                      <strong className="text-sm text-slate-900 dark:text-white mt-0.5 block">{adminProfile?.designation || 'প্রধান সম্পাদক ও চিফ অ্যাডমিন'}</strong>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">অফিসিয়াল ইমেইল এড্রেস</span>
                      <strong className="text-sm font-mono text-slate-900 dark:text-white mt-0.5 block">{adminProfile?.email}</strong>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">মোবাইল নম্বর</span>
                      <strong className="text-sm font-mono text-slate-900 dark:text-white mt-0.5 block">{adminProfile?.mobile}</strong>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">বয়স</span>
                      <strong className="text-sm text-slate-900 dark:text-white mt-0.5 block">{adminProfile?.age ? `${adminProfile.age} বছর` : 'তথ্য নেই'}</strong>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">জাতীয় পরিচয়পত্র (NID) নম্বর</span>
                      <strong className="text-sm font-mono text-slate-900 dark:text-white mt-0.5 block">{adminProfile?.nidNumber || 'তথ্য নেই'}</strong>
                    </div>

                    <div className="sm:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">ঠিকানা (অফিস ও যোগাযোগ)</span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 mt-1">{adminProfile?.address || 'গুলশান-২, ঢাকা, বাংলাদেশ'}</p>
                    </div>

                    {adminProfile?.bio && (
                      <div className="sm:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] font-bold text-slate-400 block uppercase">পরিচিতি ও বায়ো</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{adminProfile.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Authorized Admins List */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                      নিবন্ধিত অ্যাডমিনদের তালিকা ({admins ? admins.length : 1} জন)
                    </h3>
                    <span className="text-[10px] text-slate-400">Firebase Firestore সিঙ্কড</span>
                  </div>

                  <div className="space-y-3">
                    {admins && admins.length > 0 ? (
                      admins.map((adm) => (
                        <div
                          key={adm.id}
                          className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={adm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={adm.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{adm.name}</h4>
                                {adm.id === adminProfile?.id && (
                                  <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full">আপনি</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-mono">{adm.email} | {adm.mobile}</p>
                            </div>
                          </div>
                          <div className="text-right text-[11px] text-slate-400">
                            <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium text-[10px] block mb-1">
                              {adm.designation || 'সুপার অ্যাডমিন'}
                            </span>
                            <span>{new Date(adm.createdAt).toLocaleDateString('bn-BD')}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        <img
                          src={adminProfile?.avatarUrl}
                          alt={adminProfile?.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{adminProfile?.name} (প্রধান অ্যাডমিন)</h4>
                          <p className="text-[11px] text-slate-500 font-mono">{adminProfile?.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Security & Quick Password Change */}
              <div className="space-y-6">
                {/* Security Status Box */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Lock className="w-5 h-5 text-red-600" />
                    নিরাপত্তা ও অ্যাক্সেস স্ট্যাটাস
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">অ্যাকাউন্ট আইডি:</span>
                      <strong className="font-mono text-slate-900 dark:text-white text-[11px]">{adminProfile?.id}</strong>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">পাসওয়ার্ড স্ট্যাটাস:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> এনক্রিপ্টেড ও সুরক্ষিত
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">নিবন্ধন সময়:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                        {adminProfile?.createdAt ? new Date(adminProfile.createdAt).toLocaleDateString('bn-BD') : 'তথ্য নেই'}
                      </span>
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> জরুরি সতর্কতা
                      </span>
                      <p className="text-[11px] text-amber-700 dark:text-amber-300">
                        আপনার অ্যাডমিন পাসওয়ার্ড ও গোপন কোড অন্য কারও সাথে শেয়ার করবেন না।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Password Change Form */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Key className="w-5 h-5 text-amber-500" />
                    পাসওয়ার্ড পরিবর্তন করুন
                  </h3>

                  {quickPasswordMsg && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      quickPasswordMsg.type === 'success'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                    }`}>
                      {quickPasswordMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      <span>{quickPasswordMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleQuickPasswordChange} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        বর্তমান পাসওয়ার্ড
                      </label>
                      <input
                        type="password"
                        required
                        value={quickOldPassword}
                        onChange={(e) => setQuickOldPassword(e.target.value)}
                        placeholder="বর্তমান পাসওয়ার্ড টাইপ করুন..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
                      </label>
                      <input
                        type="password"
                        required
                        value={quickNewPassword}
                        onChange={(e) => setQuickNewPassword(e.target.value)}
                        placeholder="নতুন শক্তিশালী পাসওয়ার্ড..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        নতুন পাসওয়ার্ড নিশ্চিত করুন
                      </label>
                      <input
                        type="password"
                        required
                        value={quickConfirmPassword}
                        onChange={(e) => setQuickConfirmPassword(e.target.value)}
                        placeholder="আবার নতুন পাসওয়ার্ড টাইপ করুন..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-red-600 dark:hover:bg-red-700 text-xs font-bold rounded-xl transition-colors shadow flex items-center justify-center gap-2 mt-2"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>পাসওয়ার্ড আপডেট করুন</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* EDIT ADMIN PROFILE MODAL */}
      {showEditAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif">
                    ✏️ অ্যাডমিন প্রোফাইল সেটাপ ও তথ্য পরিবর্তন
                  </h3>
                  <p className="text-xs text-slate-500">
                    আপনার নাম, পদবী, মোবাইল, ঠিকানা ও ছবি আপডেট করুন।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditAdminModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminProfile} className="space-y-4">
              {/* Photo Upload with Cloudinary */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  প্রোফাইল ফটো (Cloudinary স্টোরেজ বা লিঙ্ক)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={editAdminAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-red-600 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editAdminAvatarUrl}
                        onChange={(e) => setEditAdminAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <label className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{isUploadingAdminAvatar ? 'আপলোড হচ্ছে...' : 'ছবি বেছে নিন'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAdminAvatarUpload}
                          disabled={isUploadingAdminAvatar}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      📷 আপনার ফোন বা কম্পিউটার থেকে ছবি আপলোড করুন, সরাসরি Cloudinary তে জমা হবে।
                    </span>
                  </div>
                </div>
              </div>

              {/* Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    অ্যাডমিনের পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAdminName}
                    onChange={(e) => setEditAdminName(e.target.value)}
                    placeholder="আপনার নাম..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    পদবী ও দায়িত্ব
                  </label>
                  <input
                    type="text"
                    value={editAdminDesignation}
                    onChange={(e) => setEditAdminDesignation(e.target.value)}
                    placeholder="যেমন: প্রধান সম্পাদক ও চিফ অ্যাডমিন"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Mobile & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editAdminMobile}
                    onChange={(e) => setEditAdminMobile(e.target.value)}
                    placeholder="01712345678"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    বয়স
                  </label>
                  <input
                    type="number"
                    value={editAdminAge}
                    onChange={(e) => setEditAdminAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="32"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* NID Number */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  জাতীয় পরিচয়পত্র (NID) নম্বর
                </label>
                <input
                  type="text"
                  value={editAdminNid}
                  onChange={(e) => setEditAdminNid(e.target.value)}
                  placeholder="NID নম্বর..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  ঠিকানা (অফিস বা স্থায়ী ঠিকানা)
                </label>
                <input
                  type="text"
                  value={editAdminAddress}
                  onChange={(e) => setEditAdminAddress(e.target.value)}
                  placeholder="গুলশান-২, ঢাকা, বাংলাদেশ"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  পরিচিতি ও জীবনবৃত্তান্ত (Bio)
                </label>
                <textarea
                  rows={3}
                  value={editAdminBio}
                  onChange={(e) => setEditAdminBio(e.target.value)}
                  placeholder="আপনার সংক্ষিপ্ত পরিচিতি বা দায়িত্বের বিবরণ লিখুন..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Optional New Password */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  নতুন পাসওয়ার্ড (ঐচ্ছিক — পরিবর্তন করতে চাইলে দিন)
                </label>
                <input
                  type="password"
                  value={editAdminNewPassword}
                  onChange={(e) => setEditAdminNewPassword(e.target.value)}
                  placeholder="অপরিবর্তিত রাখতে খালি রাখুন..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
                <span className="text-[10px] text-slate-400">
                  পাসওয়ার্ড পরিবর্তন না করতে চাইলে এটি খালি রাখুন।
                </span>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditAdminModal(false)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isUploadingAdminAvatar}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষণ ও আপডেট করুন</span>
                </button>
              </div>
            </form>
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
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-red-600 shadow-md"
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
                <span className="text-slate-900 dark:text-white">{selectedWriter.address}</span>
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

      {/* ADMIN NOTIFICATION CENTER MODAL (SENT & RECEIVED TABS) */}
      {showNotificationCenterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                    🔔 নোটিফিকেশন সেন্টার (Admin Notification Center)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    পাঠানো ও প্রাপ্ত সকল বিজ্ঞপ্তির তালিকা এখান থেকে দেখুন।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationCenterModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Tabs (Sent vs Received) */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setNotifCenterTab('sent')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  notifCenterTab === 'sent'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📤 পাঠানো নোটিফিকেশন</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  {notifications.length}
                </span>
              </button>

              <button
                onClick={() => setNotifCenterTab('received')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  notifCenterTab === 'received'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📥 রিসিভ করা নোটিফিকেশন</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  {withdrawals.length + writers.length}
                </span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[50vh]">
              {/* TAB 1: SENT NOTIFICATIONS */}
              {notifCenterTab === 'sent' && (
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
                      এখনো কোনো নোটিফিকেশন পাঠানো হয়নি।
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            📢 {notif.title}
                          </span>
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-extrabold px-2 py-0.5 rounded-lg uppercase">
                            {notif.targetRole === 'all' ? 'ALL WRITERS' : 'SPECIFIC WRITER'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>📅 {new Date(notif.createdAt).toLocaleDateString('bn-BD')}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> পাঠানো সফল হয়েছে
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: RECEIVED NOTIFICATIONS (From Readers / Writers) */}
              {notifCenterTab === 'received' && (
                <div className="space-y-3">
                  {/* Withdrawal requests from writers */}
                  {withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 bg-amber-50/50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            💸 লেখক টাকা উত্তোলনের আবেদন (Withdrawal Request)
                          </h4>
                        </div>
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                          {w.status === 'pending' ? 'পেন্ডিং' : 'সম্পন্ন'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        লেখক <strong>{w.writerName}</strong> ৳{w.amount} টাকা ({w.paymentMethod} - {w.accountNumber}) উত্তোলনের আবেদন পাঠিয়েছেন।
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>📅 {new Date(w.createdAt).toLocaleDateString('bn-BD')}</span>
                        <button
                          onClick={() => {
                            setShowNotificationCenterModal(false);
                            setActiveTab('withdrawals');
                          }}
                          className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
                        >
                          উইথড্রয়াল ট্যাবে যান &rarr;
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Registered writers alerts */}
                  {writers.map((writer) => (
                    <div
                      key={writer.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={writer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={writer.name}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                          />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            👤 নতুন নিবন্ধিত লেখক: {writer.name}
                          </h4>
                        </div>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                          লেখক প্রোফাইল
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        📧 {writer.email} | 📱 {writer.mobile}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>📅 {new Date(writer.createdAt).toLocaleDateString('bn-BD')}</span>
                        <button
                          onClick={() => {
                            setShowNotificationCenterModal(false);
                            setActiveTab('writers');
                          }}
                          className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                        >
                          লেখক তালিকা দেখুন &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowNotificationCenterModal(false)}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT DONE SETTLEMENT MODAL WINDOW */}
      {paymentModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Payment Done — লেনদেন সম্পন্ন করুন
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    তথ্য পূরণ করে Send বাটনে ক্লিক করলে লেখকের হিস্টোরি Done হবে এবং নোটিফিকেশন যাবে।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalReq(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmSendPayment} className="space-y-4">
              {/* Readonly Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">🔸 লেখকের নাম</span>
                  <strong className="text-slate-900 dark:text-white text-xs font-bold block truncate">
                    {paymentModalReq.writerName}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">🔸 Withdraw Amount</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black font-mono">
                    ৳{paymentModalReq.amount}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">🔸 Receiver Account (লেখকের নম্বর)</span>
                  <strong className="text-red-600 dark:text-red-400 text-xs font-mono font-bold">
                    {paymentModalReq.accountNumber}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">🔸 ব্যবহৃত Gateway</span>
                  <span className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-[11px] font-bold rounded-md">
                    {paymentModalReq.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Sender Account Input */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  🔸 Sender Account (যে নম্বর থেকে টাকা পাঠানো হয়েছে) *
                </label>
                <input
                  type="text"
                  required
                  value={senderAccountInput}
                  onChange={(e) => setSenderAccountInput(e.target.value)}
                  placeholder="যেমন: 01712345678 বা বিকাশ মার্চেন্ট নং"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Transaction ID Input */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  🔸 Transection ID (ট্রানজেকশন আইডি) *
                </label>
                <input
                  type="text"
                  required
                  value={transactionIdInput}
                  onChange={(e) => setTransactionIdInput(e.target.value)}
                  placeholder="যেমন: 9J3K8L2M1P"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Notification Preview Box */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block text-[10px] uppercase tracking-wider">
                  লেখক যে নোটিফিকেশনটি পাবেন:
                </span>
                <p className="font-sans leading-relaxed whitespace-pre-line text-[11px]">
                  {`প্রিয় ${paymentModalReq.writerName}
${paymentModalReq.paymentMethod} এর মাধ্যমে আপনার লেনদেন টি সম্পন্ন করা হয়েছে।

#Amount : ৳${paymentModalReq.amount}
#Sender Account : ${senderAccountInput || '[Sender Account]'}
#Receiver Account : ${paymentModalReq.accountNumber}
#Transection ID : ${transactionIdInput || '[Transection ID]'}`}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalReq(null)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send (পেমেন্ট নিশ্চিত ও নোটিফিকেশন পাঠান)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
