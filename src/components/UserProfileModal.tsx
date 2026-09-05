import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Bookmark, 
  WifiOff, 
  Mail, 
  LogOut, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Phone, 
  Lock, 
  Edit3, 
  Camera, 
  Save,
  CheckCircle
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { subscribeToReaders, saveReaderToFirebase } from '../services/firebaseDataService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';

interface UserProfileModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  currentLang: Language;
  bookmarksCount: number;
  offlineCount: number;
  onOpenBookmarks: () => void;
  onOpenOffline: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onLogin,
  onLogout,
  currentLang,
  bookmarksCount,
  offlineCount,
  onOpenBookmarks,
  onOpenOffline
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Reader Profile Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editMobile, setEditMobile] = useState(user?.mobile || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  const [registeredReaders, setRegisteredReaders] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('recap_registered_readers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = subscribeToReaders((readersList) => {
      if (readersList && readersList.length > 0) {
        setRegisteredReaders(readersList);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Synchronize editing fields when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditMobile(user.mobile || '');
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar || '');
      setEditNewPassword('');
    } else {
      setEditName('');
      setEditMobile('');
      setEditBio('');
      setEditAvatar('');
      setEditNewPassword('');
      setIsEditingProfile(false);
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('ছবির সাইজ ৮MB এর কম হতে হবে!');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const url = await uploadImageToCloudinary(file, 'reader_avatars');
      setEditAvatar(url);
    } catch (err: any) {
      console.warn('Reader avatar upload error:', err);
      // Fallback to local data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!editName.trim()) {
      setAuthError('নাম ফাঁকা রাখা যাবে না!');
      return;
    }

    const updatedUser: UserProfile = {
      ...user,
      name: editName.trim(),
      mobile: editMobile.trim(),
      bio: editBio.trim(),
      avatar: editAvatar.trim() || user.avatar,
      password: editNewPassword.trim() ? editNewPassword.trim() : user.password
    };

    // Update in registered readers list
    const updatedList = registeredReaders.map((r) =>
      r.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : r
    );
    setRegisteredReaders(updatedList);

    try {
      localStorage.setItem('recap_registered_readers', JSON.stringify(updatedList));
      localStorage.setItem('the_recap_media_reader_user', JSON.stringify(updatedUser));
      localStorage.setItem('recap_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.warn('Storage save warning:', err);
    }

    saveReaderToFirebase(updatedUser).catch((err) => console.warn('Firestore update warning:', err));
    onLogin(updatedUser);

    setEditSuccessMsg('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => {
      setEditSuccessMsg('');
      setIsEditingProfile(false);
    }, 1500);
  };

  const handlePerformLogout = () => {
    try {
      localStorage.removeItem('the_recap_media_reader_user');
      localStorage.removeItem('recap_user');
    } catch (e) {
      console.warn(e);
    }
    setName('');
    setEmail('');
    setMobile('');
    setPassword('');
    setAuthError('');
    setAuthSuccess('');
    setIsSignUp(false);
    setIsEditingProfile(false);
    onLogout();
  };

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!email.trim() || !password.trim()) {
      setAuthError('ইমেইল এবং পাসওয়ার্ড প্রদান করা বাধ্যতামূলক!');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isSignUp) {
      if (!name.trim()) {
        setAuthError('আপনার পূর্ণ নাম প্রদান করুন!');
        return;
      }
      if (password.trim().length < 6) {
        setAuthError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
        return;
      }

      // Check if email already registered
      const alreadyExists = registeredReaders.some((r) => r.email.trim().toLowerCase() === cleanEmail);
      if (alreadyExists) {
        setAuthError('এই ইমেইলে ইতিমধ্যে একটি পাঠক অ্যাকাউন্ট রয়েছে! অনুগ্রহ করে সাইন-ইন (Sign In) করুন।');
        return;
      }

      const newReader: UserProfile = {
        id: `reader-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password: password.trim(),
        mobile: mobile.trim(),
        role: 'viewer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        bio: 'THE RECAP MEDIA CAST সংবাদ পাঠক ও নিয়মিত পাঠক।',
        bookmarks: [],
        offlineSaved: [],
        joinedAt: new Date().toISOString()
      };

      const updatedList = [...registeredReaders.filter((r) => r.email.toLowerCase() !== cleanEmail), newReader];
      setRegisteredReaders(updatedList);
      try {
        localStorage.setItem('recap_registered_readers', JSON.stringify(updatedList));
        localStorage.setItem('the_recap_media_reader_user', JSON.stringify(newReader));
        localStorage.setItem('recap_user', JSON.stringify(newReader));
      } catch (e) {
        console.warn(e);
      }

      saveReaderToFirebase(newReader).catch((err) => console.warn('Could not save reader to Firestore:', err));

      setAuthSuccess('পাঠক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      onLogin(newReader);
      return;
    }

    // SIGN IN MODE (লগইন) - Strict requirement: MUST have signed up previously!
    let matched = registeredReaders.find((r) => r.email.trim().toLowerCase() === cleanEmail);

    if (!matched) {
      try {
        const saved = localStorage.getItem('recap_registered_readers');
        if (saved) {
          const parsed: UserProfile[] = JSON.parse(saved);
          matched = parsed.find((r) => r.email.trim().toLowerCase() === cleanEmail);
        }
      } catch {}
    }

    if (!matched) {
      setAuthError('এই ইমেইলে কোনো পাঠক অ্যাকাউন্ট পাওয়া যায়নি! সাইন-ইন করার পূর্বে অনুগ্রহ করে প্রথমে "নতুন পাঠক সাইন-আপ (Sign Up)" করুন।');
      return;
    }

    // Password verification
    if (matched.password && matched.password !== password.trim()) {
      setAuthError('ভুল পাসওয়ার্ড! অনুগ্রহ করে আপনার নিবন্ধিত সঠিক পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    try {
      localStorage.setItem('the_recap_media_reader_user', JSON.stringify(matched));
      localStorage.setItem('recap_user', JSON.stringify(matched));
    } catch (e) {
      console.warn(e);
    }

    onLogin(matched);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center items-center">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {user ? (isEditingProfile ? 'পাঠক প্রোফাইল সংশোধন' : 'নিয়মিত পাঠক প্রোফাইল') : 'নিয়মিত পাঠক সাইন-ইন / রেজিস্ট্রেশন'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                The Recap Media Cast পাঠক ফোরাম
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user logged in */}
        {user ? (
          isEditingProfile ? (
            /* READER PROFILE EDIT FORM */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {editSuccessMsg && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              <div className="flex flex-col items-center gap-2 pb-2">
                <div className="relative">
                  <img
                    src={editAvatar || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-2 border-red-500 object-cover shadow-md"
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full cursor-pointer shadow">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {isUploadingPhoto && <span className="text-[10px] text-red-500 font-bold">ছবি আপলোড হচ্ছে...</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পূর্ণ নাম (Name) *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর (Mobile)</label>
                <input
                  type="tel"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  placeholder="+৮৮০ ১XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পরিচিতি (Bio)</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="নিজের সম্পর্কে সংক্ষিপ্ত তথ্য..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে)</label>
                <input
                  type="password"
                  value={editNewPassword}
                  onChange={(e) => setEditNewPassword(e.target.value)}
                  placeholder="অপরিবর্তিত রাখতে খালি রাখুন"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> সংরক্ষণ করুন
                </button>
              </div>
            </form>
          ) : (
            /* READER PROFILE VIEW */
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-red-500 object-cover shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg truncate">{user.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-red-500 shrink-0" /> {user.email}
                  </p>
                  {user.mobile && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {user.mobile}
                    </p>
                  )}
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800">
                    ✓ নিবন্ধিত নিয়মিত পাঠক
                  </span>
                </div>
              </div>

              {/* User Activity Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => { onClose(); onOpenBookmarks(); }}
                  className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-100 dark:border-red-900/50 cursor-pointer hover:scale-[1.02] transition-transform text-center"
                >
                  <Bookmark className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <span className="block text-xl font-extrabold text-slate-900 dark:text-white">{bookmarksCount}</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">সংরক্ষিত বুকমার্ক</span>
                </div>

                <div 
                  onClick={() => { onClose(); onOpenOffline(); }}
                  className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/50 cursor-pointer hover:scale-[1.02] transition-transform text-center"
                >
                  <WifiOff className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <span className="block text-xl font-extrabold text-slate-900 dark:text-white">{offlineCount}</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">অফলাইন পঠিত খবর</span>
                </div>
              </div>

              {/* Action Buttons: Edit Profile & Logout */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-red-200 dark:border-red-800 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" /> প্রোফাইল এডিট
                </button>
                <button
                  onClick={handlePerformLogout}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> লগআউট করুন
                </button>
              </div>
            </div>
          )
        ) : (
          /* Sign Up / Login Form */
          <div className="space-y-4">
            {/* Explanatory Info Card */}
            <div className="p-3 bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                নিয়মিত পাঠক পোর্টাল
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                এখানে শুধুমাত্র <strong>পূর্বে সাইন-আপ করা নিয়মিত পাঠক</strong> লগইন করতে পারবেন। পূর্বে সাইন-আপ না থাকলে প্রথমে "নতুন পাঠক সাইন-আপ" করুন।
              </p>
            </div>

            {/* Error & Success Messages */}
            {authError && (
              <div className="p-3 bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 rounded-xl flex items-start gap-2 text-xs text-red-700 dark:text-red-300 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setAuthError(''); setAuthSuccess(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-white dark:bg-slate-900 text-red-600 shadow' : 'text-slate-500'}`}
              >
                নিয়মিত পাঠক লগইন (Sign In)
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setAuthError(''); setAuthSuccess(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-white dark:bg-slate-900 text-red-600 shadow' : 'text-slate-500'}`}
              >
                নতুন পাঠক সাইন-আপ (Sign Up)
              </button>
            </div>

            <form onSubmit={handleSubmitAuth} className="space-y-3">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পূর্ণ নাম (Full Name) *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: তানজিল হোসেন"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর (ঐচ্ছিক)</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="যেমন: 017XXXXXXXX"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেইল বা জিমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">গোপন পাসওয়ার্ড *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSignUp ? (
                  <>
                    <Sparkles className="w-4 h-4" /> সাইন-আপ সম্পন্ন করুন
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> নিয়মিত পাঠক সাইন-ইন
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
