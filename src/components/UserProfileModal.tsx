import React, { useState, useEffect } from 'react';
import { X, User, Bookmark, WifiOff, Mail, Shield, LogOut, Check, Sparkles, AlertCircle, Phone, Lock } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { getTranslation } from '../utils/i18n';
import { subscribeToReaders, saveReaderToFirebase } from '../services/firebaseDataService';

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

  const t = (key: any) => getTranslation(currentLang, key);

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
      const alreadyExists = registeredReaders.some(r => r.email.trim().toLowerCase() === cleanEmail);
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

      const updatedList = [...registeredReaders.filter(r => r.email.toLowerCase() !== cleanEmail), newReader];
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
    // Check in registeredReaders state
    let matched = registeredReaders.find(r => r.email.trim().toLowerCase() === cleanEmail);

    // Fallback check in localStorage
    if (!matched) {
      try {
        const saved = localStorage.getItem('recap_registered_readers');
        if (saved) {
          const parsed: UserProfile[] = JSON.parse(saved);
          matched = parsed.find(r => r.email.trim().toLowerCase() === cleanEmail);
        }
      } catch {}
    }

    // STRICT CHECK: Anyone who has NOT signed up previously CANNOT sign in!
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
                {user ? 'নিয়মিত পাঠক প্রোফাইল' : 'নিয়মিত পাঠক সাইন-ইন / রেজিস্ট্রেশন'}
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
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-red-500 object-cover shadow-sm"
              />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-red-500" /> {user.email}
                </p>
                {user.mobile && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" /> {user.mobile}
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

            <button
              onClick={() => {
                try {
                  localStorage.removeItem('the_recap_media_reader_user');
                  localStorage.removeItem('recap_user');
                } catch (e) {
                  console.warn(e);
                }
                onLogout();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> লগআউট করুন
            </button>
          </div>
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
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেইল এড্রেস (Email) *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পাসওয়ার্ড (Password) *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all mt-2 cursor-pointer"
              >
                {isSignUp ? 'অ্যাকাউন্ট তৈরি করুন (Create Account)' : 'প্রবেশ করুন (Sign In)'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

